/**
 * Sessões do Pomodoro
 */

import { TimerMode } from './timer.model';

/** Sessão completada do Pomodoro */
export interface PomodoroSession {
  /** ID único da sessão */
  id: string;
  /** Modo da sessão (trabalho, pausa curta, pausa longa) */
  mode: TimerMode;
  /** Duração em segundos */
  duration: number;
  /** Data/hora de conclusão */
  completedAt: Date;
}

/** Filtro de período para sessões */
export type SessionPeriodFilter = 'today' | 'week' | 'month' | 'all';

/** Estatísticas de sessões */
export interface SessionStats {
  /** Total de sessões */
  totalSessions: number;
  /** Sessões de trabalho */
  workSessions: number;
  /** Total de minutos de foco */
  totalFocusMinutes: number;
  /** Total de minutos de pausa */
  totalBreakMinutes: number;
  /** Média de sessões por dia */
  averageSessionsPerDay: number;
}

/** Filtra sessões por período */
export function filterSessionsByPeriod(
  sessions: PomodoroSession[],
  period: SessionPeriodFilter
): PomodoroSession[] {
  const now = new Date();

  switch (period) {
    case 'today': {
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return sessions.filter(s => new Date(s.completedAt) >= todayStart);
    }
    case 'week': {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessions.filter(s => new Date(s.completedAt) >= weekAgo);
    }
    case 'month': {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return sessions.filter(s => new Date(s.completedAt) >= monthAgo);
    }
    case 'all':
    default:
      return sessions;
  }
}

/** Calcula estatísticas das sessões */
export function calculateSessionStats(sessions: PomodoroSession[]): SessionStats {
  const workSessions = sessions.filter(s => s.mode === 'work');
  const breakSessions = sessions.filter(s => s.mode !== 'work');

  const totalFocusMinutes = workSessions.reduce((acc, s) => acc + (s.duration / 60), 0);
  const totalBreakMinutes = breakSessions.reduce((acc, s) => acc + (s.duration / 60), 0);

  // Calcula média de sessões por dia
  let averageSessionsPerDay = 0;
  if (sessions.length > 0) {
    const dates = sessions.map(s => new Date(s.completedAt).toDateString());
    const uniqueDates = [...new Set(dates)];
    averageSessionsPerDay = sessions.length / uniqueDates.length;
  }

  return {
    totalSessions: sessions.length,
    workSessions: workSessions.length,
    totalFocusMinutes: Math.round(totalFocusMinutes),
    totalBreakMinutes: Math.round(totalBreakMinutes),
    averageSessionsPerDay: Math.round(averageSessionsPerDay * 10) / 10
  };
}
