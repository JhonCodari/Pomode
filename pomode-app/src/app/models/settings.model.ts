/**
 * Configurações do Pomodoro
 */

/** Configurações de tempo do Pomodoro */
export interface PomodoroSettings {
  /** Tempo de foco em minutos */
  workTime: number;
  /** Tempo de pausa curta em minutos */
  shortBreakTime: number;
  /** Tempo de pausa longa em minutos */
  longBreakTime: number;
  /** Número de ciclos antes da pausa longa */
  cyclesBeforeLongBreak: number;
  /** Som habilitado */
  soundEnabled: boolean;
  /** Volume do som (0-100) */
  soundVolume: number;
  /** Notificações habilitadas */
  notificationsEnabled: boolean;
}

/** Configurações padrão do Pomodoro */
export const DEFAULT_SETTINGS: PomodoroSettings = {
  workTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  cyclesBeforeLongBreak: 4,
  soundEnabled: true,
  soundVolume: 70,
  notificationsEnabled: true
};

/** Limites de validação para configurações */
export const SETTINGS_LIMITS = {
  workTime: { min: 1, max: 60 },
  shortBreakTime: { min: 1, max: 30 },
  longBreakTime: { min: 1, max: 60 },
  cyclesBeforeLongBreak: { min: 1, max: 10 },
  soundVolume: { min: 0, max: 100 }
};

/** Valida se um valor está dentro dos limites */
export function validateSettingValue(
  key: keyof typeof SETTINGS_LIMITS,
  value: number
): number {
  const limits = SETTINGS_LIMITS[key];
  if (!limits) return value;
  return Math.max(limits.min, Math.min(limits.max, value));
}

/** Valida todas as configurações */
export function validateSettings(settings: Partial<PomodoroSettings>): Partial<PomodoroSettings> {
  const validated: Partial<PomodoroSettings> = { ...settings };

  if (validated.workTime !== undefined) {
    validated.workTime = validateSettingValue('workTime', validated.workTime);
  }
  if (validated.shortBreakTime !== undefined) {
    validated.shortBreakTime = validateSettingValue('shortBreakTime', validated.shortBreakTime);
  }
  if (validated.longBreakTime !== undefined) {
    validated.longBreakTime = validateSettingValue('longBreakTime', validated.longBreakTime);
  }
  if (validated.cyclesBeforeLongBreak !== undefined) {
    validated.cyclesBeforeLongBreak = validateSettingValue('cyclesBeforeLongBreak', validated.cyclesBeforeLongBreak);
  }
  if (validated.soundVolume !== undefined) {
    validated.soundVolume = validateSettingValue('soundVolume', validated.soundVolume);
  }

  return validated;
}
