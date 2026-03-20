import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import type { ProjectDto } from '@my-web/shared';

@Component({
  selector: 'app-projects-list',
  imports: [RouterLink],
  template: `
    <div class="section">
      <div class="container">
        <header class="mb-12">
          <div class="divider mb-4"></div>
          <h1 class="text-display-md text-text-primary mb-4">Projects</h1>
          <p class="text-text-secondary text-lg">A selection of things I've built — from side projects to production systems.</p>
        </header>

        <!-- Filters -->
        <div class="flex flex-wrap gap-2 mb-10">
          <button class="badge cursor-pointer" [class.badge-accent]="!selectedFilter" [class.badge-muted]="selectedFilter" (click)="selectedFilter = ''">All</button>
          @for (tech of allTech(); track tech) {
            <button class="badge cursor-pointer" [class.badge-accent]="selectedFilter === tech" [class.badge-muted]="selectedFilter !== tech" (click)="selectedFilter = tech">{{ tech }}</button>
          }
        </div>

        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3,4,5,6]; track i) { <div class="skeleton h-64 rounded-card"></div> }
          </div>
        } @else {
          <!-- Featured -->
          @if (featured().length > 0) {
            <section class="mb-12">
              <h2 class="text-text-secondary text-sm uppercase tracking-wider font-semibold mb-6">Featured</h2>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                @for (p of featured(); track p.id) {
                  <a [routerLink]="['/projects', p.slug]" class="card p-8 block group">
                    <div class="flex items-start justify-between mb-4">
                      <span class="badge badge-accent">Featured</span>
                      <div class="flex gap-2">
                        @if (p.repoUrl) { <span class="text-text-muted text-xs">GitHub ↗</span> }
                        @if (p.liveUrl) { <span class="badge badge-muted text-xs">Live ↗</span> }
                      </div>
                    </div>
                    <h2 class="font-display font-bold text-text-primary text-xl mb-3 group-hover:text-accent-hover transition-colors">{{ p.title }}</h2>
                    <p class="text-text-secondary text-sm leading-relaxed mb-6">{{ p.description }}</p>
                    <div class="flex flex-wrap gap-1.5">
                      @for (tech of p.stack.slice(0, 5); track tech) {
                        <span class="badge badge-muted text-xs font-mono">{{ tech }}</span>
                      }
                    </div>
                  </a>
                }
              </div>
            </section>
          }

          <!-- All / filtered -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (p of filteredProjects(); track p.id) {
              <a [routerLink]="['/projects', p.slug]" class="card p-6 block group">
                <h3 class="font-display font-semibold text-text-primary mb-2 group-hover:text-accent-hover transition-colors">{{ p.title }}</h3>
                <p class="text-text-muted text-sm leading-relaxed mb-4 line-clamp-2">{{ p.description }}</p>
                <div class="flex flex-wrap gap-1.5">
                  @for (tech of p.stack.slice(0, 4); track tech) {
                    <span class="badge badge-muted text-xs font-mono">{{ tech }}</span>
                  }
                </div>
              </a>
            } @empty {
              <div class="col-span-3 text-center py-12 text-text-muted">
                <p>No projects match this filter</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class ProjectsListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  protected readonly projects = signal<ProjectDto[]>([]);
  protected readonly loading = signal(true);
  protected selectedFilter = '';

  protected readonly allTech = () => {
    const techs = new Set<string>();
    this.projects().forEach((p) => p.stack.forEach((t) => techs.add(t)));
    return [...techs].sort();
  };

  protected readonly featured = () =>
    this.projects().filter((p) => p.featured && (!this.selectedFilter || p.stack.includes(this.selectedFilter)));

  protected readonly filteredProjects = () =>
    this.projects().filter((p) => !p.featured && (!this.selectedFilter || p.stack.includes(this.selectedFilter)));

  ngOnInit(): void {
    this.seo.updateSeo({ title: 'Projects', description: 'A selection of full stack web projects built with Angular, Node.js, and PostgreSQL.' });
    this.api.getProjects().subscribe({
      next: (res) => { if (res.success && res.data) this.projects.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
