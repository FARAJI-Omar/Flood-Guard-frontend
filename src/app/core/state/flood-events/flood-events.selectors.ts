import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FloodEventsState } from './flood-events.reducer';

export const selectFloodEventsState = createFeatureSelector<FloodEventsState>('floodEvents');

export const selectAllFeatures = createSelector(
  selectFloodEventsState,
  (state) => state.features
);

export const selectSelectedEventId = createSelector(
  selectFloodEventsState,
  (state) => state.selectedEventId
);

export const selectSelectedFeature = createSelector(
  selectAllFeatures,
  selectSelectedEventId,
  (features, selectedId) => features.find(f => f.properties.id === selectedId) || null
);

export const selectFilters = createSelector(
  selectFloodEventsState,
  (state) => state.filters
);

export const selectLoading = createSelector(
  selectFloodEventsState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectFloodEventsState,
  (state) => state.error
);

export const selectFeatureCollection = createSelector(
  selectAllFeatures,
  (features) => ({
    type: 'FeatureCollection' as const,
    features
  })
);

export const selectFloodEventsThisYear = createSelector(
  selectAllFeatures,
  (features) => {
    const currentYear = new Date().getFullYear();
    return features.filter(f => new Date(f.properties.eventDate).getFullYear() === currentYear).length;
  }
);

export const selectHistoricalRiskOutcomes = createSelector(
  selectAllFeatures,
  (features) => {
    const total = features.length;
    const bySeverity = features.reduce((acc, f) => {
      acc[f.properties.severity] = (acc[f.properties.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      low: { count: bySeverity['low'] || 0, percent: total ? ((bySeverity['low'] || 0) / total * 100) : 0 },
      moderate: { count: bySeverity['moderate'] || 0, percent: total ? ((bySeverity['moderate'] || 0) / total * 100) : 0 },
      high: { count: bySeverity['high'] || 0, percent: total ? ((bySeverity['high'] || 0) / total * 100) : 0 },
      critical: { count: bySeverity['critical'] || 0, percent: total ? ((bySeverity['critical'] || 0) / total * 100) : 0 },
      total
    };
  }
);
