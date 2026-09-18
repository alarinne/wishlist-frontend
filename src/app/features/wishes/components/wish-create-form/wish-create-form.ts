import { Component, computed, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryResponse } from '../../../../core/models/category.model';
import { Priority, WishRequest, WishResponse } from '../../../../core/models/wish.model';
import { WishCreateFieldErrors } from '../../models/wish-create-field-errors.model';
import { WishFormMode } from '../../models/wish-form-mode.model';

@Component({
  selector: 'app-wish-create-form',
  imports: [FormsModule],
  templateUrl: './wish-create-form.html',
  styleUrl: './wish-create-form.scss',
})
export class WishCreateForm {
  readonly categories = input.required<CategoryResponse[]>();
  readonly mode = input<WishFormMode>('create');
  readonly initialWish = input<WishResponse | null>(null);
  readonly fieldErrors = input<WishCreateFieldErrors>({});
  readonly isSaving = input(false);
  readonly submitWish = output<WishRequest>();

  protected readonly priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH'];
  protected readonly isEditMode = computed(() => this.mode() === 'edit');

  protected wishName = '';
  protected wishPrice: number | null = null;
  protected url = '';
  protected categoryId: number | null = null;
  protected priority: Priority = 'MEDIUM';

  private readonly syncInitialWish = effect(() => {
    const mode = this.mode();
    const initialWish = this.initialWish();

    if (mode !== 'edit' || !initialWish) {
      this.resetForm();
      return;
    }

    this.prefillForm(initialWish);
  });

  protected submitForm(): void {
    if (this.isSaving()) {
      return;
    }

    if (!this.wishName || this.wishPrice === null || this.categoryId === null) {
      return;
    }

    this.submitWish.emit({
      wishName: this.wishName,
      wishPrice: this.wishPrice,
      url: this.url || null,
      categoryId: this.categoryId,
      priority: this.priority,
    });
  }

  private prefillForm(wish: WishResponse): void {
    this.wishName = wish.wishName;
    this.wishPrice = wish.wishPrice;
    this.url = wish.url ?? '';
    this.categoryId = wish.categoryId;
    this.priority = wish.priority;
  }

  private resetForm(): void {
    this.wishName = '';
    this.wishPrice = null;
    this.url = '';
    this.categoryId = null;
    this.priority = 'MEDIUM';
  }
}
