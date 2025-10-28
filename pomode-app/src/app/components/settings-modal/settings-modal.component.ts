import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PomodoroService, PomodoroSettings } from '../../services/pomodoro.service';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-settings-modal',
  imports: [CommonModule, FormsModule, ButtonComponent, CardComponent],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.scss'
})
export class SettingsModalComponent {
  private pomodoroService = inject(PomodoroService);

  @Output() close = new EventEmitter<void>();

  // Cópia local das configurações para edição
  workTime = signal<number>(this.pomodoroService.settings().workTime);
  shortBreakTime = signal<number>(this.pomodoroService.settings().shortBreakTime);
  longBreakTime = signal<number>(this.pomodoroService.settings().longBreakTime);
  cyclesBeforeLongBreak = signal<number>(this.pomodoroService.settings().cyclesBeforeLongBreak);

  saveSettings(): void {
    const settings: PomodoroSettings = {
      workTime: this.workTime(),
      shortBreakTime: this.shortBreakTime(),
      longBreakTime: this.longBreakTime(),
      cyclesBeforeLongBreak: this.cyclesBeforeLongBreak()
    };

    this.pomodoroService.updateSettings(settings);
    this.close.emit();
  }

  cancel(): void {
    this.close.emit();
  }

  resetToDefault(): void {
    this.workTime.set(25);
    this.shortBreakTime.set(5);
    this.longBreakTime.set(15);
    this.cyclesBeforeLongBreak.set(4);
  }
}
