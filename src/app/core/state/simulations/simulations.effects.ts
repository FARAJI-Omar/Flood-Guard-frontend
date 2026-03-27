import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import * as SimulationActions from './simulations.actions';
import { SimulationService } from '../../services/simulation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class SimulationEffects {
  private actions$ = inject(Actions);
  private simulationService = inject(SimulationService);
  private toastrService = inject(ToastrService);

  loadHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimulationActions.loadHistory),
      mergeMap((action) =>
        this.simulationService.getHistory(action.userId).pipe(
          map(simulations => SimulationActions.loadHistorySuccess({ simulations })),
          catchError((error: HttpErrorResponse) => 
            of(SimulationActions.loadHistoryFailure({ error: this.getErrorMessage(error) }))
          )
        )
      )
    )
  );

  loadMine$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimulationActions.loadMine),
      mergeMap(() =>
        this.simulationService.getMine().pipe(
          map(simulations => SimulationActions.loadMineSuccess({ simulations })),
          catchError((error: HttpErrorResponse) => 
            of(SimulationActions.loadMineFailure({ error: this.getErrorMessage(error) }))
          )
        )
      )
    )
  );

  loadById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimulationActions.loadById),
      mergeMap((action) =>
        this.simulationService.getById(action.id).pipe(
          map(simulation => SimulationActions.loadByIdSuccess({ simulation })),
          catchError((error: HttpErrorResponse) => 
            of(SimulationActions.loadByIdFailure({ error: this.getErrorMessage(error) }))
          )
        )
      )
    )
  );

  createSimulation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimulationActions.createSimulation),
      mergeMap((action) =>
        this.simulationService.create(action.request).pipe(
          map(simulation => SimulationActions.createSimulationSuccess({ simulation })),
          catchError((error: HttpErrorResponse) => 
            of(SimulationActions.createSimulationFailure({ error: this.getErrorMessage(error) }))
          )
        )
      )
    )
  );

  private getErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400: return 'Invalid simulation input. Please check your values.';
      case 401: return 'Session expired. Please log in again.';
      case 403: return 'You do not have permission to access this resource.';
      case 404: return 'Simulation not found.';
      case 500: return 'Server error. Please try again later.';
      default: return error.message || 'An unknown error occurred.';
    }
  }

  showSuccessOptions$ = createEffect(() =>
        this.actions$.pipe(
          ofType(
            SimulationActions.createSimulationSuccess),
          tap((action) => {
            if (action.type === SimulationActions.createSimulationSuccess.type) {       
                setTimeout(() => {
                this.toastrService.success('Simulation created successfully!', 'Success');
                }, 10000);
            }
          })
        ),
        { dispatch: false }
    );
}
