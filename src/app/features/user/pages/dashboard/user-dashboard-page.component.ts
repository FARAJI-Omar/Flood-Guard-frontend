import { Component, inject, OnInit } from '@angular/core';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { WeatherMapComponent } from '../../components/weather-map/weather-map.component';
import { selectFloodEventsThisYear } from '../../../../core/state/flood-events/flood-events.selectors';
import { selectMySimulationsCount } from '../../../../core/state/simulations/simulations.selectors';
import { selectActiveAlerts } from '../../../../core/state/alerts/alerts.selectors';
import { loadMine } from '../../../../core/state/simulations/simulations.actions';
import { loadAlerts } from '../../../../core/state/alerts/alerts.actions';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { loadEvents } from '../../../../core/state/flood-events/flood-events.actions';
import { AlertComponent } from "../../components/alert/alert.component";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-dashboard-page',
  standalone: true,
  imports: [StatCardComponent, WeatherMapComponent, AsyncPipe, RouterLink, AlertComponent],
  templateUrl: './user-dashboard-page.component.html'
})
export class UserDashboardPageComponent implements OnInit {
  store = inject(Store);
  
  eventsThisYear$ = this.store.select(selectFloodEventsThisYear);
  mySimulationsCount$ = this.store.select(selectMySimulationsCount);
  activeAlertsCount$ = this.store.select(selectActiveAlerts).pipe(
    map(alerts => alerts.length)
  );

  ngOnInit() {
    this.store.dispatch(loadMine());
    this.store.dispatch(loadEvents({year: "all", severity: "all"}));
    this.store.dispatch(loadAlerts({ page: 0, pageSize: 10 }));
  }
}


