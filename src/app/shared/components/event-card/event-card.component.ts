import { Component, output, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FloodEventFeature } from '../../../core/models/flood-event.model';
import { AdminOnlyDirective } from '../../../core/directives/admin-only.directive';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, DatePipe, AdminOnlyDirective],
  templateUrl: './event-card.component.html'
})
export class EventCardComponent {
  event = input.required<FloodEventFeature>();
  isSelected = input<boolean>(false);
  cardClick = output<number>();
  deleteEvent = output<number>();
  editEvent = output<number>();

  onClick() {
    this.cardClick.emit(this.event().properties.id);
  }

  onDelete(eventId: number, $event: Event) {
    $event.stopPropagation();
    this.deleteEvent.emit(eventId);
  }

  onEdit(eventId: number, $event: Event) {
    $event.stopPropagation();
    this.editEvent.emit(eventId);
  }

  getSeverityBgClass(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-400';
      case 'low': return 'bg-green-500';
      default: return 'bg-slate-300';
    }
  }

  getSeverityBadgeClass(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'moderate': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  }
}
