import { inject, Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import type {
  ExperimentDto,
  CreateExperimentDto,
  UpdateExperimentDto,
  ApiResponse,
} from '@my-web/shared';

@Injectable({ providedIn: 'root' })
export class ExperimentsService {
  private readonly base = inject(HttpBaseService);
  private readonly url = `${this.base.apiUrl}/experiments`;

  getAll() {
    return this.base.http.get<ApiResponse<ExperimentDto[]>>(this.url);
  }

  getBySlug(slug: string) {
    return this.base.http.get<ApiResponse<ExperimentDto>>(`${this.url}/${slug}`);
  }

  create(data: CreateExperimentDto) {
    return this.base.http.post<ApiResponse<ExperimentDto>>(this.url, data);
  }

  update(id: string, data: UpdateExperimentDto) {
    return this.base.http.put<ApiResponse<ExperimentDto>>(`${this.url}/${id}`, data);
  }

  delete(id: string) {
    return this.base.http.delete<ApiResponse>(`${this.url}/${id}`);
  }
}
