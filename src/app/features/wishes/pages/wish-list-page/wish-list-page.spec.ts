import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListPage } from './wish-list-page';

describe('WishListPage', () => {
  let component: WishListPage;
  let fixture: ComponentFixture<WishListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishListPage],
    }).compileComponents();

    fixture = TestBed.createComponent(WishListPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
