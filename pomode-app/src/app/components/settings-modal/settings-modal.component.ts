import { Component, inject, signal, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PomodoroService } from '../../services/pomodoro.service';
import { ToastService } from '../../services/toast.service';
import { AudioService } from '../../services/audio.service';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { PomodoroSettings, SETTINGS_LIMITS, DEFAULT_SETTINGS } from '../../models';

@Component({
  selector: 'app-settings-modal',
  imports: [CommonModule, FormsModule, TranslateModule, ButtonComponent, CardComponent, FormFieldComponent],
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
  private _workTime = signal<number>(this.pomodoroService.settings().workTime);
  private _shortBreakTime = signal<number>(this.pomodoroService.settings().shortBreakTime);
  private _longBreakTime = signal<number>(this.pomodoroService.settings().longBreakTime);
  private _cyclesBeforeLongBreak = signal<number>(this.pomodoroService.settings().cyclesBeforeLongBreak);
  private _soundEnabled = signal<boolean>(this.pomodoroService.settings().soundEnabled);
  private _soundVolume = signal<number>(this.pomodoroService.settings().soundVolume);
  private _notificationsEnabled = signal<boolean>(this.pomodoroService.settings().notificationsEnabled);

  // Getters and setters para ngModel
  get workTime(): number { return this._workTime(); }
  set workTime(value: number) { this._workTime.set(value); }

  get shortBreakTime(): number { return this._shortBreakTime(); }
  set shortBreakTime(value: number) { this._shortBreakTime.set(value); }

  get longBreakTime(): number { return this._longBreakTime(); }
  set longBreakTime(value: number) { this._longBreakTime.set(value); }

  get cyclesBeforeLongBreak(): number { return this._cyclesBeforeLongBreak(); }
  set cyclesBeforeLongBreak(value: number) { this._cyclesBeforeLongBreak.set(value); }

  get soundEnabled(): boolean { return this._soundEnabled(); }
  set soundEnabled(value: boolean) { this._soundEnabled.set(value); }

  get soundVolume(): number { return this._soundVolume(); }
  set soundVolume(value: number) { this._soundVolume.set(value); }

  get notificationsEnabled(): boolean { return this._notificationsEnabled(); }
  set notificationsEnabled(value: boolean) { this._notificationsEnabled.set(value); }

  // Atalho de teclado para fechar modal
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.cancel();
  }

  saveSettings(): void {
    // Valida e corrige valores antes de salvar
    const settings: Partial<PomodoroSettings> = {
      workTime: this.clampValue(this.workTime, this.limits.workTime),
      shortBreakTime: this.clampValue(this.shortBreakTime, this.limits.shortBreakTime),
      longBreakTime: this.clampValue(this.longBreakTime, this.limits.longBreakTime),
      cyclesBeforeLongBreak: this.clampValue(this.cyclesBeforeLongBreak, this.limits.cyclesBeforeLongBreak),
      soundEnabled: this.soundEnabled,
      soundVolume: this.clampValue(this.soundVolume, this.limits.soundVolume),
      notificationsEnabled: this.notificationsEnabled
    };

    this.pomodoroService.updateSettings(settings);
    this.toastService.success(this.translate.instant('SETTINGS.SAVED'));
    this.close.emit();
  }

  cancel(): void {
    this.close.emit();
  }

  resetToDefault(): void {
    this._workTime.set(DEFAULT_SETTINGS.workTime);
    this._shortBreakTime.set(DEFAULT_SETTINGS.shortBreakTime);
    this._longBreakTime.set(DEFAULT_SETTINGS.longBreakTime);
    this._cyclesBeforeLongBreak.set(DEFAULT_SETTINGS.cyclesBeforeLongBreak);
    this._soundEnabled.set(DEFAULT_SETTINGS.soundEnabled);
    this._soundVolume.set(DEFAULT_SETTINGS.soundVolume);
    this._notificationsEnabled.set(DEFAULT_SETTINGS.notificationsEnabled);
    this.toastService.info(this.translate.instant('SETTINGS.RESTORED'));
  }

  /** Testa o som com o volume atual */
  testSound(): void {
    // Temporariamente atualiza as configurações para testar
    const currentSettings = this.pomodoroService.settings();
    this.pomodoroService.updateSettings({
      soundEnabled: true,
      soundVolume: this.soundVolume
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
      this._notificationsEnabled.set(true);
      this.toastService.success(this.translate.instant('SETTINGS.NOTIFICATIONS.ENABLED_SUCCESS'));
    } else {
      this._notificationsEnabled.set(false);
      this.toastService.warning(this.translate.instant('SETTINGS.NOTIFICATIONS.DENIED'));
    }
  }

  /** Limita valor dentro do range permitido */
  private clampValue(value: number, limits: { min: number; max: number }): number {
    return Math.max(limits.min, Math.min(limits.max, Math.round(value)));
  }
}
