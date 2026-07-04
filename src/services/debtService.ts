import { nanoid } from 'nanoid';
import { request } from './apiHelper';

export interface DebtData {
  id: string;
  description: string;
  amount: number;
  debtorId: string;
  userId: string;
  date: string;
  type: string;
}

export const createDebt = async (
  userId: string,
  amount: number,
  description: string,
  debtorId: string,
  date: string,
  type: string,
): Promise<string> => {
  const id = nanoid(24);
  const data = {
    id,
    description: description || '',
    amount,
    debtorId,
    userId,
    date,
    type,
  };
  await request<DebtData>('/debts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return id;
};

export const updateDebtById = async (
  debtId: string,
  _debtorId?: string,
  newAmount?: number,
  newDescription?: string,
  newDate?: string,
  newType?: string,
): Promise<void> => {
  const updates: Partial<DebtData> = {};
  if (newAmount !== undefined) updates.amount = newAmount;
  if (newDescription !== undefined) updates.description = newDescription;
  if (newDate !== undefined) updates.date = newDate;
  if (newType !== undefined) updates.type = newType;
  if (_debtorId !== undefined) updates.debtorId = _debtorId;

  await request<DebtData>(`/debts/${debtId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

export const deleteDebtById = async (
  debtId: string,
): Promise<void> => {
  await request<void>(`/debts/${debtId}`, {
    method: 'DELETE',
  });
};

export const deleteAllDebtsByDebtorId = async (
  debtorId: string,
): Promise<void> => {
  const debts = await request<DebtData[]>(`/debts?debtorId=${debtorId}`);
  await Promise.all(debts.map(d => deleteDebtById(d.id)));
};

export const getAllDebtsByUserId = async (
  userId: string,
): Promise<DebtData[]> => {
  try {
    return await request<DebtData[]>(`/debts?userId=${userId}`);
  } catch {
    return [];
  }
};

export const getAllDebtsByUserIdAndDebtorId = async (
  userId: string,
  debtorId: string,
): Promise<DebtData[]> => {
  try {
    return await request<DebtData[]>(`/debts?userId=${userId}&debtorId=${debtorId}`);
  } catch {
    return [];
  }
};

export const getDebtById = async (
  debtId: string,
): Promise<DebtData | null> => {
  try {
    return await request<DebtData>(`/debts/${debtId}`);
  } catch {
    return null;
  }
};
