import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SimulationState } from './simulations.reducer';

export const selectSimulationState = createFeatureSelector<SimulationState>('simulations');

export const selectAllSimulations = createSelector(
  selectSimulationState,
  (state: SimulationState) => state.simulations
);

export const selectMySimulations = createSelector(
  selectSimulationState,
  (state: SimulationState) => state.mySimulations
);

export const selectMySimulationsCount = createSelector(
  selectMySimulations,
  (simulations) => simulations.length
);

export const selectSelectedSimulation = createSelector(
  selectSimulationState,
  (state: SimulationState) => state.selected
);

export const selectSimulationLoading = createSelector(
  selectSimulationState,
  (state: SimulationState) => state.loading
);

export const selectSimulationError = createSelector(
  selectSimulationState,
  (state: SimulationState) => state.error
);
