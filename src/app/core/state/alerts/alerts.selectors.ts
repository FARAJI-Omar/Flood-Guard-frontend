import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlertsState } from './alerts.reducer';

export const selectAlertsState = createFeatureSelector<AlertsState>('alerts');

export const selectThreshold = createSelector(
  selectAlertsState,
  (state) => state.threshold
);

export const selectAlerts = createSelector(
  selectAlertsState,
  (state) => state.alerts
);

export const selectTotalAlerts = createSelector(
  selectAlertsState,
  (state) => state.totalAlerts
);

export const selectCurrentPage = createSelector(
  selectAlertsState,
  (state) => state.currentPage
);

export const selectPageSize = createSelector(
  selectAlertsState,
  (state) => state.pageSize
);

export const selectLoading = createSelector(
  selectAlertsState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectAlertsState,
  (state) => state.error
);

export const selectActiveAlerts = createSelector(
  selectAlerts,
  (alerts) => alerts ? alerts.filter(alert => alert.status === 'active') : []
);
