import { Component, inject, signal } from '@angular/core';

import { CategoryApiService } from '../../../../core/api/category-api.service';
import { WishApiService } from '../../../../core/api/wish-api.service';
import { CategoryResponse } from '../../../../core/models/category.model';
import { WishRequest, WishResponse } from '../../../../core/models/wish.model';
import { WishCard } from '../../components/wish-card/wish-card';
import { WishCreateForm } from '../../components/wish-create-form/wish-create-form';

@Component({
  selector: 'app-wish-list-page',
  imports: [WishCard, WishCreateForm],
  templateUrl: './wish-list-page.html',
  styleUrl: './wish-list-page.scss',
})
export class WishListPage {
  private readonly wishApiService = inject(WishApiService);
  private readonly categoryApiService = inject(CategoryApiService);

  protected readonly wishes = signal<WishResponse[]>([]);
  protected readonly categories = signal<CategoryResponse[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadWishes();
    this.loadCategories();
  }

  protected loadWishes(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.wishApiService.getWishes().subscribe({
      next: (wishes) => {
        this.wishes.set(wishes);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load wishes');
        this.isLoading.set(false);
      },
    });
  }

  protected loadCategories(): void {
    this.categoryApiService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: () => {
        this.errorMessage.set('Could not load categories');
      },
    });
  }

  protected createWish(request: WishRequest): void {
    this.wishApiService.createWish(request).subscribe({
      next: () => {
        this.loadWishes();
      },
      error: () => {
        this.errorMessage.set('Could not create wish');
      },
    });
  }
}
