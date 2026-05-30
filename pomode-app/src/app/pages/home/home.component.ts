import { Component, inject, OnInit, OnDestroy, computed, effect, untracked, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContainerComponent } from '../../components/container/container.component';
import { TimerComponent } from '../../components/timer/timer.component';
import { TimerControlsComponent } from '../../components/timer-controls/timer-controls.component';
import { StatsSidebarComponent, StatItem } from '../../components/stats-sidebar/stats-sidebar.component';
import { IntentionInputComponent } from '../../components/intention-input/intention-input.component';
import { IntentionLogComponent } from '../../components/intention-log/intention-log.component';
import { PomodoroService } from '../../services/pomodoro.service';
import { AudioService } from '../../services/audio.service';
import { MusicPlayerService } from '../../services/music-player.service';
import { AnalyticsService, ToastService } from '../../services';
import { IntentionService } from '../../services/intention.service';
import { TimerMode } from '../../models';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    TranslateModule,
    ContainerComponent,
    TimerComponent,
    TimerControlsComponent,
    StatsSidebarComponent,
    IntentionInputComponent,
    IntentionLogComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  private pomodoroService = inject(PomodoroService);
  private audioService = inject(AudioService);
  private musicPlayerService = inject(MusicPlayerService);
  private analyticsService = inject(AnalyticsService);
  private toastService = inject(ToastService);
  private intentionService = inject(IntentionService);
  private translate = inject(TranslateService);
  private timerCompleteSubscription?: Subscription;
  private pendingPomodoroCompletion = false;

  constructor() {
    // Integração automática do music player com o timer.
    // untracked() evita que isPlaying() e autoPlayOnFocus() (lidos dentro de
    // onTimerChange) se tornem dependências deste effect, prevenindo re-execuções
    // indesejadas que podem acionar pause() logo após um play() em produção.
    effect(() => {
      const state = this.pomodoroService.state();
      const mode  = this.pomodoroService.mode();
      untracked(() => this.musicPlayerService.onTimerChange(state, mode));
    });
  }

  // Computed signals encapsulados para o template
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

  // Stats array para sidebar
  readonly stats = computed<StatItem[]>(() => [
    { value: this.todaySessions(), labelKey: 'STATS.TODAY_INTERVALS' },
    { value: this.totalHours(), labelKey: 'STATS.TOTAL_HOURS' },
    { value: this.currentStreak(), labelKey: 'STATS.WEEKLY_INTERVALS' }
  ]);

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

    // Analytics: duração base por modo
    const durationMap: Record<TimerMode, number> = {
      work: this.pomodoroService.settings().workTime,
      shortBreak: this.pomodoroService.settings().shortBreakTime,
      longBreak: this.pomodoroService.settings().longBreakTime,
    };

    // Analytics: intervalo concluído (apenas pausas)
    if (mode !== 'work') {
      this.analyticsService.trackIntervalCompleted(
        mode,
        durationMap[mode]
      );
    }

    const totalWorkSessionsEver = this.pomodoroService.sessions()
      .filter(s => s.mode === 'work').length;

    // Marca que um foco terminou e aguarda conclusão da pausa para fechar 1 pomodoro completo.
    if (mode === 'work') {
      this.pendingPomodoroCompletion = true;

      const intention = this.intentionService.intention();
      if (intention) {
        this.intentionService.addAccomplished(intention);
        const message = this.translate.instant('INTENTION.TOAST_COMPLETED', { intention });
        this.toastService.success(message, 4000);
        this.intentionService.clear();
      }

      return;
    }

    // Analytics: pomodoro concluído (foco + pausa finalizada)
    if (this.pendingPomodoroCompletion) {
      const pomodoros = this.pomodoroService.completedCycles();

      this.analyticsService.trackPomodoroCompleted(
        pomodoros,
        durationMap.work,
        totalWorkSessionsEver
      );

      // Analytics: ciclo Pomodoro completo (N pomodoros concluídos)
      const cyclesBeforeLong = this.pomodoroService.settings().cyclesBeforeLongBreak;
      if (pomodoros > 0 && pomodoros % cyclesBeforeLong === 0) {
        this.analyticsService.trackPomodoroBlockCompleted(
          Math.floor(pomodoros / cyclesBeforeLong),
          totalWorkSessionsEver
        );
      }

      this.pendingPomodoroCompletion = false;
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
    const messages: Record<TimerMode, { titleKey: string; bodyKey: string }> = {
      work: {
        titleKey: 'NOTIFICATIONS.WORK_COMPLETE.TITLE',
        bodyKey: 'NOTIFICATIONS.WORK_COMPLETE.BODY'
      },
      shortBreak: {
        titleKey: 'NOTIFICATIONS.SHORT_BREAK_COMPLETE.TITLE',
        bodyKey: 'NOTIFICATIONS.SHORT_BREAK_COMPLETE.BODY'
      },
      longBreak: {
        titleKey: 'NOTIFICATIONS.LONG_BREAK_COMPLETE.TITLE',
        bodyKey: 'NOTIFICATIONS.LONG_BREAK_COMPLETE.BODY'
      }
    };

    const message = messages[mode];

    new Notification(this.translate.instant(message.titleKey), {
      body: this.translate.instant(message.bodyKey),
      icon: '/favicon.ico',
      tag: 'pomodoro-timer'
    });
  }
}
