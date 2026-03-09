import { Injectable, signal, computed, OnDestroy } from '@angular/core';
import {
  MusicCategory,
  WebAudioNoiseType,
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

  // ── Audio nodes ──────────────────────────────────────────────────────────
  private audioElement?: HTMLAudioElement;
  private audioContext?: AudioContext;
  private masterGain?: GainNode;
  /** Nós Web Audio ativos (source + filtros) — guardados para parar */
  private webAudioSource?: AudioBufferSourceNode | OscillatorNode;
  private webAudioSource2?: OscillatorNode; // segundo oscilador para binaural
  private webAudioPanner?: StereoPannerNode;

  /** true quando o usuário pausou manualmente durante uma sessão de trabalho,
   *  para não retomar automaticamente sem querer */
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
    if (wasPlaying) this.stopCurrentAudio();

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
    if (wasPlaying) this.stopCurrentAudio();

    this._state.update(s => ({
      ...s,
      currentTrackId: trackId,
      selectedCategory: track.category,
      isPlaying: false,
    }));
    this.saveToStorage();

    if (wasPlaying) this.play();
  }

  /** Inicia a reprodução da faixa atual */
  play(): void {
    const track = this.currentTrack();
    if (!track) return;

    if (track.source.type === 'stream') {
      this.playStream(track.source.url!);
    } else if (track.source.type === 'webaudio') {
      this.playWebAudio(track.source.noiseType!);
    }

    this._state.update(s => ({ ...s, isPlaying: true }));
    this.manuallyPaused = false;
    this.saveToStorage();
  }

  /** Pausa a reprodução */
  pause(): void {
    this.pauseCurrentAudio();
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
    this.stopCurrentAudio();
    this.audioContext?.close();
  }

  // ── Private: stream audio ─────────────────────────────────────────────────

  private playStream(url: string): void {
    this.stopCurrentAudio();

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.loop = false;
      this.audioElement.crossOrigin = 'anonymous';
    }

    this.audioElement.src = url;
    this.applyVolumeToElement();
    this.audioElement.play().catch(() => {
      // autoplay policy: apenas registra silenciosamente
    });
  }

  private pauseCurrentAudio(): void {
    this.audioElement?.pause();
    // Web Audio API: baixar gain para silêncio suave
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setTargetAtTime(0, this.audioContext.currentTime, 0.1);
      // Para o source após o fade
      setTimeout(() => this.stopWebAudioNodes(), 200);
    }
  }

  private stopCurrentAudio(): void {
    this.audioElement?.pause();
    if (this.audioElement) {
      this.audioElement.src = '';
    }
    this.stopWebAudioNodes();
  }

  private stopWebAudioNodes(): void {
    try { this.webAudioSource?.stop(); } catch { /* já parado */ }
    try { this.webAudioSource2?.stop(); } catch { /* já parado */ }
    this.webAudioSource  = undefined;
    this.webAudioSource2 = undefined;
    this.webAudioPanner  = undefined;
  }

  // ── Private: Web Audio API ────────────────────────────────────────────────

  private ensureAudioContext(): boolean {
    if (typeof window === 'undefined') return false;
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    this.applyVolumeToGain();
    return true;
  }

  private playWebAudio(noiseType: WebAudioNoiseType): void {
    if (!this.ensureAudioContext()) return;
    this.stopWebAudioNodes();

    switch (noiseType) {
      case 'white':        return this.playWhiteNoise();
      case 'brown':        return this.playBrownNoise();
      case 'rain':         return this.playRain();
      case 'binaural-alpha': return this.playBinaural(10);  // 10 Hz → ondas alpha
      case 'binaural-theta': return this.playBinaural(6);   // 6 Hz  → ondas theta
    }
  }

  private playWhiteNoise(): void {
    const ctx = this.audioContext!;
    const bufferSize = ctx.sampleRate * 2; // 2 segundos de buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.masterGain!);
    source.start();
    this.webAudioSource = source;
  }

  private playBrownNoise(): void {
    const ctx = this.audioContext!;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // normaliza o volume
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.masterGain!);
    source.start();
    this.webAudioSource = source;
  }

  private playRain(): void {
    const ctx = this.audioContext!;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Filtro passa-banda para textura de chuva
    const highPass = ctx.createBiquadFilter();
    highPass.type = 'highpass';
    highPass.frequency.value = 1200;

    const lowPass = ctx.createBiquadFilter();
    lowPass.type = 'lowpass';
    lowPass.frequency.value = 8000;

    source.connect(highPass);
    highPass.connect(lowPass);
    lowPass.connect(this.masterGain!);
    source.start();
    this.webAudioSource = source;
  }

  private playBinaural(beatHz: number): void {
    const ctx = this.audioContext!;
    const baseFreq = 200; // frequência base (inaudível por si só de forma "óbvia")

    // Oscilador esquerdo
    const oscLeft = ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.value = baseFreq;

    // Oscilador direito (baseFreq + beatHz)
    const oscRight = ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.value = baseFreq + beatHz;

    // Panner para separar os canais
    const panLeft = ctx.createStereoPanner();
    panLeft.pan.value = -1;
    const panRight = ctx.createStereoPanner();
    panRight.pan.value = 1;

    oscLeft.connect(panLeft);
    panLeft.connect(this.masterGain!);

    oscRight.connect(panRight);
    panRight.connect(this.masterGain!);

    oscLeft.start();
    oscRight.start();

    this.webAudioSource  = oscLeft;
    this.webAudioSource2 = oscRight;
  }

  // ── Private: volume ───────────────────────────────────────────────────────

  private applyVolume(): void {
    this.applyVolumeToElement();
    this.applyVolumeToGain();
  }

  private applyVolumeToElement(): void {
    if (!this.audioElement) return;
    const isMuted = this._state().isMuted;
    const volumeFraction = isMuted ? 0 : this._state().volume / 100;
    this.audioElement.volume = volumeFraction;
    this.audioElement.muted = isMuted;
  }

  private applyVolumeToGain(): void {
    if (!this.masterGain || !this.audioContext) return;
    const isMuted = this._state().isMuted;
    const gain = isMuted ? 0 : this._state().volume / 100;
    this.masterGain.gain.setTargetAtTime(gain, this.audioContext.currentTime, 0.05);
  }

  // ── Private: persistence ──────────────────────────────────────────────────

  private loadInitialState(): PlayerState {
    const saved = this.loadFromStorage();
    return { ...DEFAULT_PLAYER_STATE, ...saved };
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
