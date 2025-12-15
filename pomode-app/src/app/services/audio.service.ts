import { Injectable, inject } from '@angular/core';
import { PomodoroService } from './pomodoro.service';

/** Configuração de som */
interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
}

/** Presets de sons */
const SOUND_PRESETS = {
  alert: { frequency: 800, duration: 0.8, type: 'sine' as OscillatorType },
  beep: { frequency: 600, duration: 0.3, type: 'sine' as OscillatorType },
  success: [
    { frequency: 523.25, delay: 0, duration: 0.3 },    // C5
    { frequency: 659.25, delay: 0.15, duration: 0.3 }, // E5
    { frequency: 783.99, delay: 0.3, duration: 0.5 }   // G5
  ]
};

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext?: AudioContext;
  private pomodoroService = inject(PomodoroService);

  constructor() {
    this.initAudioContext();
  }

  /**
   * Inicializa o AudioContext
   */
  private initAudioContext(): void {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  /**
   * Verifica se o som está habilitado
   */
  private isSoundEnabled(): boolean {
    return this.pomodoroService.settings().soundEnabled;
  }

  /**
   * Obtém o volume atual (0-1)
   */
  private getVolume(): number {
    return this.pomodoroService.settings().soundVolume / 100;
  }

  /**
   * Resume o contexto de áudio se necessário
   */
  private async resumeContext(): Promise<boolean> {
    if (!this.audioContext) return false;

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    return true;
  }

  /**
   * Cria um oscilador conectado ao destino com ganho
   */
  private createOscillator(config: SoundConfig): { oscillator: OscillatorNode; gainNode: GainNode } | null {
    if (!this.audioContext) return null;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, this.audioContext.currentTime);

    return { oscillator, gainNode };
  }

  /**
   * Toca um som de alerta
   */
  public async playAlert(): Promise<void> {
    if (!this.isSoundEnabled() || !this.audioContext) return;

    try {
      await this.resumeContext();
      const volume = this.getVolume();

      const result = this.createOscillator(SOUND_PRESETS.alert);
      if (!result) return;

      const { oscillator, gainNode } = result;
      const currentTime = this.audioContext.currentTime;

      // Envelope do volume
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3 * volume, currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.8);

      oscillator.start(currentTime);
      oscillator.stop(currentTime + 0.8);

      // Repetir beeps
      setTimeout(() => this.playBeep(), 200);
      setTimeout(() => this.playBeep(), 400);
    } catch (error) {
      console.error('Erro ao tocar som:', error);
    }
  }

  /**
   * Toca um beep curto
   */
  private async playBeep(): Promise<void> {
    if (!this.isSoundEnabled() || !this.audioContext) return;

    try {
      const volume = this.getVolume();
      const result = this.createOscillator(SOUND_PRESETS.beep);
      if (!result) return;

      const { oscillator, gainNode } = result;
      const currentTime = this.audioContext.currentTime;

      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2 * volume, currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3);

      oscillator.start(currentTime);
      oscillator.stop(currentTime + 0.3);
    } catch (error) {
      console.error('Erro ao tocar beep:', error);
    }
  }

  /**
   * Toca um som de sucesso (sequência de notas)
   */
  public async playSuccess(): Promise<void> {
    if (!this.isSoundEnabled() || !this.audioContext) return;

    try {
      await this.resumeContext();

      for (const note of SOUND_PRESETS.success) {
        this.playNote(note.frequency, note.delay, note.duration);
      }
    } catch (error) {
      console.error('Erro ao tocar som de sucesso:', error);
    }
  }

  /**
   * Toca uma nota específica
   */
  private playNote(frequency: number, startDelay: number, duration: number): void {
    if (!this.audioContext) return;

    const volume = this.getVolume();
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    const startTime = this.audioContext.currentTime + startDelay;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    const attackTime = 0.05;
    const releaseTime = 0.1;
    const maxGain = 0.25 * volume;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(maxGain, startTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(maxGain, startTime + duration - releaseTime);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  /**
   * Toca um som de teste para preview do volume
   */
  public async playTest(): Promise<void> {
    if (!this.audioContext) return;

    try {
      await this.resumeContext();
      this.playNote(600, 0, 0.2);
    } catch (error) {
      console.error('Erro ao tocar som de teste:', error);
    }
  }
}
