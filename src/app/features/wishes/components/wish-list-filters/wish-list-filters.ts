import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryResponse } from '../../../../core/models/category.model';
import { WishStatusFilter } from '../../models/wish-status-filter.model';

@Component({
  selector: 'app-wish-list-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './wish-list-filters.html',
  styleUrl: './wish-list-filters.scss',
})
export class WishListFilters {
  readonly categories = input.required<ReadonlyArray<CategoryResponse>>();
  readonly status = input<WishStatusFilter>('ALL');
  readonly categoryId = input<number | null>(null);
  readonly statusChange = output<WishStatusFilter>();
  readonly categoryChange = output<number | null>();
  readonly resetFilters = output<void>();

  protected readonly statusOptions: ReadonlyArray<{ value: WishStatusFilter; label: string }> = [
    { value: 'ALL', label: 'All' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PURCHASED', label: 'Purchased' },
  ];
  protected readonly hasFilters = computed(() => this.status() !== 'ALL' || this.categoryId() !== null);
}
