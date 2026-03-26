import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ThresholdConfig } from '../../threshold-config/threshold-config';
import { AlertsList } from '../../components/alerts-list/alerts-list';
import * as AlertsActions from '../../../../core/state/alerts/alerts.actions';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [CommonModule, ThresholdConfig, AlertsList],
  templateUrl: './alerts-page.component.html'
})
export class AlertsPageComponent implements OnInit {
  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(AlertsActions.loadThreshold());
    this.store.dispatch(AlertsActions.loadAlerts({ page: 0, pageSize: 10 }));
  }
}
