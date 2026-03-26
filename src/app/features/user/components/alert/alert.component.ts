import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as AlertsActions from '../../../../core/state/alerts/alerts.actions';
import * as AlertsSelectors from '../../../../core/state/alerts/alerts.selectors';
import { Alert } from '../../../../core/models/alert.model';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent implements OnInit {
  private store = inject(Store);
  
  alerts: Alert[] = [];

  ngOnInit() {
    this.store.dispatch(AlertsActions.loadAlerts({ page: 0, pageSize: 100 }));
    
    this.store.select(AlertsSelectors.selectAlerts).subscribe(alerts => {
      this.alerts = alerts || [];
    });
  }
}
