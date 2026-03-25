import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadMine } from '../../../../core/state/simulations/simulations.actions';
import { 
  selectMySimulations, 
  selectSimulationLoading, 
  selectSimulationError 
} from '../../../../core/state/simulations/simulations.selectors';
import { SearchFilterComponent } from './components/search-filter.component';
import { HistoryCardComponent } from './components/history-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-simulations-history',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchFilterComponent, HistoryCardComponent, PaginationComponent],
  templateUrl: './simulations-history.component.html'
})
export class SimulationsHistoryComponent implements OnInit {
  private store = inject(Store);

  currentPage = signal(1);
  itemsPerPage = 6;
  selectedRisk = signal('ALL');
  selectedSort = signal('newest');

  simulations = toSignal(this.store.select(selectMySimulations), { initialValue: [] });
  loading$ = this.store.select(selectSimulationLoading);
  error$ = this.store.select(selectSimulationError);

  filteredSimulations = computed(() => {
    let filtered = [...this.simulations()];
    const risk = this.selectedRisk();
    const sort = this.selectedSort();

    if (risk !== 'ALL') {
      filtered = filtered.filter(sim => sim.riskLevel === risk);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  });

  paginatedSimulations = computed(() => {
    const filtered = this.filteredSimulations();
    const page = this.currentPage();
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  });

  totalFilteredCount = computed(() => this.filteredSimulations().length);

  ngOnInit(): void {
    this.store.dispatch(loadMine());
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onRiskChange(risk: string): void {
    this.selectedRisk.set(risk);
    this.currentPage.set(1);
  }

  onSortChange(sort: string): void {
    this.selectedSort.set(sort);
    this.currentPage.set(1);
  }
}
