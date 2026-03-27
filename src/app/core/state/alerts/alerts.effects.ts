import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, interval, timer } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom, mergeMap, tap } from 'rxjs/operators';
import { AlertService } from '../../services/alert.service';
import { WeatherService } from '../../services/weather.service';
import * as AlertsActions from './alerts.actions';
import * as AlertsSelectors from './alerts.selectors';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AlertsEffects {
  private actions$ = inject(Actions);
  private alertService = inject(AlertService);
  private weatherService = inject(WeatherService);
  private store = inject(Store);
  private toastr = inject(ToastrService);
  

  loadThreshold$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsActions.loadThreshold),
      switchMap(() =>
        this.alertService.getThreshold().pipe(
          map(threshold => AlertsActions.loadThresholdSuccess({ threshold })),
          catchError(error => of(AlertsActions.loadThresholdFailure({ error: error.message })))
        )
      )
    )
  );

  updateThreshold$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsActions.updateThreshold),
      switchMap(({ threshold }) =>
        this.alertService.updateThreshold(threshold).pipe(
          map(threshold => AlertsActions.updateThresholdSuccess({ threshold })),
          catchError(error => of(AlertsActions.updateThresholdFailure({ error: error.message })))
        )
      )
    )
  );

  loadAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsActions.loadAlerts),
      switchMap(({ page, pageSize }) =>
        this.alertService.getAlerts(page, pageSize).pipe(
          map(response => AlertsActions.loadAlertsSuccess({ 
            response: {
              alerts: response.content,
              total: response.totalElements,
              page: response.number,
              pageSize: response.size
            }
          })),
          catchError(error => of(AlertsActions.loadAlertsFailure({ error: error.message })))
        )
      )
    )
  );

  checkWeather$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsActions.checkWeather),
      withLatestFrom(this.store.select(AlertsSelectors.selectThreshold)),
      switchMap(([_, threshold]) => {
        if (!threshold) {
          return of(AlertsActions.checkWeatherFailure({ error: 'Threshold not set' }));
        }

        return this.weatherService.getCurrentWeather().pipe(
          mergeMap(cityWeatherData => {
            const alertsToSave = cityWeatherData
              .filter(data => data.weather.current.precipitation >= threshold)
              .map(data => ({
                cityName: data.city.name,
                precipitation: data.weather.current.precipitation,
                threshold: threshold,
                timestamp: new Date()
              }));

            if (alertsToSave.length === 0) {
              return of(AlertsActions.checkWeatherSuccess());
            }

            return alertsToSave.map(alert => AlertsActions.saveAlert({ alert }));
          }),
          catchError(error => of(AlertsActions.checkWeatherFailure({ error: error.message })))
        );
      })
    )
  );

  saveAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsActions.saveAlert),
      mergeMap(({ alert }) =>
        this.alertService.saveAlert(alert).pipe(
          map(savedAlert => AlertsActions.saveAlertSuccess({ alert: savedAlert })),
          catchError(error => of(AlertsActions.saveAlertFailure({ error: error.message })))
        )
      )
    )
  );

  // Hourly weather check
  hourlyWeatherCheck$ = createEffect(() =>
    timer(0, 3600000).pipe(
      map(() => AlertsActions.checkWeather())
    )
  );

  showSuccessOptions$ = createEffect(() =>
      this.actions$.pipe(
        ofType(
          AlertsActions.updateThreshold),
        tap((action) => {
          if (action.type === AlertsActions.updateThreshold.type) {       
            this.toastr.success('Threshold updated successfully!', 'Success');    
          }
        })
      ),
      { dispatch: false }
  );
}
