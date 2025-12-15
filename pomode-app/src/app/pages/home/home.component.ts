import { Component, inject, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ContainerComponent } from '../../components/container/container.component';
import { CardComponent } from '../../components/card/card.component';
import { TimerComponent } from '../../components/timer/timer.component';
import { TimerControlsComponent } from '../../components/timer-controls/timer-controls.component';
import { PomodoroService } from '../../services/pomodoro.service';
import { AudioService } from '../../services/audio.service';
import { TimerMode } from '../../models';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ContainerComponent,
    CardComponent,
    TimerComponent,
    TimerControlsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  private pomodoroService = inject(PomodoroService);
  private audioService = inject(AudioService);
  private timerCompleteSubscription?: Subscription;

  // Computed signals encapsulados para o template
  readonly completedCycles = computed(() => this.pomodoroService.completedCycles());
  readonly sessions = computed(() => this.pomodoroService.sessions());

  // Stats computadas como signals
  readonly todaySessions = computed(() => {
    const today = new Date().toDateString();
    return this.sessions().filter(s =>
      new Date(s.completedAt).toDateString() === today
    ).length;
  });

  readonly totalHours = computed(() => {
    const totalMinutes = this.sessions().reduce((acc, s) => acc + (s.duration / 60), 0);
    return Math.floor(totalMinutes / 60);
  });

  readonly currentStreak = computed(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return this.sessions().filter(s =>
      new Date(s.completedAt) >= weekAgo
    ).length;
  });

  ngOnInit(): void {
    // Inscreve para ouvir quando o timer completa
    this.timerCompleteSubscription = this.pomodoroService.timerComplete$.subscribe(
      (mode) => {
        this.onTimerComplete(mode);
      }
    );
  }

  ngOnDestroy(): void {
    // Limpa subscription para evitar memory leaks
    if (this.timerCompleteSubscription) {
      this.timerCompleteSubscription.unsubscribe();
      this.timerCompleteSubscription = undefined;
    }
  }

  private onTimerComplete(mode: TimerMode): void {
    // Toca som de alerta (AudioService já verifica se som está habilitado)
    if (mode === 'work') {
      this.audioService.playSuccess(); // Som de sucesso quando completa trabalho
    } else {
      this.audioService.playAlert(); // Som simples para pausas
    }

    // Notificação desktop (se habilitado nas configurações)
    if (this.pomodoroService.settings().notificationsEnabled) {
      this.showNotification(mode);
    }
  }

  private showNotification(mode: TimerMode): void {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      this.createNotification(mode);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.createNotification(mode);
        }
      });
    }
  }

  private createNotification(mode: TimerMode): void {
    const messages: Record<TimerMode, { title: string; body: string }> = {
      work: {
        title: '🍅 Parabéns! Ciclo completo!',
        body: 'Hora de fazer uma pausa. Você merece!'
      },
      shortBreak: {
        title: '☕ Pausa terminada!',
        body: 'Vamos voltar ao trabalho?'
      },
      longBreak: {
        title: '🌴 Pausa longa terminada!',
        body: 'Pronto para um novo ciclo de produtividade!'
      }
    };

    const message = messages[mode];

    new Notification(message.title, {
      body: message.body,
      icon: '/favicon.ico',
      tag: 'pomodoro-timer'
    });
  }
}
