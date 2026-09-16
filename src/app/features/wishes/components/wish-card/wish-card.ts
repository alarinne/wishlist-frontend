import { Component, input, output } from '@angular/core';

import { WishResponse } from '../../../../core/models/wish.model';

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
  readonly deleteWish = output<number>();
  readonly editWish = output<WishResponse>();

  protected requestDelete(): void {
    if (this.actionsDisabled() || this.isDeleting()) {
      return;
    }

    this.deleteWish.emit(this.wish().id);
  }

  protected requestEdit(): void {
    if (this.actionsDisabled() || this.isDeleting()) {
      return;
    }

    this.editWish.emit(this.wish());
  }
}
