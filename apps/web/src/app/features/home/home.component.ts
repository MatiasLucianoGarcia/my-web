import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import type { PostListItemDto, ProjectDto } from '@my-web/shared';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, DatePipe],
  template: `
    <!-- HERO ───────────────────────────────────────────── -->
    <section class="relative min-h-screen flex items-center noise overflow-hidden">
      <!-- Background gradient blobs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-gradient-shift"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-gradient-shift delay-500"></div>
      </div>

      <div class="container relative z-10">
        <div class="max-w-4xl">
          <!-- Status Badge -->
          <div class="inline-flex items-center gap-2 badge badge-accent mb-8 animate-fade-up">
            <span class="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            Available for new opportunities
          </div>

          <!-- Headline -->
          <h1 class="text-display-xl mb-6 animate-fade-up delay-100">
            <span class="block text-text-primary">Full Stack</span>
            <span class="block text-gradient">Engineer</span>
          </h1>

          <p class="text-xl text-text-secondary mb-8 max-w-2xl leading-relaxed animate-fade-up delay-200">
            I build scalable web products with Angular, Node.js & PostgreSQL.
            Passionate about clean architecture, great DX, and meaningful user experiences.
          </p>

          <!-- CTAs -->
          <div class="flex flex-wrap gap-4 mb-16 animate-fade-up delay-300">
            <a routerLink="/projects" class="btn btn-primary text-base px-6 py-3">
              View my work
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </a>
            <a routerLink="/about" class="btn btn-ghost text-base px-6 py-3">
              About me
            </a>
          </div>

          <!-- Tech stack chips -->
          <div class="flex flex-wrap gap-2 animate-fade-up delay-400">
            @for (tech of techStack; track tech) {
              <span class="badge badge-muted font-mono text-xs">{{ tech }}</span>
            }
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted animate-bounce">
        <span class="text-xs font-mono">scroll</span>
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </section>

    <!-- FEATURED PROJECTS ──────────────────────────────── -->
    <section class="section">
      <div class="container">
        <div class="flex items-end justify-between mb-12">
          <div>
            <div class="divider mb-4"></div>
            <h2 class="text-display-sm text-text-primary">Selected Work</h2>
            <p class="text-text-secondary mt-2">Projects I'm proud of building</p>
          </div>
          <a routerLink="/projects" class="btn btn-ghost hidden sm:inline-flex">
            All projects →
          </a>
        </div>

        @if (loadingProjects()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3]; track i) {
              <div class="skeleton h-64 rounded-card"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (project of featuredProjects(); track project.id) {
              <a [routerLink]="['/projects', project.slug]" class="card p-6 block group">
                <div class="flex items-start justify-between mb-4">
                  <div class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <svg class="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                    </svg>
                  </div>
                  @if (project.liveUrl) {
                    <span class="badge badge-accent text-xs">Live</span>
                  }
                </div>
                <h3 class="font-display font-semibold text-text-primary mb-2 group-hover:text-accent-hover transition-colors">
                  {{ project.title }}
                </h3>
                <p class="text-text-muted text-sm leading-relaxed mb-4 line-clamp-2">
                  {{ project.description }}
                </p>
                <div class="flex flex-wrap gap-1.5">
                  @for (tech of project.stack.slice(0, 4); track tech) {
                    <span class="badge badge-muted text-xs font-mono">{{ tech }}</span>
                  }
                </div>
              </a>
            } @empty {
              <div class="col-span-3 text-center py-12 text-text-muted">
                <p>Projects coming soon</p>
              </div>
            }
          </div>
        }
      </div>
    </section>

    <!-- LATEST POSTS ──────────────────────────────────── -->
    <section class="section">
      <div class="container">
        <div class="flex items-end justify-between mb-12">
          <div>
            <div class="divider mb-4"></div>
            <h2 class="text-display-sm text-text-primary">From the Blog</h2>
            <p class="text-text-secondary mt-2">Thoughts, tutorials, and technical deep-dives</p>
          </div>
          <a routerLink="/blog" class="btn btn-ghost hidden sm:inline-flex">
            All posts →
          </a>
        </div>

        @if (loadingPosts()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3]; track i) {
              <div class="skeleton h-48 rounded-card"></div>
            }
          </div>
        } @else if (latestPosts().length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (post of latestPosts(); track post.id) {
              <a [routerLink]="['/blog', post.slug]" class="card p-6 block group">
                <div class="flex items-center gap-2 mb-3">
                  @if (post.category) {
                    <span class="badge badge-accent text-xs">{{ post.category.name }}</span>
                  }
                  @if (post.readingTime) {
                    <span class="text-text-muted text-xs">{{ post.readingTime }} min read</span>
                  }
                </div>
                <h3 class="font-display font-semibold text-text-primary mb-2 group-hover:text-accent-hover transition-colors line-clamp-2">
                  {{ post.title }}
                </h3>
                @if (post.excerpt) {
                  <p class="text-text-muted text-sm leading-relaxed mb-4 line-clamp-2">{{ post.excerpt }}</p>
                }
                <time class="text-text-muted text-xs font-mono">
                  {{ post.publishedAt | date: 'MMM d, y' }}
                </time>
              </a>
            }
          </div>
        } @else {
          <div class="text-center py-12 text-text-muted">
            <p>Articles coming soon. Check back!</p>
          </div>
        }
      </div>
    </section>

    <!-- CTA BANNER ─────────────────────────────────────── -->
    <section class="section-sm">
      <div class="container">
        <div class="card-glass p-10 md:p-16 text-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none"></div>
          <h2 class="text-display-md text-text-primary mb-4 relative">
            Let's build something
            <span class="text-gradient"> great together</span>
          </h2>
          <p class="text-text-secondary max-w-xl mx-auto mb-8 relative">
            I'm open to freelance projects, full-time positions, and interesting collaborations.
          </p>
          <div class="flex flex-wrap gap-4 justify-center relative">
            <a routerLink="/contact" class="btn btn-primary px-8 py-3 text-base">
              Get in touch
            </a>
            <a href="mailto:hello@matiasgarcia.dev" class="btn btn-ghost px-8 py-3 text-base">
              hello&#64;matiasgarcia.dev
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  protected readonly featuredProjects = signal<ProjectDto[]>([]);
  protected readonly latestPosts = signal<PostListItemDto[]>([]);
  protected readonly loadingProjects = signal(true);
  protected readonly loadingPosts = signal(true);

  protected readonly techStack = [
    'Angular', 'TypeScript', 'Node.js', 'PostgreSQL',
    'Express', 'Prisma', 'TailwindCSS', 'Docker',
  ];

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Matias Garcia — Full Stack Engineer',
      description: 'Full stack engineer specializing in Angular, Node.js, and PostgreSQL. Open to freelance projects and full-time positions.',
      type: 'website',
    });

    this.api.getProjects().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.featuredProjects.set(res.data.filter((p) => p.featured).slice(0, 3));
        }
        this.loadingProjects.set(false);
      },
      error: () => this.loadingProjects.set(false),
    });

    this.api.getPosts({ featured: true, limit: 3 }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.latestPosts.set(res.data.data.slice(0, 3));
        }
        this.loadingPosts.set(false);
      },
      error: () => this.loadingPosts.set(false),
    });
  }
}
