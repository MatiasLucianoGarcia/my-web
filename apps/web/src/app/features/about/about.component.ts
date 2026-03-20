import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

interface SkillCategory {
  name: string;
  icon: string;
  skills: { name: string; level: number }[];
}

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  template: `
    <div class="section">
      <div class="container-narrow">

        <!-- Header -->
        <header class="mb-16">
          <div class="divider mb-4"></div>
          <h1 class="text-display-md text-text-primary mb-4">About Me</h1>
          <p class="text-text-secondary text-lg leading-relaxed">
            Full Stack Engineer based in Argentina 🇦🇷 with a passion for building
            clean, fast, and accessible web applications.
          </p>
        </header>

        <!-- Bio -->
        <section class="card p-8 mb-8">
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Avatar placeholder -->
            <div class="flex-shrink-0">
              <div class="w-40 h-40 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/5
                          border border-accent/20 flex items-center justify-center text-5xl font-display font-bold text-accent">
                MG
              </div>
            </div>

            <div class="space-y-4">
              <p class="text-text-secondary leading-relaxed">
                I'm a full stack engineer with a strong focus on TypeScript and
                modern web architectures. I love the whole spectrum: crafting
                pixel-perfect UIs, designing clean APIs, and architecting scalable
                database schemas.
              </p>
              <p class="text-text-secondary leading-relaxed">
                When I'm not coding, I'm probably reading about distributed systems,
                contributing to open source, or experimenting with new tech in my
                personal lab.
              </p>
              <div class="flex flex-wrap gap-3 pt-2">
                <a routerLink="/contact" class="btn btn-primary">Get in touch</a>
                <a href="/cv.pdf" class="btn btn-ghost" target="_blank" rel="noopener">
                  Download CV
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Values -->
        <section class="mb-12">
          <h2 class="text-display-sm text-text-primary mb-6">What drives me</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            @for (value of values; track value.title) {
              <div class="card p-6">
                <div class="text-2xl mb-3">{{ value.icon }}</div>
                <h3 class="font-display font-semibold text-text-primary mb-2">{{ value.title }}</h3>
                <p class="text-text-muted text-sm leading-relaxed">{{ value.desc }}</p>
              </div>
            }
          </div>
        </section>

        <!-- CTA -->
        <div class="flex gap-4">
          <a routerLink="/experience" class="btn btn-ghost">View experience →</a>
          <a routerLink="/projects" class="btn btn-ghost">See projects →</a>
        </div>
      </div>
    </div>
  `,
})
export class AboutComponent implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly values = [
    { icon: '🏗️', title: 'Architecture first', desc: 'I think before I code. Good design saves months of refactoring.' },
    { icon: '⚡', title: 'Performance matters', desc: 'Every millisecond counts. I obsess over load times and Core Web Vitals.' },
    { icon: '♿', title: 'Accessibility', desc: 'The web should work for everyone. WCAG compliance is non-negotiable.' },
    { icon: '🧪', title: 'Testing culture', desc: 'Tests are documentation. They give you confidence to ship fast.' },
    { icon: '📖', title: 'Continuous learning', desc: 'The tech world doesn\'t stand still. Neither do I.' },
    { icon: '🤝', title: 'Collaboration', desc: 'The best products come from diverse teams with psychological safety.' },
  ];

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'About',
      description: 'Full Stack Engineer based in Argentina. Passionate about clean architecture, performance, and accessibility.',
    });
  }
}
