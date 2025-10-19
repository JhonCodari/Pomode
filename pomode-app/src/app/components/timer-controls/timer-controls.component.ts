import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PomodoroService } from '../../services/pomodoro.service';
import { AnalyticsService } from '../../services';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-timer-controls',
  imports: [CommonModule, TranslateModule, ButtonComponent, IconComponent],
  templateUrl: './timer-controls.component.html',
  styleUrl: './timer-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerControlsComponent {
  private pomodoroService = inject(PomodoroService);
  private analyticsService = inject(AnalyticsService);

  state = this.pomodoroService.state;
  private mode = this.pomodoroService.mode;
  private timeRemaining = this.pomodoroService.timeRemaining;

  start(): void {
    const sessionState = this.pomodoroService.state() === 'paused' ? 'resumed' : 'new';
    this.pomodoroService.start();
    this.analyticsService.trackTimerStarted(this.mode(), sessionState);
  }

  pause(): void {
    const mode = this.mode();
    const timeRemaining = this.timeRemaining();
    this.pomodoroService.pause();
    this.analyticsService.trackTimerPaused(mode, timeRemaining);
  }

  reset(): void {
    const mode = this.mode();
    const state = this.state();
    this.pomodoroService.reset();
    this.analyticsService.trackTimerReset(mode, state);
  }

  skip(): void {
    const modeFrom = this.mode();
    this.pomodoroService.skipToNext();
    this.analyticsService.trackTimerSkipped(modeFrom, this.mode());
  }
}
