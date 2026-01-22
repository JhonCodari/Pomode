import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ContainerComponent } from '../../components/container/container.component';
import { ButtonComponent } from '../../components/button/button.component';
import { SectionComponent } from '../../components/section/section.component';
import { ListComponent } from '../../components/list/list.component';

@Component({
  selector: 'app-sobre-pomodoro',
  standalone: true,
  imports: [CommonModule, ContainerComponent, RouterLink, ButtonComponent, TranslateModule, SectionComponent, ListComponent],
  templateUrl: './sobre-pomodoro.page.html',
  styleUrl: './sobre-pomodoro.page.scss'
})
export class SobrePomodoroPage {}
