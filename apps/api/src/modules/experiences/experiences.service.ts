import { prisma } from '../../lib/prisma.js';

export interface CreateExperienceData {
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  logoUrl?: string;
  stack: string[];
  order: number;
}

export type UpdateExperienceData = Partial<CreateExperienceData>;

export const ExperiencesService = {
  async list() {
    return prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { startDate: 'desc' }] });
  },

  async create(data: CreateExperienceData) {
    return prisma.experience.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        logoUrl: data.logoUrl || null,
      },
    });
  },

  async update(id: string, data: UpdateExperienceData) {
    return prisma.experience.update({
      where: { id },
      data: {
        ...data,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        endDate: data.endDate ? new Date(data.endDate) : null,
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl || null }),
      },
    });
  },

  async delete(id: string) {
    await prisma.experience.delete({ where: { id } });
  },
};
