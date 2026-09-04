import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishRequest } from '../../../../core/models/wish.model';
import { WishCreateForm } from './wish-create-form';

describe('WishCreateForm', () => {
  let component: WishCreateForm;
  let fixture: ComponentFixture<WishCreateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishCreateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(WishCreateForm);
    fixture.componentRef.setInput('categories', [
      { id: 1, name: 'Books', code: 'books', label: 'Books' },
    ]);
    fixture.detectChanges();

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit wish request when form is valid', async () => {
    let emittedRequest: WishRequest | undefined;

    component.saveWish.subscribe((request) => {
      emittedRequest = request;
    });

    const compiled = fixture.nativeElement as HTMLElement;

    const nameInput = compiled.querySelector<HTMLInputElement>('#wishName')!;
    nameInput.value = 'Kindle';
    nameInput.dispatchEvent(new Event('input'));

    const priceInput = compiled.querySelector<HTMLInputElement>('#wishPrice')!;
    priceInput.value = '120';
    priceInput.dispatchEvent(new Event('input'));

    const categorySelect = compiled.querySelector<HTMLSelectElement>('#categoryId')!;
    categorySelect.value = categorySelect.options[1].value;
    categorySelect.dispatchEvent(new Event('change'));

    await fixture.whenStable();
    fixture.detectChanges();

    const form = compiled.querySelector<HTMLFormElement>('form')!;
    form.dispatchEvent(new Event('submit'));

    expect(emittedRequest).toEqual({
      wishName: 'Kindle',
      wishPrice: 120,
      url: null,
      categoryId: 1,
      priority: 'MEDIUM',
    });
  });

  it('should render field errors', () => {
    fixture.componentRef.setInput('fieldErrors', {
      wishName: 'Wish name is required',
      wishPrice: 'Wish price must be zero or positive',
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Wish name is required');
    expect(compiled.textContent).toContain('Wish price must be zero or positive');
  });

  it('should prefill fields when editing wish is provided', async () => {
    fixture.componentRef.setInput('editingWish', {
      id: 1,
      wishName: 'Kindle',
      wishPrice: 120,
      url: 'https://example.com/kindle',
      status: 'ACTIVE',
      categoryId: 1,
      categoryName: 'Books',
      priority: 'HIGH',
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const nameInput = compiled.querySelector<HTMLInputElement>('#wishName')!;
    const priceInput = compiled.querySelector<HTMLInputElement>('#wishPrice')!;
    const urlInput = compiled.querySelector<HTMLInputElement>('#url')!;
    const categorySelect = compiled.querySelector<HTMLSelectElement>('#categoryId')!;
    const prioritySelect = compiled.querySelector<HTMLSelectElement>('#priority')!;
    const button = compiled.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    expect(nameInput.value).toBe('Kindle');
    expect(priceInput.value).toBe('120');
    expect(urlInput.value).toBe('https://example.com/kindle');
    expect(categorySelect.selectedOptions[0].textContent?.trim()).toBe('Books');
    expect(prioritySelect.selectedOptions[0].textContent?.trim()).toBe('HIGH');
    expect(button.textContent).toContain('Update wish');
  });
});
