import { createAction, props } from '@ngrx/store';
import { Alert, AlertsResponse, ThresholdResponse } from '../../models/alert.model';

// Threshold Actions
export const loadThreshold = createAction('[Alerts] Load Threshold');
export const loadThresholdSuccess = createAction(
  '[Alerts] Load Threshold Success',
  props<{ threshold: number }>()
);
export const loadThresholdFailure = createAction(
  '[Alerts] Load Threshold Failure',
  props<{ error: string }>()
);

export const updateThreshold = createAction(
  '[Alerts] Update Threshold',
  props<{ threshold: number }>()
);
export const updateThresholdSuccess = createAction(
  '[Alerts] Update Threshold Success',
  props<{ threshold: number }>()
);
export const updateThresholdFailure = createAction(
  '[Alerts] Update Threshold Failure',
  props<{ error: string }>()
);

// Alerts Actions
export const loadAlerts = createAction(
  '[Alerts] Load Alerts',
  props<{ page: number; pageSize: number }>()
);
export const loadAlertsSuccess = createAction(
  '[Alerts] Load Alerts Success',
  props<{ response: { alerts: Alert[], total: number, page: number, pageSize: number } }>()
);
export const loadAlertsFailure = createAction(
  '[Alerts] Load Alerts Failure',
  props<{ error: string }>()
);

// Weather Check Actions
export const checkWeather = createAction('[Alerts] Check Weather');
export const checkWeatherSuccess = createAction('[Alerts] Check Weather Success');
export const checkWeatherFailure = createAction(
  '[Alerts] Check Weather Failure',
  props<{ error: string }>()
);

export const saveAlert = createAction(
  '[Alerts] Save Alert',
  props<{ alert: Partial<Alert> }>()
);
export const saveAlertSuccess = createAction(
  '[Alerts] Save Alert Success',
  props<{ alert: Alert }>()
);
export const saveAlertFailure = createAction(
  '[Alerts] Save Alert Failure',
  props<{ error: string }>()
);
