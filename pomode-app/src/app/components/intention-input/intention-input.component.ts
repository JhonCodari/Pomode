import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IntentionService } from '../../services/intention.service';
import { PomodoroService } from '../../services/pomodoro.service';

@Component({
  selector: 'app-intention-input',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './intention-input.component.html',
  styleUrl: './intention-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntentionInputComponent {
  private intentionService = inject(IntentionService);
  private pomodoroService = inject(PomodoroService);

  readonly intention = this.intentionService.intention;
  readonly isRunning = computed(() => this.pomodoroService.state() === 'running');
  readonly hasIntention = computed(() => this.intention().length > 0);

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    } else if (event.key === 'Escape') {
      const input = event.target as HTMLInputElement;
      input.value = '';
      input.blur();
    }
  }

  onBlur(event: FocusEvent): void {
    const value = (event.target as HTMLInputElement).value.trim();
    if (value) {
      this.intentionService.set(value);
    }
  }

  clear(): void {
    this.intentionService.clear();
  }
}
