import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryResponse } from '../../../../core/models/category.model';
import { Priority, WishRequest } from '../../../../core/models/wish.model';

@Component({
  selector: 'app-wish-create-form',
  imports: [FormsModule],
  templateUrl: './wish-create-form.html',
  styleUrl: './wish-create-form.scss',
})
export class WishCreateForm {
  readonly categories = input.required<CategoryResponse[]>();
  readonly createWish = output<WishRequest>();

  protected readonly priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];

  protected wishName = '';
  protected wishPrice: number | null = null;
  protected url = '';
  protected categoryId: number | null = null;
  protected priority: Priority = 'MEDIUM';

  protected submitForm(): void {
    if (!this.wishName || this.wishPrice === null || this.categoryId === null) {
      return;
    }

    this.createWish.emit({
      wishName: this.wishName,
      wishPrice: this.wishPrice,
      url: this.url || null,
      categoryId: this.categoryId,
      priority: this.priority,
    });
  }
}
