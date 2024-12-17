import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, TransferState } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideIndexedDb } from 'ngx-indexed-db';
import Aura from '@primeng/themes/aura';
import { dbConfig } from './db.config';
import { HttpClient, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { translateBrowserLoaderFactory } from './core/loaders/translate-browser.loader';
import { LocalizeParser, LocalizeRouterModule, LocalizeRouterSettings } from '@gilsdav/ngx-translate-router';
import { localizeBrowserLoaderFactory } from './core/loaders/localize-browser.loader';
import { tokenInterceptor } from './core/interceptor/token/token.interceptor';
import { Location } from '@angular/common';
import { PreloaderService } from './core/services/preloader/preloader.service';
import { EncryptionService } from './core/services/encryption/encryption.service';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    PreloaderService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [PreloaderService],
      multi: true
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'
    })),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      },
      ripple: true
    }),
    provideIndexedDb(dbConfig),
    provideHttpClient(
      withFetch(), 
      withInterceptorsFromDi(), 
      withInterceptors([tokenInterceptor])
    ),
    provideAnimations(),
    importProvidersFrom(TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateBrowserLoaderFactory,
        deps: [HttpClient, TransferState]
      }
    })),
    importProvidersFrom(LocalizeRouterModule.forRoot(routes, {
      parser: {
        provide: LocalizeParser,
        useFactory: localizeBrowserLoaderFactory,
        deps: [TranslateService, Location, LocalizeRouterSettings, HttpClient, TransferState],
      },
      initialNavigation: true,
      defaultLangFunction: (languages: string[], cachedLang?: string, browserLang?: string): any => {
        let lang = cachedLang || languages[0] || browserLang;
        return lang;
      }
    })),
    EncryptionService,
    MessageService
  ]
};

export function initializeApp(preloader: PreloaderService): () => Promise<void> {
  return (): Promise<any> => preloader.initializeAdminAccount();
}