import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {HttpClientModule, provideHttpClient, withInterceptors} from '@angular/common/http';
import {hydraInterceptor} from './interceptor/hydra.interceptor';
import {jwtInterceptor} from './interceptor/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      HttpClientModule,
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withInterceptors([hydraInterceptor, jwtInterceptor])),
  ]
};
