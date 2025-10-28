import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ContainerComponent } from '../../components/container/container.component';
import { CardComponent } from '../../components/card/card.component';
import { TimerComponent } from '../../components/timer/timer.component';
import { TimerControlsComponent } from '../../components/timer-controls/timer-controls.component';
import { PomodoroService } from '../../services/pomodoro.service';
import { AudioService } from '../../services/audio.service';

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
  pomodoroService = inject(PomodoroService);
  private audioService = inject(AudioService);
  private timerCompleteSubscription?: Subscription;

  sessions = this.pomodoroService.sessions;

  ngOnInit(): void {
    // Inscreve para ouvir quando o timer completa
    this.timerCompleteSubscription = this.pomodoroService.timerComplete$.subscribe(
      (mode) => {
        this.onTimerComplete(mode);
      }
    );
  }

  ngOnDestroy(): void {
    this.timerCompleteSubscription?.unsubscribe();
  }

  private onTimerComplete(mode: string): void {
    // Toca som de alerta
    if (mode === 'work') {
      this.audioService.playSuccess(); // Som de sucesso quando completa trabalho
    } else {
      this.audioService.playAlert(); // Som simples para pausas
    }

    // Notificação desktop (se disponível)
    this.showNotification(mode);
  }

  private showNotification(mode: string): void {
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

  private createNotification(mode: string): void {
    const messages = {
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

    const message = messages[mode as keyof typeof messages];

    new Notification(message.title, {
      body: message.body,
      icon: '/favicon.ico',
      tag: 'pomodoro-timer'
    });
  }

  // Stats computadas
  get todaySessions(): number {
    const today = new Date().toDateString();
    return this.sessions().filter(s =>
      new Date(s.completedAt).toDateString() === today
    ).length;
  }

  get totalHours(): number {
    const totalMinutes = this.sessions().reduce((acc, s) => acc + (s.duration / 60), 0);
    return Math.floor(totalMinutes / 60);
  }

  get currentStreak(): number {
    // Simplificado: retorna número de sessões dos últimos 7 dias
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return this.sessions().filter(s =>
      new Date(s.completedAt) >= weekAgo
    ).length;
  }
}
