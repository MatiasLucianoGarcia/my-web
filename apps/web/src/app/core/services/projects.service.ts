import { inject, Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import type {
  ProjectDto,
  CreateProjectDto,
  UpdateProjectDto,
  ApiResponse,
} from '@my-web/shared';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly base = inject(HttpBaseService);
  private readonly url = `${this.base.apiUrl}/projects`;

  getAll() {
    return this.base.http.get<ApiResponse<ProjectDto[]>>(this.url);
  }

  getBySlug(slug: string) {
    return this.base.http.get<ApiResponse<ProjectDto>>(`${this.url}/${slug}`);
  }

  create(data: CreateProjectDto) {
    return this.base.http.post<ApiResponse<ProjectDto>>(this.url, data);
  }

  update(id: string, data: UpdateProjectDto) {
    return this.base.http.put<ApiResponse<ProjectDto>>(`${this.url}/${id}`, data);
  }

  delete(id: string) {
    return this.base.http.delete<ApiResponse>(`${this.url}/${id}`);
  }
}
