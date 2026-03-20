import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-bg-base">
      <div class="w-full max-w-md px-4">
        <!-- Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2">
            <span class="text-accent font-mono text-2xl font-bold">MG</span>
          </a>
          <h1 class="text-display-sm text-text-primary mt-4 mb-1">Admin Login</h1>
          <p class="text-text-muted text-sm">Sign in to manage your content</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="card p-8 space-y-5">
          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2" for="email">Email</label>
            <input
              id="email"
              type="email"
              class="input"
              formControlName="email"
              placeholder="admin@yourdomain.com"
              autocomplete="email"
            />
          </div>

          <div>
            <label class="block text-text-secondary text-sm font-medium mb-2" for="password">Password</label>
            <div class="relative">
              <input
                id="password"
                [type]="showPassword() ? 'text' : 'password'"
                class="input pr-10"
                formControlName="password"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                (click)="showPassword.update(v => !v)"
              >
                {{ showPassword() ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          @if (error()) {
            <div class="bg-error/10 border border-error/20 rounded-lg p-3 text-error text-sm">
              {{ error() }}
            </div>
          }

          <button
            type="submit"
            class="btn btn-primary w-full py-3"
            [disabled]="loading()"
          >
            @if (loading()) {
              <span class="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
              Signing in...
            } @else {
              Sign in →
            }
          </button>
        </form>

        <p class="text-center text-text-muted text-xs mt-6">
          <a routerLink="/" class="hover:text-accent transition-colors">← Back to site</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => {
        void this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Invalid credentials');
        this.loading.set(false);
      },
    });
  }
}
