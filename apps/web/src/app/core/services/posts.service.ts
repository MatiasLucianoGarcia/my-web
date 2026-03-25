import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { HttpBaseService } from './http-base.service';
import type {
  PostListItemDto,
  PostDto,
  PaginatedResponse,
  CreatePostDto,
  UpdatePostDto,
  PostQueryDto,
  ApiResponse,
} from '@my-web/shared';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly base = inject(HttpBaseService);
  private readonly url = `${this.base.apiUrl}/posts`;

  getAll(query: PostQueryDto = {}) {
    let params = new HttpParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return this.base.http.get<ApiResponse<PaginatedResponse<PostListItemDto>>>(this.url, { params });
  }

  getAllAdmin(query: PostQueryDto = {}) {
    let params = new HttpParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });
    return this.base.http.get<ApiResponse<PaginatedResponse<PostListItemDto>>>(`${this.url}/admin`, { params });
  }

  getBySlug(slug: string) {
    return this.base.http.get<ApiResponse<PostDto>>(`${this.url}/${slug}`);
  }

  create(data: CreatePostDto) {
    return this.base.http.post<ApiResponse<PostDto>>(this.url, data);
  }

  update(id: string, data: UpdatePostDto) {
    return this.base.http.put<ApiResponse<PostDto>>(`${this.url}/${id}`, data);
  }

  delete(id: string) {
    return this.base.http.delete<ApiResponse>(`${this.url}/${id}`);
  }
}
