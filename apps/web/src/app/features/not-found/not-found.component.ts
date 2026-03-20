import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="container-narrow text-center py-20">
        <div class="font-mono text-accent text-8xl font-black mb-6 leading-none">404</div>
        <h1 class="text-display-sm text-text-primary mb-4">Page not found</h1>
        <p class="text-text-secondary mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="flex flex-wrap gap-3 justify-center">
          <a routerLink="/" class="btn btn-primary">Go home →</a>
          <a routerLink="/blog" class="btn btn-ghost">Read the blog</a>
        </div>
        <!-- ASCII art easter egg -->
        <pre class="text-text-muted/30 text-xs font-mono mt-16 hidden md:block select-none">
  _   _  ___  _  _
 | | | |/ _ \| || |
 | |_| | | | | || |_
 |  _  | |_| |__   _|
 |_| |_|\___/   |_|
        </pre>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
