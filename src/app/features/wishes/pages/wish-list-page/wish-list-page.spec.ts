import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of, Subject, throwError } from 'rxjs';

import { CategoryApiService } from '../../../../core/api/category-api.service';
import { WishApiService } from '../../../../core/api/wish-api.service';
import { CategoryRequest } from '../../../../core/models/category.model';
import { WishRequest, WishResponse } from '../../../../core/models/wish.model';
import { CategoryCreateForm } from '../../components/category-create-form/category-create-form';
import { WishCard } from '../../components/wish-card/wish-card';
import { WishCreateForm } from '../../components/wish-create-form/wish-create-form';
import { WishListPage } from './wish-list-page';

describe('WishListPage', () => {
  let component: WishListPage;
  let fixture: ComponentFixture<WishListPage>;
  let wishApiService: {
    getWishes: ReturnType<typeof vi.fn>;
    createWish: ReturnType<typeof vi.fn>;
    updateWish: ReturnType<typeof vi.fn>;
    deleteWish: ReturnType<typeof vi.fn>;
  };
  let categoryApiService: {
    getCategories: ReturnType<typeof vi.fn>;
    createCategory: ReturnType<typeof vi.fn>;
  };

  const wish: WishResponse = {
    id: 1,
    wishName: 'Kindle',
    wishPrice: 120,
    url: null,
    status: 'ACTIVE',
    categoryId: 1,
    categoryName: 'Books',
    priority: 'HIGH',
  };

  beforeEach(async () => {
    wishApiService = {
      getWishes: vi.fn(),
      createWish: vi.fn(),
      updateWish: vi.fn(),
      deleteWish: vi.fn(),
    };

    categoryApiService = {
      getCategories: vi.fn(),
      createCategory: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [WishListPage],
      providers: [
        { provide: WishApiService, useValue: wishApiService },
        { provide: CategoryApiService, useValue: categoryApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WishListPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    wishApiService.getWishes.mockReturnValue(of([]));
    categoryApiService.getCategories.mockReturnValue(of([]));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should load wishes and categories on init', () => {
    wishApiService.getWishes.mockReturnValue(of([wish]));
    categoryApiService.getCategories.mockReturnValue(
      of([{ id: 1, name: 'Books', code: 'books', label: 'Books' }]),
    );

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(wishApiService.getWishes).toHaveBeenCalledTimes(1);
    expect(categoryApiService.getCategories).toHaveBeenCalledTimes(1);
    expect(compiled.textContent).toContain('Kindle');
    expect(compiled.textContent).toContain('Books');
  });

  it('should show error when wishes cannot be loaded', () => {
    wishApiService.getWishes.mockReturnValue(throwError(() => new Error('Failed')));
    categoryApiService.getCategories.mockReturnValue(of([]));

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Could not load wishes');
  });

  it('should disable refresh while wishes are loading', () => {
    const wishes$ = new Subject<WishResponse[]>();

    wishApiService.getWishes.mockReturnValue(wishes$);
    categoryApiService.getCategories.mockReturnValue(of([]));

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const refreshButton = compiled.querySelector<HTMLButtonElement>('header button')!;

    refreshButton.click();

    expect(refreshButton.disabled).toBe(true);
    expect(refreshButton.textContent).toContain('Refreshing...');
    expect(wishApiService.getWishes).toHaveBeenCalledTimes(1);

    wishes$.next([wish]);
    wishes$.complete();
    fixture.detectChanges();

    expect(refreshButton.disabled).toBe(false);
    expect(refreshButton.textContent).toContain('Refresh');
    expect(compiled.textContent).toContain('Kindle');
  });

  it('should create wish and reload wishes', () => {
    const request: WishRequest = {
      wishName: 'Kindle',
      wishPrice: 120,
      url: null,
      categoryId: 1,
      priority: 'HIGH',
    };

    wishApiService.getWishes.mockReturnValue(of([]));
    wishApiService.createWish.mockReturnValue(of(wish));
    categoryApiService.getCategories.mockReturnValue(of([]));

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.directive(WishCreateForm))
      .componentInstance as WishCreateForm;

    form.saveWish.emit(request);

    expect(wishApiService.createWish).toHaveBeenCalledWith(request);
    expect(wishApiService.getWishes).toHaveBeenCalledTimes(2);
  });

  it('should show saving state and ignore duplicate create wish submissions', () => {
    const request: WishRequest = {
      wishName: 'Kindle',
      wishPrice: 120,
      url: null,
      categoryId: 1,
      priority: 'HIGH',
    };
    const createWish$ = new Subject<WishResponse>();

    wishApiService.getWishes.mockReturnValue(of([]));
    wishApiService.createWish.mockReturnValue(createWish$);
    categoryApiService.getCategories.mockReturnValue(of([]));

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.directive(WishCreateForm))
      .componentInstance as WishCreateForm;

    form.saveWish.emit(request);
    fixture.detectChanges();

    const formElement = fixture.debugElement.query(By.directive(WishCreateForm)).nativeElement as HTMLElement;
    const button = formElement.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    form.saveWish.emit(request);

    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Creating wish...');
    expect(wishApiService.createWish).toHaveBeenCalledTimes(1);

    createWish$.next(wish);
    createWish$.complete();
    fixture.detectChanges();

    const updatedButton = formElement.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(updatedButton.textContent).toContain('Create wish');
  });

  it('should create category and add it to the wish form categories', () => {
    const request: CategoryRequest = {
      name: 'Games',
      code: 'games',
      label: 'Games',
    };

    wishApiService.getWishes.mockReturnValue(of([]));
    categoryApiService.getCategories.mockReturnValue(of([]));
    categoryApiService.createCategory.mockReturnValue(of({
      id: 2,
      name: 'Games',
      code: 'games',
      label: 'Games',
    }));

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.directive(CategoryCreateForm))
      .componentInstance as CategoryCreateForm;

    form.createCategory.emit(request);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(categoryApiService.createCategory).toHaveBeenCalledWith(request);
    expect(compiled.textContent).toContain('Games');
  });

  it('should show backend validation errors when create category returns bad request', () => {
    const request: CategoryRequest = {
      name: '',
      code: '',
      label: 'Books',
    };

    wishApiService.getWishes.mockReturnValue(of([]));
    categoryApiService.getCategories.mockReturnValue(of([]));
    categoryApiService.createCategory.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 400,
      error: {
        message: 'Validation failed',
        fieldErrors: [
          { field: 'name', message: 'Category name is required' },
          { field: 'code', message: 'Category code is required' },
        ],
      },
    })));

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.directive(CategoryCreateForm))
      .componentInstance as CategoryCreateForm;

    form.createCategory.emit(request);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Category name is required');
    expect(compiled.textContent).toContain('Category code is required');
    expect(compiled.textContent).not.toContain('Could not create category');
  });

  it('should show category error message when create category fails without validation errors', () => {
    const request: CategoryRequest = {
      name: 'Books',
      code: 'books',
      label: 'Books',
    };

    wishApiService.getWishes.mockReturnValue(of([]));
    categoryApiService.getCategories.mockReturnValue(of([]));
    categoryApiService.createCategory.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 409,
      error: {
        message: 'Category with code books already exists',
        fieldErrors: [],
      },
    })));

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.directive(CategoryCreateForm))
      .componentInstance as CategoryCreateForm;

    form.createCategory.emit(request);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Category with code books already exists');
  });

  it('should show backend validation errors when create wish returns bad request', () => {
    const request: WishRequest = {
      wishName: '',
      wishPrice: 120,
      url: null,
      categoryId: 1,
      priority: 'HIGH',
    };

    wishApiService.getWishes.mockReturnValue(of([]));
    wishApiService.createWish.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 400,
      error: {
        message: 'Validation failed',
        fieldErrors: [
          { field: 'wishName', message: 'Wish name is required' },
        ],
      },
    })));
    categoryApiService.getCategories.mockReturnValue(
      of([{ id: 1, name: 'Books', code: 'books', label: 'Books' }]),
    );

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.directive(WishCreateForm))
      .componentInstance as WishCreateForm;

    form.saveWish.emit(request);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Wish name is required');
    expect(compiled.textContent).not.toContain('Could not create wish');
  });

  it('should show generic create error when create wish fails without validation errors', () => {
    const request: WishRequest = {
      wishName: 'Kindle',
      wishPrice: 120,
      url: null,
      categoryId: 1,
      priority: 'HIGH',
    };

    wishApiService.getWishes.mockReturnValue(of([]));
    wishApiService.createWish.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 500,
    })));
    categoryApiService.getCategories.mockReturnValue(of([]));

    fixture.detectChanges();

    const form = fixture.debugElement.query(By.directive(WishCreateForm))
      .componentInstance as WishCreateForm;

    form.saveWish.emit(request);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Could not create wish');
  });

  it('should delete wish and remove it from the list', () => {
    wishApiService.getWishes.mockReturnValue(of([wish]));
    wishApiService.deleteWish.mockReturnValue(of(undefined));
    categoryApiService.getCategories.mockReturnValue(of([]));

    fixture.detectChanges();

    const card = fixture.debugElement.query(By.directive(WishCard))
      .componentInstance as WishCard;

    card.deleteWish.emit(1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(wishApiService.deleteWish).toHaveBeenCalledWith(1);
    expect(compiled.textContent).not.toContain('Kindle');
  });

  it('should show deleting state for the selected wish and ignore duplicate delete requests', () => {
    const secondWish: WishResponse = {
      id: 2,
      wishName: 'Notebook',
      wishPrice: 20,
      url: null,
      status: 'ACTIVE',
      categoryId: 1,
      categoryName: 'Books',
      priority: 'LOW',
    };
    const deleteWish$ = new Subject<void>();

    wishApiService.getWishes.mockReturnValue(of([wish, secondWish]));
    wishApiService.deleteWish.mockReturnValue(deleteWish$);
    categoryApiService.getCategories.mockReturnValue(of([]));

    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.directive(WishCard));
    const firstCard = cards[0].componentInstance as WishCard;

    firstCard.deleteWish.emit(1);
    fixture.detectChanges();

    const firstCardElement = cards[0].nativeElement as HTMLElement;
    const secondCardElement = cards[1].nativeElement as HTMLElement;
    const firstDeleteButton = firstCardElement.querySelector<HTMLButtonElement>('button')!;
    const secondDeleteButton = secondCardElement.querySelector<HTMLButtonElement>('button')!;

    firstCard.deleteWish.emit(1);

    expect(firstDeleteButton.disabled).toBe(true);
    expect(firstDeleteButton.textContent).toContain('Deleting...');
    expect(secondDeleteButton.disabled).toBe(false);
    expect(wishApiService.deleteWish).toHaveBeenCalledTimes(1);

    deleteWish$.next();
    deleteWish$.complete();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Kindle');
    expect(compiled.textContent).toContain('Notebook');
  });

  it('should clear deleting state when delete wish fails', () => {
    const deleteWish$ = new Subject<void>();

    wishApiService.getWishes.mockReturnValue(of([wish]));
    wishApiService.deleteWish.mockReturnValue(deleteWish$);
    categoryApiService.getCategories.mockReturnValue(of([]));

    fixture.detectChanges();

    const card = fixture.debugElement.query(By.directive(WishCard))
      .componentInstance as WishCard;

    card.deleteWish.emit(1);
    fixture.detectChanges();

    deleteWish$.error(new Error('Failed'));
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.directive(WishCard)).nativeElement as HTMLElement;
    const deleteButton = cardElement.querySelector<HTMLButtonElement>('button')!;
    const compiled = fixture.nativeElement as HTMLElement;

    expect(deleteButton.disabled).toBe(false);
    expect(deleteButton.textContent).toContain('Delete');
    expect(compiled.textContent).toContain('Could not delete wish');
  });

  it('should show generic delete error when delete wish fails', () => {
    wishApiService.getWishes.mockReturnValue(of([wish]));
    wishApiService.deleteWish.mockReturnValue(throwError(() => new Error('Failed')));
    categoryApiService.getCategories.mockReturnValue(of([]));

    fixture.detectChanges();

    const card = fixture.debugElement.query(By.directive(WishCard))
      .componentInstance as WishCard;

    card.deleteWish.emit(1);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(wishApiService.deleteWish).toHaveBeenCalledWith(1);
    expect(compiled.textContent).toContain('Could not delete wish');
  });

  it('should start editing when wish card emits edit wish', async () => {
    wishApiService.getWishes.mockReturnValue(of([wish]));
    categoryApiService.getCategories.mockReturnValue(
      of([{ id: 1, name: 'Books', code: 'books', label: 'Books' }]),
    );

    fixture.detectChanges();

    const card = fixture.debugElement.query(By.directive(WishCard))
      .componentInstance as WishCard;

    card.editWish.emit(wish);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const formElement = fixture.debugElement.query(By.directive(WishCreateForm)).nativeElement as HTMLElement;
    const button = formElement.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    expect(compiled.querySelector<HTMLInputElement>('#wishName')?.value).toBe('Kindle');
    expect(button.textContent).toContain('Update wish');
  });

  it('should update wish and replace it in the list', () => {
    const request: WishRequest = {
      wishName: 'Kobo',
      wishPrice: 150,
      url: null,
      categoryId: 1,
      priority: 'MEDIUM',
    };
    const updatedWish: WishResponse = {
      ...wish,
      wishName: 'Kobo',
      wishPrice: 150,
      priority: 'MEDIUM',
    };

    wishApiService.getWishes.mockReturnValue(of([wish]));
    wishApiService.updateWish.mockReturnValue(of(updatedWish));
    categoryApiService.getCategories.mockReturnValue(
      of([{ id: 1, name: 'Books', code: 'books', label: 'Books' }]),
    );

    fixture.detectChanges();

    const card = fixture.debugElement.query(By.directive(WishCard))
      .componentInstance as WishCard;
    card.editWish.emit(wish);
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.directive(WishCreateForm))
      .componentInstance as WishCreateForm;
    form.saveWish.emit(request);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const formElement = fixture.debugElement.query(By.directive(WishCreateForm)).nativeElement as HTMLElement;
    const button = formElement.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    expect(wishApiService.updateWish).toHaveBeenCalledWith(1, request);
    expect(compiled.textContent).toContain('Kobo');
    expect(button.textContent).toContain('Create wish');
  });

  it('should show saving state and ignore duplicate update wish submissions', async () => {
    const request: WishRequest = {
      wishName: 'Kobo',
      wishPrice: 150,
      url: null,
      categoryId: 1,
      priority: 'MEDIUM',
    };
    const updatedWish: WishResponse = {
      ...wish,
      wishName: 'Kobo',
      wishPrice: 150,
      priority: 'MEDIUM',
    };
    const updateWish$ = new Subject<WishResponse>();

    wishApiService.getWishes.mockReturnValue(of([wish]));
    wishApiService.updateWish.mockReturnValue(updateWish$);
    categoryApiService.getCategories.mockReturnValue(
      of([{ id: 1, name: 'Books', code: 'books', label: 'Books' }]),
    );

    fixture.detectChanges();

    const card = fixture.debugElement.query(By.directive(WishCard))
      .componentInstance as WishCard;
    card.editWish.emit(wish);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.directive(WishCreateForm))
      .componentInstance as WishCreateForm;
    form.saveWish.emit(request);
    fixture.detectChanges();

    const formElement = fixture.debugElement.query(By.directive(WishCreateForm)).nativeElement as HTMLElement;
    const button = formElement.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    form.saveWish.emit(request);

    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Updating wish...');
    expect(wishApiService.updateWish).toHaveBeenCalledTimes(1);

    updateWish$.next(updatedWish);
    updateWish$.complete();
    fixture.detectChanges();

    const updatedButton = formElement.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const compiled = fixture.nativeElement as HTMLElement;

    expect(updatedButton.textContent).toContain('Create wish');
    expect(compiled.textContent).toContain('Kobo');
  });

  it('should show generic update error when update wish fails', () => {
    const request: WishRequest = {
      wishName: 'Kobo',
      wishPrice: 150,
      url: null,
      categoryId: 1,
      priority: 'MEDIUM',
    };

    wishApiService.getWishes.mockReturnValue(of([wish]));
    wishApiService.updateWish.mockReturnValue(throwError(() => new Error('Failed')));
    categoryApiService.getCategories.mockReturnValue(of([]));

    fixture.detectChanges();

    const card = fixture.debugElement.query(By.directive(WishCard))
      .componentInstance as WishCard;
    card.editWish.emit(wish);
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.directive(WishCreateForm))
      .componentInstance as WishCreateForm;
    form.saveWish.emit(request);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(wishApiService.updateWish).toHaveBeenCalledWith(1, request);
    expect(compiled.textContent).toContain('Could not update wish');
  });
});
