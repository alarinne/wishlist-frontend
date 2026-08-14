import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishCreateForm } from './wish-create-form';

describe('WishCreateForm', () => {
  let component: WishCreateForm;
  let fixture: ComponentFixture<WishCreateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishCreateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(WishCreateForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
