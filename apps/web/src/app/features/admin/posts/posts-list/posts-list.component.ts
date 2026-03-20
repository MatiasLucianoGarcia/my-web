import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import type { PostListItemDto } from '@my-web/shared';

@Component({
  selector: 'app-admin-posts-list',
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-display-sm text-text-primary mb-1">Posts</h1>
          <p class="text-text-muted text-sm">Manage your blog articles</p>
        </div>
        <a routerLink="/admin/posts/new" class="btn btn-primary">+ New Post</a>
      </div>

      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3,4,5]; track i) { <div class="skeleton h-16 rounded-lg"></div> }
        </div>
      } @else {
        <div class="card overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left p-4 text-text-muted font-semibold">Title</th>
                <th class="text-left p-4 text-text-muted font-semibold hidden sm:table-cell">Status</th>
                <th class="text-left p-4 text-text-muted font-semibold hidden md:table-cell">Category</th>
                <th class="text-left p-4 text-text-muted font-semibold hidden lg:table-cell">Updated</th>
                <th class="p-4"></th>
              </tr>
            </thead>
            <tbody>
              @for (post of posts(); track post.id) {
                <tr class="border-b border-border-muted hover:bg-bg-muted/50 transition-colors">
                  <td class="p-4">
                    <p class="font-medium text-text-primary truncate max-w-xs">{{ post.title }}</p>
                    <p class="text-text-muted text-xs font-mono">/blog/{{ post.slug }}</p>
                  </td>
                  <td class="p-4 hidden sm:table-cell">
                    <span class="badge text-xs"
                      [class.badge-accent]="post.status === 'PUBLISHED'"
                      [class.badge-muted]="post.status !== 'PUBLISHED'">
                      {{ post.status }}
                    </span>
                  </td>
                  <td class="p-4 text-text-muted hidden md:table-cell">{{ post.category?.name ?? '—' }}</td>
                  <td class="p-4">
                    <div class="flex items-center gap-2 justify-end">
                      <a [routerLink]="['/admin/posts', post.id, 'edit']" class="btn btn-ghost text-xs py-1 px-2">Edit</a>
                      <button (click)="deletePost(post.id)" class="btn btn-ghost text-xs py-1 px-2 text-error hover:bg-error/10">Delete</button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="p-12 text-center text-text-muted">
                    No posts yet. <a routerLink="/admin/posts/new" class="text-accent hover:text-accent-hover">Create your first post →</a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
})
export class AdminPostsListComponent implements OnInit {
  private readonly api = inject(ApiService);

  protected readonly posts = signal<PostListItemDto[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void { this.loadPosts(); }

  private loadPosts(): void {
    this.api.getAdminPosts({ limit: 50 }).subscribe({
      next: (res) => { if (res.success && res.data) this.posts.set(res.data.data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  protected deletePost(id: string): void {
    if (!confirm('Delete this post?')) return;
    this.api.deletePost(id).subscribe({ next: () => this.loadPosts() });
  }
}
