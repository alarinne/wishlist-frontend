import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryRequest } from '../../../../core/models/category.model';
import { CategoryCreateForm } from './category-create-form';

describe('CategoryCreateForm', () => {
  let component: CategoryCreateForm;
  let fixture: ComponentFixture<CategoryCreateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCreateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCreateForm);
    fixture.detectChanges();

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit category request when form is valid', async () => {
    let emittedRequest: CategoryRequest | undefined;

    component.createCategory.subscribe((request) => {
      emittedRequest = request;
    });

    const compiled = fixture.nativeElement as HTMLElement;

    const nameInput = compiled.querySelector<HTMLInputElement>('#categoryName')!;
    nameInput.value = 'Books';
    nameInput.dispatchEvent(new Event('input'));

    const codeInput = compiled.querySelector<HTMLInputElement>('#categoryCode')!;
    codeInput.value = 'books';
    codeInput.dispatchEvent(new Event('input'));

    const labelInput = compiled.querySelector<HTMLInputElement>('#categoryLabel')!;
    labelInput.value = 'Books';
    labelInput.dispatchEvent(new Event('input'));

    await fixture.whenStable();
    fixture.detectChanges();

    const form = compiled.querySelector<HTMLFormElement>('form')!;
    form.dispatchEvent(new Event('submit'));

    expect(emittedRequest).toEqual({
      name: 'Books',
      code: 'books',
      label: 'Books',
    });
  });

  it('should render field errors', () => {
    fixture.componentRef.setInput('fieldErrors', {
      name: 'Category name is required',
      code: 'Category code is required',
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Category name is required');
    expect(compiled.textContent).toContain('Category code is required');
  });

  it('should reset fields when reset key changes', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nameInput = compiled.querySelector<HTMLInputElement>('#categoryName')!;
    const codeInput = compiled.querySelector<HTMLInputElement>('#categoryCode')!;
    const labelInput = compiled.querySelector<HTMLInputElement>('#categoryLabel')!;

    nameInput.value = 'Books';
    nameInput.dispatchEvent(new Event('input'));
    codeInput.value = 'books';
    codeInput.dispatchEvent(new Event('input'));
    labelInput.value = 'Books';
    labelInput.dispatchEvent(new Event('input'));

    await fixture.whenStable();

    fixture.componentRef.setInput('resetKey', 1);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(nameInput.value).toBe('');
    expect(codeInput.value).toBe('');
    expect(labelInput.value).toBe('');
  });
});
