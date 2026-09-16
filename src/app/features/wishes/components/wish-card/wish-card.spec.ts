import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishResponse } from '../../../../core/models/wish.model';
import { WishCard } from './wish-card';

describe('WishCard', () => {
  let component: WishCard;
  let fixture: ComponentFixture<WishCard>;

  const wish: WishResponse = {
    id: 1,
    wishName: 'Kindle',
    wishPrice: 120,
    url: 'https://example.com/kindle',
    status: 'ACTIVE',
    categoryId: 1,
    categoryName: 'Books',
    priority: 'HIGH',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishCard],
    }).compileComponents();

    fixture = TestBed.createComponent(WishCard);
    fixture.componentRef.setInput('wish', wish);
    fixture.detectChanges();

    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render wish details', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Kindle');
    expect(compiled.textContent).toContain('Books');
    expect(compiled.textContent).toContain('120');
    expect(compiled.textContent).toContain('HIGH');
    expect(compiled.textContent).toContain('ACTIVE');
  });

  it('should render wish link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a');

    expect(link?.getAttribute('href')).toBe('https://example.com/kindle');
  });

  it('should emit wish id when delete button is clicked', () => {
    let deletedWishId: number | undefined;
    component.deleteWish.subscribe((id) => {
      deletedWishId = id;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button')!;
    button.click();

    expect(deletedWishId).toBe(1);
  });

  it('should emit wish when edit button is clicked', () => {
    let editedWish: WishResponse | undefined;
    component.editWish.subscribe((selectedWish) => {
      editedWish = selectedWish;
    });

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    buttons[1].click();

    expect(editedWish).toEqual(wish);
  });

  it('should disable actions and show deleting label when wish is deleting', () => {
    fixture.componentRef.setInput('isDeleting', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');

    expect(buttons[0].disabled).toBe(true);
    expect(buttons[0].textContent).toContain('Deleting...');
    expect(buttons[1].disabled).toBe(true);
  });

  it('should not emit actions when actions are disabled', () => {
    let deletedWishId: number | undefined;
    let editedWish: WishResponse | undefined;

    component.deleteWish.subscribe((id) => {
      deletedWishId = id;
    });
    component.editWish.subscribe((selectedWish) => {
      editedWish = selectedWish;
    });

    fixture.componentRef.setInput('actionsDisabled', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    buttons[0].click();
    buttons[1].click();

    expect(deletedWishId).toBeUndefined();
    expect(editedWish).toBeUndefined();
  });
});
