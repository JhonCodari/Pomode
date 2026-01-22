import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContainerComponent } from '../../components/container/container.component';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-sobre-pomodoro',
  standalone: true,
  imports: [CommonModule, ContainerComponent, RouterLink, ButtonComponent],
  templateUrl: './sobre-pomodoro.page.html',
  styleUrl: './sobre-pomodoro.page.scss'
})
export class SobrePomodoroPage {}
