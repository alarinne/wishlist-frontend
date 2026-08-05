import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { WishRequest, WishResponse } from '../models/wish.model';

@Injectable({
  providedIn: 'root',
})
export class WishApiService {
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  private readonly wishesUrl = `${this.apiBaseUrl}/api/wishes`;

  constructor(private readonly http: HttpClient) {}

  getWishes() {
    return this.http.get<WishResponse[]>(this.wishesUrl);
  }

  getWishById(id: number) {
    return this.http.get<WishResponse>(`${this.wishesUrl}/${id}`);
  }

  createWish(request: WishRequest) {
    return this.http.post<WishResponse>(this.wishesUrl, request);
  }

  updateWish(id: number, request: WishRequest) {
    return this.http.put<WishResponse>(`${this.wishesUrl}/${id}`, request);
  }

  deleteWish(id: number) {
    return this.http.delete<void>(`${this.wishesUrl}/${id}`);
  }
}
