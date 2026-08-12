import { Component, inject, signal } from '@angular/core';

import { WishApiService } from '../../../../core/api/wish-api.service';
import { WishResponse } from '../../../../core/models/wish.model';
import { WishCard } from '../../components/wish-card/wish-card';

@Component({
  selector: 'app-wish-list-page',
  imports: [WishCard],
  templateUrl: './wish-list-page.html',
  styleUrl: './wish-list-page.scss',
})
export class WishListPage {
  private readonly wishApiService = inject(WishApiService);

  protected readonly wishes = signal<WishResponse[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadWishes();
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
}
