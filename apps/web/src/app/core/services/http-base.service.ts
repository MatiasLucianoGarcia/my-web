import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Base HTTP service — provides the HttpClient and base API URL.
 * Feature services should inject this instead of HttpClient directly.
 */
@Injectable({ providedIn: 'root' })
export class HttpBaseService {
  readonly http = inject(HttpClient);
  readonly apiUrl = environment.apiUrl;
}
