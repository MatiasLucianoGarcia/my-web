import { inject, Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import type {
  ExperienceDto,
  CreateExperienceDto,
  UpdateExperienceDto,
  ApiResponse,
} from '@my-web/shared';

@Injectable({ providedIn: 'root' })
export class ExperiencesService {
  private readonly base = inject(HttpBaseService);
  private readonly url = `${this.base.apiUrl}/experiences`;

  getAll() {
    return this.base.http.get<ApiResponse<ExperienceDto[]>>(this.url);
  }

  create(data: CreateExperienceDto) {
    return this.base.http.post<ApiResponse<ExperienceDto>>(this.url, data);
  }

  update(id: string, data: UpdateExperienceDto) {
    return this.base.http.put<ApiResponse<ExperienceDto>>(`${this.url}/${id}`, data);
  }

  delete(id: string) {
    return this.base.http.delete<ApiResponse>(`${this.url}/${id}`);
  }
}
