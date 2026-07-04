import { nanoid } from 'nanoid';
import { request } from './apiHelper';

export interface CurrencyData {
  id: string;
  code: string;
  symbol: string;
  name: string;
  userId: string;
}

export const createCurrency = async (
  code: string,
  symbol: string,
  name: string,
  userId: string,
): Promise<string> => {
  const id = nanoid(24);
  const data = {
    id,
    code,
    symbol,
    name,
    userId,
  };
  await request<CurrencyData>('/currencies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return id;
};

export const updateCurrencyById = async (
  currencyId: string,
  newCode?: string,
  newSymbol?: string,
  newName?: string,
): Promise<void> => {
  const updates: Partial<CurrencyData> = {};
  if (newCode !== undefined) updates.code = newCode;
  if (newSymbol !== undefined) updates.symbol = newSymbol;
  if (newName !== undefined) updates.name = newName;

  await request<CurrencyData>(`/currencies/${currencyId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

export const getCurrencyById = async (
  currencyId: string,
): Promise<CurrencyData | null> => {
  try {
    return await request<CurrencyData>(`/currencies/${currencyId}`);
  } catch {
    return null;
  }
};

export const getCurrencyByUserId = async (
  userId: string,
): Promise<CurrencyData | null> => {
  try {
    const currencies = await request<CurrencyData[]>(`/currencies?userId=${userId}`);
    return currencies.length > 0 ? currencies[0] : null;
  } catch {
    return null;
  }
};

export const getAllCurrencies = async (): Promise<CurrencyData[]> => {
  try {
    return await request<CurrencyData[]>('/currencies');
  } catch {
    return [];
  }
};
