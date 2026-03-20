import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <div class="space-y-8">
      <div>
        <h1 class="text-display-sm text-text-primary mb-1">Dashboard</h1>
        <p class="text-text-muted text-sm">Welcome back. Here's an overview of your content.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        @for (stat of stats(); track stat.label) {
          <div class="card p-5">
            <div class="text-2xl mb-2">{{ stat.icon }}</div>
            <p class="text-3xl font-display font-bold text-text-primary mb-1">{{ stat.value }}</p>
            <p class="text-text-muted text-sm">{{ stat.label }}</p>
          </div>
        }
      </div>

      <!-- Quick Actions -->
      <section>
        <h2 class="text-text-secondary text-sm uppercase tracking-wider font-semibold mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (action of quickActions; track action.label) {
            <a [routerLink]="action.path" class="card p-5 group hover:border-accent transition-colors block">
              <span class="text-2xl mb-3 block">{{ action.icon }}</span>
              <h3 class="font-semibold text-text-primary text-sm group-hover:text-accent-hover transition-colors">{{ action.label }}</h3>
              <p class="text-text-muted text-xs mt-1">{{ action.desc }}</p>
            </a>
          }
        </div>
      </section>

      @if (loading()) {
        <div class="text-center text-text-muted text-sm">Loading stats...</div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly loading = signal(true);
  protected readonly stats = signal([
    { icon: '📝', label: 'Posts', value: '—' },
    { icon: '🚀', label: 'Projects', value: '—' },
    { icon: '🧪', label: 'Experiments', value: '—' },
    { icon: '📬', label: 'Messages', value: '—' },
  ]);

  protected readonly quickActions = [
    { icon: '✍️', label: 'New post', desc: 'Write and publish a new article', path: '/admin/posts/new' },
    { icon: '🚀', label: 'Add project', desc: 'Showcase a new project', path: '/admin/projects' },
    { icon: '🧪', label: 'Add experiment', desc: 'Add a lab experiment', path: '/admin/experiments' },
    { icon: '💼', label: 'Add experience', desc: 'Update your work history', path: '/admin/experiences' },
    { icon: '📬', label: 'View messages', desc: 'Read contact form messages', path: '/admin/messages' },
  ];

  ngOnInit(): void {
    Promise.all([
      this.api.getAdminPosts({ limit: 1 }).toPromise(),
      this.api.getProjects().toPromise(),
      this.api.getExperiments().toPromise(),
      this.api.getContacts().toPromise(),
    ]).then(([posts, projects, experiments, contacts]) => {
      this.stats.set([
        { icon: '📝', label: 'Posts', value: String(posts?.data?.meta.total ?? 0) },
        { icon: '🚀', label: 'Projects', value: String(projects?.data?.length ?? 0) },
        { icon: '🧪', label: 'Experiments', value: String(experiments?.data?.length ?? 0) },
        { icon: '📬', label: 'Messages', value: String(contacts?.data?.length ?? 0) },
      ]);
      this.loading.set(false);
    }).catch(() => this.loading.set(false));
  }
}
