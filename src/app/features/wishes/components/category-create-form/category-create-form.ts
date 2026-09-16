import { Component, effect, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CategoryRequest } from '../../../../core/models/category.model';
import { CategoryCreateFieldErrors } from '../../models/category-create-field-errors.model';

@Component({
  selector: 'app-category-create-form',
  imports: [FormsModule],
  templateUrl: './category-create-form.html',
  styleUrl: './category-create-form.scss',
})
export class CategoryCreateForm {
  readonly fieldErrors = input<CategoryCreateFieldErrors>({});
  readonly resetKey = input(0);
  readonly createCategory = output<CategoryRequest>();

  protected name = '';
  protected code = '';
  protected label = '';

  private readonly resetWhenRequested = effect(() => {
    this.resetKey();
    this.resetForm();
  });

  protected submitForm(): void {
    if (!this.name || !this.code || !this.label) {
      return;
    }

    this.createCategory.emit({
      name: this.name,
      code: this.code,
      label: this.label,
    });
  }

  private resetForm(): void {
    this.name = '';
    this.code = '';
    this.label = '';
  }
}
