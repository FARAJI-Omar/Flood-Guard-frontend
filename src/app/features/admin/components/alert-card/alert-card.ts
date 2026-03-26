import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alert } from '../../../../core/models/alert.model';

@Component({
  selector: 'app-alert-card',
  imports: [CommonModule],
  templateUrl: './alert-card.html',
  styleUrl: './alert-card.css',
})
export class AlertCard {
  @Input() alert!: Alert;
}
