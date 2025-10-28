import { Injectable, signal, computed, effect } from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';
export type TimerState = 'idle' | 'running' | 'paused';

export interface PomodoroSettings {
  workTime: number;        // minutos
  shortBreakTime: number;  // minutos
  longBreakTime: number;   // minutos
  cyclesBeforeLongBreak: number;
}

export interface PomodoroSession {
  id: string;
  mode: TimerMode;
  duration: number;
  completedAt: Date;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  cyclesBeforeLongBreak: 4
};

@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  private readonly SETTINGS_KEY = 'pomodoro-settings';
  private readonly SESSIONS_KEY = 'pomodoro-sessions';

  // Timer subscription
  private timerSubscription?: Subscription;

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
  }

  /**
   * Inicia o timer
   */
  public start(): void {
    if (this.state() === 'running') return;

    this.state.set('running');

    // Se está pausado, continua de onde parou
    // Se está idle, começa do zero
    if (this.state() === 'idle') {
      this.timeRemaining.set(this.getTotalTime(this.mode()));
    }

    // Cria subscription do timer (tick a cada segundo)
    this.timerSubscription = interval(1000).subscribe(() => {
      this.tick();
    });
  }

  /**
   * Pausa o timer
   */
  public pause(): void {
    if (this.state() !== 'running') return;

    this.state.set('paused');
    this.stopTimer();
  }

  /**
   * Reseta o timer
   */
  public reset(): void {
    this.state.set('idle');
    this.stopTimer();
    this.timeRemaining.set(this.getTotalTime(this.mode()));
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
   * Atualiza as configurações
   */
  public updateSettings(settings: Partial<PomodoroSettings>): void {
    this.settings.update(current => ({
      ...current,
      ...settings
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
   * Tick do timer (a cada segundo)
   */
  private tick(): void {
    const remaining = this.timeRemaining();

    if (remaining <= 0) {
      this.onTimerComplete();
      return;
    }

    this.timeRemaining.set(remaining - 1);
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

    // Avança para o próximo modo
    this.nextMode();

    // Reseta o tempo
    this.timeRemaining.set(this.getTotalTime(this.mode()));
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
    this.timeRemaining.set(this.getTotalTime(this.mode()));
  }

  /**
   * Obtém o tempo total de um modo (em segundos)
   */
  private getTotalTime(mode: TimerMode): number {
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
      id: `${Date.now()}`,
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
        return JSON.parse(stored);
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
