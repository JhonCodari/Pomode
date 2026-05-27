import { Injectable } from '@angular/core';
import { TimerMode, TimerState } from '../models';
import { environment } from '../../environments/environment';

const GA_MEASUREMENT_ID = 'G-YJ23L6T83X';

// Typed declaration for the global gtag function injected by index.html
declare function gtag(...args: unknown[]): void;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly analyticsEnabled = environment.analyticsEnabled;
  private readonly debugMode = !environment.production || this.isLocalhost();

  private isLocalhost(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  }

  private withDebugParams(params?: Record<string, unknown>): Record<string, unknown> {
    if (!this.debugMode) {
      return params ?? {};
    }

    return {
      ...(params ?? {}),
      debug_mode: true,
    };
  }

  private track(eventName: string, params?: Record<string, unknown>): void {
    if (!this.analyticsEnabled) return;
    if (typeof gtag === 'undefined') return;
    gtag('event', eventName, this.withDebugParams(params));
  }

  setUserProperty(name: string, value: string): void {
    if (!this.analyticsEnabled) return;
    if (typeof gtag === 'undefined') return;
    gtag('set', 'user_properties', { [name]: value });
  }

  trackPageView(path: string): void {
    if (!this.analyticsEnabled) return;
    if (typeof gtag === 'undefined') return;
    gtag('config', GA_MEASUREMENT_ID, this.withDebugParams({ page_path: path }));
  }

  // ── Timer ────────────────────────────────────────────────────────────────

  trackTimerStarted(mode: TimerMode, sessionState: 'new' | 'resumed'): void {
    this.track('timer_started', { mode, session_state: sessionState });
  }

  trackTimerPaused(mode: TimerMode, timeRemainingSeconds: number): void {
    this.track('timer_paused', { mode, time_remaining_seconds: timeRemainingSeconds });
  }

  trackTimerReset(mode: TimerMode, timerState: TimerState): void {
    this.track('timer_reset', { mode, timer_state: timerState });
  }

  trackTimerSkipped(modeFrom: TimerMode, modeTo: TimerMode): void {
    this.track('timer_skipped', { mode_from: modeFrom, mode_to: modeTo });
  }

  trackIntervalCompleted(
    intervalType: TimerMode,
    intervalDurationMinutes: number
  ): void {
    this.track('interval_completed', {
      interval_type: intervalType,
      interval_duration_minutes: intervalDurationMinutes,
    });
  }

  trackPomodoroCompleted(
    pomodorosCompletedTotal: number,
    focusDurationMinutes: number,
    totalWorkSessionsEver: number
  ): void {
    this.track('pomodoro_completed', {
      pomodoros_completed_total: pomodorosCompletedTotal,
      focus_duration_minutes: focusDurationMinutes,
      total_work_sessions_ever: totalWorkSessionsEver,
    });
  }

  trackPomodoroBlockCompleted(blockNumber: number, totalWorkSessionsEver: number): void {
    this.track('pomodoro_block_completed', {
      block_number: blockNumber,
      total_work_sessions_ever: totalWorkSessionsEver,
    });
  }

  // ── Settings ─────────────────────────────────────────────────────────────

  trackSettingsOpened(): void {
    this.track('settings_opened');
  }

  trackSettingsSaved(params: {
    workTime: number;
    shortBreakTime: number;
    longBreakTime: number;
    cyclesBeforeLongBreak: number;
    soundEnabled: boolean;
    notificationsEnabled: boolean;
  }): void {
    this.track('settings_saved', {
      work_time: params.workTime,
      short_break_time: params.shortBreakTime,
      long_break_time: params.longBreakTime,
      cycles_before_long_break: params.cyclesBeforeLongBreak,
      sound_enabled: params.soundEnabled,
      notifications_enabled: params.notificationsEnabled,
    });
  }

  trackSettingsResetToDefault(): void {
    this.track('settings_reset_to_default');
  }

  trackNotificationPermissionRequested(result: 'granted' | 'denied' | 'unsupported'): void {
    this.track('notification_permission_requested', { result });
  }

  // ── Preferences ──────────────────────────────────────────────────────────

  trackThemeChanged(theme: 'light' | 'dark'): void {
    this.track('theme_changed', { theme });
  }

  trackLanguageChanged(language: string): void {
    this.track('language_changed', { language });
  }

  trackKeyboardShortcutUsed(key: 'space' | 'r' | 's', action: string): void {
    this.track('keyboard_shortcut_used', { key, action });
  }

  // ── Music Player ─────────────────────────────────────────────────────────

  trackMusicPlaybackStarted(category: string, trackId: string): void {
    this.track('music_playback_started', { category, track_id: trackId });
  }

  trackMusicPlaybackPaused(category: string, trackId: string, trigger: 'manual' | 'auto_timer'): void {
    this.track('music_playback_paused', { category, track_id: trackId, trigger });
  }

  trackMusicCategoryChanged(categoryId: string): void {
    this.track('music_category_changed', { category_id: categoryId });
  }

  trackMusicNextTrack(trackIdAfter: string, category: string): void {
    this.track('music_next_track', { track_id_after: trackIdAfter, category });
  }

  trackMusicMuteToggled(action: 'mute' | 'unmute', volumeAtTime: number): void {
    this.track('music_mute_toggled', { action, volume_at_time: volumeAtTime });
  }

  trackMusicVolumeChanged(volumeLevel: number): void {
    this.track('music_volume_changed', { volume_level: volumeLevel });
  }
}
