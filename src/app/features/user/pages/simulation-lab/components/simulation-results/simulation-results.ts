import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-simulation-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './simulation-results.html',
})
export class SimulationResults {
  results = input<any>(null);
  private router = inject(Router);

  goToHistory() {
    this.router.navigate(['/user/simulationshistory']);
  }

  getRiskColorText(level: string): string {
    switch (level) {
      case 'CRITICAL': return 'text-red-600';
      case 'HIGH': return 'text-orange-500';
      case 'MODERATE': return 'text-yellow-500';
      case 'LOW': return 'text-green-500';
      default: return 'text-gray-500';
    }
  }

  getRiskColorBg(level: string): string {
    switch (level) {
      case 'CRITICAL': return 'bg-red-100';
      case 'HIGH': return 'bg-orange-100';
      case 'MODERATE': return 'bg-yellow-100';
      case 'LOW': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  }

  getRiskColorStroke(level: string): string {
    switch (level) {
      case 'CRITICAL': return '#dc2626'; // red-600
      case 'HIGH': return '#f97316'; // orange-500
      case 'MODERATE': return '#eab308'; // yellow-500
      case 'LOW': return '#22c55e'; // green-500
      default: return '#9ca3af'; // gray-500
    }
  }

  getRunoffPotential(level: string): string {
    switch (level) {
      case 'CRITICAL': return 'Very High';
      case 'HIGH': return 'High';
      case 'MODERATE': return 'Moderate'; 
      case 'LOW': return 'Low';
      default: return 'Unknown';
    }
  }

  getRunoffPotentialColor(level: string): string {
    return this.getRiskColorText(level);
  }

  getRunoffDescription(level: string): string {
    switch (level) {
      case 'CRITICAL': return 'Runoff potential is extremely high — dense urban cover and impervious surfaces generate rapid surface flow.';
      case 'HIGH': return 'Runoff potential is high — compacted soils and urban surfaces limit infiltration significantly.';
      case 'MODERATE': return 'Runoff potential is moderate — mixed development begins to reduce natural absorption.';
      case 'LOW': return 'Runoff potential is low — natural land cover and good soil conditions allow for adequate infiltration.';
      default: return 'Unable to determine runoff potential.';
    }
  }

  getCnColorStroke(level: string): string {
    return this.getRiskColorStroke(level);
  }
}

