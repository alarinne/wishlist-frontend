import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

import { CategoryApiService } from '../../../../core/api/category-api.service';
import { WishApiService } from '../../../../core/api/wish-api.service';
import { ApiErrorResponse, ApiFieldError } from '../../../../core/models/api-error.model';
import { CategoryRequest, CategoryResponse } from '../../../../core/models/category.model';
import { WishRequest, WishResponse } from '../../../../core/models/wish.model';
import { CategoryCreateForm } from '../../components/category-create-form/category-create-form';
import { WishCard } from '../../components/wish-card/wish-card';
import { WishCreateForm } from '../../components/wish-create-form/wish-create-form';
import { CategoryCreateFieldErrors } from '../../models/category-create-field-errors.model';
import { WishCreateFieldErrors } from '../../models/wish-create-field-errors.model';

@Component({
  selector: 'app-wish-list-page',
  imports: [WishCard, WishCreateForm, CategoryCreateForm],
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
  protected readonly createFieldErrors = signal<WishCreateFieldErrors>({});
  protected readonly categoryFieldErrors = signal<CategoryCreateFieldErrors>({});
  protected readonly categoryErrorMessage = signal<string | null>(null);
  protected readonly categoryFormResetKey = signal(0);
  protected readonly editingWish = signal<WishResponse | null>(null);

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

  protected createCategory(request: CategoryRequest): void {
    this.categoryErrorMessage.set(null);
    this.categoryFieldErrors.set({});

    this.categoryApiService.createCategory(request).subscribe({
      next: (category) => {
        this.categories.update((categories) => [...categories, category]);
        this.categoryFormResetKey.update((resetKey) => resetKey + 1);
      },
      error: (error: unknown) => {
        const fieldErrors = this.getCategoryValidationFieldErrors(error);

        if (fieldErrors) {
          this.categoryFieldErrors.set(fieldErrors);
          return;
        }

        this.categoryErrorMessage.set(this.getApiErrorMessage(error) ?? 'Could not create category');
      },
    });
  }

  protected saveWish(request: WishRequest): void {
    const editingWish = this.editingWish();

    if (editingWish) {
      this.updateWish(editingWish.id, request);
      return;
    }

    this.createWish(request);
  }

  private createWish(request: WishRequest): void {
    this.errorMessage.set(null);
    this.createFieldErrors.set({});

    this.wishApiService.createWish(request).subscribe({
      next: () => {
        this.loadWishes();
      },
      error: (error: unknown) => {
        const fieldErrors = this.getValidationFieldErrors(error);

        if (fieldErrors) {
          this.createFieldErrors.set(fieldErrors);
          return;
        }

        this.errorMessage.set('Could not create wish');
      },
    });
  }

  private updateWish(id: number, request: WishRequest): void {
    this.errorMessage.set(null);
    this.createFieldErrors.set({});

    this.wishApiService.updateWish(id, request).subscribe({
      next: (updatedWish) => {
        this.wishes.update((wishes) =>
          wishes.map((wish) => wish.id === id ? updatedWish : wish),
        );
        this.editingWish.set(null);
      },
      error: (error: unknown) => {
        const fieldErrors = this.getValidationFieldErrors(error);

        if (fieldErrors) {
          this.createFieldErrors.set(fieldErrors);
          return;
        }

        this.errorMessage.set('Could not update wish');
      },
    });
  }

  protected deleteWish(id: number): void {
    this.errorMessage.set(null);

    this.wishApiService.deleteWish(id).subscribe({
      next: () => {
        this.wishes.update((wishes) => wishes.filter((wish) => wish.id !== id));
      },
      error: () => {
        this.errorMessage.set('Could not delete wish');
      },
    });
  }

  protected startEdit(wish: WishResponse): void {
    this.errorMessage.set(null);
    this.createFieldErrors.set({});
    this.editingWish.set(wish);
  }

  private getValidationFieldErrors(error: unknown): WishCreateFieldErrors | null {
    if (!(error instanceof HttpErrorResponse) || error.status !== 400) {
      return null;
    }

    if (!this.isApiErrorResponse(error.error)) {
      return null;
    }

    const fieldErrors: WishCreateFieldErrors = {};

    for (const fieldError of error.error.fieldErrors) {
      if (this.isWishRequestField(fieldError.field)) {
        fieldErrors[fieldError.field] = fieldError.message;
      }
    }

    return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
  }

  private getCategoryValidationFieldErrors(error: unknown): CategoryCreateFieldErrors | null {
    if (!(error instanceof HttpErrorResponse) || error.status !== 400) {
      return null;
    }

    if (!this.isApiErrorResponse(error.error)) {
      return null;
    }

    const fieldErrors: CategoryCreateFieldErrors = {};

    for (const fieldError of error.error.fieldErrors) {
      if (this.isCategoryRequestField(fieldError.field)) {
        fieldErrors[fieldError.field] = fieldError.message;
      }
    }

    return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
  }

  private getApiErrorMessage(error: unknown): string | null {
    if (!(error instanceof HttpErrorResponse) || !this.isApiErrorResponse(error.error)) {
      return null;
    }

    return error.error.message;
  }

  private isApiErrorResponse(error: unknown): error is ApiErrorResponse {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const maybeError = error as Partial<ApiErrorResponse>;

    return typeof maybeError.message === 'string'
      && Array.isArray(maybeError.fieldErrors)
      && maybeError.fieldErrors.every((fieldError): fieldError is ApiFieldError => (
        Boolean(fieldError)
        && typeof fieldError.field === 'string'
        && typeof fieldError.message === 'string'
      ));
  }

  private isWishRequestField(field: string): field is keyof WishRequest {
    return field === 'wishName'
      || field === 'wishPrice'
      || field === 'url'
      || field === 'categoryId'
      || field === 'priority';
  }

  private isCategoryRequestField(field: string): field is keyof CategoryRequest {
    return field === 'name'
      || field === 'code'
      || field === 'label';
  }
}
