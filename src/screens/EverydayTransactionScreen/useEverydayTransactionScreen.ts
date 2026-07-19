import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { selectUser } from '../../redux/slices/authSlice';
import { selectCurrency } from '../../redux/slices/settingsSlice';
import { getAllExpensesByDate } from '../../services';
import { formatDate } from '../../utils/dateUtils';
import type { ExpenseWithCategory } from '../../services/expenseService';
import type { RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../../types';

export const useEverydayTransactionScreen = (
  route: RouteProp<HomeStackParamList, 'EverydayTransactionScreen'>,
) => {
  const user = useSelector(selectUser);
  const currency = useSelector(selectCurrency);
  const [transactions, setTransactions] = useState<ExpenseWithCategory[]>([]);

  const expenseDate = route.params?.date ?? '';
  const formattedDate = formatDate(expenseDate, 'MMM Do YY');
  const currencySymbol = currency?.symbol ?? '$';

  // Fetch transactions for the specific date on focus
  useFocusEffect(
    useCallback(() => {
      if (user && expenseDate) {
        getAllExpensesByDate(user.id, expenseDate).then((data) => {
          setTransactions(data);
        });
      }
    }, [user, expenseDate]),
  );

  // Calculate total spent for the day
  const totalAmountForTheDay = useMemo(
    () =>
      (transactions ?? []).reduce(
        (sum: number, transaction: ExpenseWithCategory) => sum + transaction.amount,
        0,
      ),
    [transactions],
  );

  return {
    formattedDate,
    expenseDate,
    transactions,
    totalAmountForTheDay,
    currencySymbol,
    currency,
  };
};
