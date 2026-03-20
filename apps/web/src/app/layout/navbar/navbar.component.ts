import { Component, inject, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="fixed top-0 left-0 right-0 z-navbar transition-all duration-300"
      [class.header-scrolled]="scrolled()"
    >
      <nav class="container flex items-center justify-between h-16">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2 group">
          <span class="text-accent font-mono text-xl font-bold tracking-tighter group-hover:text-accent-hover transition-colors">
            MG
          </span>
          <span class="hidden sm:block text-text-primary font-display font-semibold text-sm opacity-70 group-hover:opacity-100 transition-opacity">
            matias garcia
          </span>
        </a>

        <!-- Desktop Nav -->
        <ul class="hidden md:flex items-center gap-1">
          @for (link of navLinks; track link.path) {
            <li>
              <a
                [routerLink]="link.path"
                routerLinkActive="nav-link-active"
                [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                class="nav-link"
              >{{ link.label }}</a>
            </li>
          }
        </ul>

        <!-- CTA + Hamburger -->
        <div class="flex items-center gap-3">
          <a routerLink="/contact" class="btn btn-primary hidden sm:inline-flex text-sm py-2 px-4">
            Hire me
          </a>
          <button
            class="md:hidden flex flex-col gap-1.5 p-2 rounded-md hover:bg-bg-muted transition-colors"
            (click)="toggleMenu()"
            [attr.aria-expanded]="mobileOpen()"
            aria-label="Toggle navigation"
          >
            <span class="block w-5 h-0.5 bg-text-primary transition-all" [class.rotate-45]="mobileOpen()" [class.translate-y-2]="mobileOpen()"></span>
            <span class="block w-5 h-0.5 bg-text-primary transition-all" [class.opacity-0]="mobileOpen()"></span>
            <span class="block w-5 h-0.5 bg-text-primary transition-all" [class.-rotate-45]="mobileOpen()" [class.-translate-y-2]="mobileOpen()"></span>
          </button>
        </div>
      </nav>

      <!-- Mobile Menu -->
      @if (mobileOpen()) {
        <div class="md:hidden border-t border-border bg-bg-elevated/95 backdrop-blur-glass animate-fade-in">
          <ul class="container py-4 flex flex-col gap-1">
            @for (link of navLinks; track link.path) {
              <li>
                <a
                  [routerLink]="link.path"
                  routerLinkActive="nav-link-active"
                  [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                  class="nav-link block py-3"
                  (click)="mobileOpen.set(false)"
                >{{ link.label }}</a>
              </li>
            }
            <li class="pt-2">
              <a routerLink="/contact" class="btn btn-primary w-full" (click)="mobileOpen.set(false)">
                Hire me
              </a>
            </li>
          </ul>
        </div>
      }
    </header>
  `,
  styles: [`
    .header-scrolled {
      background: rgba(10, 10, 15, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
    }

    .nav-link {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
      transition: all var(--transition-fast);
    }

    .nav-link:hover, .nav-link-active {
      color: var(--color-text-primary);
      background: var(--color-bg-muted);
    }

    .nav-link-active {
      color: var(--color-accent-hover) !important;
    }
  `],
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly scrolled = signal(false);
  protected readonly mobileOpen = signal(false);

  protected readonly navLinks: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Lab', path: '/lab' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }

  protected toggleMenu(): void {
    this.mobileOpen.update((v) => !v);
  }
}
