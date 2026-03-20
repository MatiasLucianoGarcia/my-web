import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import type { PostDto } from '@my-web/shared';
import { DatePipe } from '@angular/common';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-blog-detail',
  imports: [RouterLink, DatePipe],
  template: `
    @if (loading()) {
      <div class="section">
        <div class="container-narrow">
          <div class="skeleton h-8 w-2/3 mb-4 rounded-md"></div>
          <div class="skeleton h-48 mb-8 rounded-card"></div>
          <div class="space-y-3">
            @for (i of [1,2,3,4,5]; track i) {
              <div class="skeleton h-4 rounded"></div>
            }
          </div>
        </div>
      </div>
    } @else if (post()) {
      <!-- Post Hero -->
      <section class="section-sm border-b border-border">
        <div class="container-narrow">
          <!-- Breadcrumb -->
          <nav class="text-sm text-text-muted mb-6 flex items-center gap-2">
            <a routerLink="/blog" class="hover:text-accent transition-colors">Blog</a>
            <span>/</span>
            <span class="text-text-secondary truncate">{{ post()!.title }}</span>
          </nav>

          <!-- Category + Reading time -->
          <div class="flex flex-wrap items-center gap-3 mb-4">
            @if (post()!.category) {
              <span class="badge badge-accent">{{ post()!.category!.name }}</span>
            }
            @if (post()!.readingTime) {
              <span class="text-text-muted text-sm">{{ post()!.readingTime }} min read</span>
            }
            <time class="text-text-muted text-sm font-mono">
              {{ post()!.publishedAt | date: 'MMMM d, y' }}
            </time>
          </div>

          <!-- Title -->
          <h1 class="text-display-md text-text-primary mb-6">{{ post()!.title }}</h1>

          @if (post()!.excerpt) {
            <p class="text-xl text-text-secondary leading-relaxed mb-6">{{ post()!.excerpt }}</p>
          }

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-8">
            @for (tag of post()!.tags; track tag.id) {
              <span class="badge badge-muted text-sm"># {{ tag.name }}</span>
            }
          </div>

          <!-- Author -->
          <div class="flex items-center gap-3">
            @if (post()!.author.avatarUrl) {
              <img [src]="post()!.author.avatarUrl!" [alt]="post()!.author.name" class="w-10 h-10 rounded-full object-cover"/>
            } @else {
              <div class="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                {{ post()!.author.name[0] }}
              </div>
            }
            <div>
              <p class="font-medium text-text-primary text-sm">{{ post()!.author.name }}</p>
              <p class="text-text-muted text-xs">Author</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Cover Image -->
      @if (post()!.coverImage) {
        <div class="container-narrow my-8">
          <div class="aspect-video rounded-panel overflow-hidden">
            <img [src]="post()!.coverImage!" [alt]="post()!.title" class="w-full h-full object-cover"/>
          </div>
        </div>
      }

      <!-- Content -->
      <section class="section-sm">
        <div class="container-narrow">
          <article class="prose prose-invert prose-lg max-w-none" [innerHTML]="safeContent()"></article>
        </div>
      </section>

      <!-- Related Posts -->
      @if (post()!.relatedPosts && post()!.relatedPosts!.length > 0) {
        <section class="section-sm border-t border-border">
          <div class="container-narrow">
            <h2 class="text-display-sm text-text-primary mb-6">Related articles</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (related of post()!.relatedPosts!; track related.id) {
                <a [routerLink]="['/blog', related.slug]" class="card p-5 block group">
                  <h3 class="font-semibold text-text-primary mb-2 group-hover:text-accent-hover transition-colors line-clamp-2">
                    {{ related.title }}
                  </h3>
                  @if (related.readingTime) {
                    <span class="text-text-muted text-xs">{{ related.readingTime }} min read</span>
                  }
                </a>
              }
            </div>
          </div>
        </section>
      }
    } @else {
      <div class="section text-center">
        <div class="container-narrow">
          <div class="text-6xl mb-4">📭</div>
          <h1 class="text-display-sm text-text-primary mb-4">Article not found</h1>
          <a routerLink="/blog" class="btn btn-primary">Back to Blog</a>
        </div>
      </div>
    }
  `,
})
export class BlogDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly post = signal<PostDto | null>(null);
  protected readonly loading = signal(true);
  protected readonly safeContent = signal<SafeHtml>('');

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.api.getPostBySlug(slug).subscribe({
      next: async (res) => {
        if (res.success && res.data) {
          this.post.set(res.data);
          // Render markdown safely
          const rawHtml = await marked.parse(res.data.content);
          const clean = isPlatformBrowser(this.platformId)
            ? DOMPurify.sanitize(rawHtml)
            : rawHtml; // SSR: DOMPurify not available, HTML is trusted from our own DB
          this.safeContent.set(this.sanitizer.bypassSecurityTrustHtml(clean));

          // SEO
          this.seo.updateSeo({
            title: res.data.metaTitle ?? res.data.title,
            description: res.data.metaDescription ?? res.data.excerpt ?? undefined,
            image: res.data.ogImage ?? res.data.coverImage ?? undefined,
            type: 'article',
            article: {
              publishedTime: res.data.publishedAt ?? undefined,
              modifiedTime: res.data.updatedAt,
              author: res.data.author.name,
              tags: res.data.tags.map((t) => t.name),
            },
          });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
