import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PomodoroService } from '../../services/pomodoro.service';
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

  state = this.pomodoroService.state;

  start(): void {
    this.pomodoroService.start();
  }

  pause(): void {
    this.pomodoroService.pause();
  }

  reset(): void {
    this.pomodoroService.reset();
  }

  skip(): void {
    this.pomodoroService.skipToNext();
  }
}
