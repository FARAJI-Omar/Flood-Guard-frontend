import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { updateEvent } from '../../../../core/state/flood-events/flood-events.actions';
import { FloodEventService } from '../../../../core/services/flood-event.service';
import { MapComponent } from '../../../../shared/components/map/map.component';

@Component({
  selector: 'app-edit-flood-event-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-flood-event-page.component.html'
})
export class EditFloodEventPageComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private floodEventService = inject(FloodEventService);

  eventId!: number;
  eventName = '';
  eventDate = '';
  eventSeverity = 'critical';
  coordinates: number[][] = [];
  loading = false;

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent();
  }

  loadEvent(): void {
    this.loading = true;
    this.floodEventService.getFloodEventById(this.eventId).subscribe({
      next: (event) => {
        this.eventName = event.properties.name;
        this.eventDate = event.properties.eventDate;
        this.eventSeverity = event.properties.severity;
        this.coordinates = event.geometry.type === 'Polygon' 
          ? event.geometry.coordinates[0] 
          : event.geometry.coordinates[0][0];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/admin/floodevents']);
      }
    });
  }

  submitUpdate(): void {
    const eventPayload = {
      name: this.eventName,
      eventDate: this.eventDate,
      severity: this.eventSeverity,
      coordinates: this.coordinates
    };
    
    this.store.dispatch(updateEvent({ id: this.eventId, event: eventPayload }));
    this.router.navigate(['/admin/floodevents']);
  }

  cancel(): void {
    this.router.navigate(['/admin/floodevents']);
  }
}
