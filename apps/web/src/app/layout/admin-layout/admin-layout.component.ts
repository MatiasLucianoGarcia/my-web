import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen flex">
      <!-- Sidebar -->
      <aside class="w-64 flex-shrink-0 bg-bg-elevated border-r border-border flex flex-col">
        <!-- Logo -->
        <div class="h-16 flex items-center px-6 border-b border-border">
          <a routerLink="/" class="flex items-center gap-2">
            <span class="text-accent font-mono font-bold text-xl">MG</span>
            <span class="text-text-muted text-sm">/ Admin</span>
          </a>
        </div>

        <!-- Nav -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="admin-nav-active"
              class="admin-nav-link"
            >
              <span class="text-lg leading-none">{{ item.icon }}</span>
              {{ item.label }}
            </a>
          }
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-border space-y-2">
          <div class="text-xs text-text-muted px-3">
            <p class="font-medium text-text-secondary">{{ authService.currentUser()?.name ?? 'Admin' }}</p>
            <p>{{ authService.currentUser()?.email }}</p>
          </div>
          <button (click)="authService.logout()" class="admin-nav-link w-full text-error hover:text-error hover:bg-error/10">
            <span class="text-lg leading-none">🚪</span>
            Sign out
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 min-w-0 overflow-auto bg-bg-base">
        <!-- Top bar -->
        <header class="h-16 border-b border-border bg-bg-elevated/50 backdrop-blur-sm flex items-center px-6 sticky top-0 z-10">
          <h1 class="font-display font-semibold text-text-primary text-sm">Admin Panel</h1>
          <div class="ml-auto flex items-center gap-3">
            <a routerLink="/" target="_blank" class="btn btn-ghost text-xs py-1.5 px-3">
              View site ↗
            </a>
          </div>
        </header>
        <div class="p-6">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styles: [`
    .admin-nav-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      transition: all var(--transition-fast);
      text-decoration: none;
    }
    .admin-nav-link:hover { background: var(--color-bg-muted); color: var(--color-text-primary); }
    .admin-nav-active { background: rgba(124,108,245,0.12) !important; color: var(--color-accent-hover) !important; }
  `],
})
export class AdminLayoutComponent {
  protected readonly authService = inject(AuthService);

  protected readonly navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Posts', path: '/admin/posts', icon: '📝' },
    { label: 'Projects', path: '/admin/projects', icon: '🚀' },
    { label: 'Experiments', path: '/admin/experiments', icon: '🧪' },
    { label: 'Experiences', path: '/admin/experiences', icon: '💼' },
    { label: 'Messages', path: '/admin/messages', icon: '📬' },
  ];
}
