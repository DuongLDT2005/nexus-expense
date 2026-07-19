import { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { AppDispatch } from '../../redux/store';
import { Expense } from '../../types';
import { getAllExpensesByCategoryAndMonth } from '../../services/expenseService';
import { selectUser } from '../../redux/slices/authSlice';
import { useState } from 'react';
import { formatWithSymbol } from '../../utils/numberUtils';
import { selectCurrency } from '../../redux/slices/settingsSlice';

export const useCategoryTransactionScreen = () => {
  const route = useRoute<any>();
  const [transactions, setTransactions] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const currency = useSelector(selectCurrency);
  const currencySymbol = currency?.symbol || '$';

  const {
    categoryId = '',
    categoryName = 'Category',
    categoryColor = '#4f46e5',
    categoryIcon = 'shapes',
    yearMonth = new Date().toISOString().slice(0, 7), // default to current month YYYY-MM
  } = route.params ?? {};

  const user = useSelector(selectUser);

  const fetchTransactions = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const data = await getAllExpensesByCategoryAndMonth(user.id, categoryId, yearMonth);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, yearMonth, user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [fetchTransactions])
  );

  const totalAmount = useMemo(
    () => transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [transactions]
  );

  // Group transactions by date for the SectionList
  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: Expense[] } = {};
    transactions.forEach(t => {
      if (!groups[t.date]) {
        groups[t.date] = [];
      }
      groups[t.date].push(t);
    });
    
    return Object.keys(groups).sort((a, b) => b.localeCompare(a)).map(date => {
      // Very simple "Today", "Yesterday" logic
      const today = new Date().toISOString().split('T')[0];
      let title = date;
      if (date === today) title = 'Today';
      else {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (date === yesterday) title = 'Yesterday';
      }
      return {
        title,
        data: groups[date]
      };
    });
  }, [transactions]);

  // Format month label like "October 2023"
  const monthLabel = useMemo(() => {
    try {
      const [year, month] = yearMonth.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    } catch {
      return yearMonth;
    }
  }, [yearMonth]);

  const formatAmount = useCallback(
    (amount: number) => formatWithSymbol(amount, currencySymbol, currency?.code),
    [currencySymbol, currency?.code]
  );

  return {
    transactions,
    groupedTransactions,
    totalAmount,
    categoryName,
    categoryColor,
    categoryIcon,
    monthLabel,
    categoryId,
    yearMonth,
    currencySymbol,
    formatAmount,
    isLoading
  };
};
