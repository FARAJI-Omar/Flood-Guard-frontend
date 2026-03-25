import { Component } from '@angular/core';
import { FloodHistoryComponent } from '../../../../shared/components/flood-history/flood-history.component';

@Component({
  selector: 'app-flood-events-page',
  standalone: true,
  imports: [FloodHistoryComponent],
  templateUrl: './flood-events-page.component.html'})
export class FloodEventsPageComponent {}
