import { Component, inject, signal, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PomodoroService } from '../../services/pomodoro.service';
import { ToastService } from '../../services/toast.service';
import { AudioService } from '../../services/audio.service';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { PomodoroSettings, SETTINGS_LIMITS, DEFAULT_SETTINGS } from '../../models';

@Component({
  selector: 'app-settings-modal',
  imports: [CommonModule, FormsModule, TranslateModule, ButtonComponent, CardComponent],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.scss'
})
export class SettingsModalComponent {
  private pomodoroService = inject(PomodoroService);
  private toastService = inject(ToastService);
  private audioService = inject(AudioService);
  private translate = inject(TranslateService);

  @Output() close = new EventEmitter<void>();

  // Limites para validação (exposto para o template)
  readonly limits = SETTINGS_LIMITS;

  // Cópia local das configurações para edição
  workTime = signal<number>(this.pomodoroService.settings().workTime);
  shortBreakTime = signal<number>(this.pomodoroService.settings().shortBreakTime);
  longBreakTime = signal<number>(this.pomodoroService.settings().longBreakTime);
  cyclesBeforeLongBreak = signal<number>(this.pomodoroService.settings().cyclesBeforeLongBreak);
  soundEnabled = signal<boolean>(this.pomodoroService.settings().soundEnabled);
  soundVolume = signal<number>(this.pomodoroService.settings().soundVolume);
  notificationsEnabled = signal<boolean>(this.pomodoroService.settings().notificationsEnabled);

  // Atalho de teclado para fechar modal
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.cancel();
  }

  saveSettings(): void {
    // Valida e corrige valores antes de salvar
    const settings: Partial<PomodoroSettings> = {
      workTime: this.clampValue(this.workTime(), this.limits.workTime),
      shortBreakTime: this.clampValue(this.shortBreakTime(), this.limits.shortBreakTime),
      longBreakTime: this.clampValue(this.longBreakTime(), this.limits.longBreakTime),
      cyclesBeforeLongBreak: this.clampValue(this.cyclesBeforeLongBreak(), this.limits.cyclesBeforeLongBreak),
      soundEnabled: this.soundEnabled(),
      soundVolume: this.clampValue(this.soundVolume(), this.limits.soundVolume),
      notificationsEnabled: this.notificationsEnabled()
    };

    this.pomodoroService.updateSettings(settings);
    this.toastService.success(this.translate.instant('SETTINGS.SAVED'));
    this.close.emit();
  }

  cancel(): void {
    this.close.emit();
  }

  resetToDefault(): void {
    this.workTime.set(DEFAULT_SETTINGS.workTime);
    this.shortBreakTime.set(DEFAULT_SETTINGS.shortBreakTime);
    this.longBreakTime.set(DEFAULT_SETTINGS.longBreakTime);
    this.cyclesBeforeLongBreak.set(DEFAULT_SETTINGS.cyclesBeforeLongBreak);
    this.soundEnabled.set(DEFAULT_SETTINGS.soundEnabled);
    this.soundVolume.set(DEFAULT_SETTINGS.soundVolume);
    this.notificationsEnabled.set(DEFAULT_SETTINGS.notificationsEnabled);
    this.toastService.info(this.translate.instant('SETTINGS.RESTORED'));
  }

  /** Testa o som com o volume atual */
  testSound(): void {
    // Temporariamente atualiza as configurações para testar
    const currentSettings = this.pomodoroService.settings();
    this.pomodoroService.updateSettings({
      soundEnabled: true,
      soundVolume: this.soundVolume()
    });

    this.audioService.playTest();

    // Restaura as configurações originais
    setTimeout(() => {
      this.pomodoroService.updateSettings({
        soundEnabled: currentSettings.soundEnabled,
        soundVolume: currentSettings.soundVolume
      });
    }, 300);
  }

  /** Solicita permissão para notificações */
  async requestNotificationPermission(): Promise<void> {
    if (!('Notification' in window)) {
      this.toastService.warning(this.translate.instant('SETTINGS.NOTIFICATIONS.NOT_SUPPORTED'));
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      this.notificationsEnabled.set(true);
      this.toastService.success(this.translate.instant('SETTINGS.NOTIFICATIONS.ENABLED_SUCCESS'));
    } else {
      this.notificationsEnabled.set(false);
      this.toastService.warning(this.translate.instant('SETTINGS.NOTIFICATIONS.DENIED'));
    }
  }

  /** Limita valor dentro do range permitido */
  private clampValue(value: number, limits: { min: number; max: number }): number {
    return Math.max(limits.min, Math.min(limits.max, Math.round(value)));
  }
}
