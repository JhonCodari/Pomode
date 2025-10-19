import { Component, inject, computed, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MusicPlayerService } from '../../services/music-player.service';
import { AnalyticsService } from '../../services';
import { MUSIC_CATEGORIES, MUSIC_TRACKS, Track } from '../../models/music-player.model';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-music-player',
  imports: [TranslateModule, IconComponent],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicPlayerComponent {
  private musicService = inject(MusicPlayerService);
  private analyticsService = inject(AnalyticsService);

  // ── Signals do service ────────────────────────────────────────────────────
  readonly isPlaying        = this.musicService.isPlaying;
  readonly volume           = this.musicService.volume;
  readonly isMuted          = this.musicService.isMuted;
  readonly currentTrack     = this.musicService.currentTrack;
  readonly selectedCategory = this.musicService.selectedCategory;
  readonly tracksInCategory = this.musicService.tracksInCategory;
  readonly autoPlayOnFocus  = this.musicService.autoPlayOnFocus;

  // ── Local UI state ────────────────────────────────────────────────────────
  readonly isMinimized = signal(false);
  readonly showTracks  = signal(false);

  // ── Dados estáticos para template ─────────────────────────────────────────
  readonly categories = MUSIC_CATEGORIES;

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly volumeIconName = computed<IconName>(() => {
    if (this.isMuted() || this.volume() === 0) return 'volume-x';
    if (this.volume() < 50) return 'volume-1';
    return 'volume-2';
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  toggle(): void {
    const wasPlaying = this.isPlaying();
    const track = this.currentTrack();
    const category = this.selectedCategory();
    this.musicService.toggle();
    if (wasPlaying) {
      this.analyticsService.trackMusicPlaybackPaused(category, track?.id ?? 'unknown', 'manual');
    } else {
      this.analyticsService.trackMusicPlaybackStarted(category, track?.id ?? 'unknown');
    }
  }

  selectCategory(categoryId: string): void {
    this.musicService.setCategory(categoryId as any);
    this.showTracks.set(false);
    this.analyticsService.trackMusicCategoryChanged(categoryId);
  }

  nextTrack(): void {
    this.musicService.nextTrack();
    const newTrack = this.currentTrack();
    this.analyticsService.trackMusicNextTrack(newTrack?.id ?? 'unknown', this.selectedCategory());
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const volumeLevel = Number(input.value);
    this.musicService.setVolume(volumeLevel);
    this.analyticsService.trackMusicVolumeChanged(volumeLevel);
  }

  toggleMute(): void {
    const action = this.isMuted() ? 'unmute' : 'mute';
    const vol = this.volume();
    this.musicService.toggleMute();
    this.analyticsService.trackMusicMuteToggled(action, vol);
  }

  toggleMinimize(): void {
    this.isMinimized.update(v => !v);
  }

  toggleTracks(): void {
    this.showTracks.update(v => !v);
  }

  toggleAutoPlay(): void {
    this.musicService.setAutoPlayOnFocus(!this.autoPlayOnFocus());
  }
}
