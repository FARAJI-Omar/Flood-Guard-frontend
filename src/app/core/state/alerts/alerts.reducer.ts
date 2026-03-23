import { createReducer, on } from '@ngrx/store';
import { Alert } from '../../models/alert.model';
import * as AlertsActions from './alerts.actions';

export interface AlertsState {
  threshold: number | null;
  alerts: Alert[];
  totalAlerts: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
}

export const initialState: AlertsState = {
  threshold: null,
  alerts: [],
  totalAlerts: 0,
  currentPage: 0,
  pageSize: 10,
  loading: false,
  error: null
};

export const alertsReducer = createReducer(
  initialState,
  
  // Threshold
  on(AlertsActions.loadThreshold, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlertsActions.loadThresholdSuccess, (state, { threshold }) => ({
    ...state,
    threshold,
    loading: false
  })),
  on(AlertsActions.loadThresholdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(AlertsActions.updateThreshold, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(AlertsActions.updateThresholdSuccess, (state, { threshold }) => ({
    ...state,
    threshold,
    loading: false
  })),
  on(AlertsActions.updateThresholdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Alerts
  on(AlertsActions.loadAlerts, (state, { page, pageSize }) => ({
    ...state,
    currentPage: page,
    pageSize,
    loading: true,
    error: null
  })),
  on(AlertsActions.loadAlertsSuccess, (state, { response }) => ({
    ...state,
    alerts: response.alerts,
    totalAlerts: response.total,
    loading: false
  })),
  on(AlertsActions.loadAlertsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Weather Check
  on(AlertsActions.checkWeather, (state) => ({
    ...state,
    loading: true
  })),
  on(AlertsActions.checkWeatherSuccess, (state) => ({
    ...state,
    loading: false
  })),
  on(AlertsActions.checkWeatherFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Save Alert
  on(AlertsActions.saveAlertSuccess, (state, { alert }) => ({
    ...state,
    alerts: [alert, ...state.alerts],
    totalAlerts: state.totalAlerts + 1
  }))
);
