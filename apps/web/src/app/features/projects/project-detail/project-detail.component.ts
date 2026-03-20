import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import type { ProjectDto } from '@my-web/shared';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="section"><div class="container-narrow space-y-4">
        <div class="skeleton h-8 w-2/3 rounded"></div>
        <div class="skeleton h-48 rounded-card"></div>
      </div></div>
    } @else if (project()) {
      <div class="section">
        <div class="container-narrow">
          <nav class="text-sm text-text-muted mb-6 flex items-center gap-2">
            <a routerLink="/projects" class="hover:text-accent transition-colors">Projects</a>
            <span>/</span>
            <span class="text-text-secondary">{{ project()!.title }}</span>
          </nav>

          <h1 class="text-display-md text-text-primary mb-4">{{ project()!.title }}</h1>
          <p class="text-xl text-text-secondary leading-relaxed mb-8">{{ project()!.description }}</p>

          <div class="flex flex-wrap gap-3 mb-8">
            @if (project()!.liveUrl) {
              <a [href]="project()!.liveUrl!" target="_blank" rel="noopener" class="btn btn-primary">
                View Live ↗
              </a>
            }
            @if (project()!.repoUrl) {
              <a [href]="project()!.repoUrl!" target="_blank" rel="noopener" class="btn btn-ghost">
                GitHub ↗
              </a>
            }
          </div>

          @if (project()!.coverImage) {
            <div class="aspect-video rounded-panel overflow-hidden mb-8">
              <img [src]="project()!.coverImage!" [alt]="project()!.title" class="w-full h-full object-cover"/>
            </div>
          }

          <div class="card p-6 mb-8">
            <h2 class="font-display font-semibold text-text-primary mb-4">Tech Stack</h2>
            <div class="flex flex-wrap gap-2">
              @for (tech of project()!.stack; track tech) {
                <span class="badge badge-muted font-mono">{{ tech }}</span>
              }
            </div>
          </div>

          <a routerLink="/projects" class="btn btn-ghost">← Back to Projects</a>
        </div>
      </div>
    } @else {
      <div class="section text-center">
        <div class="container-narrow">
          <p class="text-text-muted mb-4">Project not found</p>
          <a routerLink="/projects" class="btn btn-primary">Back to Projects</a>
        </div>
      </div>
    }
  `,
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  protected readonly project = signal<ProjectDto | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.api.getProjectBySlug(slug).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.project.set(res.data);
          this.seo.updateSeo({ title: res.data.title, description: res.data.description });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
