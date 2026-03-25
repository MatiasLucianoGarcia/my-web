import { ExperimentStatus } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../middleware/errorHandler.js';

export interface CreateExperimentData {
  title: string;
  slug: string;
  description: string;
  status: ExperimentStatus;
  stack: string[];
  tags: string[];
  demoUrl?: string;
  featured: boolean;
  order: number;
}

export type UpdateExperimentData = Partial<CreateExperimentData>;

export const ExperimentsService = {
  async list() {
    return prisma.experiment.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });
  },

  async findBySlug(slug: string) {
    const experiment = await prisma.experiment.findUnique({ where: { slug } });
    if (!experiment) throw new AppError(404, 'Experiment not found');
    return experiment;
  },

  async create(data: CreateExperimentData) {
    return prisma.experiment.create({ data: { ...data, demoUrl: data.demoUrl || null } });
  },

  async update(id: string, data: UpdateExperimentData) {
    return prisma.experiment.update({
      where: { id },
      data: { ...data, ...(data.demoUrl !== undefined && { demoUrl: data.demoUrl || null }) },
    });
  },

  async delete(id: string) {
    await prisma.experiment.delete({ where: { id } });
  },
};
