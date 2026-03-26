import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import * as AlertsActions from '../../../../core/state/alerts/alerts.actions';
import * as AlertsSelectors from '../../../../core/state/alerts/alerts.selectors';
import { Alert } from '../../../../core/models/alert.model';

@Component({
  selector: 'app-alerts-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './alerts-list.html',
  styleUrl: './alerts-list.css',
})
export class AlertsList {
  private store = inject(Store);
  
  alerts: Alert[] = [];
  totalAlerts = 0;
  currentPage = 0;
  pageSize = 10;
  loading = false;

  constructor() {
    this.store.select(AlertsSelectors.selectAlerts).subscribe(alerts => {
      this.alerts = alerts || [];
    });

    this.store.select(AlertsSelectors.selectTotalAlerts).subscribe(total => {
      this.totalAlerts = total ?? 0;
    });

    this.store.select(AlertsSelectors.selectCurrentPage).subscribe(page => {
      this.currentPage = page ?? 0;
    });

    this.store.select(AlertsSelectors.selectPageSize).subscribe(size => {
      this.pageSize = size ?? 10;
    });

    this.store.select(AlertsSelectors.selectLoading).subscribe(loading => {
      this.loading = loading ?? false;
    });
  }

  onPageChange(page: number) {
    this.store.dispatch(AlertsActions.loadAlerts({ page: page - 1, pageSize: 10 }));
  }
}
