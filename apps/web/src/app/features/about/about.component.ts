import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

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
            Senior Software Engineer based in Bahía Blanca, Argentina 🇦🇷 — building
            scalable web applications with Angular, TypeScript &amp; Node.js.
          </p>
        </header>

        <!-- Bio -->
        <section class="card p-8 mb-8">
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div class="w-40 h-40 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/5
                          border border-accent/20 flex items-center justify-center text-5xl font-display font-bold text-accent">
                MG
              </div>
            </div>

            <div class="space-y-4">
              <p class="text-text-secondary leading-relaxed">
                I'm a Software Engineer with <strong class="text-text-primary">6+ years of experience</strong> building
                scalable web applications. My core expertise is in <strong class="text-text-primary">Angular, TypeScript and Node.js</strong>,
                with deep knowledge in enterprise SaaS platforms, fintech integrations and microfrontend architectures.
              </p>
              <p class="text-text-secondary leading-relaxed">
                Throughout my career I've collaborated with international teams, defined frontend
                development guidelines, worked on high-traffic B2B platforms and designed
                microfrontend architectures based on Web Components for financial systems.
              </p>
              <p class="text-text-secondary leading-relaxed">
                I'm passionate about clean architecture, performance optimization and building
                maintainable software that scales. When I'm not coding, I'm exploring new
                Angular patterns, contributing to side projects, or experimenting in my personal lab.
              </p>
              <div class="flex flex-wrap gap-3 pt-2">
                <a routerLink="/contact" class="btn btn-primary">Get in touch</a>
                <a routerLink="/cv" class="btn btn-ghost">
                  📄 View CV
                </a>
                <a href="/cv.pdf" download="Matias-Garcia-CV.pdf" class="btn btn-ghost">
                  ⬇ Download PDF
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Education -->
        <section class="mb-12">
          <h2 class="text-display-sm text-text-primary mb-6">Education</h2>
          <div class="space-y-4">
            @for (edu of education; track edu.institution) {
              <div class="card p-6 flex items-start gap-4">
                <span class="text-2xl">{{ edu.icon }}</span>
                <div>
                  <h3 class="font-display font-semibold text-text-primary">{{ edu.degree }}</h3>
                  <p class="text-accent font-medium text-sm">{{ edu.institution }}</p>
                  <p class="text-text-muted text-xs font-mono mt-1">{{ edu.year }}</p>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- What drives me -->
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

        <!-- CTAs -->
        <div class="flex flex-wrap gap-4">
          <a routerLink="/experience" class="btn btn-ghost">View experience →</a>
          <a routerLink="/projects" class="btn btn-ghost">See projects →</a>
          <a routerLink="/skills" class="btn btn-ghost">Tech stack →</a>
        </div>
      </div>
    </div>
  `,
})
export class AboutComponent implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly education = [
    {
      icon: '🎓',
      degree: 'Systems Information Engineer',
      institution: 'Universidad Nacional del Sur',
      year: 'Expected 2026',
    },
    {
      icon: '💻',
      degree: 'Computer Technician',
      institution: 'Instituto Técnico La Piedad',
      year: 'Completed',
    },
  ];

  protected readonly values = [
    { icon: '🏗️', title: 'Architecture first', desc: 'I think before I code. Good design prevents months of painful refactoring.' },
    { icon: '⚡', title: 'Performance matters', desc: 'Optimizing load times and Core Web Vitals is a craft, not an afterthought.' },
    { icon: '📐', title: 'Scalable systems', desc: 'I build for tomorrow. Every decision considers maintainability and growth.' },
    { icon: '🌍', title: 'International collaboration', desc: 'Experienced working with engineering, product and design teams across time zones.' },
    { icon: '📖', title: 'Continuous learning', desc: 'The frontend ecosystem never stops evolving. Neither do I.' },
    { icon: '🤝', title: 'Team player', desc: 'The best products come from cross-functional teams aligned on a clear vision.' },
  ];

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'About — Matias Garcia',
      description: 'Senior Software Engineer with 6+ years of experience in Angular, TypeScript and Node.js. Based in Bahía Blanca, Argentina.',
    });
  }
}
