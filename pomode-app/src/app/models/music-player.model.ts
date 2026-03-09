/**
 * Models para o Music Player Ambiente
 */

/** Categorias de música disponíveis */
export type MusicCategory = 'lofi' | 'whitenoise' | 'nature' | 'instrumental' | 'binaural';

/** Tipo da fonte de áudio — extensível para youtube no futuro */
export type AudioSourceType = 'stream' | 'webaudio' | 'youtube';

/** Tipos de ruído gerados via Web Audio API */
export type WebAudioNoiseType =
  | 'white'
  | 'brown'
  | 'rain'
  | 'binaural-alpha'
  | 'binaural-theta';

/** Fonte de áudio — polimórfica por tipo */
export interface AudioSource {
  type: AudioSourceType;
  /** URL do stream ou arquivo (para type: 'stream') */
  url?: string;
  /** Tipo de ruído a gerar (para type: 'webaudio') */
  noiseType?: WebAudioNoiseType;
  /** ID do vídeo YouTube (para type: 'youtube' — uso futuro) */
  youtubeVideoId?: string;
}

/** Faixa de música */
export interface Track {
  id: string;
  /** Chave de i18n para o nome */
  nameKey: string;
  category: MusicCategory;
  source: AudioSource;
  /** Ícone emoji representativo */
  icon: string;
}

/** Estado do player */
export interface PlayerState {
  isPlaying: boolean;
  /** Volume de 0 a 100 */
  volume: number;
  isMuted: boolean;
  currentTrackId: string | null;
  selectedCategory: MusicCategory;
  /** Tocar automaticamente ao iniciar sessão de foco */
  autoPlayOnFocus: boolean;
}

/** Estado persistido no localStorage (subconjunto do PlayerState) */
export interface PersistedPlayerState {
  volume: number;
  isMuted: boolean;
  currentTrackId: string | null;
  selectedCategory: MusicCategory;
  autoPlayOnFocus: boolean;
}

/** Estado padrão do player */
export const DEFAULT_PLAYER_STATE: PlayerState = {
  isPlaying: false,
  volume: 50,
  isMuted: false,
  currentTrackId: 'lofi-groove-salad',
  selectedCategory: 'lofi',
  autoPlayOnFocus: false,
};

/** Informações de uma categoria para exibição na UI */
export interface MusicCategoryInfo {
  id: MusicCategory;
  labelKey: string;
  icon: string;
}

/** Categorias disponíveis na UI */
export const MUSIC_CATEGORIES: MusicCategoryInfo[] = [
  { id: 'lofi',         labelKey: 'MUSIC_PLAYER.CATEGORIES.LOFI',         icon: '🎵' },
  { id: 'whitenoise',   labelKey: 'MUSIC_PLAYER.CATEGORIES.WHITENOISE',   icon: '🌫️' },
  { id: 'nature',       labelKey: 'MUSIC_PLAYER.CATEGORIES.NATURE',       icon: '🌿' },
  { id: 'instrumental', labelKey: 'MUSIC_PLAYER.CATEGORIES.INSTRUMENTAL', icon: '🎹' },
  { id: 'binaural',     labelKey: 'MUSIC_PLAYER.CATEGORIES.BINAURAL',     icon: '🧠' },
];

/**
 * Catálogo de faixas disponíveis.
 * Streams usam Soma FM (licenciado para streaming público gratuito).
 * Sons gerados usam Web Audio API (offline, sem custo).
 */
export const MUSIC_TRACKS: Track[] = [
  // ── Lofi / Chillhop ──────────────────────────────────────────────────────
  {
    id: 'lofi-groove-salad',
    nameKey: 'MUSIC_PLAYER.TRACKS.GROOVE_SALAD',
    category: 'lofi',
    source: { type: 'stream', url: 'https://ice1.somafm.com/groovesalad-256-mp3' },
    icon: '🎵',
  },
  {
    id: 'lofi-drone-zone',
    nameKey: 'MUSIC_PLAYER.TRACKS.DRONE_ZONE',
    category: 'lofi',
    source: { type: 'stream', url: 'https://ice1.somafm.com/dronezone-256-mp3' },
    icon: '🌙',
  },
  // ── Ruído Branco / Marrom ─────────────────────────────────────────────────
  {
    id: 'noise-white',
    nameKey: 'MUSIC_PLAYER.TRACKS.WHITE_NOISE',
    category: 'whitenoise',
    source: { type: 'webaudio', noiseType: 'white' },
    icon: '⬜',
  },
  {
    id: 'noise-brown',
    nameKey: 'MUSIC_PLAYER.TRACKS.BROWN_NOISE',
    category: 'whitenoise',
    source: { type: 'webaudio', noiseType: 'brown' },
    icon: '🟤',
  },
  // ── Sons da Natureza ──────────────────────────────────────────────────────
  {
    id: 'nature-rain',
    nameKey: 'MUSIC_PLAYER.TRACKS.RAIN',
    category: 'nature',
    source: { type: 'webaudio', noiseType: 'rain' },
    icon: '🌧️',
  },
  // ── Instrumental ──────────────────────────────────────────────────────────
  {
    id: 'instrumental-digitalis',
    nameKey: 'MUSIC_PLAYER.TRACKS.DIGITALIS',
    category: 'instrumental',
    source: { type: 'stream', url: 'https://ice1.somafm.com/digitalis-128-mp3' },
    icon: '🎹',
  },
  // ── Binaural Beats ────────────────────────────────────────────────────────
  {
    id: 'binaural-alpha',
    nameKey: 'MUSIC_PLAYER.TRACKS.BINAURAL_ALPHA',
    category: 'binaural',
    source: { type: 'webaudio', noiseType: 'binaural-alpha' },
    icon: '🧠',
  },
  {
    id: 'binaural-theta',
    nameKey: 'MUSIC_PLAYER.TRACKS.BINAURAL_THETA',
    category: 'binaural',
    source: { type: 'webaudio', noiseType: 'binaural-theta' },
    icon: '🔮',
  },
];
