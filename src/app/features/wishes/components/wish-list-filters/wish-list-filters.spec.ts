import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishStatusFilter } from '../../models/wish-status-filter.model';
import { WishListFilters } from './wish-list-filters';

describe('WishListFilters', () => {
  let fixture: ComponentFixture<WishListFilters>;
  let component: WishListFilters;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [WishListFilters] }).compileComponents();
    fixture = TestBed.createComponent(WishListFilters);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.componentRef.setInput('categories', [
      { id: 7, name: 'Books', code: 'books', label: 'Books' },
      { id: 12, name: 'Games', code: 'games', label: 'Games' },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should default to All and All categories with reset disabled', () => {
    expect(element.querySelector<HTMLInputElement>('input[value="ALL"]')!.checked).toBe(true);
    expect(element.querySelector<HTMLOptionElement>('option:checked')!.textContent).toContain('All categories');
    expect(element.querySelector<HTMLButtonElement>('button')!.disabled).toBe(true);
    expect(element.querySelector('legend')!.textContent).toBe('Status');
    expect(element.querySelector('label[for="wish-category-filter"]')!.textContent).toBe('Category');
  });

  it.each(['ALL', 'ACTIVE', 'PURCHASED'] as const)('should emit typed status %s without mutating the input', (status) => {
    const emit = vi.fn();
    component.statusChange.subscribe(emit);
    element.querySelector<HTMLInputElement>(`input[value="${status}"]`)!.dispatchEvent(new Event('change'));
    expect(emit).toHaveBeenCalledWith(status);
    expect(component.status()).toBe('ALL');
  });

  it('should emit numeric category IDs and null for All categories without changing inputs', () => {
    const emit = vi.fn();
    component.categoryChange.subscribe(emit);
    const select = element.querySelector<HTMLSelectElement>('select')!;
    select.selectedIndex = 2;
    select.dispatchEvent(new Event('change'));
    expect(emit).toHaveBeenLastCalledWith(12);
    select.selectedIndex = 0;
    select.dispatchEvent(new Event('change'));
    expect(emit).toHaveBeenLastCalledWith(null);
    expect(component.categoryId()).toBeNull();
  });

  it.each([
    ['ACTIVE', null], ['ALL', 7], ['PURCHASED', 12],
  ] as const)('should reflect parent selection %s/%s and emit reset without clearing inputs', async (status: WishStatusFilter, categoryId) => {
    fixture.componentRef.setInput('status', status);
    fixture.componentRef.setInput('categoryId', categoryId);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.querySelector<HTMLInputElement>(`input[value="${status}"]`)!.checked).toBe(true);
    const emit = vi.fn();
    component.resetFilters.subscribe(emit);
    const reset = element.querySelector<HTMLButtonElement>('button')!;
    expect(reset.disabled).toBe(false);
    reset.click();
    expect(emit).toHaveBeenCalledTimes(1);
    expect(component.status()).toBe(status);
    expect(component.categoryId()).toBe(categoryId);
  });

  it('should keep All categories available with no loaded categories', async () => {
    fixture.componentRef.setInput('categories', []);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.querySelectorAll('option')).toHaveLength(1);
    expect(element.querySelector<HTMLSelectElement>('select')!.disabled).toBe(false);
  });

  it('should render category labels as text rather than HTML', () => {
    const label = '<img src=x onerror=alert(1)>';
    fixture.componentRef.setInput('categories', [{ id: 7, name: 'Books', code: 'books', label }]);
    fixture.detectChanges();
    expect(element.querySelectorAll('option')[1].textContent).toBe(label);
    expect(element.querySelector('img')).toBeNull();
  });
});
