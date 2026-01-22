import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PomodoroService, TimerMode } from '../../services/pomodoro.service';

@Component({
  selector: 'app-timer',
  imports: [CommonModule, TranslateModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {
  private pomodoroService = inject(PomodoroService);
  private translate = inject(TranslateService);

  // Expor signals do serviço
  minutes = this.pomodoroService.minutes;
  seconds = this.pomodoroService.seconds;
  mode = this.pomodoroService.mode;
  state = this.pomodoroService.state;
  progress = this.pomodoroService.progress;
  completedCycles = this.pomodoroService.completedCycles;

  // Computed para chave de tradução do modo
  modeTranslateKey = computed(() => {
    const mode = this.mode();
    switch (mode) {
      case 'work':
        return 'TIMER.MODES.WORK';
      case 'shortBreak':
        return 'TIMER.MODES.SHORT_BREAK';
      case 'longBreak':
        return 'TIMER.MODES.LONG_BREAK';
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
