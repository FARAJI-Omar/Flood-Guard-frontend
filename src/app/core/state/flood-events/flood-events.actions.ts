import { createAction, props } from '@ngrx/store';
import { FloodEventCollection, FloodEventFeature } from '../../models/flood-event.model';

export const loadEvents = createAction(
  '[Flood Events] Load Events',
  props<{ year?: string; severity?: string }>()
);

export const loadEventsSuccess = createAction(
  '[Flood Events] Load Events Success',
  props<{ featureCollection: FloodEventCollection }>()
);

export const loadEventsFailure = createAction(
  '[Flood Events] Load Events Failure',
  props<{ error: any }>()
);

export const selectEvent = createAction(
  '[Flood Events] Select Event',
  props<{ eventId: number | null }>()
);

export const updateFilters = createAction(
  '[Flood Events] Update Filters',
  props<{ year: string; severity: string }>()
);

export const deleteEvent = createAction(
  '[Flood Events] Delete Event',
  props<{ eventId: number }>()
);

export const deleteEventSuccess = createAction(
  '[Flood Events] Delete Event Success',
  props<{ eventId: number }>()
);

export const deleteEventFailure = createAction(
  '[Flood Events] Delete Event Failure',
  props<{ error: any }>()
);

export const createEvent = createAction(
  '[Flood Events] Create Event',
  props<{ event: any }>()
);

export const createEventSuccess = createAction(
  '[Flood Events] Create Event Success',
  props<{ event: FloodEventFeature }>()
);

export const createEventFailure = createAction(
  '[Flood Events] Create Event Failure',
  props<{ error: any }>()
);

export const updateEvent = createAction(
  '[Flood Events] Update Event',
  props<{ id: number; event: any }>()
);

export const updateEventSuccess = createAction(
  '[Flood Events] Update Event Success',
  props<{ event: FloodEventFeature }>()
);

export const updateEventFailure = createAction(
  '[Flood Events] Update Event Failure',
  props<{ error: any }>()
);
