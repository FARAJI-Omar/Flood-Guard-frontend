import { createReducer, on } from '@ngrx/store';
import { FloodEventFeature, FloodEventCollection } from '../../models/flood-event.model';
import * as FloodEventsActions from './flood-events.actions';

export interface FloodEventsState {
  features: FloodEventFeature[];
  selectedEventId: number | null;
  filters: { year: string; severity: string };
  loading: boolean;
  error: any;
}

export const initialState: FloodEventsState = {
  features: [],
  selectedEventId: null,
  filters: { year: 'all', severity: 'all' },
  loading: false,
  error: null
};

export const floodEventsReducer = createReducer(
  initialState,
  
  on(FloodEventsActions.loadEvents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(FloodEventsActions.loadEventsSuccess, (state, { featureCollection }) => ({
    ...state,
    features: featureCollection.features || [],
    selectedEventId: null,
    loading: false
  })),
  
  on(FloodEventsActions.loadEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(FloodEventsActions.selectEvent, (state, { eventId }) => ({
    ...state,
    selectedEventId: eventId
  })),
  
  on(FloodEventsActions.updateFilters, (state, { year, severity }) => ({
    ...state,
    filters: { year, severity }
  })),

  on(FloodEventsActions.deleteEvent, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(FloodEventsActions.deleteEventSuccess, (state, { eventId }) => ({
    ...state,
    features: state.features.filter(f => f.properties.id !== eventId),
    selectedEventId: state.selectedEventId === eventId ? null : state.selectedEventId,
    loading: false
  })),

  on(FloodEventsActions.deleteEventFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(FloodEventsActions.createEvent, (state) => ({
    ...state,
    loading: true
  })),

  on(FloodEventsActions.createEventSuccess, (state, { event }) => ({
    ...state,
    features: [...state.features, event],
    loading: false
  })),

  on(FloodEventsActions.createEventFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(FloodEventsActions.updateEvent, (state) => ({
    ...state,
    loading: true
  })),

  on(FloodEventsActions.updateEventSuccess, (state, { event }) => ({
    ...state,
    features: state.features.map(f => f.properties.id === event.properties.id ? event : f),
    loading: false
  })),

  on(FloodEventsActions.updateEventFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
