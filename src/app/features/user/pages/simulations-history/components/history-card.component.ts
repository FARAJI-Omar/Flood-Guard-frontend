import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationResponse } from '../../../../../core/models/simulation.model';

@Component({
  selector: 'app-history-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="bg-white rounded-lg border-l-4 shadow-sm hover:shadow-md transition-shadow" 
      [ngClass]="getBorderColor()"
    >
      <div class="p-6">
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-3">
            <span class="text-sm font-semibold text-gray-700">#SIM-{{ getSimId() }}</span>
            <div class="flex items-center text-sm text-gray-600">
              <svg class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate() }}
            </div>
          </div>
          <span 
            class="text-xs font-bold uppercase tracking-wider" 
            [ngClass]="getTextColor()"
          >
            {{ simulation.riskLevel }} RISK
          </span>
        </div>

        <div class="grid grid-cols-7 gap-6 text-sm">
          <div>
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">RAINFALL</div>
            <div class="text-base font-bold text-gray-900">{{ simulation.rainfallMm }} mm</div>
          </div>
          <div>
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">RUNOFF</div>
            <div class="text-base font-bold text-gray-900">{{ simulation.runoffMm | number:'1.1-1' }} mm</div>
          </div>
          <div>
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">INFILTRATION</div>
            <div class="text-base font-bold text-gray-900">{{ simulation.infiltrationMm | number:'1.1-1' }} mm</div>
          </div>
          <div>
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">SOIL</div>
            <div class="text-base font-bold text-gray-900">Type {{ simulation.soilClass }}</div>
          </div>
          <div>
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">LAND COVER</div>
            <div class="text-base font-bold text-gray-900">{{ formatLandCover() }}</div>
          </div>
          <div>
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CN</div>
            <div class="text-base font-bold text-gray-900">{{ simulation.cnValue }}</div>
          </div>
          <div>
            <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">AREA KM²</div>
            <div class="text-base font-bold text-gray-900">{{ simulation.areaKm2 }}</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HistoryCardComponent {
  @Input({ required: true }) simulation!: SimulationResponse;

  getBorderColor(): string {
    switch (this.simulation.riskLevel) {
      case 'CRITICAL': return 'border-red-500';
      case 'HIGH': return 'border-orange-500';
      case 'MODERATE': return 'border-yellow-500';
      case 'LOW': return 'border-green-500';
      default: return 'border-gray-300';
    }
  }

  getTextColor(): string {
    switch (this.simulation.riskLevel) {
      case 'CRITICAL': return 'text-red-600';
      case 'HIGH': return 'text-orange-600';
      case 'MODERATE': return 'text-orange-500';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  }

  formatDate(): string {
    return new Date(this.simulation.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatLandCover(): string {
    const map: Record<string, string> = {
      'URBAN_DENSE': 'Urbanized',
      'URBAN_SPARSE': 'Urban',
      'VEGETATION': 'Pasture',
      'BARE_SOIL': 'Bare Soil'
    };
    return map[this.simulation.landCover] || this.simulation.landCover;
  }

  getSimId(): string {
    return String(this.simulation.id).padStart(2, '0');
  }
}
