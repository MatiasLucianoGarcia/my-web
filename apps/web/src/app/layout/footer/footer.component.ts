import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="border-t border-border bg-bg-elevated mt-20">
      <div class="container py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          <!-- Brand -->
          <div>
            <a routerLink="/" class="flex items-center gap-2 mb-3">
              <span class="text-accent font-mono text-xl font-bold">MG</span>
              <span class="font-display font-semibold text-text-primary">matias garcia</span>
            </a>
            <p class="text-text-muted text-sm leading-relaxed">
              Full stack engineer crafting scalable web products with Angular, Node.js, and PostgreSQL.
            </p>
          </div>

          <!-- Navigation -->
          <div>
            <h4 class="text-text-primary font-semibold text-sm mb-4 uppercase tracking-wider">Navigation</h4>
            <ul class="space-y-2">
              @for (link of navLinks; track link.path) {
                <li>
                  <a [routerLink]="link.path" class="text-text-muted hover:text-accent text-sm transition-colors">
                    {{ link.label }}
                  </a>
                </li>
              }
            </ul>
          </div>

          <!-- Social / Contact -->
          <div>
            <h4 class="text-text-primary font-semibold text-sm mb-4 uppercase tracking-wider">Connect</h4>
            <ul class="space-y-2">
              @for (social of socialLinks; track social.label) {
                <li>
                  <a [href]="social.url" target="_blank" rel="noopener noreferrer"
                    class="text-text-muted hover:text-accent text-sm transition-colors flex items-center gap-2">
                    <span>{{ social.label }}</span>
                    <svg class="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                </li>
              }
            </ul>
          </div>
        </div>

        <!-- Bottom -->
        <div class="border-t border-border-muted pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-text-muted text-xs">
            &copy; {{ currentYear }} Matias Garcia. Built with Angular, Express & PostgreSQL.
          </p>
          <a routerLink="/admin/login" class="text-text-muted hover:text-text-secondary text-xs transition-colors">
            Admin
          </a>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();

  protected readonly navLinks = [
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Lab', path: '/lab' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  protected readonly socialLinks = [
    { label: 'GitHub', url: 'https://github.com/matiaslucianogarcia' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/matiaslucianogarcia' },
    { label: 'Twitter / X', url: 'https://x.com/matiaslucianogarcia' },
  ];
}
