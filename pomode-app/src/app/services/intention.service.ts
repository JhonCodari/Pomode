import { Injectable, signal } from '@angular/core';

interface DailyLog {
  date: string;
  accomplished: string[];
}

@Injectable({
  providedIn: 'root'
})
export class IntentionService {
  readonly #STORAGE_KEY = 'pomode_daily_focus';

  #intention = signal<string>('');
  #accomplished = signal<string[]>([]);

  readonly intention = this.#intention.asReadonly();
  readonly accomplished = this.#accomplished.asReadonly();

  constructor() {
    this.#loadFromStorage();
  }

  set(value: string): void {
    this.#intention.set(value.trim());
  }

  clear(): void {
    this.#intention.set('');
  }

  addAccomplished(intention: string): void {
    const updated = [...this.#accomplished(), intention];
    this.#accomplished.set(updated);
    this.#persist(updated);
  }

  #loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.#STORAGE_KEY);
      if (!raw) return;
      const log: DailyLog = JSON.parse(raw);
      if (log.date === this.#today()) {
        this.#accomplished.set(log.accomplished);
      }
    } catch {
      // dado corrompido — ignora
    }
  }

  #persist(accomplished: string[]): void {
    const log: DailyLog = { date: this.#today(), accomplished };
    localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(log));
  }

  #today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
