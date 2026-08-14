import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishCard } from './wish-card';

describe('WishCard', () => {
  let component: WishCard;
  let fixture: ComponentFixture<WishCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishCard],
    }).compileComponents();

    fixture = TestBed.createComponent(WishCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
