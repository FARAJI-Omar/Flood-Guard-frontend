import { createReducer, on } from '@ngrx/store';
import { SimulationResponse } from '../../models/simulation.model';
import * as SimulationActions from './simulations.actions';

export interface SimulationState {
  simulations: SimulationResponse[];
  mySimulations: SimulationResponse[];
  selected: SimulationResponse | null;
  loading: boolean;
  error: string | null;
}

export const initialState: SimulationState = {
  simulations: [],
  mySimulations: [],
  selected: null,
  loading: false,
  error: null
};

export const simulationReducer = createReducer(
  initialState,
  
  // Load History
  on(SimulationActions.loadHistory, (state) => ({ ...state, loading: true, error: null })),
  on(SimulationActions.loadHistorySuccess, (state, { simulations }) => ({ 
    ...state, 
    loading: false, 
    simulations 
  })),
  on(SimulationActions.loadHistoryFailure, (state, { error }) => ({ ...state, loading: false, error })),
  
  // Load Mine
  on(SimulationActions.loadMine, (state) => ({ ...state, loading: true, error: null })),
  on(SimulationActions.loadMineSuccess, (state, { simulations }) => ({ 
    ...state, 
    loading: false, 
    mySimulations: simulations 
  })),
  on(SimulationActions.loadMineFailure, (state, { error }) => ({ ...state, loading: false, error })),
  
  // Load By ID
  on(SimulationActions.loadById, (state) => ({ ...state, loading: true, error: null })),
  on(SimulationActions.loadByIdSuccess, (state, { simulation }) => ({ 
    ...state, 
    loading: false, 
    selected: simulation 
  })),
  on(SimulationActions.loadByIdFailure, (state, { error }) => ({ ...state, loading: false, error })),
  
  // Create Simulation
  on(SimulationActions.createSimulation, (state) => ({ ...state, loading: true, error: null })),
  on(SimulationActions.createSimulationSuccess, (state, { simulation }) => ({ 
    ...state, 
    loading: false, 
    simulations: [simulation, ...state.simulations],
    mySimulations: [simulation, ...state.mySimulations]
  })),
  on(SimulationActions.createSimulationFailure, (state, { error }) => ({ ...state, loading: false, error })),
  
  // Select Simulation
  on(SimulationActions.selectSimulation, (state, { simulation }) => ({ ...state, selected: simulation })),
  on(SimulationActions.clearSelected, (state) => ({ ...state, selected: null }))
);
