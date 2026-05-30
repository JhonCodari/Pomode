import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Pomode - Timer Pomodoro'
  },
  {
    path: 'sobre-pomodoro',
    loadComponent: () => import('./pages/sobre-pomodoro/sobre-pomodoro.page').then(m => m.SobrePomodoroPage),
    title: 'O que é Pomodoro? - Pomode'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
