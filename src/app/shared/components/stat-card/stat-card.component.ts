import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html'
})
export class StatCardComponent {
  value = input<string | number>('');
  label = input<string>('');
  leftBorderColor = input<string>('bg-blue-500');
  iconColor = input<string>('text-blue-500');
  valueColor = input<string>('text-blue-950');
  topText = input<string>('');
  badgeClasses = input<string>('text-gray-500 bg-transparent');
}
