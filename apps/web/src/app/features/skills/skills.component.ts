import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';

interface SkillItem {
  name: string;
  icon?: string;
  level?: number; // 1-5
}

interface SkillCategory {
  name: string;
  icon: string;
  color: string;
  skills: SkillItem[];
}

@Component({
  selector: 'app-skills',
  imports: [],
  template: `
    <div class="section">
      <div class="container">
        <header class="mb-12">
          <div class="divider mb-4"></div>
          <h1 class="text-display-md text-text-primary mb-4">Skills & Stack</h1>
          <p class="text-text-secondary text-lg">Technologies I work with regularly and love using.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (category of categories; track category.name) {
            <div class="card p-6 h-full">
              <div class="flex items-center gap-3 mb-5">
                <span class="text-2xl">{{ category.icon }}</span>
                <h2 class="font-display font-semibold text-text-primary">{{ category.name }}</h2>
              </div>
              <ul class="space-y-3">
                @for (skill of category.skills; track skill.name) {
                  <li class="flex items-center justify-between">
                    <span class="text-text-secondary text-sm font-medium">{{ skill.name }}</span>
                    @if (skill.level) {
                      <div class="flex gap-1">
                        @for (d of [1,2,3,4,5]; track d) {
                          <div class="w-2 h-2 rounded-full transition-colors"
                               [class.bg-accent]="d <= skill.level!"
                               [class.bg-border]="d > skill.level!"></div>
                        }
                      </div>
                    }
                  </li>
                }
              </ul>
            </div>
          }
        </div>

        <!-- Tools & Others -->
        <section class="mt-12">
          <h2 class="text-text-secondary text-sm uppercase tracking-wider font-semibold mb-6">Tools & Workflow</h2>
          <div class="flex flex-wrap gap-3">
            @for (tool of tools; track tool) {
              <span class="badge badge-muted text-sm">{{ tool }}</span>
            }
          </div>
        </section>
      </div>
    </div>
  `,
})
export class SkillsComponent implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly categories: SkillCategory[] = [
    {
      name: 'Frontend',
      icon: '🎨',
      color: 'accent',
      skills: [
        { name: 'Angular', level: 5 },
        { name: 'TypeScript', level: 5 },
        { name: 'RxJS / Signals', level: 4 },
        { name: 'TailwindCSS', level: 5 },
        { name: 'HTML5 / CSS3', level: 5 },
        { name: 'Web Accessibility', level: 4 },
      ],
    },
    {
      name: 'Backend',
      icon: '⚙️',
      color: 'success',
      skills: [
        { name: 'Node.js', level: 5 },
        { name: 'Express', level: 5 },
        { name: 'REST API Design', level: 5 },
        { name: 'GraphQL', level: 3 },
        { name: 'WebSockets', level: 3 },
        { name: 'Microservices', level: 3 },
      ],
    },
    {
      name: 'Database',
      icon: '🗄️',
      color: 'warning',
      skills: [
        { name: 'PostgreSQL', level: 5 },
        { name: 'Prisma ORM', level: 5 },
        { name: 'Redis', level: 3 },
        { name: 'MongoDB', level: 3 },
        { name: 'SQL Optimization', level: 4 },
        { name: 'Data Modeling', level: 4 },
      ],
    },
    {
      name: 'DevOps & Infra',
      icon: '🚀',
      color: 'accent',
      skills: [
        { name: 'Docker', level: 4 },
        { name: 'GitHub Actions', level: 4 },
        { name: 'Linux / Bash', level: 4 },
        { name: 'Nginx', level: 3 },
        { name: 'Railway / Render', level: 4 },
      ],
    },
    {
      name: 'Architecture',
      icon: '🏗️',
      color: 'success',
      skills: [
        { name: 'Clean Architecture', level: 4 },
        { name: 'Domain-Driven Design', level: 3 },
        { name: 'SOLID Principles', level: 5 },
        { name: 'Design Patterns', level: 4 },
        { name: 'Monorepos', level: 4 },
      ],
    },
    {
      name: 'Testing',
      icon: '🧪',
      color: 'warning',
      skills: [
        { name: 'Vitest / Jest', level: 4 },
        { name: 'Angular Testing Lib', level: 4 },
        { name: 'Playwright / Cypress', level: 3 },
        { name: 'TDD', level: 3 },
        { name: 'Integration Testing', level: 4 },
      ],
    },
  ];

  protected readonly tools = [
    'VS Code', 'Git / GitHub', 'Figma', 'Postman', 'DBeaver',
    'Prisma Studio', 'pnpm', 'ESLint', 'Prettier', 'Pino',
    'Zod', 'JWT', 'Helmet', 'Husky', 'Conventional Commits',
  ];

  ngOnInit(): void {
    this.seo.updateSeo({ title: 'Skills', description: 'My tech stack: Angular, TypeScript, Node.js, PostgreSQL, and more.' });
  }
}
