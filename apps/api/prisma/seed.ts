import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with real data...');

  // ─── Admin user ────────────────────────────────────────────────────────────
  const pwHash = await bcrypt.hash(process.env['ADMIN_PASSWORD'] ?? 'Admin@12345!', 12);
  const admin = await prisma.user.upsert({
    where: { email: process.env['ADMIN_EMAIL'] ?? 'mati.luciano.garcia@gmail.com' },
    update: {},
    create: {
      email: process.env['ADMIN_EMAIL'] ?? 'mati.luciano.garcia@gmail.com',
      pwHash,
      name: process.env['ADMIN_NAME'] ?? 'Matias Garcia',
      role: 'ADMIN',
      bio: 'Senior Software Engineer with 6+ years of experience building scalable web applications using Angular, TypeScript and Node.js.',
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ─── Categories ───────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'frontend' }, update: {}, create: { name: 'Frontend', slug: 'frontend', description: 'Frontend development — Angular, TypeScript, CSS, performance' } }),
    prisma.category.upsert({ where: { slug: 'backend' }, update: {}, create: { name: 'Backend', slug: 'backend', description: 'Backend development — Node.js, APIs, databases' } }),
    prisma.category.upsert({ where: { slug: 'architecture' }, update: {}, create: { name: 'Architecture', slug: 'architecture', description: 'Software architecture, patterns and system design' } }),
    prisma.category.upsert({ where: { slug: 'devops' }, update: {}, create: { name: 'DevOps', slug: 'devops', description: 'DevOps & infrastructure' } }),
    prisma.category.upsert({ where: { slug: 'career' }, update: {}, create: { name: 'Career', slug: 'career', description: 'Career growth, soft skills, and engineering culture' } }),
  ]);
  console.log(`✅ Categories: ${categories.map((c) => c.name).join(', ')}`);

  // ─── Tags ─────────────────────────────────────────────────────────────────
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript', slug: 'typescript', color: '#3178C6' } }),
    prisma.tag.upsert({ where: { slug: 'angular' }, update: {}, create: { name: 'Angular', slug: 'angular', color: '#DD0031' } }),
    prisma.tag.upsert({ where: { slug: 'nodejs' }, update: {}, create: { name: 'Node.js', slug: 'nodejs', color: '#539E43' } }),
    prisma.tag.upsert({ where: { slug: 'postgresql' }, update: {}, create: { name: 'PostgreSQL', slug: 'postgresql', color: '#336791' } }),
    prisma.tag.upsert({ where: { slug: 'rxjs' }, update: {}, create: { name: 'RxJS', slug: 'rxjs', color: '#B7178C' } }),
    prisma.tag.upsert({ where: { slug: 'microfrontends' }, update: {}, create: { name: 'Microfrontends', slug: 'microfrontends', color: '#7C6CF5' } }),
    prisma.tag.upsert({ where: { slug: 'performance' }, update: {}, create: { name: 'Performance', slug: 'performance', color: '#F5A623' } }),
  ]);
  console.log(`✅ Tags: ${tags.map((t) => t.name).join(', ')}`);

  // ─── Professional Experience ───────────────────────────────────────────────
  await prisma.experience.upsert({
    where: { id: 'exp-zintro' },
    update: {},
    create: {
      id: 'exp-zintro',
      company: 'Zintro',
      role: 'FullStack / Software Engineer',
      description: 'Development and maintenance of core enterprise applications using Angular and Node.js. Implementation of full-stack features including frontend interfaces and backend services. Design and integration of REST APIs and third-party services. Troubleshooting complex production issues and improving performance and system stability. Worked on key business flows such as scheduling, payments and system integrations. Collaboration with international engineering, product and design teams.',
      startDate: new Date('2024-12-01'),
      current: true,
      stack: ['Angular', 'TypeScript', 'Node.js', 'Express', 'REST APIs'],
      order: 0,
    },
  });

  await prisma.experience.upsert({
    where: { id: 'exp-coderslab' },
    update: {},
    create: {
      id: 'exp-coderslab',
      company: 'Coderslab / Coca-Cola',
      role: 'Senior Frontend Developer',
      description: 'Developed new features for a large-scale B2B platform used across multiple countries and thousands of users. Improved application performance and refactored legacy components, enhancing scalability and maintainability. Defined frontend development guidelines and provided technical support to the team. Contributed to the maintenance of a high-traffic enterprise application.',
      startDate: new Date('2023-07-01'),
      endDate: new Date('2024-12-01'),
      current: false,
      stack: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Performance Optimization'],
      order: 1,
    },
  });

  await prisma.experience.upsert({
    where: { id: 'exp-globallogic' },
    update: {},
    create: {
      id: 'exp-globallogic',
      company: 'Global Logic | BCI',
      role: 'Frontend Developer',
      description: 'Designed a microfrontend architecture based on Web Components for a financial data hub. Built Angular applications integrated with fintech platforms and external services. Developed features for MACH products and BCI Access, including bug fixing and enhancements. Created technical documentation to support the adoption of microfrontend architecture.',
      startDate: new Date('2021-10-01'),
      endDate: new Date('2023-07-01'),
      current: false,
      stack: ['Angular', 'TypeScript', 'Web Components', 'Microfrontends', 'Angular Elements', 'Fintech'],
      order: 2,
    },
  });

  await prisma.experience.upsert({
    where: { id: 'exp-xeron' },
    update: {},
    create: {
      id: 'exp-xeron',
      company: 'Xeron Web | Freelance',
      role: 'Full Stack Developer',
      description: 'Delivered end-to-end web solutions using Angular and Laravel. Managed cloud deployments and worked directly with clients to define requirements. Planned deliverables and coordinated technical tasks across multiple projects.',
      startDate: new Date('2019-08-01'),
      endDate: new Date('2021-12-01'),
      current: false,
      stack: ['Angular', 'TypeScript', 'Laravel', 'PHP', 'MySQL', 'Cloud Deployments'],
      order: 3,
    },
  });

  await prisma.experience.upsert({
    where: { id: 'exp-upso' },
    update: {},
    create: {
      id: 'exp-upso',
      company: 'UPSO',
      role: 'Full Stack Developer',
      description: 'Developed internal web applications using Angular and Laravel. Worked on technical documentation and internal system support. Built and maintained solutions for institutional workflows and administrative processes.',
      startDate: new Date('2020-02-01'),
      endDate: new Date('2021-09-01'),
      current: false,
      stack: ['Angular', 'TypeScript', 'Laravel', 'PHP', 'MariaDB'],
      order: 4,
    },
  });

  console.log('✅ Professional experiences (5) created');

  // ─── Projects ─────────────────────────────────────────────────────────────
  await prisma.project.upsert({
    where: { slug: 'personal-portfolio-website' },
    update: {},
    create: {
      title: 'Personal Portfolio & Blog Platform',
      slug: 'personal-portfolio-website',
      description: 'A full-stack personal website combining portfolio, blog and professional online presence. Built with Angular 19 SSR, Express, PostgreSQL and Prisma ORM as a monorepo.',
      featured: true,
      status: 'active',
      stack: ['Angular', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'TailwindCSS', 'Railway'],
      tags: ['fullstack', 'portfolio', 'angular', 'ssr'],
      liveUrl: 'https://worthy-sparkle-production-40a0.up.railway.app',
      repoUrl: 'https://github.com/MatiasLucianoGarcia/my-web',
      order: 0,
    },
  });

  await prisma.project.upsert({
    where: { slug: 'social-alert-reporting-system' },
    update: {},
    create: {
      title: 'Social Alert & Reporting System',
      slug: 'social-alert-reporting-system',
      description: 'Full-stack platform developed in collaboration with the Municipality of Bahía Blanca to manage reports and alerts for children in vulnerable situations. Implemented alert mechanisms to support timely intervention by institutions. Built with a focus on scalability, maintainability, and real social impact.',
      featured: true,
      status: 'active',
      stack: ['Angular', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL'],
      tags: ['fullstack', 'angular', 'social-impact', 'government'],
      order: 1,
    },
  });

  console.log('✅ Projects (2) created');

  // ─── Experiment ───────────────────────────────────────────────────────────
  await prisma.experiment.upsert({
    where: { slug: 'signal-state-patterns' },
    update: {},
    create: {
      title: 'Angular Signal State Patterns',
      slug: 'signal-state-patterns',
      description: 'Exploring different state management patterns using Angular Signals without NgRx. Comparing signal-based stores vs traditional approaches.',
      status: 'WIP',
      stack: ['Angular', 'TypeScript', 'Signals'],
      tags: ['angular', 'signals', 'state-management'],
      featured: true,
      order: 0,
    },
  });

  await prisma.experiment.upsert({
    where: { slug: 'microfrontend-web-components' },
    update: {},
    create: {
      title: 'Microfrontend with Web Components',
      slug: 'microfrontend-web-components',
      description: 'Proof of concept for a shell+remote microfrontend architecture using Angular Elements and native Web Components, without module federation.',
      status: 'DONE',
      stack: ['Angular', 'TypeScript', 'Angular Elements', 'Web Components', 'Microfrontends'],
      tags: ['microfrontends', 'angular', 'architecture'],
      featured: true,
      order: 1,
    },
  });

  console.log('✅ Experiments (2) created');
  console.log('\n✨ Seed complete — real CV data loaded!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
