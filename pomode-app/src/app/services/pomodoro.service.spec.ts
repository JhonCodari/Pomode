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
      expect(settings.workDuration).toBe(DEFAULT_SETTINGS.workDuration);
      expect(settings.shortBreakDuration).toBe(DEFAULT_SETTINGS.shortBreakDuration);
      expect(settings.longBreakDuration).toBe(DEFAULT_SETTINGS.longBreakDuration);
      expect(settings.cyclesBeforeLongBreak).toBe(DEFAULT_SETTINGS.cyclesBeforeLongBreak);
    });

    it('deve inicializar no modo work', () => {
      expect(service.mode()).toBe('work');
    });

    it('deve inicializar no estado idle', () => {
      expect(service.state()).toBe('idle');
    });

    it('deve inicializar com tempo de trabalho configurado', () => {
      expect(service.timeRemaining()).toBe(DEFAULT_SETTINGS.workDuration * 60);
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
      expect(service.timeRemaining()).toBe(DEFAULT_SETTINGS.workDuration * 60);
      discardPeriodicTasks();
    }));
  });

  describe('Mudança de Modo', () => {
    it('deve mudar para shortBreak ao chamar setMode', () => {
      service.setMode('shortBreak');
      expect(service.mode()).toBe('shortBreak');
      expect(service.timeRemaining()).toBe(DEFAULT_SETTINGS.shortBreakDuration * 60);
    });

    it('deve mudar para longBreak ao chamar setMode', () => {
      service.setMode('longBreak');
      expect(service.mode()).toBe('longBreak');
      expect(service.timeRemaining()).toBe(DEFAULT_SETTINGS.longBreakDuration * 60);
    });

    it('deve mudar para work ao chamar setMode', () => {
      service.setMode('shortBreak');
      service.setMode('work');
      expect(service.mode()).toBe('work');
      expect(service.timeRemaining()).toBe(DEFAULT_SETTINGS.workDuration * 60);
    });
  });

  describe('Configurações', () => {
    it('deve atualizar configurações ao chamar updateSettings', () => {
      const newSettings: PomodoroSettings = {
        workDuration: 30,
        shortBreakDuration: 10,
        longBreakDuration: 20,
        cyclesBeforeLongBreak: 3,
        soundEnabled: false,
        soundVolume: 0.5,
        notificationsEnabled: false
      };

      service.updateSettings(newSettings);

      const updatedSettings = service.settings();
      expect(updatedSettings.workDuration).toBe(30);
      expect(updatedSettings.shortBreakDuration).toBe(10);
      expect(updatedSettings.longBreakDuration).toBe(20);
      expect(updatedSettings.cyclesBeforeLongBreak).toBe(3);
    });

    it('deve persistir configurações no localStorage', () => {
      const newSettings: PomodoroSettings = {
        ...DEFAULT_SETTINGS,
        workDuration: 30
      };

      service.updateSettings(newSettings);

      // Verifica localStorage
      const stored = localStorage.getItem('pomodoro-settings');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed.workDuration).toBe(30);
    });

    it('deve carregar configurações do localStorage ao inicializar', () => {
      // Salva configurações no localStorage
      const customSettings: PomodoroSettings = {
        ...DEFAULT_SETTINGS,
        workDuration: 45
      };
      localStorage.setItem('pomodoro-settings', JSON.stringify(customSettings));

      // Cria nova instância
      const newService = TestBed.inject(PomodoroService);

      expect(newService.settings().workDuration).toBe(45);
      newService.ngOnDestroy();
    });
  });

  describe('Skip e Auto-Avanço', () => {
    it('deve pular para próxima fase ao chamar skip()', () => {
      expect(service.mode()).toBe('work');
      service.skip();
      expect(service.mode()).toBe('shortBreak');
    });

    it('deve avançar para longBreak após ciclos configurados', () => {
      // Simula completar 4 ciclos de trabalho
      for (let i = 0; i < DEFAULT_SETTINGS.cyclesBeforeLongBreak; i++) {
        service.setMode('work');
        service.skip();
        if (i < DEFAULT_SETTINGS.cyclesBeforeLongBreak - 1) {
          service.setMode('work');
        }
      }

      // Após 4 ciclos, deve ser longBreak
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
          completedAt: new Date().toISOString(),
          wasSkipped: false
        }
      ]);

      const stored = localStorage.getItem('pomodoro-sessions');
      expect(stored).toBeTruthy();
    });
  });

  describe('Timer Complete Observable', () => {
    it('deve emitir quando o timer termina', fakeAsync(() => {
      let emittedMode: TimerMode | null = null;

      service.timerComplete$.subscribe(mode => {
        emittedMode = mode;
      });

      // Configura tempo mínimo para teste rápido
      service.updateSettings({
        ...DEFAULT_SETTINGS,
        workDuration: 0.02 // ~1 segundo
      });
      service.resetTimer();

      service.start();
      tick(1500); // 1.5 segundos

      expect(emittedMode).toBe('work');
      discardPeriodicTasks();
    }));
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
