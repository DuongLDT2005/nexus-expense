import { nanoid } from 'nanoid';
import { request } from './apiHelper';

const DEFAULT_ICON = 'user';
const DEFAULT_COLOR = '#6b7280';
const sanitize = (val: string | null | undefined, fallback: string): string =>
  val && val !== 'null' ? val : fallback;

export interface DebtorData {
  id: string;
  title: string;
  type: string;
  debtorStatus: boolean;
  userId: string;
  icon: string;
  color: string;
}

export const createDebtor = async (
  title: string,
  userId: string,
  icon: string | null,
  type: string,
  color: string | null,
): Promise<string> => {
  const id = nanoid(24);
  await request<DebtorData>('/debtors', {
    method: 'POST',
    body: JSON.stringify({ id, title, type: type || 'person', debtorStatus: true, userId, icon: sanitize(icon, DEFAULT_ICON), color: sanitize(color, DEFAULT_COLOR) }),
  });
  return id;
};

export const softDeleteDebtorById = async (debtorId: string): Promise<void> => {
  await request<DebtorData>(`/debtors/${debtorId}`, { method: 'PATCH', body: JSON.stringify({ debtorStatus: false }) });
};

export const deleteDebtorById = async (debtorId: string): Promise<void> => {
  await request<void>(`/debtors/${debtorId}`, { method: 'DELETE' });
};

export const updateDebtorById = async (
  debtorId: string,
  newTitle?: string,
  newType?: string,
  newIcon?: string,
  newColor?: string,
): Promise<void> => {
  const updates: Partial<DebtorData> = {};
  if (newTitle !== undefined) updates.title = newTitle;
  if (newType !== undefined) updates.type = newType;
  if (newIcon !== undefined) updates.icon = newIcon;
  if (newColor !== undefined) updates.color = newColor;
  await request<DebtorData>(`/debtors/${debtorId}`, { method: 'PATCH', body: JSON.stringify(updates) });
};

export const getAllDebtors = async (): Promise<DebtorData[]> => {
  const debtors = await request<DebtorData[]>('/debtors');
  return debtors.map(d => ({ ...d, icon: sanitize(d.icon, DEFAULT_ICON), color: sanitize(d.color, DEFAULT_COLOR) }));
};

export const getAllDebtorsByUserId = async (userId: string): Promise<DebtorData[]> => {
  const debtors = await request<DebtorData[]>(`/debtors?userId=${userId}`);
  return debtors.map(d => ({ ...d, icon: sanitize(d.icon, DEFAULT_ICON), color: sanitize(d.color, DEFAULT_COLOR) }));
};

export const getActiveDebtorsByUserId = async (userId: string): Promise<DebtorData[]> => {
  const debtors = await request<DebtorData[]>(`/debtors?userId=${userId}&debtorStatus=true`);
  return debtors.map(d => ({ ...d, icon: sanitize(d.icon, DEFAULT_ICON), color: sanitize(d.color, DEFAULT_COLOR) }));
};

export const getDebtorByDebtorId = async (debtorId: string): Promise<DebtorData | null> => {
  try {
    const d = await request<DebtorData>(`/debtors/${debtorId}`);
    return { ...d, icon: sanitize(d.icon, DEFAULT_ICON), color: sanitize(d.color, DEFAULT_COLOR) };
  } catch {
    return null;
  }
};
