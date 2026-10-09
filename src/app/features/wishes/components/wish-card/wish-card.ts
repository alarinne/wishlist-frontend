import { Component, computed, input, output } from '@angular/core';

import { WishResponse } from '../../../../core/models/wish.model';
import { WishStatusChange } from '../../models/wish-status-change.model';

@Component({
  selector: 'app-wish-card',
  imports: [],
  templateUrl: './wish-card.html',
  styleUrl: './wish-card.scss',
})
export class WishCard {
  readonly wish = input.required<WishResponse>();
  readonly actionsDisabled = input(false);
  readonly isDeleting = input(false);
  readonly isUpdatingStatus = input(false);
  readonly statusError = input<string | null>(null);
  readonly deleteWish = output<number>();
  readonly editWish = output<WishResponse>();
  readonly updateWishStatus = output<WishStatusChange>();

  protected readonly areActionsDisabled = computed(() =>
    this.actionsDisabled() || this.isDeleting() || this.isUpdatingStatus(),
  );

  protected requestDelete(): void {
    if (this.areActionsDisabled()) {
      return;
    }

    this.deleteWish.emit(this.wish().id);
  }

  protected requestEdit(): void {
    if (this.areActionsDisabled()) {
      return;
    }

    this.editWish.emit(this.wish());
  }

  protected requestStatusUpdate(): void {
    if (this.areActionsDisabled()) {
      return;
    }

    const wish = this.wish();
    this.updateWishStatus.emit({
      id: wish.id,
      status: wish.status === 'ACTIVE' ? 'PURCHASED' : 'ACTIVE',
    });
  }
}
