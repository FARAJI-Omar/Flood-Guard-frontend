import { createAction, props } from '@ngrx/store';
import { SimulationRequest, SimulationResponse } from '../../models/simulation.model';

export const loadHistory = createAction(
  '[Simulation] Load History',
  props<{ userId?: number }>()
);

export const loadHistorySuccess = createAction(
  '[Simulation] Load History Success',
  props<{ simulations: SimulationResponse[] }>()
);

export const loadHistoryFailure = createAction(
  '[Simulation] Load History Failure',
  props<{ error: string }>()
);

export const loadMine = createAction(
  '[Simulation] Load Mine'
);

export const loadMineSuccess = createAction(
  '[Simulation] Load Mine Success',
  props<{ simulations: SimulationResponse[] }>()
);

export const loadMineFailure = createAction(
  '[Simulation] Load Mine Failure',
  props<{ error: string }>()
);

export const loadById = createAction(
  '[Simulation] Load By Id',
  props<{ id: number }>()
);

export const loadByIdSuccess = createAction(
  '[Simulation] Load By Id Success',
  props<{ simulation: SimulationResponse }>()
);

export const loadByIdFailure = createAction(
  '[Simulation] Load By Id Failure',
  props<{ error: string }>()
);

export const createSimulation = createAction(
  '[Simulation] Create Simulation',
  props<{ request: SimulationRequest }>()
);

export const createSimulationSuccess = createAction(
  '[Simulation] Create Simulation Success',
  props<{ simulation: SimulationResponse }>()
);

export const createSimulationFailure = createAction(
  '[Simulation] Create Simulation Failure',
  props<{ error: string }>()
);

export const selectSimulation = createAction(
  '[Simulation] Select Simulation',
  props<{ simulation: SimulationResponse }>()
);

export const clearSelected = createAction(
  '[Simulation] Clear Selected Simulation'
);
