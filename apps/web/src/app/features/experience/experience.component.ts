import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import type { ExperienceDto } from '@my-web/shared';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-experience',
  imports: [DatePipe],
  template: `
    <div class="section">
      <div class="container-narrow">
        <header class="mb-12">
          <div class="divider mb-4"></div>
          <h1 class="text-display-md text-text-primary mb-4">Experience</h1>
          <p class="text-text-secondary text-lg">My professional journey in software development.</p>
        </header>

        @if (loading()) {
          <div class="space-y-6">
            @for (i of [1,2,3]; track i) { <div class="skeleton h-40 rounded-card"></div> }
          </div>
        } @else if (experiences().length > 0) {
          <!-- Timeline -->
          <div class="relative">
            <!-- Vertical line -->
            <div class="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-border to-transparent hidden sm:block"></div>

            <div class="space-y-8">
              @for (exp of experiences(); track exp.id; let i = $index) {
                <div class="relative flex gap-6 animate-fade-up" [style.animation-delay]="(i * 100) + 'ms'">
                  <!-- Timeline dot -->
                  <div class="hidden sm:flex flex-shrink-0 w-16 items-start justify-center pt-6">
                    <div class="w-4 h-4 rounded-full border-2 z-10 shadow-lg"
                         [class.bg-accent]="exp.current"
                         [class.border-accent]="exp.current"
                         [class.glow-accent]="exp.current"
                         [class.bg-bg-muted]="!exp.current"
                         [class.border-border]="!exp.current"
                    ></div>
                  </div>

                  <!-- Card -->
                  <div class="card p-6 flex-1">
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div>
                        <h2 class="font-display font-bold text-text-primary text-lg">{{ exp.role }}</h2>
                        <p class="text-accent font-medium">{{ exp.company }}</p>
                      </div>
                      <div class="text-right flex-shrink-0">
                        @if (exp.current) {
                          <span class="badge badge-accent mb-1 block text-center">Current</span>
                        }
                        <p class="text-text-muted text-xs font-mono">
                          {{ exp.startDate | date: 'MMM y' }} —
                          {{ exp.current ? 'Present' : (exp.endDate | date: 'MMM y') }}
                        </p>
                      </div>
                    </div>

                    <p class="text-text-secondary text-sm leading-relaxed mb-4">{{ exp.description }}</p>

                    @if (exp.stack.length > 0) {
                      <div class="flex flex-wrap gap-1.5">
                        @for (tech of exp.stack; track tech) {
                          <span class="badge badge-muted text-xs font-mono">{{ tech }}</span>
                        }
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="text-center py-16 text-text-muted">
            <p>Experience data coming soon</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class ExperienceComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  protected readonly experiences = signal<ExperienceDto[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.seo.updateSeo({ title: 'Experience', description: 'Professional experience timeline — full stack engineering roles and achievements.' });
    this.api.getExperiences().subscribe({
      next: (res) => { if (res.success && res.data) this.experiences.set(res.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
