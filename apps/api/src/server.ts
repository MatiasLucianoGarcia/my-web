import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { execSync } from 'node:child_process';
import { getEnv } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma, connectDB, disconnectDB } from './lib/prisma.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Routes
import authRoutes from './modules/auth/auth.routes.js';
import postsRoutes from './modules/posts/posts.routes.js';
import projectsRoutes from './modules/projects/projects.routes.js';
import experimentsRoutes from './modules/experiments/experiments.routes.js';
import experiencesRoutes from './modules/experiences/experiences.routes.js';
import contactsRoutes from './modules/contacts/contacts.routes.js';
import taxonomyRoutes from './modules/taxonomy/taxonomy.routes.js';
import sitemapRoutes from './modules/sitemap/sitemap.routes.js';

const env = getEnv();
const app = express();

// ─── SECURITY ────────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }),
);

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
  }),
);

// ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(pinoHttp({ logger }));

// ─── GLOBAL RATE LIMIT ───────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV, timestamp: new Date().toISOString() });
});

// ─── API ROUTES ──────────────────────────────────────────────────────────────
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/posts`, postsRoutes);
app.use(`${API_PREFIX}/projects`, projectsRoutes);
app.use(`${API_PREFIX}/experiments`, experimentsRoutes);
app.use(`${API_PREFIX}/experiences`, experiencesRoutes);
app.use(`${API_PREFIX}/contacts`, contactsRoutes);
app.use(`${API_PREFIX}/taxonomy`, taxonomyRoutes);
app.use('/', sitemapRoutes);

// ─── ERROR HANDLING ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── DB SETUP: auto-migrate + seed if empty ──────────────────────────────────
async function ensureDatabase() {
  // 1. Apply schema to DB (idempotent)
  try {
    logger.info('🔄 Running prisma db push...');
    execSync('npx prisma db push --accept-data-loss', {
      stdio: 'inherit',
      env: process.env,
    });
    logger.info('✅ Schema synced');
  } catch (err) {
    logger.warn({ err }, '⚠️  prisma db push failed — continuing');
  }

  // 2. Seed only if DB is empty (use upsert so it is safe to re-run)
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      logger.info('🌱 Empty DB — running seed...');
      execSync('npx tsx prisma/seed.ts', {
        stdio: 'inherit',
        env: process.env,
        cwd: process.cwd(),
      });
      logger.info('✅ Seed complete');
    } else {
      logger.info(`✅ DB has ${userCount} user(s) — skipping seed`);
    }
  } catch (err) {
    logger.warn({ err }, '⚠️  Seed failed — app continues without seed data');
  }
}

// ─── BOOTSTRAP ───────────────────────────────────────────────────────────────
async function bootstrap() {
  await connectDB();
  await ensureDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 API running at http://localhost:${env.PORT}`);
    logger.info(`📋 Health check: http://localhost:${env.PORT}/health`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

void bootstrap();
