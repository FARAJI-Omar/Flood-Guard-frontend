import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode, provideAppInitializer } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { inject } from '@angular/core';

import { routes } from './app.routes';
import { floodEventsReducer } from './core/state/flood-events/flood-events.reducer';
import { simulationReducer } from './core/state/simulations/simulations.reducer';
import { alertsReducer } from './core/state/alerts/alerts.reducer';
import { FloodEventsEffects } from './core/state/flood-events/flood-events.effects';
import { SimulationEffects } from './core/state/simulations/simulations.effects';
import { AlertsEffects } from './core/state/alerts/alerts.effects';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthSessionService } from './core/services/auth-session.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideStore({ 
      floodEvents: floodEventsReducer,
      simulations: simulationReducer,
      alerts: alertsReducer
    }),
    provideEffects([FloodEventsEffects, SimulationEffects, AlertsEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideAppInitializer(() => {
      const authSession = inject(AuthSessionService);
      authSession.initializeSession();
    })
  ]
};
