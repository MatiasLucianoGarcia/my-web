import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import type { ExperimentDto } from '@my-web/shared';

const STATUS_CONFIG: Record<string, { label: string; class: string }> = {
  IDEA: { label: 'Idea', class: 'bg-warning/15 text-warning border-warning/25' },
  WIP: { label: 'In Progress', class: 'bg-accent/15 text-accent-hover border-accent/25' },
  DONE: { label: 'Done', class: 'bg-success/15 text-success border-success/25' },
  PAUSED: { label: 'Paused', class: 'bg-text-muted/10 text-text-muted border-text-muted/20' },
};

@Component({
  selector: 'app-lab-detail',
  imports: [RouterLink],
  template: `
    @if (loading()) {
      <div class="section"><div class="container-narrow space-y-4">
        <div class="skeleton h-8 w-2/3 rounded"></div>
        <div class="skeleton h-24 rounded-card"></div>
      </div></div>
    } @else if (experiment()) {
      <div class="section">
        <div class="container-narrow">
          <nav class="text-sm text-text-muted mb-6 flex items-center gap-2">
            <a routerLink="/lab" class="hover:text-accent transition-colors">Lab</a>
            <span>/</span>
            <span class="text-text-secondary">{{ experiment()!.title }}</span>
          </nav>

          <div class="flex items-start justify-between mb-4 flex-wrap gap-3">
            <span class="font-mono text-text-muted text-sm">~/lab/{{ experiment()!.slug }}</span>
            <span class="badge text-xs border" [class]="statusConfig(experiment()!.status)">
              {{ statusLabel(experiment()!.status) }}
            </span>
          </div>

          <h1 class="text-display-md text-text-primary mb-4">{{ experiment()!.title }}</h1>
          <p class="text-xl text-text-secondary leading-relaxed mb-8">{{ experiment()!.description }}</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div class="card p-6">
              <h2 class="font-semibold text-text-primary mb-4">Stack</h2>
              <div class="flex flex-wrap gap-2">
                @for (tech of experiment()!.stack; track tech) {
                  <span class="badge badge-muted font-mono">{{ tech }}</span>
                }
              </div>
            </div>
            <div class="card p-6">
              <h2 class="font-semibold text-text-primary mb-4">Tags</h2>
              <div class="flex flex-wrap gap-2">
                @for (tag of experiment()!.tags; track tag) {
                  <span class="badge badge-accent">#{{ tag }}</span>
                }
              </div>
            </div>
          </div>

          @if (experiment()!.demoUrl) {
            <a [href]="experiment()!.demoUrl!" target="_blank" rel="noopener" class="btn btn-primary mb-8">
              Open Demo ↗
            </a>
          }

          <a routerLink="/lab" class="btn btn-ghost">← Back to Lab</a>
        </div>
      </div>
    } @else {
      <div class="section text-center">
        <div class="container-narrow">
          <p class="font-mono text-text-muted mb-4">$ cat experiment.json<br/><span class="text-error">Error: Not Found</span></p>
          <a routerLink="/lab" class="btn btn-primary">Back to Lab</a>
        </div>
      </div>
    }
  `,
})
export class LabDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  protected readonly experiment = signal<ExperimentDto | null>(null);
  protected readonly loading = signal(true);

  protected statusLabel(status: string): string { return STATUS_CONFIG[status]?.label ?? status; }
  protected statusConfig(status: string): string { return STATUS_CONFIG[status]?.class ?? ''; }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.api.getExperimentBySlug(slug).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.experiment.set(res.data);
          this.seo.updateSeo({ title: res.data.title, description: res.data.description });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
