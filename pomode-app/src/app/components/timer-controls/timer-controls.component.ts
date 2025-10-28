import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PomodoroService } from '../../services/pomodoro.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-timer-controls',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './timer-controls.component.html',
  styleUrl: './timer-controls.component.scss'
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
