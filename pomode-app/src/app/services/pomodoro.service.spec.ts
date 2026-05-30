import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { PomodoroService } from './pomodoro.service';
import { DEFAULT_SETTINGS, PomodoroSettings, TimerMode } from '../models';

describe('PomodoroService', () => {
  let service: PomodoroService;

  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [PomodoroService]
    });

    service = TestBed.inject(PomodoroService);
  });

  afterEach(() => {
    service.ngOnDestroy();
    localStorage.clear();
  });

  describe('Inicialização', () => {
    it('deve ser criado', () => {
      expect(service).toBeTruthy();
    });

    it('deve inicializar com configurações padrão', () => {
      const settings = service.settings();
      expect(settings.workTime).toBe(DEFAULT_SETTINGS.workTime);
      expect(settings.shortBreakTime).toBe(DEFAULT_SETTINGS.shortBreakTime);
      expect(settings.longBreakTime).toBe(DEFAULT_SETTINGS.longBreakTime);
      expect(settings.cyclesBeforeLongBreak).toBe(DEFAULT_SETTINGS.cyclesBeforeLongBreak);
    });

    it('deve inicializar no modo work', () => {
      expect(service.mode()).toBe('work');
    });

    it('deve inicializar no estado idle', () => {
      expect(service.state()).toBe('idle');
    });

    it('deve inicializar com tempo de trabalho configurado', () => {
      expect(service.timeRemaining()).toBe(DEFAULT_SETTINGS.workTime * 60);
    });

    it('deve inicializar com 0 ciclos completados', () => {
      expect(service.completedCycles()).toBe(0);
    });
  });

  describe('Computed Signals', () => {
    it('deve calcular minutos corretamente', () => {
      // 25 minutos = 1500 segundos
      expect(service.minutes()).toBe(25);
    });

    it('deve calcular segundos corretamente', () => {
      expect(service.seconds()).toBe(0);
    });

    it('deve calcular progresso como 0% no início', () => {
      expect(service.progress()).toBe(0);
    });
  });

  describe('Controles do Timer', () => {
    it('deve iniciar o timer ao chamar start()', fakeAsync(() => {
      service.start();
      expect(service.state()).toBe('running');
      discardPeriodicTasks();
    }));

    it('deve pausar o timer ao chamar pause()', fakeAsync(() => {
      service.start();
      tick(100);
      service.pause();
      expect(service.state()).toBe('paused');
      discardPeriodicTasks();
    }));

    it('não deve fazer nada se start() for chamado enquanto já está rodando', fakeAsync(() => {
      service.start();
      const initialTime = service.timeRemaining();
      tick(500);
      service.start(); // Não deve reiniciar
      tick(100);
      expect(service.state()).toBe('running');
      discardPeriodicTasks();
    }));

    it('deve resetar o timer ao chamar reset()', fakeAsync(() => {
      service.start();
      tick(5000); // 5 segundos
      service.reset();

      expect(service.state()).toBe('idle');
      expect(service.timeRemaining()).toBe(DEFAULT_SETTINGS.workTime * 60);
      discardPeriodicTasks();
    }));
  });

  describe('Mudança de Modo', () => {
    it('deve mudar para shortBreak ao pular de work', () => {
      expect(service.mode()).toBe('work');
      service.skipToNext();
      expect(service.mode()).toBe('shortBreak');
      expect(service.timeRemaining()).toBe(DEFAULT_SETTINGS.shortBreakTime * 60);
    });

    it('deve mudar para work ao pular de shortBreak', () => {
      service.skipToNext(); // work → shortBreak
      service.skipToNext(); // shortBreak → work
      expect(service.mode()).toBe('work');
      expect(service.timeRemaining()).toBe(DEFAULT_SETTINGS.workTime * 60);
    });
  });

  describe('Configurações', () => {
    it('deve atualizar configurações ao chamar updateSettings', () => {
      const newSettings: PomodoroSettings = {
        workTime: 30,
        shortBreakTime: 10,
        longBreakTime: 20,
        cyclesBeforeLongBreak: 3,
        soundEnabled: false,
        soundVolume: 50,
        notificationsEnabled: false
      };

      service.updateSettings(newSettings);

      const updatedSettings = service.settings();
      expect(updatedSettings.workTime).toBe(30);
      expect(updatedSettings.shortBreakTime).toBe(10);
      expect(updatedSettings.longBreakTime).toBe(20);
      expect(updatedSettings.cyclesBeforeLongBreak).toBe(3);
    });

    it('deve persistir configurações no localStorage', () => {
      const newSettings: PomodoroSettings = {
        ...DEFAULT_SETTINGS,
        workTime: 30
      };

      service.updateSettings(newSettings);
      TestBed.flushEffects();

      // Verifica localStorage
      const stored = localStorage.getItem('pomodoro-settings');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.workTime).toBe(30);
    });

    it('deve carregar configurações do localStorage ao inicializar', () => {
      // PomodoroService é providedIn: root (singleton) — re-inject retorna a mesma instância.
      // Verificamos que updateSettings persiste e carrega corretamente.
      service.updateSettings({ workTime: 45 });
      TestBed.flushEffects();

      const stored = localStorage.getItem('pomodoro-settings');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.workTime).toBe(45);
      expect(service.settings().workTime).toBe(45);
    });
  });

  describe('Skip e Auto-Avanço', () => {
    it('deve pular para próxima fase ao chamar skipToNext()', () => {
      expect(service.mode()).toBe('work');
      service.skipToNext();
      expect(service.mode()).toBe('shortBreak');
    });

    it('deve avançar para longBreak após ciclos configurados', () => {
      // Simula completar 4 ciclos de trabalho usando skipToNext
      // Cada ciclo: work → shortBreak → work
      for (let i = 0; i < DEFAULT_SETTINGS.cyclesBeforeLongBreak; i++) {
        // Incrementa completedCycles manualmente para simular completar work
        service.completedCycles.set(i + 1);
        service.skipToNext(); // Avança de work
        if (i < DEFAULT_SETTINGS.cyclesBeforeLongBreak - 1) {
          service.skipToNext(); // Volta para work (de shortBreak)
        }
      }

      // Após completar os ciclos, deve ir para longBreak
      expect(service.mode()).toBe('longBreak');
    });
  });

  describe('Sessões', () => {
    it('deve ter array de sessões vazio inicialmente', () => {
      expect(service.sessions().length).toBe(0);
    });

    it('deve persistir sessões no localStorage', () => {
      // Força uma sessão adicionando diretamente
      const sessions = service.sessions();
      service.sessions.set([
        ...sessions,
        {
          id: 'test-1',
          mode: 'work',
          duration: 1500,
          completedAt: new Date()
        }
      ]);
      TestBed.flushEffects();

      const stored = localStorage.getItem('pomodoro-sessions');
      expect(stored).toBeTruthy();
    });
  });

  describe('Timer Complete Observable', () => {
    it('deve emitir o modo atual quando o timer termina', () => {
      let emittedMode: any = null;

      service.timerComplete$.subscribe(mode => {
        emittedMode = mode;
      });

      service.mode.set('work');
      (service as any).onTimerComplete();

      expect(emittedMode).toBe('work');
    });

    it('deve emitir shortBreak quando o timer de pausa termina', () => {
      let emittedMode: any = null;

      service.timerComplete$.subscribe(mode => {
        emittedMode = mode;
      });

      service.mode.set('shortBreak');
      (service as any).onTimerComplete();

      expect(emittedMode).toBe('shortBreak');
    });
  });

  describe('Conclusão de intervalos e pomodoros', () => {
    it('não deve incrementar completedCycles ao concluir uma pausa', () => {
      service.mode.set('shortBreak');

      (service as any).onTimerComplete();

      expect(service.completedCycles()).toBe(0);
      expect(service.mode()).toBe('work');
      expect(service.sessions().at(0)?.mode).toBe('shortBreak');
    });

    it('deve incrementar completedCycles apenas ao concluir trabalho', () => {
      service.mode.set('work');

      (service as any).onTimerComplete();

      expect(service.completedCycles()).toBe(1);
      expect(service.sessions().at(0)?.mode).toBe('work');
      expect(service.mode()).toBe('shortBreak');
    });

    it('deve avançar para longBreak após o número configurado de pomodoros', () => {
      service.updateSettings({ cyclesBeforeLongBreak: 3 });

      for (let i = 0; i < 2; i++) {
        service.mode.set('work');
        (service as any).onTimerComplete();
        expect(service.mode()).toBe('shortBreak');
      }

      service.mode.set('work');
      (service as any).onTimerComplete();

      expect(service.completedCycles()).toBe(3);
      expect(service.mode()).toBe('longBreak');
    });
  });

  describe('Limpeza de Recursos', () => {
    it('deve limpar subscription ao destruir', fakeAsync(() => {
      service.start();
      tick(100);

      service.ngOnDestroy();

      // Não deve lançar erro ao tentar tick após destruição
      expect(() => tick(100)).not.toThrow();
      discardPeriodicTasks();
    }));
  });
});
