import { Injectable, signal, computed, effect, OnDestroy } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import {
  TimerMode,
  TimerState,
  PomodoroSettings,
  PomodoroSession,
  DEFAULT_SETTINGS,
  validateSettings
} from '../models';

// Re-exporta tipos para compatibilidade
export type { TimerMode, TimerState, PomodoroSettings, PomodoroSession };

@Injectable({
  providedIn: 'root'
})
export class PomodoroService implements OnDestroy {
  private readonly SETTINGS_KEY = 'pomodoro-settings';
  private readonly SESSIONS_KEY = 'pomodoro-sessions';

  // Timer com precisão usando timestamps
  private timerSubscription?: Subscription;
  private startTimestamp: number = 0;
  private pausedTimeRemaining: number = 0;
  private targetEndTime: number = 0; // Timestamp absoluto de quando o timer deve terminar

  // Page Visibility para detectar quando aba fica inativa/ativa
  private visibilityChangeHandler: (() => void) | null = null;

  // Signals
  public settings = signal<PomodoroSettings>(this.loadSettings());
  public mode = signal<TimerMode>('work');
  public state = signal<TimerState>('idle');
  public timeRemaining = signal<number>(0); // em segundos
  public completedCycles = signal<number>(0);
  public sessions = signal<PomodoroSession[]>(this.loadSessions());

  // Computed signals
  public minutes = computed(() => Math.floor(this.timeRemaining() / 60));
  public seconds = computed(() => this.timeRemaining() % 60);
  public progress = computed(() => {
    const total = this.getTotalTime(this.mode());
    const remaining = this.timeRemaining();
    if (total === 0) return 0;
    return ((total - remaining) / total) * 100;
  });

  // Subject para notificar quando o timer termina
  public timerComplete$ = new Subject<TimerMode>();

  constructor() {
    // Inicializa o timer com o tempo de trabalho
    this.resetTimer();

    // Effect para salvar configurações quando mudarem
    effect(() => {
      this.saveSettings(this.settings());
    });

    // Effect para salvar sessões quando mudarem
    effect(() => {
      this.saveSessions(this.sessions());
    });

    // Configura Page Visibility API para detectar quando aba volta a ficar ativa
    this.setupVisibilityChangeListener();
  }

  ngOnDestroy(): void {
    this.stopTimer();
    this.timerComplete$.complete();
    this.removeVisibilityChangeListener();
  }

  /**
   * Configura listener para Page Visibility API
   * Detecta quando usuário volta à aba para verificar se timer completou
   */
  private setupVisibilityChangeListener(): void {
    if (typeof document === 'undefined') return;

    this.visibilityChangeHandler = () => {
      if (!document.hidden && this.state() === 'running') {
        // Usuário voltou à aba e timer está rodando
        // Verifica se o timer deveria ter completado enquanto estava em background
        this.checkTimerStatus();
      }
    };

    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
  }

  /**
   * Remove listener de visibilidade
   */
  private removeVisibilityChangeListener(): void {
    if (this.visibilityChangeHandler && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
      this.visibilityChangeHandler = null;
    }
  }

  /**
   * Verifica status do timer baseado no timestamp absoluto
   * Chamado quando usuário volta à aba
   */
  private checkTimerStatus(): void {
    if (this.state() !== 'running' || this.targetEndTime === 0) return;

    const now = Date.now();

    // Se o tempo alvo já passou, timer deveria ter completado
    if (now >= this.targetEndTime) {
      // Timer completou enquanto estava em background
      this.timeRemaining.set(0);
      this.onTimerComplete();
    } else {
      // Atualiza tempo restante baseado no tempo real
      const remaining = Math.ceil((this.targetEndTime - now) / 1000);
      this.timeRemaining.set(remaining);
    }
  }

  /**
   * Inicia o timer
   * Corrigido: verifica estado ANTES de alterá-lo
   */
  public start(): void {
    const currentState = this.state();

    if (currentState === 'running') return;

    // Se está idle, define o tempo total
    if (currentState === 'idle') {
      this.pausedTimeRemaining = this.getTotalTime(this.mode());
      this.timeRemaining.set(this.pausedTimeRemaining);
    } else {
      // Se está pausado, continua de onde parou
      this.pausedTimeRemaining = this.timeRemaining();
    }

    // Marca o timestamp de início e o timestamp absoluto de fim
    this.startTimestamp = Date.now();
    this.targetEndTime = this.startTimestamp + (this.pausedTimeRemaining * 1000);
    this.state.set('running');

    // Timer com precisão usando timestamps absolutos
    // Tick a cada 100ms para maior precisão visual
    this.timerSubscription = timer(0, 100).subscribe(() => {
      this.tick();
    });
  }

  /**
   * Pausa o timer
   */
  public pause(): void {
    if (this.state() !== 'running') return;

    // Salva o tempo restante atual baseado no timestamp absoluto
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((this.targetEndTime - now) / 1000));
    this.pausedTimeRemaining = remaining;
    this.timeRemaining.set(remaining);

