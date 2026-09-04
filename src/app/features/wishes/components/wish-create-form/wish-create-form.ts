import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryResponse } from '../../../../core/models/category.model';
import { Priority, WishRequest, WishResponse } from '../../../../core/models/wish.model';
import { WishCreateFieldErrors } from '../../models/wish-create-field-errors.model';

@Component({
  selector: 'app-wish-create-form',
  imports: [FormsModule],
  templateUrl: './wish-create-form.html',
  styleUrl: './wish-create-form.scss',
})
export class WishCreateForm {
  readonly categories = input.required<CategoryResponse[]>();
  readonly editingWish = input<WishResponse | null>(null);
  readonly fieldErrors = input<WishCreateFieldErrors>({});
  readonly saveWish = output<WishRequest>();

  protected readonly priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];

  protected wishName = '';
  protected wishPrice: number | null = null;
  protected url = '';
  protected categoryId: number | null = null;
  protected priority: Priority = 'MEDIUM';

  private readonly syncEditingWish = effect(() => {
    const editingWish = this.editingWish();

    if (!editingWish) {
      this.resetForm();
      return;
    }

    this.wishName = editingWish.wishName;
    this.wishPrice = editingWish.wishPrice;
    this.url = editingWish.url ?? '';
    this.categoryId = editingWish.categoryId;
    this.priority = editingWish.priority;
  });

  protected submitForm(): void {
    if (!this.wishName || this.wishPrice === null || this.categoryId === null) {
      return;
    }

    this.saveWish.emit({
      wishName: this.wishName,
      wishPrice: this.wishPrice,
      url: this.url || null,
      categoryId: this.categoryId,
      priority: this.priority,
    });
  }

  private resetForm(): void {
    this.wishName = '';
    this.wishPrice = null;
    this.url = '';
    this.categoryId = null;
    this.priority = 'MEDIUM';
  }
}
