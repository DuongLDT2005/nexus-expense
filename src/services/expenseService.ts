import { nanoid } from 'nanoid';
import { request } from './apiHelper';
import type { Category } from '../types';
import { getCategoryById, getAllCategories } from './categoryService';

export interface ExpenseData {
  id: string;
  title: string;
  amount: number;
  description?: string;
  categoryId: string;
  userId: string;
  date: string;
}

export interface ExpenseWithCategory extends ExpenseData {
  category?: {
    id: string;
    name: string;
    icon?: string;
    color: string;
  };
}

export const createExpense = async (
  userId: string,
  title: string,
  amount: number,
  description: string,
  categoryId: string,
  date: string,
): Promise<string> => {
  const id = nanoid(24);
  const data = {
    id,
    title,
    amount,
    description: description || undefined,
    categoryId,
    userId,
    date,
  };
  await request<ExpenseData>('/expenses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return id;
};

export const updateExpenseById = async (
  expenseId: string,
  categoryId?: string,
  newTitle?: string,
  newAmount?: number,
  newDescription?: string,
  newDate?: string,
): Promise<void> => {
  const updates: Partial<ExpenseData> = {};
  if (categoryId !== undefined) updates.categoryId = categoryId;
  if (newTitle !== undefined) updates.title = newTitle;
  if (newAmount !== undefined) updates.amount = newAmount;
  if (newDescription !== undefined) updates.description = newDescription;
  if (newDate !== undefined) updates.date = newDate;

  await request<ExpenseData>(`/expenses/${expenseId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

export const deleteExpenseById = async (
  expenseId: string,
): Promise<void> => {
  await request<void>(`/expenses/${expenseId}`, {
    method: 'DELETE',
  });
};

export const getAllExpensesByUserId = async (
  userId: string,
): Promise<ExpenseData[]> => {
  try {
    return await request<ExpenseData[]>(`/expenses?userId=${userId}`);
  } catch {
    return [];
  }
};

export const getAllExpensesByUserIdWithCategory = async (
  userId: string,
): Promise<ExpenseWithCategory[]> => {
  try {
    const [expenses, categories] = await Promise.all([
      getAllExpensesByUserId(userId),
      getAllCategories(),
    ]);

    const catMap = new Map<string, Category>();
    categories.forEach(c => catMap.set(c.id, c));

    return expenses.map(e => {
      const cat = catMap.get(e.categoryId);
      return {
        ...e,
        category: cat ? {
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
        } : undefined,
      };
    });
  } catch {
    return [];
  }
};

export const getAllExpensesByDate = async (
  userId: string,
  date: string,
): Promise<ExpenseWithCategory[]> => {
  try {
    const all = await getAllExpensesByUserIdWithCategory(userId);
    return all.filter(e => e.date && e.date.startsWith(date));
  } catch {
    return [];
  }
};

export const getAllExpensesByMonth = async (
  userId: string,
  yearMonth: string, // YYYY-MM
): Promise<ExpenseWithCategory[]> => {
  try {
    const all = await getAllExpensesByUserIdWithCategory(userId);
    return all.filter(e => e.date.startsWith(yearMonth));
  } catch {
    return [];
  }
};

export const getAllExpensesByCategoryAndMonth = async (
  userId: string,
  categoryId: string,
  yearMonth: string,
): Promise<ExpenseWithCategory[]> => {
  try {
    const all = await getAllExpensesByMonth(userId, yearMonth);
    return all.filter(e => e.categoryId === categoryId);
  } catch {
    return [];
  }
};

export const getAvailableExpenseYears = async (
  userId: string,
): Promise<number[]> => {
  try {
    const expenses = await getAllExpensesByUserId(userId);
    const years = new Set<number>();
    expenses.forEach(e => {
      if (e.date) {
        const year = new Date(e.date).getFullYear();
        if (!isNaN(year)) {
          years.add(year);
        }
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  } catch {
    return [];
  }
};

export const getExpenseById = async (
  expenseId: string,
): Promise<ExpenseData | null> => {
  try {
    return await request<ExpenseData>(`/expenses/${expenseId}`);
  } catch {
    return null;
  }
};
