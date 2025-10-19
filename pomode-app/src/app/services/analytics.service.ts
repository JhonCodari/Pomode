import { Injectable } from '@angular/core';
import { TimerMode, TimerState } from '../models';

const GA_MEASUREMENT_ID = 'G-YJ23L6T83X';

// Typed declaration for the global gtag function injected by index.html
declare function gtag(...args: unknown[]): void;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private track(eventName: string, params?: Record<string, unknown>): void {
    if (typeof gtag === 'undefined') return;
    gtag('event', eventName, params ?? {});
  }

  setUserProperty(name: string, value: string): void {
    if (typeof gtag === 'undefined') return;
    gtag('set', 'user_properties', { [name]: value });
  }

  trackPageView(path: string): void {
    if (typeof gtag === 'undefined') return;
    gtag('config', GA_MEASUREMENT_ID, { page_path: path });
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

  trackCycleCompleted(
    sessionType: TimerMode,
    cyclesCompletedTotal: number,
    sessionDurationMinutes: number
  ): void {
    this.track('cycle_completed', {
      session_type: sessionType,
      cycles_completed_total: cyclesCompletedTotal,
      session_duration_minutes: sessionDurationMinutes,
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
