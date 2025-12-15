import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly DEFAULT_DURATION = 3000;

  /** Lista de toasts ativos */
  public toasts = signal<Toast[]>([]);

  /**
   * Exibe um toast de sucesso
   */
  public success(message: string, duration?: number): void {
    this.show(message, 'success', duration);
  }

  /**
   * Exibe um toast de erro
   */
  public error(message: string, duration?: number): void {
    this.show(message, 'error', duration);
  }

  /**
   * Exibe um toast de aviso
   */
  public warning(message: string, duration?: number): void {
    this.show(message, 'warning', duration);
  }

  /**
   * Exibe um toast informativo
   */
  public info(message: string, duration?: number): void {
    this.show(message, 'info', duration);
  }

  /**
   * Exibe um toast genérico
   */
  public show(message: string, type: ToastType = 'info', duration?: number): void {
    const toast: Toast = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      duration: duration ?? this.DEFAULT_DURATION
    };

    this.toasts.update(toasts => [...toasts, toast]);

    // Remove automaticamente após a duração
    if (toast.duration > 0) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, toast.duration);
    }
  }

  /**
   * Remove um toast específico
   */
  public dismiss(id: string): void {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  /**
   * Remove todos os toasts
   */
  public clear(): void {
    this.toasts.set([]);
  }
}
