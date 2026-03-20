import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  selector: 'app-lab-list',
  imports: [RouterLink],
  template: `
    <div class="section">
      <div class="container">
        <!-- Distinctive Lab Header -->
        <header class="mb-12 relative">
          <div class="absolute top-0 right-0 text-9xl font-display font-black text-accent/5 select-none pointer-events-none leading-none">
            LAB
          </div>
          <span class="inline-block font-mono text-accent text-sm mb-3 bg-accent/10 border border-accent/20 px-3 py-1 rounded-full">
            ~/experiments
          </span>
          <h1 class="text-display-md text-text-primary mb-4">Personal Lab</h1>
          <p class="text-text-secondary text-lg max-w-2xl">
            A space for experiments, prototypes, and technical explorations.
            Not production, just curiosity.
          </p>
        </header>

        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (i of [1,2,3,4]; track i) { <div class="skeleton h-48 rounded-card"></div> }
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (exp of experiments(); track exp.id) {
              <div class="card p-6 group relative overflow-hidden">
                <!-- Accent corner -->
                <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-3xl"></div>

                <div class="flex items-start justify-between mb-4">
                  <span class="text-2xl font-mono text-text-muted">&#9001;/&#9002;</span>
                  <span class="badge text-xs border" [class]="statusConfig(exp.status)">
                    {{ statusLabel(exp.status) }}
                  </span>
                </div>

                <h3 class="font-display font-bold text-text-primary text-lg mb-2">{{ exp.title }}</h3>
                <p class="text-text-secondary text-sm leading-relaxed mb-5">{{ exp.description }}</p>

                <div class="flex flex-wrap gap-1.5 mb-5">
                  @for (tech of exp.stack.slice(0, 5); track tech) {
                    <span class="badge badge-muted text-xs font-mono">{{ tech }}</span>
                  }
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex flex-wrap gap-1">
                    @for (tag of exp.tags.slice(0, 3); track tag) {
                      <span class="text-text-muted text-xs">#{{ tag }}</span>
                    }
                  </div>
                  @if (exp.demoUrl) {
                    <a [href]="exp.demoUrl" target="_blank" rel="noopener" class="text-accent text-sm hover:text-accent-hover transition-colors">
                      Demo ↗
                    </a>
                  }
                </div>
              </div>
            } @empty {
              <div class="col-span-2 text-center py-20">
                <div class="font-mono text-text-muted text-lg mb-2">$ ls experiments/</div>
                <p class="text-text-muted">No experiments yet. They're cooking... 🔬</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class LabListComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  protected readonly experiments = signal<ExperimentDto[]>([]);
  protected readonly loading = signal(true);

  protected statusLabel(status: string): string {
    return STATUS_CONFIG[status]?.label ?? status;
  }

  protected statusConfig(status: string): string {
    return STATUS_CONFIG[status]?.class ?? '';
  }

  ngOnInit(): void {
    this.seo.updateSeo({ title: 'Lab & Experiments', description: 'A personal lab for experiments, prototypes, and technical explorations.' });
    this.api.getExperiments().subscribe({
      next: (res) => { if (res.success && res.data) this.experiments.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
