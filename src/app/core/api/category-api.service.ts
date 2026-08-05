import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { CategoryRequest, CategoryResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  private readonly categoriesUrl = `${this.apiBaseUrl}/api/categories`;

  constructor(private readonly http: HttpClient) {}

  getCategories() {
    return this.http.get<CategoryResponse[]>(this.categoriesUrl);
  }

  createCategory(request: CategoryRequest) {
    return this.http.post<CategoryResponse>(this.categoriesUrl, request);
  }
}
