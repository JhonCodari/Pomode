import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SobrePomodoroPage } from './pages/sobre-pomodoro/sobre-pomodoro.page';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Pomode - Timer Pomodoro'
  },
  {
    path: 'sobre-pomodoro',
    component: SobrePomodoroPage,
    title: 'O que é Pomodoro? - Pomode'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
