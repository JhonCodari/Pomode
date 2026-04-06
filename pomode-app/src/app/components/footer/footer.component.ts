import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContainerComponent } from '../container/container.component';
import { IconComponent } from '../icon/icon.component';
import { VisitorService } from '../../services/visitor.service';

@Component({
  selector: 'app-footer',
  imports: [TranslateModule, ContainerComponent, IconComponent, DecimalPipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private readonly visitorService = inject(VisitorService);

  readonly visitCount = this.visitorService.visitCount;
  readonly isLoading  = this.visitorService.isLoading;
  readonly hasError   = this.visitorService.hasError;

  // URL hardcoded — nunca vem de binding dinâmico para evitar injeção
  readonly badgeSrc = 'https://hits.sh/www.pomode.com.br.svg';
}
