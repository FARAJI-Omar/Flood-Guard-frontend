import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6 flex gap-4 items-center justify-end">
      <div class="relative">
        <button 
          (click)="showRiskDropdown = !showRiskDropdown"
          class="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 whitespace-nowrap flex items-center gap-2"
        >
          Risk Level: {{ selectedRisk === 'ALL' ? 'All' : selectedRisk }}
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        @if (showRiskDropdown) {
          <div class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            @for (risk of riskLevels; track risk) {
              <button
                (click)="selectRisk(risk)"
                class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                [class.bg-blue-50]="selectedRisk === risk"
              >
                {{ risk === 'ALL' ? 'All' : risk }}
              </button>
            }
          </div>
        }
      </div>
      <div class="relative">
        <button 
          (click)="showSortDropdown = !showSortDropdown"
          class="px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
        >
          Sort by: {{ selectedSort === 'newest' ? 'Newest' : 'Oldest' }}
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        @if (showSortDropdown) {
          <div class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <button
              (click)="selectSort('newest')"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-lg"
              [class.bg-blue-50]="selectedSort === 'newest'"
            >
              Newest
            </button>
            <button
              (click)="selectSort('oldest')"
              class="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-b-lg"
              [class.bg-blue-50]="selectedSort === 'oldest'"
            >
              Oldest
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class SearchFilterComponent {
  selectedRisk = 'ALL';
  selectedSort = 'newest';
  showRiskDropdown = false;
  showSortDropdown = false;
  
  riskLevels = ['ALL', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'];
  
  riskChange = output<string>();
  sortChange = output<string>();

  selectRisk(risk: string) {
    this.selectedRisk = risk;
    this.showRiskDropdown = false;
    this.riskChange.emit(risk);
  }

  selectSort(sort: string) {
    this.selectedSort = sort;
    this.showSortDropdown = false;
    this.sortChange.emit(sort);
  }
}
