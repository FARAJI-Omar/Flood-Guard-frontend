import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe, DecimalPipe, DatePipe, NgClass } from '@angular/common';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { selectFloodEventsThisYear, selectHistoricalRiskOutcomes } from '../../../../core/state/flood-events/flood-events.selectors';
import { loadEvents } from '../../../../core/state/flood-events/flood-events.actions';
import { loadHistory } from '../../../../core/state/simulations/simulations.actions';
import { selectAllSimulations } from '../../../../core/state/simulations/simulations.selectors';
import { selectTotalAlerts } from '../../../../core/state/alerts/alerts.selectors';
import { UserService } from '../../../../core/services/user.service';
import { map } from 'rxjs/operators';
import { loadAlerts } from '../../../../core/state/alerts/alerts.actions';

@Component({
  selector: 'app-dashboard-page',
  imports: [StatCardComponent, RouterLink, MapComponent, AsyncPipe, DecimalPipe, DatePipe, NgClass],
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {
  private store = inject(Store);
  private userService = inject(UserService);

  totalUsers$ = this.userService.totalUsers();
  totalAlerts$ = this.store.select(selectTotalAlerts);
  totalSimulations$ = this.store.select(selectAllSimulations).pipe(
    map(sims => sims ? sims.length : 0)
  )


  eventsThisYear$ = this.store.select(selectFloodEventsThisYear);
  riskOutcomes$ = this.store.select(selectHistoricalRiskOutcomes);

  // Take the first 3 simulations
  recentSimulations$ = this.store.select(selectAllSimulations).pipe(
    map(simulations => simulations ? simulations.slice(0, 3) : [])
  );

  ngOnInit(): void {
    this.store.dispatch(loadEvents({ year: 'all', severity: 'all' }));
    this.store.dispatch(loadHistory({}));
    this.store.dispatch(loadAlerts({ page: 0, pageSize: 10 }));
  }

  getRiskColor(level: string): string {
    switch (level) {
      case 'CRITICAL': return 'bg-red-100 text-red-700';
      case 'HIGH RISK': return 'bg-orange-100 text-orange-700';
      case 'MODERATE': return 'bg-yellow-100 text-yellow-700';
      case 'LOW': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
