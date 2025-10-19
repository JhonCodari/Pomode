/**
 * Models para o Music Player Ambiente
 */

/** Categorias de música disponíveis */
export type MusicCategory = 'lofi' | 'instrumental';

/** Fonte de áudio */
export interface AudioSource {
  type: 'stream';
  /** URL do stream */
  url: string;
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
  { id: 'instrumental', labelKey: 'MUSIC_PLAYER.CATEGORIES.INSTRUMENTAL', icon: '🎹' },
];

/** Catálogo de faixas disponíveis (streams via Soma FM — licenciado para streaming público gratuito) */
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
  // ── Instrumental ──────────────────────────────────────────────────────────
  {
    id: 'instrumental-digitalis',
    nameKey: 'MUSIC_PLAYER.TRACKS.DIGITALIS',
    category: 'instrumental',
    source: { type: 'stream', url: 'https://ice1.somafm.com/digitalis-128-mp3' },
    icon: '🎹',
  },
];
