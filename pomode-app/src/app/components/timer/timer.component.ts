import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PomodoroService, TimerMode } from '../../services/pomodoro.service';

@Component({
  selector: 'app-timer',
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {
  private pomodoroService = inject(PomodoroService);

  // Expor signals do serviço
  minutes = this.pomodoroService.minutes;
  seconds = this.pomodoroService.seconds;
  mode = this.pomodoroService.mode;
  state = this.pomodoroService.state;
  progress = this.pomodoroService.progress;
  completedCycles = this.pomodoroService.completedCycles;

  // Computed para textos do modo
  modeText = computed(() => {
    const mode = this.mode();
    switch (mode) {
      case 'work':
        return 'Tempo de Foco';
      case 'shortBreak':
        return 'Pausa Curta';
      case 'longBreak':
        return 'Pausa Longa';
    }
  });

  modeEmoji = computed(() => {
    const mode = this.mode();
    switch (mode) {
      case 'work':
        return '🍅';
      case 'shortBreak':
        return '☕';
      case 'longBreak':
        return '🌴';
    }
  });

  // Helper para formatar números com zero à esquerda
  formatNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
