import { ApplicationConfig, provideZoneChangeDetection, provideAppInitializer, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';

// Factory para carregar arquivos de tradução
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * Aplica o tema salvo ao DOM antes do primeiro render do Angular.
 * Evita FOUC (Flash of Unstyled Content) sem necessidade de script inline.
 */
function initializeTheme(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  const stored = localStorage.getItem('pomode-theme');
  const theme: 'light' | 'dark' | null =
    stored === 'light' || stored === 'dark' ? stored : null;

  let effective: 'light' | 'dark';

  if (theme) {
    effective = theme;
  } else {
    // 'auto' ou sem preferência: segue o sistema operacional
    effective = window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  const root = document.documentElement;
  const body = document.body;

  root.setAttribute('data-theme', effective);
  body.classList.add(effective === 'dark' ? 'dark-mode' : 'light-mode');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAppInitializer(initializeTheme),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
};
