import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { selectUser } from '../../redux/slices/authSlice';
import { selectCurrency } from '../../redux/slices/settingsSlice';
import { getAllExpensesByUserIdWithCategory } from '../../services/expenseService';
import type { ExpenseWithCategory } from '../../services/expenseService';

export interface CategoryBreakdown {
  id: string;
  name: string;
  color: string;
  icon?: string;
  amount: number;
  percentage: number;
}

export interface HeatmapDay {
  dayNum: number;
  dateStr: string;
  amount: number;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export const useReportsScreen = () => {
  const user = useSelector(selectUser);
  const currency = useSelector(selectCurrency);

  // Month state (Format: YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState(() => dayjs().format('YYYY-MM'));
  const [allExpenses, setAllExpenses] = useState<ExpenseWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Theme visibility (can be used to show month picker selector sheet)
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);

  // Fetch all user expenses on mount
  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getAllExpensesByUserIdWithCategory(user.id);
      setAllExpenses(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Filter expenses by selected month
  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((e) => e.date && e.date.startsWith(selectedMonth));
  }, [allExpenses, selectedMonth]);

  // Compute Total Month Spending
  const totalSpending = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  }, [filteredExpenses]);

  // Calculate Average Daily Spending
  const avgSpendingPerDay = useMemo(() => {
    const daysInMonth = dayjs(selectedMonth).daysInMonth();
    if (daysInMonth <= 0) return 0;
    return totalSpending / daysInMonth;
  }, [totalSpending, selectedMonth]);

  // Compute Category Breakdown for Pie Chart
  const categoryBreakdown = useMemo((): CategoryBreakdown[] => {
    if (filteredExpenses.length === 0 || totalSpending === 0) return [];

    const grouping: Record<string, { name: string; color: string; icon?: string; amount: number }> = {};

    filteredExpenses.forEach((exp) => {
      const catId = exp.categoryId || 'uncategorized';
      const catName = exp.category?.name || 'Uncategorized';
      const catColor = exp.category?.color || '#9ca3af'; // gray-400
      const catIcon = exp.category?.icon || 'shapes';

      if (!grouping[catId]) {
        grouping[catId] = {
          name: catName,
          color: catColor,
          icon: catIcon,
          amount: 0,
        };
      }
      grouping[catId].amount += exp.amount || 0;
    });

    return Object.entries(grouping)
      .map(([id, info]) => {
        const percentage = (info.amount / totalSpending) * 100;
        return {
          id,
          name: info.name,
          color: info.color,
          icon: info.icon,
          amount: info.amount,
          percentage: parseFloat(percentage.toFixed(1)),
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [filteredExpenses, totalSpending]);

  // Compute Daily Activity Heatmap Matrix
  const heatmapData = useMemo(() => {
    const daysInMonth = dayjs(selectedMonth).daysInMonth();
    const result: HeatmapDay[] = [];

    // Map all daily totals for the month
    const dailyMap = new Map<number, number>();
    filteredExpenses.forEach((exp) => {
      if (exp.date) {
        const day = dayjs(exp.date).date();
        dailyMap.set(day, (dailyMap.get(day) || 0) + (exp.amount || 0));
      }
    });

    // Generate each day and assign intensity level based on thresholds
    for (let day = 1; day <= daysInMonth; day++) {
      const dayAmount = dailyMap.get(day) || 0;
      const padDayStr = day < 10 ? `0${day}` : `${day}`;
      const dateStr = `${selectedMonth}-${padDayStr}`;

      let intensity: 0 | 1 | 2 | 3 | 4 = 0;
      if (dayAmount > 0) {
        if (dayAmount <= 200) intensity = 1;
        else if (dayAmount <= 500) intensity = 2;
        else if (dayAmount <= 1500) intensity = 3;
        else intensity = 4;
      }

      result.push({
        dayNum: day,
        dateStr,
        amount: dayAmount,
        intensity,
      });
    }

    return result;
  }, [filteredExpenses, selectedMonth]);

  // Find padding offset for calendar alignment (Mon starts grid)
  const heatmapPadding = useMemo(() => {
    const firstDay = dayjs(`${selectedMonth}-01`);
    const dayOfWeek = firstDay.day(); // 0 is Sunday, 1 is Monday...
    // If Sunday (0), we need 6 prepending empty cells. If Monday (1), 0 cells.
    return dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  }, [selectedMonth]);

  // Month navigation handlers
  const handlePrevMonth = useCallback(() => {
    setSelectedMonth((prev) => dayjs(prev).subtract(1, 'month').format('YYYY-MM'));
  }, []);

  const handleNextMonth = useCallback(() => {
    setSelectedMonth((prev) => dayjs(prev).add(1, 'month').format('YYYY-MM'));
  }, []);

  // Format month for UI (e.g. "October 2023")
  const formattedMonthLabel = useMemo(() => {
    return dayjs(selectedMonth).format('MMMM YYYY');
  }, [selectedMonth]);

  // Generate lists of recent months for manual picker selection
  const recentMonthsList = useMemo(() => {
    const list = [];
    for (let i = 0; i < 6; i++) {
      list.push(dayjs().subtract(i, 'month').format('YYYY-MM'));
    }
    return list;
  }, []);

  return {
    user,
    currencySymbol: currency?.symbol || '$',
    selectedMonth,
    setSelectedMonth,
    formattedMonthLabel,
    totalSpending,
    avgSpendingPerDay,
    categoryBreakdown,
    heatmapData,
    heatmapPadding,
    monthPickerVisible,
    setMonthPickerVisible,
    recentMonthsList,
    loading,
    error,
    refetch: fetchExpenses,
    handlePrevMonth,
    handleNextMonth,
  };
};
