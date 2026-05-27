import { TestBed } from '@angular/core/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let gtagSpy: jasmine.Spy;

  beforeEach(() => {
    gtagSpy = jasmine.createSpy('gtag');
    (globalThis as any).gtag = gtagSpy;

    TestBed.configureTestingModule({
      providers: [AnalyticsService]
    });

    service = TestBed.inject(AnalyticsService);
  });

  afterEach(() => {
    delete (globalThis as any).gtag;
  });

  it('deve rastrear interval_completed para qualquer intervalo', () => {
    service.trackIntervalCompleted('shortBreak', 5);

    expect(gtagSpy).toHaveBeenCalledWith('event', 'interval_completed', {
      interval_type: 'shortBreak',
      interval_duration_minutes: 5,
      debug_mode: true,
    });
  });

  it('deve rastrear pomodoro_completed apenas para foco concluído', () => {
    service.trackPomodoroCompleted(2, 25, 2);

    expect(gtagSpy).toHaveBeenCalledWith('event', 'pomodoro_completed', {
      pomodoros_completed_total: 2,
      focus_duration_minutes: 25,
      total_work_sessions_ever: 2,
      debug_mode: true,
    });
  });

  it('deve rastrear page_view com debug_mode no ambiente local', () => {
    service.trackPageView('/home');

    expect(gtagSpy).toHaveBeenCalledWith('config', 'G-YJ23L6T83X', {
      page_path: '/home',
      debug_mode: true,
    });
  });
});
