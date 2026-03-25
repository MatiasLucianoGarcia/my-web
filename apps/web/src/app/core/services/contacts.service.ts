import { inject, Injectable } from '@angular/core';
import { HttpBaseService } from './http-base.service';
import type {
  ContactDto,
  CreateContactDto,
  ApiResponse,
} from '@my-web/shared';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private readonly base = inject(HttpBaseService);
  private readonly url = `${this.base.apiUrl}/contacts`;

  send(data: CreateContactDto) {
    return this.base.http.post<ApiResponse>(this.url, data);
  }

  getAll() {
    return this.base.http.get<ApiResponse<ContactDto[]>>(this.url);
  }

  markAsRead(id: string) {
    return this.base.http.put<ApiResponse>(`${this.url}/${id}/read`, {});
  }
}
