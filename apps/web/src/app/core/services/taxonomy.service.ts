import { inject, Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import type { CategoryDto, TagDto, ApiResponse } from '@my-web/shared';

@Injectable({ providedIn: 'root' })
export class TaxonomyService {
  private readonly base = inject(HttpBaseService);
  private readonly url = `${this.base.apiUrl}/taxonomy`;

  getTags() {
    return this.base.http.get<ApiResponse<TagDto[]>>(`${this.url}/tags`);
  }

  getCategories() {
    return this.base.http.get<ApiResponse<CategoryDto[]>>(`${this.url}/categories`);
  }
}
