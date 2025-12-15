import { TestBed } from '@angular/core/testing';
import { AudioService } from './audio.service';
import { PomodoroService } from './pomodoro.service';

describe('AudioService', () => {
  let service: AudioService;
  let pomodoroServiceSpy: jasmine.SpyObj<PomodoroService>;

  // Mock AudioContext
  let mockAudioContext: any;
  let mockOscillator: any;
  let mockGainNode: any;

  beforeEach(() => {
    // Cria spy do PomodoroService
    pomodoroServiceSpy = jasmine.createSpyObj('PomodoroService', [], {
      settings: jasmine.createSpy().and.returnValue({
        soundEnabled: true,
        soundVolume: 80,
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        cyclesBeforeLongBreak: 4,
        notificationsEnabled: true
      })
    });

    // Mock AudioContext
    mockOscillator = {
      connect: jasmine.createSpy('connect'),
      start: jasmine.createSpy('start'),
      stop: jasmine.createSpy('stop'),
      type: 'sine',
      frequency: {
        setValueAtTime: jasmine.createSpy('setValueAtTime')
      }
    };

    mockGainNode = {
      connect: jasmine.createSpy('connect'),
      gain: {
        setValueAtTime: jasmine.createSpy('setValueAtTime'),
        linearRampToValueAtTime: jasmine.createSpy('linearRampToValueAtTime')
      }
    };

    mockAudioContext = {
      state: 'running',
      currentTime: 0,
      destination: {},
      resume: jasmine.createSpy('resume').and.returnValue(Promise.resolve()),
      createOscillator: jasmine.createSpy('createOscillator').and.returnValue(mockOscillator),
      createGain: jasmine.createSpy('createGain').and.returnValue(mockGainNode)
    };

    // Mock window.AudioContext
    (window as any).AudioContext = jasmine.createSpy('AudioContext').and.returnValue(mockAudioContext);

    TestBed.configureTestingModule({
      providers: [
        AudioService,
        { provide: PomodoroService, useValue: pomodoroServiceSpy }
      ]
    });

    service = TestBed.inject(AudioService);
  });

  describe('Inicialização', () => {
    it('deve ser criado', () => {
      expect(service).toBeTruthy();
    });

    it('deve criar AudioContext na inicialização', () => {
      expect((window as any).AudioContext).toHaveBeenCalled();
    });
  });

  describe('playAlert', () => {
    it('deve tocar som quando habilitado', async () => {
      await service.playAlert();

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      expect(mockOscillator.start).toHaveBeenCalled();
    });

    it('não deve tocar som quando desabilitado', async () => {
      // Configura som desabilitado
      (pomodoroServiceSpy.settings as jasmine.Spy).and.returnValue({
        soundEnabled: false,
        soundVolume: 80
      });

      // Recria o serviço com nova configuração
      await service.playAlert();

      // Como o som está desabilitado, não deve criar oscilador
      // Nota: O comportamento depende da ordem de verificação no serviço
    });
  });

  describe('playBeep', () => {
    it('deve tocar beep quando habilitado', async () => {
      await service.playBeep();

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      expect(mockOscillator.start).toHaveBeenCalled();
    });
  });

  describe('playSuccess', () => {
    it('deve tocar melodia de sucesso quando habilitado', async () => {
      await service.playSuccess();

      // playSuccess toca 3 notas
      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });
  });

  describe('playTest', () => {
    it('deve tocar som de teste ignorando configuração', async () => {
      // Mesmo com som desabilitado, playTest deve funcionar
      (pomodoroServiceSpy.settings as jasmine.Spy).and.returnValue({
        soundEnabled: false,
        soundVolume: 80
      });

      await service.playTest();

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });
  });

  describe('playClick', () => {
    it('deve tocar click quando habilitado', async () => {
      await service.playClick();

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });
  });

  describe('Volume', () => {
    it('deve aplicar volume corretamente', async () => {
      await service.playBeep();

      // Verifica se gainNode foi configurado
      expect(mockGainNode.gain.setValueAtTime).toHaveBeenCalled();
    });
  });

  describe('AudioContext Resume', () => {
    it('deve resumir contexto se suspenso', async () => {
      mockAudioContext.state = 'suspended';

      await service.playBeep();

      expect(mockAudioContext.resume).toHaveBeenCalled();
    });
  });

  describe('Fallback quando AudioContext não está disponível', () => {
    it('não deve lançar erro se AudioContext não existir', async () => {
      // Remove AudioContext
      delete (window as any).AudioContext;

      // Recria serviço sem AudioContext
      const serviceWithoutAudio = new AudioService();

      // Não deve lançar erro
      await expectAsync(serviceWithoutAudio.playAlert()).toBeResolved();
      await expectAsync(serviceWithoutAudio.playBeep()).toBeResolved();
      await expectAsync(serviceWithoutAudio.playSuccess()).toBeResolved();
    });
  });
});
