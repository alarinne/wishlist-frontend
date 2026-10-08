import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { WishResponse, WishStatus } from '../models/wish.model';
import { WishApiService } from './wish-api.service';

describe('WishApiService status updates', () => {
  let service: WishApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WishApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it.each<WishStatus>(['ACTIVE', 'PURCHASED'])('should PATCH the named status %s and return the server wish', (status) => {
    const updatedWish: WishResponse = {
      id: 7, wishName: 'Kindle', wishPrice: 120, url: null, status,
      categoryId: 1, categoryName: 'Books', priority: 'HIGH',
    };
    let response: WishResponse | undefined;

    service.updateWishStatus(7, { status }).subscribe((wish) => response = wish);

    const request = http.expectOne(`${environment.apiBaseUrl}/api/wishes/7/status`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ status });
    request.flush(updatedWish);
    expect(response).toEqual(updatedWish);
  });

  it('should forward HTTP errors to the caller', () => {
    const onError = vi.fn();
    service.updateWishStatus(7, { status: 'PURCHASED' }).subscribe({ error: onError });
    http.expectOne(`${environment.apiBaseUrl}/api/wishes/7/status`)
      .flush({ message: 'Wish not found', fieldErrors: [] }, { status: 404, statusText: 'Not Found' });

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
  });
});
