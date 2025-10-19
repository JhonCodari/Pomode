import { Injectable } from '@angular/core';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TouchDetectionService {
  private _isTouchDevice = signal(false);
  private _hasTouch = signal(false);
  private _hasMouse = signal(true);

  readonly isTouchDevice = this._isTouchDevice.asReadonly();
  readonly hasTouch = this._hasTouch.asReadonly();
  readonly hasMouse = this._hasMouse.asReadonly();

  constructor() {
    if (typeof window !== 'undefined') {
      this.detectTouchCapabilities();
      this.setupEventListeners();
    }
  }

  private detectTouchCapabilities(): void {
    // Detecta capacidade de toque
    const hasTouch = 'ontouchstart' in window ||
                    navigator.maxTouchPoints > 0 ||
                    (navigator as any).msMaxTouchPoints > 0;

    this._hasTouch.set(hasTouch);

    // Detecta se é principalmente um dispositivo de toque
    const isTouchDevice = hasTouch &&
                         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    this._isTouchDevice.set(isTouchDevice);

    // Assume que tem mouse se não for principalmente touch
    this._hasMouse.set(!isTouchDevice);
  }

  private setupEventListeners(): void {
    // Detecta primeiro uso do mouse
    const handleFirstMouseMove = () => {
      this._hasMouse.set(true);
      document.removeEventListener('mousemove', handleFirstMouseMove);
    };

    // Detecta primeiro toque
    const handleFirstTouch = () => {
      this._isTouchDevice.set(true);
      this._hasTouch.set(true);
      document.removeEventListener('touchstart', handleFirstTouch);
    };

    document.addEventListener('mousemove', handleFirstMouseMove, { once: true });
    document.addEventListener('touchstart', handleFirstTouch, { once: true });
  }
}
