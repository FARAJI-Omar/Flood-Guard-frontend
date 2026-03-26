import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import * as AlertsActions from '../../../core/state/alerts/alerts.actions';
import * as AlertsSelectors from '../../../core/state/alerts/alerts.selectors';

@Component({
  selector: 'app-threshold-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './threshold-config.html',
  styleUrl: './threshold-config.css',
})
export class ThresholdConfig implements OnInit {
  private store = inject(Store);
  
  threshold = 0;
  loading = false;
  activeAlertsCount = 0;
  
  newThreshold: number = 0;

  ngOnInit() {
    this.store.select(AlertsSelectors.selectThreshold).subscribe(threshold => {
      if (threshold !== null && threshold !== undefined) {
        this.threshold = threshold;
        this.newThreshold = threshold;
      }
    });

    this.store.select(AlertsSelectors.selectLoading).subscribe(loading => {
      this.loading = loading ?? false;
    });

    this.store.select(AlertsSelectors.selectActiveAlerts).pipe(
      map(alerts => alerts ? alerts.length : 0)
    ).subscribe(count => {
      this.activeAlertsCount = count;
    });
  }

  updateThreshold() {
    if (this.newThreshold > 0) {
      this.store.dispatch(AlertsActions.updateThreshold({ threshold: this.newThreshold }));
    }
  }
}
