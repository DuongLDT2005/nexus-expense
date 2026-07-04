import { useMemo } from 'react';

/**
 * Custom hook to get the Tailwind CSS text color class based on the transaction amount.
 * Follows the nexus-expense coding guidelines (using Tailwind classes instead of JS color values).
 * 
 * - Negative amount (Income): text-green-500
 * - Positive amount (Expense/Debit): text-red-500
 * - Zero: text-gray-900 dark:text-white
 */
export const useAmountColorClass = (amount: number): string => {
  return useMemo(() => {
    if (amount < 0) {
      return 'text-green-500';
    }
    if (amount === 0) {
      return 'text-gray-900 dark:text-white';
    }
    return 'text-red-500';
  }, [amount]);
};

export default useAmountColorClass;
