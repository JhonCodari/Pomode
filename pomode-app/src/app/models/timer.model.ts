/**
 * Tipos relacionados ao Timer
 */

/** Modo do timer: trabalho, pausa curta ou pausa longa */
export type TimerMode = 'work' | 'shortBreak' | 'longBreak';

/** Estado do timer: inativo, rodando ou pausado */
export type TimerState = 'idle' | 'running' | 'paused';

/** Informações do modo do timer para exibição */
export interface TimerModeInfo {
  mode: TimerMode;
  label: string;
  emoji: string;
  color: string;
}

/** Mapeamento de informações por modo */
export const TIMER_MODE_INFO: Record<TimerMode, Omit<TimerModeInfo, 'mode'>> = {
  work: {
    label: 'Tempo de Foco',
    emoji: '🍅',
    color: 'primary'
  },
  shortBreak: {
    label: 'Pausa Curta',
    emoji: '☕',
    color: 'success'
  },
  longBreak: {
    label: 'Pausa Longa',
    emoji: '🌴',
    color: 'secondary'
  }
};
