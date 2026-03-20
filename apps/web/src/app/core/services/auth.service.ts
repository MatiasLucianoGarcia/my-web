import { inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import type { AuthTokenDto, UserDto } from '@my-web/shared';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentUser = signal<UserDto | null>(null);
  readonly isAuthenticated = signal(false);

  private _accessToken: string | null = null;

  get accessToken(): string | null {
    return this._accessToken;
  }

  setTokens(token: string, user: UserDto): void {
    this._accessToken = token;
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<{ success: boolean; data: AuthTokenDto }>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this.setTokens(res.data.accessToken, res.data.user);
          }
        }),
      );
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe();
    this._accessToken = null;
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('user');
    }
    void this.router.navigate(['/admin/login']);
  }

  refreshToken() {
    return this.http
      .post<{ success: boolean; data: { accessToken: string } }>(
        `${environment.apiUrl}/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .pipe(
        tap((res) => {
          if (res.success && res.data) {
            this._accessToken = res.data.accessToken;
            this.isAuthenticated.set(true);
          }
        }),
      );
  }

  restoreSession(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr) as UserDto;
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch {
        sessionStorage.removeItem('user');
      }
    }
  }
}
