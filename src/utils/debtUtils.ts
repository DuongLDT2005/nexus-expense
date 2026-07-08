import dayjs from 'dayjs';
import { Debt, Debtor } from '../types';

export const buildDebtorTypeMap = (debtors: Debtor[]): Map<string, string> =>
  new Map(debtors.map(d => [d.id, d.type]));

export const computeDebtorNet = (debts: Debt[], debtorId: string): number =>
  debts
    .filter(d => d.debtorId === debtorId)
    .reduce((sum, d) => sum + (d.type === 'Borrow' ? d.amount : -d.amount), 0);

export const computeTotalDebts = (debts: Debt[]): number =>
  debts.reduce((sum, d) => sum + (d.type === 'Borrow' ? d.amount : -d.amount), 0);

/** Calculates the summary values for bento-style cards on DebtsScreen */
export const computeSummaryTotals = (debtors: Debtor[], debts: Debt[]) => {
  let totalYouOweOthers = 0;
  let totalOthersOweYou = 0;
  debtors.forEach(d => {
    const net = computeDebtorNet(debts, d.id);
    if (net > 0) totalYouOweOthers += net;
    if (net < 0) totalOthersOweYou += Math.abs(net);
  });
  return { totalYouOweOthers, totalOthersOweYou, netTotal: computeTotalDebts(debts) };
};

/** Provides metadata helper for each Debtor row in DebtsScreen */
export const getDebtorRowMeta = (net: number) => {
  if (net > 0) return { label: 'You owe', amountClass: 'text-tertiary', badge: 'Pending' };
  if (net < 0) return { label: 'Owes you', amountClass: 'text-secondary', badge: 'Paid' };
  return { label: 'Settled', amountClass: 'text-on-surface', badge: 'Settled' };
};

/** Standardizes date format to ISO datetime used by the zero app */
export const normalizeDebtDate = (input: string | Date): string =>
  dayjs(input).format('YYYY-MM-DDTHH:mm:ss');
