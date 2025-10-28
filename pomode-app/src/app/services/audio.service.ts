import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext?: AudioContext;

  constructor() {
    // Inicializa o AudioContext apenas quando necessário
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  /**
   * Toca um som de alerta usando Web Audio API
   * Gera um som sintetizado (não precisa de arquivo externo)
   */
  public playAlert(): void {
    if (!this.audioContext) return;

    try {
      // Resume o contexto se estiver suspenso (política de autoplay)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Cria um oscilador para gerar o som
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Conecta o oscilador ao ganho e o ganho ao destino
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configura o som (frequência e tipo de onda)
      oscillator.type = 'sine'; // Tom suave
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime); // 800 Hz

      // Envelope do volume (fade in/out)
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);

      // Inicia e para o som
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.8);

      // Repetir 3 vezes
      setTimeout(() => this.playBeep(), 200);
      setTimeout(() => this.playBeep(), 400);
    } catch (error) {
      console.error('Erro ao tocar som:', error);
    }
  }

  /**
   * Toca um beep curto
   */
  private playBeep(): void {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Erro ao tocar beep:', error);
    }
  }

  /**
   * Toca um som de sucesso (mais agradável)
   */
  public playSuccess(): void {
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Primeira nota
      this.playNote(523.25, 0, 0.3); // C5
      // Segunda nota
      this.playNote(659.25, 0.15, 0.3); // E5
      // Terceira nota
      this.playNote(783.99, 0.3, 0.5); // G5
    } catch (error) {
      console.error('Erro ao tocar som de sucesso:', error);
    }
  }

  /**
   * Toca uma nota específica
   */
  private playNote(frequency: number, startTime: number, duration: number): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime + startTime);

    const attackTime = 0.05;
    const releaseTime = 0.1;

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime + startTime);
    gainNode.gain.linearRampToValueAtTime(0.25, this.audioContext.currentTime + startTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(0.25, this.audioContext.currentTime + startTime + duration - releaseTime);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + startTime + duration);

    oscillator.start(this.audioContext.currentTime + startTime);
    oscillator.stop(this.audioContext.currentTime + startTime + duration);
  }
}
