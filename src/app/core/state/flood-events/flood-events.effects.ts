import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import { FloodEventService } from '../../services/flood-event.service';
import * as FloodEventsActions from './flood-events.actions';
import { Store } from '@ngrx/store';
import { selectFilters } from './flood-events.selectors';

@Injectable()
export class FloodEventsEffects {
  private actions$ = inject(Actions);
  private floodEventService = inject(FloodEventService);
  private store = inject(Store);

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FloodEventsActions.loadEvents),
      mergeMap(({ year, severity }) => 
        this.floodEventService.getFloodEvents(year, severity).pipe(
          map(featureCollection => FloodEventsActions.loadEventsSuccess({ featureCollection })),
          catchError(error => of(FloodEventsActions.loadEventsFailure({ error })))
        )
      )
    )
  );

  updateFilters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FloodEventsActions.updateFilters),
      map(({ year, severity }) => FloodEventsActions.loadEvents({ year, severity }))
    )
  );

  deleteEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FloodEventsActions.deleteEvent),
      mergeMap(({ eventId }) =>
        this.floodEventService.deleteFloodEvent(eventId).pipe(
          map(() => FloodEventsActions.deleteEventSuccess({ eventId })),
          catchError(error => of(FloodEventsActions.deleteEventFailure({ error })))
        )
      )
    )
  );

  createEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FloodEventsActions.createEvent),
      mergeMap(({ event }) =>
        this.floodEventService.createFloodEvent(event).pipe(
          map(createdEvent => FloodEventsActions.createEventSuccess({ event: createdEvent })),
          catchError(error => of(FloodEventsActions.createEventFailure({ error })))
        )
      )
    )
  );

  updateEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FloodEventsActions.updateEvent),
      mergeMap(({ id, event }) =>
        this.floodEventService.updateFloodEvent(id, event).pipe(
          map(updatedEvent => FloodEventsActions.updateEventSuccess({ event: updatedEvent })),
          catchError(error => of(FloodEventsActions.updateEventFailure({ error })))
        )
      )
    )
  );
}
