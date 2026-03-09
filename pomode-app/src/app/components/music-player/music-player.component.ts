import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MusicPlayerService } from '../../services/music-player.service';
import { MUSIC_CATEGORIES, MUSIC_TRACKS, Track } from '../../models/music-player.model';

@Component({
  selector: 'app-music-player',
  imports: [CommonModule, TranslateModule],
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.scss',
})
export class MusicPlayerComponent {
  private musicService = inject(MusicPlayerService);

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
  readonly volumeIcon = computed(() => {
    if (this.isMuted() || this.volume() === 0) return '🔇';
    if (this.volume() < 40) return '🔈';
    if (this.volume() < 70) return '🔉';
    return '🔊';
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  toggle(): void {
    this.musicService.toggle();
  }

  selectCategory(categoryId: string): void {
    this.musicService.setCategory(categoryId as any);
    this.showTracks.set(false);
  }

  selectTrack(track: Track): void {
    this.musicService.setTrack(track.id);
    this.showTracks.set(false);
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.musicService.setVolume(Number(input.value));
  }

  toggleMute(): void {
    this.musicService.toggleMute();
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

  trackById(_: number, track: Track): string {
    return track.id;
  }
}
