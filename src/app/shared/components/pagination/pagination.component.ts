import { Component, Output, EventEmitter, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  currentPage = input<number>(1);
  totalItems = input<number>(0);
  itemsPerPage = input<number>(10);
  @Output() pageChange = new EventEmitter<number>();

  totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage()));
  startItem = computed(() => (this.currentPage() - 1) * this.itemsPerPage() + 1);
  endItem = computed(() => Math.min(this.currentPage() * this.itemsPerPage(), this.totalItems()));

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.pageChange.emit(page);
    }
  }

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }

    return pages;
  }
}