    this.state.set('paused');
    this.targetEndTime = 0; // Limpa o target
    this.stopTimer();
  }

  /**
   * Reseta o timer
   */
  public reset(): void {
    this.state.set('idle');
    this.targetEndTime = 0;
    this.stopTimer();
    this.pausedTimeRemaining = this.getTotalTime(this.mode());
    this.timeRemaining.set(this.pausedTimeRemaining);
  }

  /**
   * Pula para o próximo modo
   */
  public skipToNext(): void {
    this.stopTimer();
    this.nextMode();
    this.reset();
  }

  /**
   * Atualiza as configurações com validação
   */
  public updateSettings(newSettings: Partial<PomodoroSettings>): void {
    // Valida as configurações antes de salvar
    const validatedSettings = validateSettings(newSettings);

    this.settings.update(current => ({
      ...current,
      ...validatedSettings
    }));

    // Se o timer está idle, atualiza o tempo
    if (this.state() === 'idle') {
      this.timeRemaining.set(this.getTotalTime(this.mode()));
    }
  }

  /**
   * Limpa o histórico de sessões
   */
  public clearSessions(): void {
    this.sessions.set([]);
    this.completedCycles.set(0);
  }

  /**
   * Tick do timer com precisão usando timestamps
   * Calcula o tempo real decorrido para evitar drift
   * Usa targetEndTime para garantir precisão mesmo se aba ficar em background
   */
  private tick(): void {
    if (this.targetEndTime === 0) return;

    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((this.targetEndTime - now) / 1000));

    this.timeRemaining.set(remaining);

    if (remaining <= 0) {
      this.onTimerComplete();
    }
  }

  /**
   * Quando o timer completa
   */
  private onTimerComplete(): void {
    const currentMode = this.mode();

    // Salva a sessão
    this.saveSession(currentMode);

    // Se completou um ciclo de trabalho, incrementa
    if (currentMode === 'work') {
      this.completedCycles.update(c => c + 1);
    }

    // Notifica que o timer completou
    this.timerComplete$.next(currentMode);

    // Para o timer
    this.stopTimer();
    this.state.set('idle');
    this.targetEndTime = 0;

    // Avança para o próximo modo
    this.nextMode();

    // Reseta o tempo
    this.pausedTimeRemaining = this.getTotalTime(this.mode());
    this.timeRemaining.set(this.pausedTimeRemaining);
  }

  /**
   * Para o timer
   */
  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  /**
   * Avança para o próximo modo
   */
  private nextMode(): void {
    const currentMode = this.mode();
    const cycles = this.completedCycles();
    const settings = this.settings();

    if (currentMode === 'work') {
      // Se completou os ciclos necessários, pausa longa
      if (cycles % settings.cyclesBeforeLongBreak === 0 && cycles > 0) {
        this.mode.set('longBreak');
      } else {
        this.mode.set('shortBreak');
      }
    } else {
      // Volta para o trabalho
      this.mode.set('work');
    }
  }

  /**
   * Reseta o timer para o modo atual
   */
  private resetTimer(): void {
    this.pausedTimeRemaining = this.getTotalTime(this.mode());
    this.timeRemaining.set(this.pausedTimeRemaining);
  }

  /**
   * Obtém o tempo total de um modo (em segundos)
   */
  public getTotalTime(mode: TimerMode): number {
    const settings = this.settings();

    switch (mode) {
      case 'work':
        return settings.workTime * 60;
      case 'shortBreak':
        return settings.shortBreakTime * 60;
      case 'longBreak':
        return settings.longBreakTime * 60;
    }
  }

  /**
   * Salva uma sessão completada
   */
  private saveSession(mode: TimerMode): void {
    const session: PomodoroSession = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      mode,
      duration: this.getTotalTime(mode),
      completedAt: new Date()
    };

    this.sessions.update(sessions => [session, ...sessions]);
  }

  /**
   * Carrega configurações do localStorage
   */
  private loadSettings(): PomodoroSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;

    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }

    return DEFAULT_SETTINGS;
  }

  /**
   * Salva configurações no localStorage
   */
  private saveSettings(settings: PomodoroSettings): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  }

  /**
   * Carrega sessões do localStorage
   */
  private loadSessions(): PomodoroSession[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(this.SESSIONS_KEY);
      if (stored) {
        const sessions = JSON.parse(stored);
        // Converte strings de data para objetos Date
        return sessions.map((s: PomodoroSession) => ({
          ...s,
          completedAt: new Date(s.completedAt)
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
    }

    return [];
  }

  /**
   * Salva sessões no localStorage
   */
  private saveSessions(sessions: PomodoroSession[]): void {
    if (typeof window === 'undefined') return;

    try {
      // Limita a 100 últimas sessões
      const limitedSessions = sessions.slice(0, 100);
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(limitedSessions));
    } catch (error) {
      console.error('Erro ao salvar sessões:', error);
    }
  }
}
