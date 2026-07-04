import { nanoid } from 'nanoid';
import { request } from './apiHelper';
import type { Category } from '../types';

const DEFAULT_ICON = 'tag';
const DEFAULT_COLOR = '#6b7280';
const sanitize = (val: string | null | undefined, fallback: string): string =>
  val && val !== 'null' ? val : fallback;

export const createCategory = async (
  name: string,
  userId: string,
  icon: string | null,
  color: string | null,
): Promise<string> => {
  const id = nanoid(24);
  await request<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify({ id, name, categoryStatus: true, userId, icon: sanitize(icon, DEFAULT_ICON), color: sanitize(color, DEFAULT_COLOR) }),
  });
  return id;
};

export const softDeleteCategoryById = async (categoryId: string): Promise<void> => {
  await request<Category>(`/categories/${categoryId}`, { method: 'PATCH', body: JSON.stringify({ categoryStatus: false }) });
};

export const updateCategoryById = async (categoryId: string, newName?: string, newIcon?: string, newColor?: string): Promise<void> => {
  const updates: Partial<Category> = {};
  if (newName !== undefined) updates.name = newName;
  if (newIcon !== undefined) updates.icon = newIcon;
  if (newColor !== undefined) updates.color = newColor;
  await request<Category>(`/categories/${categoryId}`, { method: 'PATCH', body: JSON.stringify(updates) });
};

export const getAllCategories = async (): Promise<Category[]> => {
  const categories = await request<Category[]>('/categories');
  return categories.map(c => ({ ...c, icon: sanitize(c.icon, DEFAULT_ICON), color: sanitize(c.color, DEFAULT_COLOR) }));
};

export const getAllCategoriesByUserId = async (userId: string): Promise<Category[]> => {
  const categories = await request<Category[]>(`/categories?userId=${userId}`);
  return categories.map(c => ({ ...c, icon: sanitize(c.icon, DEFAULT_ICON), color: sanitize(c.color, DEFAULT_COLOR) }));
};

export const getActiveCategoriesByUserId = async (userId: string): Promise<Category[]> => {
  const categories = await request<Category[]>(`/categories?userId=${userId}&categoryStatus=true`);
  return categories.map(c => ({ ...c, icon: sanitize(c.icon, DEFAULT_ICON), color: sanitize(c.color, DEFAULT_COLOR) }));
};

export const getCategoryById = async (categoryId: string): Promise<Category | null> => {
  try {
    const c = await request<Category>(`/categories/${categoryId}`);
    return { ...c, icon: sanitize(c.icon, DEFAULT_ICON), color: sanitize(c.color, DEFAULT_COLOR) };
  } catch {
    return null;
  }
};
