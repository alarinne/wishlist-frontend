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
  readonly deleteWish = output<number>();

  protected requestDelete(): void {
    this.deleteWish.emit(this.wish().id);
  }
}
