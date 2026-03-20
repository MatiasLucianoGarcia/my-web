import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin user
  const pwHash = await bcrypt.hash(process.env['ADMIN_PASSWORD'] ?? 'Admin@12345!', 12);
  const admin = await prisma.user.upsert({
    where: { email: process.env['ADMIN_EMAIL'] ?? 'admin@example.com' },
    update: {},
    create: {
      email: process.env['ADMIN_EMAIL'] ?? 'admin@example.com',
      pwHash,
      name: process.env['ADMIN_NAME'] ?? 'Matias Garcia',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'frontend' }, update: {}, create: { name: 'Frontend', slug: 'frontend', description: 'Frontend development articles' } }),
    prisma.category.upsert({ where: { slug: 'backend' }, update: {}, create: { name: 'Backend', slug: 'backend', description: 'Backend development articles' } }),
    prisma.category.upsert({ where: { slug: 'devops' }, update: {}, create: { name: 'DevOps', slug: 'devops', description: 'DevOps & infrastructure' } }),
    prisma.category.upsert({ where: { slug: 'career' }, update: {}, create: { name: 'Career', slug: 'career', description: 'Career & growth' } }),
  ]);
  console.log(`✅ Categories: ${categories.map((c) => c.name).join(', ')}`);

  // Tags
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript', slug: 'typescript', color: '#3178C6' } }),
    prisma.tag.upsert({ where: { slug: 'angular' }, update: {}, create: { name: 'Angular', slug: 'angular', color: '#DD0031' } }),
    prisma.tag.upsert({ where: { slug: 'nodejs' }, update: {}, create: { name: 'Node.js', slug: 'nodejs', color: '#539E43' } }),
    prisma.tag.upsert({ where: { slug: 'postgresql' }, update: {}, create: { name: 'PostgreSQL', slug: 'postgresql', color: '#336791' } }),
    prisma.tag.upsert({ where: { slug: 'architecture' }, update: {}, create: { name: 'Architecture', slug: 'architecture', color: '#7C6CF5' } }),
  ]);
  console.log(`✅ Tags: ${tags.map((t) => t.name).join(', ')}`);

  // Sample experience
  await prisma.experience.upsert({
    where: { id: 'exp-sample-1' },
    update: {},
    create: {
      id: 'exp-sample-1',
      company: 'Your Company',
      role: 'Full Stack Engineer',
      description: 'Building scalable web applications with modern tech stacks. Architecting solutions, mentoring junior developers, and driving technical decisions.',
      startDate: new Date('2022-01-01'),
      current: true,
      stack: ['Angular', 'TypeScript', 'Node.js', 'PostgreSQL'],
      order: 0,
    },
  });
  console.log('✅ Sample experience created');

  // Sample project
  await prisma.project.upsert({
    where: { slug: 'personal-web-platform' },
    update: {},
    create: {
      title: 'Personal Web Platform',
      slug: 'personal-web-platform',
      description: 'A full-stack portfolio and blog platform built with Angular 19, Express, and PostgreSQL.',
      featured: true,
      status: 'active',
      stack: ['Angular', 'TypeScript', 'Express', 'PostgreSQL', 'Prisma', 'Tailwind'],
      tags: ['fullstack', 'portfolio', 'open-source'],
      order: 0,
    },
  });
  console.log('✅ Sample project created');

  // Sample experiment
  await prisma.experiment.upsert({
    where: { slug: 'signal-state-patterns' },
    update: {},
    create: {
      title: 'Angular Signal State Patterns',
      slug: 'signal-state-patterns',
      description: 'Exploring different state management patterns using Angular Signals without NgRx.',
      status: 'WIP',
      stack: ['Angular', 'TypeScript', 'Signals'],
      tags: ['angular', 'signals', 'state'],
      featured: true,
      order: 0,
    },
  });
  console.log('✅ Sample experiment created');

  console.log('\n✨ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
