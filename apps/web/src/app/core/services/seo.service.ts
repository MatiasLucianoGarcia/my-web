import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

export interface SeoData {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly defaultTitle = 'Matias Garcia — Full Stack Engineer';
  readonly siteName = 'Matias Garcia';
  readonly baseUrl = 'https://yourdomain.com'; // TODO: env var
  readonly defaultImage = `${this.baseUrl}/og-default.jpg`;

  updateSeo(data: SeoData): void {
    const fullTitle = data.title === this.defaultTitle ? data.title : `${data.title} | ${this.siteName}`;

    this.title.setTitle(fullTitle);

    // Basic meta
    if (data.description) {
      this.meta.updateTag({ name: 'description', content: data.description });
    }
    if (data.keywords) {
      this.meta.updateTag({ name: 'keywords', content: data.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:type', content: data.type ?? 'website' });
    if (data.description) {
      this.meta.updateTag({ property: 'og:description', content: data.description });
    }
    if (data.image) {
      this.meta.updateTag({ property: 'og:image', content: data.image });
    }
    if (data.url) {
      this.meta.updateTag({ property: 'og:url', content: data.url });
    }

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    if (data.description) {
      this.meta.updateTag({ name: 'twitter:description', content: data.description });
    }
    if (data.image) {
      this.meta.updateTag({ name: 'twitter:image', content: data.image });
    }

    // Article meta
    if (data.type === 'article' && data.article) {
      if (data.article.publishedTime) {
        this.meta.updateTag({ property: 'article:published_time', content: data.article.publishedTime });
      }
      if (data.article.modifiedTime) {
        this.meta.updateTag({ property: 'article:modified_time', content: data.article.modifiedTime });
      }
      if (data.article.author) {
        this.meta.updateTag({ property: 'article:author', content: data.article.author });
      }
      (data.article.tags ?? []).forEach((tag) => {
        this.meta.addTag({ property: 'article:tag', content: tag });
      });
    }

    // Canonical URL
    if (data.url && isPlatformBrowser(this.platformId)) {
      this.setCanonical(data.url);
    }
  }

  setCanonical(url: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = url;
  }

  addJsonLd(data: Record<string, unknown>): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const existing = this.doc.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
    const script = existing ?? this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    if (!existing) this.doc.head.appendChild(script);
  }
}
