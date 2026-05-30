import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let gtagSpy: jasmine.Spy;

  beforeEach(() => {
    gtagSpy = jasmine.createSpy('gtag');
    (globalThis as any).gtag = gtagSpy;

    TestBed.configureTestingModule({
      providers: [AnalyticsService]
    });

    service = TestBed.inject(AnalyticsService);
  });

  afterEach(() => {
    delete (globalThis as any).gtag;
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  describe('quando analytics está habilitado', () => {
    beforeEach(() => {
      // Force analytics enabled regardless of environment / hostname
      (service as any).analyticsEnabled = true;
      (service as any).isConfigured = true;
      (service as any).debugMode = true;
      gtagSpy.calls.reset();
    });

    // ── Rastreamento de página ──────────────────────────────────────────────

    it('deve rastrear page_view', () => {
      service.trackPageView('/home');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/home',
        debug_mode: true,
      });
    });

    // ── Timer ───────────────────────────────────────────────────────────────

    it('deve rastrear interval_completed para qualquer intervalo', () => {
      service.trackIntervalCompleted('shortBreak', 5);

      expect(gtagSpy).toHaveBeenCalledWith('event', 'interval_completed', {
        interval_type: 'shortBreak',
        interval_duration_minutes: 5,
        debug_mode: true,
      });
    });

    it('deve rastrear pomodoro_completed apenas para foco concluído', () => {
      service.trackPomodoroCompleted(2, 25, 2);

      expect(gtagSpy).toHaveBeenCalledWith('event', 'pomodoro_completed', {
        pomodoros_completed_total: 2,
        focus_duration_minutes: 25,
        total_work_sessions_ever: 2,
        debug_mode: true,
      });
    });

    it('deve rastrear pomodoro_block_completed', () => {
      service.trackPomodoroBlockCompleted(2, 10);

      expect(gtagSpy).toHaveBeenCalledWith('event', 'pomodoro_block_completed', {
        block_number: 2,
        total_work_sessions_ever: 10,
        debug_mode: true,
      });
    });

    it('deve rastrear timer_started com modo e estado de sessão', () => {
      service.trackTimerStarted('work', 'new');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'timer_started', {
        mode: 'work',
        session_state: 'new',
        debug_mode: true,
      });
    });

    it('deve rastrear timer_started com sessão retomada', () => {
      service.trackTimerStarted('shortBreak', 'resumed');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'timer_started', {
        mode: 'shortBreak',
        session_state: 'resumed',
        debug_mode: true,
      });
    });

    it('deve rastrear timer_paused com tempo restante', () => {
      service.trackTimerPaused('work', 300);

      expect(gtagSpy).toHaveBeenCalledWith('event', 'timer_paused', {
        mode: 'work',
        time_remaining_seconds: 300,
        debug_mode: true,
      });
    });

    it('deve rastrear timer_reset', () => {
      service.trackTimerReset('shortBreak', 'idle');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'timer_reset', {
        mode: 'shortBreak',
        timer_state: 'idle',
        debug_mode: true,
      });
    });

    it('deve rastrear timer_skipped com modos de origem e destino', () => {
      service.trackTimerSkipped('work', 'shortBreak');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'timer_skipped', {
        mode_from: 'work',
        mode_to: 'shortBreak',
        debug_mode: true,
      });
    });

    // ── Configurações ───────────────────────────────────────────────────────

    it('deve rastrear settings_opened', () => {
      service.trackSettingsOpened();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'settings_opened', {
        debug_mode: true,
      });
    });

    it('deve rastrear settings_saved com todos os parâmetros', () => {
      service.trackSettingsSaved({
        workTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
        cyclesBeforeLongBreak: 4,
        soundEnabled: true,
        notificationsEnabled: false,
      });

      expect(gtagSpy).toHaveBeenCalledWith('event', 'settings_saved', {
        work_time: 25,
        short_break_time: 5,
        long_break_time: 15,
        cycles_before_long_break: 4,
        sound_enabled: true,
        notifications_enabled: false,
        debug_mode: true,
      });
    });

    it('deve rastrear settings_reset_to_default', () => {
      service.trackSettingsResetToDefault();

      expect(gtagSpy).toHaveBeenCalledWith('event', 'settings_reset_to_default', {
        debug_mode: true,
      });
    });

    it('deve rastrear notification_permission_requested com resultado', () => {
      service.trackNotificationPermissionRequested('granted');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'notification_permission_requested', {
        result: 'granted',
        debug_mode: true,
      });
    });

    // ── Preferências ────────────────────────────────────────────────────────

    it('deve rastrear theme_changed', () => {
      service.trackThemeChanged('dark');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'theme_changed', {
        theme: 'dark',
        debug_mode: true,
      });
    });

    it('deve rastrear language_changed', () => {
      service.trackLanguageChanged('pt');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'language_changed', {
        language: 'pt',
        debug_mode: true,
      });
    });

    it('deve rastrear keyboard_shortcut_used', () => {
      service.trackKeyboardShortcutUsed('space', 'toggle_timer');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'keyboard_shortcut_used', {
        key: 'space',
        action: 'toggle_timer',
        debug_mode: true,
      });
    });

    // ── Music Player ────────────────────────────────────────────────────────

    it('deve rastrear music_playback_started', () => {
      service.trackMusicPlaybackStarted('lofi', 'track-1');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'music_playback_started', {
        category: 'lofi',
        track_id: 'track-1',
        debug_mode: true,
      });
    });

    it('deve rastrear music_playback_paused com trigger manual', () => {
      service.trackMusicPlaybackPaused('lofi', 'track-1', 'manual');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'music_playback_paused', {
        category: 'lofi',
        track_id: 'track-1',
        trigger: 'manual',
        debug_mode: true,
      });
    });

    it('deve rastrear music_category_changed', () => {
      service.trackMusicCategoryChanged('jazz');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'music_category_changed', {
        category_id: 'jazz',
        debug_mode: true,
      });
    });

    it('deve rastrear music_next_track', () => {
      service.trackMusicNextTrack('track-2', 'lofi');

      expect(gtagSpy).toHaveBeenCalledWith('event', 'music_next_track', {
        track_id_after: 'track-2',
        category: 'lofi',
        debug_mode: true,
      });
    });

    it('deve rastrear music_volume_changed', () => {
      service.trackMusicVolumeChanged(75);

      expect(gtagSpy).toHaveBeenCalledWith('event', 'music_volume_changed', {
        volume_level: 75,
        debug_mode: true,
      });
    });

    it('deve rastrear music_mute_toggled', () => {
      service.trackMusicMuteToggled('mute', 50);

      expect(gtagSpy).toHaveBeenCalledWith('event', 'music_mute_toggled', {
        action: 'mute',
        volume_at_time: 50,
        debug_mode: true,
      });
    });

    // ── User Properties ─────────────────────────────────────────────────────

    it('deve definir user property via gtag set', () => {
      service.setUserProperty('user_type', 'power_user');

      expect(gtagSpy).toHaveBeenCalledWith('set', 'user_properties', {
        user_type: 'power_user',
      });
    });
  });

  describe('quando analytics está desabilitado', () => {
    beforeEach(() => {
      (service as any).analyticsEnabled = false;
      gtagSpy.calls.reset();
    });

    it('não deve chamar gtag ao rastrear page_view', () => {
      service.trackPageView('/home');
      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it('não deve chamar gtag ao rastrear interval_completed', () => {
      service.trackIntervalCompleted('work', 25);
      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it('não deve chamar gtag ao rastrear timer_started', () => {
      service.trackTimerStarted('work', 'new');
      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it('não deve chamar gtag ao rastrear timer_paused', () => {
      service.trackTimerPaused('work', 600);
      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it('não deve chamar gtag ao rastrear settings_saved', () => {
      service.trackSettingsSaved({
        workTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
        cyclesBeforeLongBreak: 4,
        soundEnabled: true,
        notificationsEnabled: false,
      });
      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it('não deve chamar gtag ao chamar setUserProperty', () => {
      service.setUserProperty('prop', 'value');
      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it('não deve chamar gtag ao rastrear theme_changed', () => {
      service.trackThemeChanged('light');
      expect(gtagSpy).not.toHaveBeenCalled();
    });
  });

  describe('ensureConfigured — inicialização lazy', () => {
    it('deve chamar gtag config antes do primeiro evento quando não configurado', () => {
      (service as any).analyticsEnabled = true;
      (service as any).isConfigured = false;
      gtagSpy.calls.reset();

      service.trackPageView('/home');

      // Primeira chamada: config (lazy setup); segunda: o evento em si
      expect(gtagSpy.calls.count()).toBe(2);
      expect(gtagSpy.calls.argsFor(0)[0]).toBe('config');
      expect(gtagSpy.calls.argsFor(1)[0]).toBe('event');
    });

    it('não deve emitir nenhum evento se gtag não estiver definido no escopo global', () => {
      (service as any).analyticsEnabled = true;
      (service as any).isConfigured = false;
      delete (globalThis as any).gtag;

      expect(() => service.trackPageView('/home')).not.toThrow();
    });
  });
});
