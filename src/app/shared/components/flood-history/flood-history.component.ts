import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import {
  loadEvents,
  selectEvent,
  updateFilters,
  deleteEvent,
  createEvent,
  updateEvent
} from '../../../core/state/flood-events/flood-events.actions';
import { 
  selectAllFeatures, 
  selectError, 
  selectFeatureCollection, 
  selectFilters, 
  selectLoading, 
  selectSelectedEventId
} from '../../../core/state/flood-events/flood-events.selectors';
import { EventCardComponent } from '../event-card/event-card.component';
import { MapComponent } from '../map/map.component';
import { AdminOnlyDirective } from '../../../core/directives/admin-only.directive';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-flood-history',
  standalone: true,
  imports: [CommonModule, FormsModule, EventCardComponent, MapComponent, AdminOnlyDirective, ConfirmDialogComponent],
  templateUrl: './flood-history.component.html'
})
export class FloodHistoryComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  destroy$ = new Subject<void>();

  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  features$ = this.store.select(selectAllFeatures);
  filteredCollection$ = this.store.select(selectFeatureCollection);
  selectedEventId$ = this.store.select(selectSelectedEventId);
  filters$ = this.store.select(selectFilters);

  years = ['all', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015'];
  severities = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'low', label: 'Low' }
  ];

  selectedYear = 'all';
  selectedSeverity = 'all';
  showAddEventModal = false;
  showConfirmDelete = false;
  eventToDelete: number | null = null;
  
  isDrawingMode = false;
  drawnCoordinates: number[][] = [];
  newEventName = '';
  newEventDate = '';
  newEventSeverity = 'critical';

  showEditEventModal = false;
  eventToEditId: number | null = null;
  editEventName = '';
  editEventDate = '';
  editEventSeverity = 'critical';

  ngOnInit(): void {
    // Sync filters from URL
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const year = params['year'] || 'all';
      const severity = params['severity'] || 'all';
      
      if (this.selectedYear !== year || this.selectedSeverity !== severity) {
        this.selectedYear = year;
        this.selectedSeverity = severity;
        this.store.dispatch(updateFilters({ year, severity }));
      } else {
        // Initial load if no query params but we still need to load
        this.store.dispatch(updateFilters({ year: this.selectedYear, severity: this.selectedSeverity }));
      }
    });

    // Also listen to store filter changes to update URL
    this.filters$.pipe(takeUntil(this.destroy$)).subscribe(filters => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          year: filters.year === 'all' ? null : filters.year,
          severity: filters.severity === 'all' ? null : filters.severity
        },
        queryParamsHandling: 'merge'
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilters(): void {
    this.store.dispatch(updateFilters({ 
      year: this.selectedYear, 
      severity: this.selectedSeverity 
    }));
  }

  resetFilters(): void {
    this.selectedYear = 'all';
    this.selectedSeverity = 'all';
    this.applyFilters();
  }

  onEventSelect(id: number): void {
    this.store.dispatch(selectEvent({ eventId: id }));
  }

  clearSelection(): void {
    this.store.dispatch(selectEvent({ eventId: null }));
  }

  retry(): void {
    this.applyFilters();
  }

  onDeleteEvent(eventId: number): void {
    this.eventToDelete = eventId;
    this.showConfirmDelete = true;
  }

  onEditEvent(eventId: number): void {
    this.features$.subscribe(features => {
      const feature = features.find(f => f.properties.id === eventId);
      if (feature) {
        this.eventToEditId = eventId;
        this.editEventName = feature.properties.name;
        this.editEventDate = new Date(feature.properties.eventDate).toISOString().split('T')[0];
        this.editEventSeverity = feature.properties.severity.toLowerCase();
        this.showEditEventModal = true;
      }
    }).unsubscribe();
  }

  cancelEditModal(): void {
    this.showEditEventModal = false;
    this.eventToEditId = null;
  }

  submitEditEvent(): void {
    if (!this.editEventName || !this.editEventDate || this.eventToEditId === null) {
      alert("Please fill in all required fields.");
      return;
    }

    const updates = {
      name: this.editEventName,
      eventDate: this.editEventDate,
      severity: this.editEventSeverity
    };

    this.store.dispatch(updateEvent({ id: this.eventToEditId, event: updates }));
    this.showEditEventModal = false;
    this.eventToEditId = null;
  }

  confirmDelete(): void {
    if (this.eventToDelete !== null) {
      this.store.dispatch(deleteEvent({ eventId: this.eventToDelete }));
      this.eventToDelete = null;
      this.showConfirmDelete = false;
    }
  }

  cancelDelete(): void {
    this.eventToDelete = null;
    this.showConfirmDelete = false;
  }

  startDrawing(): void {
    this.isDrawingMode = true;
    this.showAddEventModal = false;
  }

  cancelDrawing(): void {
    this.isDrawingMode = false;
    this.drawnCoordinates = [];
  }

  onShapeDrawn(coordinates: number[][]): void {
    this.drawnCoordinates = coordinates;
    this.isDrawingMode = false;
    // reset form fields
    this.newEventName = '';
    this.newEventDate = new Date().toISOString().split('T')[0];
    this.newEventSeverity = 'critical';
    
    this.showAddEventModal = true;
  }
  
  cancelAddModal(): void {
    this.showAddEventModal = false;
    this.drawnCoordinates = [];
  }

  submitNewEvent(): void {
    if (!this.newEventName || !this.newEventDate) {
      alert("Please fill in all required fields.");
      return;
    }
    
    const eventPayload = {
      name: this.newEventName,
      eventDate: this.newEventDate,
      severity: this.newEventSeverity,
      coordinates: this.drawnCoordinates
    };
    
    this.store.dispatch(createEvent({ event: eventPayload }));
    this.showAddEventModal = false;
    this.drawnCoordinates = [];
  }
}
