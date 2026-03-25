import { prisma } from '../../lib/prisma.js';

export const TaxonomyService = {
  async listTags() {
    return prisma.tag.findMany({ orderBy: { name: 'asc' } });
  },

  async createTag(data: { name: string; slug: string; color?: string }) {
    return prisma.tag.create({ data: { ...data, color: data.color ?? null } });
  },

  async deleteTag(id: string) {
    await prisma.tag.delete({ where: { id } });
  },

  async listCategories() {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
  },

  async createCategory(data: { name: string; slug: string; description?: string }) {
    return prisma.category.create({ data: { ...data, description: data.description ?? null } });
  },

  async deleteCategory(id: string) {
    await prisma.category.delete({ where: { id } });
  },
};
