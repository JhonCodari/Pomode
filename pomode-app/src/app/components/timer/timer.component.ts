import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PomodoroService, TimerMode } from '../../services/pomodoro.service';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-timer',
  imports: [TranslateModule, IconComponent],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  modeIcon = computed<IconName | null>(() => {
    const mode = this.mode();
    switch (mode) {
      case 'work':
        return null; // usa emoji 🍅
      case 'shortBreak':
        return 'coffee';
      case 'longBreak':
        return 'palmtree';
    }
  });

  // Helper para formatar números com zero à esquerda
  formatNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
