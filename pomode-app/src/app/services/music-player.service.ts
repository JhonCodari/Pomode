import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import {
  MusicCategory,
  PlayerState,
  PersistedPlayerState,
  Track,
  DEFAULT_PLAYER_STATE,
  MUSIC_TRACKS,
} from '../models/music-player.model';
import { TimerMode, TimerState } from '../models';

@Injectable({
  providedIn: 'root',
})
export class MusicPlayerService implements OnDestroy {
  private readonly STORAGE_KEY = 'pomodoro-music-player';

  // ── Audio element ────────────────────────────────────────────────────────
  private audioElement?: HTMLAudioElement;

  /** true quando o usuário pausou manualmente (não retoma automaticamente) */
  private manuallyPaused = false;

  // ── State signal ─────────────────────────────────────────────────────────
  private readonly _state = signal<PlayerState>(this.loadInitialState());

  // ── Public computed signals ───────────────────────────────────────────────
  readonly isPlaying    = computed(() => this._state().isPlaying);
  readonly volume       = computed(() => this._state().volume);
  readonly isMuted      = computed(() => this._state().isMuted);
  readonly selectedCategory = computed(() => this._state().selectedCategory);
  readonly currentTrackId   = computed(() => this._state().currentTrackId);
  readonly autoPlayOnFocus  = computed(() => this._state().autoPlayOnFocus);

  readonly currentTrack = computed<Track | null>(() => {
    const id = this._state().currentTrackId;
    return id ? (MUSIC_TRACKS.find(t => t.id === id) ?? null) : null;
  });

  readonly tracksInCategory = computed<Track[]>(() => {
    const cat = this._state().selectedCategory;
    return MUSIC_TRACKS.filter(t => t.category === cat);
  });

  // ── Public API ────────────────────────────────────────────────────────────

  /** Altera a categoria e troca para a primeira faixa dela */
  setCategory(category: MusicCategory): void {
    const wasPlaying = this.isPlaying();
    if (wasPlaying) this.audioElement?.pause();

    const firstTrack = MUSIC_TRACKS.find(t => t.category === category);
    this._state.update(s => ({
      ...s,
      selectedCategory: category,
      currentTrackId: firstTrack?.id ?? null,
      isPlaying: false,
    }));
    this.saveToStorage();

    if (wasPlaying && firstTrack) {
      this.play();
    }
  }

  /** Seleciona uma faixa específica */
  setTrack(trackId: string): void {
    const track = MUSIC_TRACKS.find(t => t.id === trackId);
    if (!track) return;

    const wasPlaying = this.isPlaying();
    if (wasPlaying) this.audioElement?.pause();

    this._state.update(s => ({
      ...s,
      currentTrackId: trackId,
      selectedCategory: track.category,
      isPlaying: false,
    }));
    this.saveToStorage();

    if (wasPlaying) this.play();
  }

  /** Avança para a próxima faixa da categoria atual (circulando) */
  nextTrack(): void {
    const tracks = this.tracksInCategory();
    if (tracks.length <= 1) return;
    const currentId = this.currentTrackId();
    const currentIndex = tracks.findIndex(t => t.id === currentId);
    const nextIndex = (currentIndex + 1) % tracks.length;
    this.setTrack(tracks[nextIndex].id);
  }

  /** Inicia a reprodução da faixa atual */
  play(): void {
    const track = this.currentTrack();
    if (!track) return;

    this.playStream(track.source.url);
    this._state.update(s => ({ ...s, isPlaying: true }));
    this.manuallyPaused = false;
    this.saveToStorage();
  }

  /** Pausa a reprodução */
  pause(): void {
    this.audioElement?.pause();
    this._state.update(s => ({ ...s, isPlaying: false }));
    this.saveToStorage();
  }

  /** Pausa marcando como pausa manual (não retoma automaticamente) */
  pauseManually(): void {
    this.manuallyPaused = true;
    this.pause();
  }

  /** Alterna entre play/pause */
  toggle(): void {
    if (this.isPlaying()) {
      this.pauseManually();
    } else {
      this.manuallyPaused = false;
      this.play();
    }
  }

  /** Define o volume (0–100) */
  setVolume(volume: number): void {
    const v = Math.max(0, Math.min(100, volume));
    this._state.update(s => ({ ...s, volume: v, isMuted: v === 0 }));
    this.applyVolume();
    this.saveToStorage();
  }

  /** Alterna mudo */
  toggleMute(): void {
    this._state.update(s => ({ ...s, isMuted: !s.isMuted }));
    this.applyVolume();
    this.saveToStorage();
  }

  /** Liga/desliga auto-play ao iniciar foco */
  setAutoPlayOnFocus(value: boolean): void {
    this._state.update(s => ({ ...s, autoPlayOnFocus: value }));
    this.saveToStorage();
  }

  /**
   * Chamado pelo HomeComponent quando o estado do timer muda.
   * Pausa durante pausas e retoma ao voltar ao foco (se auto-play ligado).
   */
  onTimerChange(timerState: TimerState, timerMode: TimerMode): void {
    const isBreak = timerMode === 'shortBreak' || timerMode === 'longBreak';
    const isWorkRunning = timerMode === 'work' && timerState === 'running';

    if (isBreak && this.isPlaying()) {
      this.pause(); // pausa durante pausa (não marca como manual)
    }

    if (isWorkRunning && !this.isPlaying() && !this.manuallyPaused && this.autoPlayOnFocus()) {
      this.play();
    }
  }

  ngOnDestroy(): void {
    this.audioElement?.pause();
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private playStream(url: string): void {
    if (!this.audioElement) {
      // crossOrigin omitido: não usamos Web Audio API, e CORS anônimo
      // pode bloquear streams que não retornam Access-Control-Allow-Origin
      this.audioElement = new Audio();
    }

    if (this.audioElement.src !== url) {
      this.audioElement.pause();
      this.audioElement.src = url;
    }

    this.applyVolume();
    this.audioElement.play().catch(() => { /* autoplay policy */ });
  }

  private applyVolume(): void {
    if (!this.audioElement) return;
    const isMuted = this._state().isMuted;
    this.audioElement.volume = isMuted ? 0 : this._state().volume / 100;
    this.audioElement.muted = isMuted;
  }

  // ── Private: persistence ──────────────────────────────────────────────────

  private loadInitialState(): PlayerState {
    const saved = this.loadFromStorage();
    const validTrack = saved.currentTrackId
      ? MUSIC_TRACKS.find(t => t.id === saved.currentTrackId)
      : undefined;
    const validCategory = saved.selectedCategory &&
      MUSIC_TRACKS.some(t => t.category === saved.selectedCategory)
        ? saved.selectedCategory
        : DEFAULT_PLAYER_STATE.selectedCategory;
    return {
      ...DEFAULT_PLAYER_STATE,
      ...saved,
      currentTrackId: validTrack?.id ?? DEFAULT_PLAYER_STATE.currentTrackId,
      selectedCategory: validCategory,
    };
  }

  private loadFromStorage(): Partial<PersistedPlayerState> {
    if (typeof localStorage === 'undefined') return {};
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as PersistedPlayerState) : {};
    } catch {
      return {};
    }
  }

  private saveToStorage(): void {
    if (typeof localStorage === 'undefined') return;
    const s = this._state();
    const toSave: PersistedPlayerState = {
      volume: s.volume,
      isMuted: s.isMuted,
      currentTrackId: s.currentTrackId,
      selectedCategory: s.selectedCategory,
      autoPlayOnFocus: s.autoPlayOnFocus,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(toSave));
  }
}
