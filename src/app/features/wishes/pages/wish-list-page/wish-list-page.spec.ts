import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { CategoryApiService } from '../../../../core/api/category-api.service';
import { WishApiService } from '../../../../core/api/wish-api.service';
import { WishRequest, WishResponse } from '../../../../core/models/wish.model';
import { WishCreateForm } from '../../components/wish-create-form/wish-create-form';
import { WishListPage } from './wish-list-page';

describe('WishListPage', () => {
  let component: WishListPage;
  let fixture: ComponentFixture<WishListPage>;
  let wishApiService: {
    getWishes: ReturnType<typeof vi.fn>;
    createWish: ReturnType<typeof vi.fn>;
  };
  let categoryApiService: {
    getCategories: ReturnType<typeof vi.fn>;
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
    };

    categoryApiService = {
      getCategories: vi.fn(),
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

    form.createWish.emit(request);

    expect(wishApiService.createWish).toHaveBeenCalledWith(request);
    expect(wishApiService.getWishes).toHaveBeenCalledTimes(2);
  });
});
