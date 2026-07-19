import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import {
  setTransactions,
  setLoading,
  selectTransactions,
  selectSelectedMonth,
  setSelectedMonth,
} from '../../redux/slices/transactionSlice';
import {
  setCategories,
} from '../../redux/slices/categorySlice';
import { selectUser } from '../../redux/slices/authSlice';
import { selectCurrency } from '../../redux/slices/settingsSlice';
import {
  getAllExpensesByMonth,
  getAvailableExpenseYears,
  getActiveCategoriesByUserId,
} from '../../services';
import {
  getCurrentYear,
  getMonthNames,
  getMonthNumber,
  sortByDateDesc,
} from '../../utils/dateUtils';
import type { AppDispatch } from '../../redux/store';
import type { ExpenseWithCategory } from '../../services/expenseService';

const MONTHS = getMonthNames();
const CURRENT_YEAR = getCurrentYear();
const CURRENT_MONTH_INDEX = new Date().getMonth();

export const useHomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState(false);
  const [availableYears, setAvailableYears] = useState<number[]>([CURRENT_YEAR]);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const user = useSelector(selectUser);
  const transactions = useSelector(selectTransactions) as ExpenseWithCategory[];
  const selectedMonth = useSelector(selectSelectedMonth); // YYYY-MM
  const currency = useSelector(selectCurrency);

  // Parse selectedMonth to get index and year
  const selectedYear = useMemo(() => {
    const parts = selectedMonth.split('-');
    return parseInt(parts[0], 10) || CURRENT_YEAR;
  }, [selectedMonth]);

  const selectedMonthIndex = useMemo(() => {
    const parts = selectedMonth.split('-');
    return (parseInt(parts[1], 10) || 1) - 1;
  }, [selectedMonth]);

  const selectedMonthName = MONTHS[selectedMonthIndex];
  const currencySymbol = currency?.symbol ?? '$';

  // Sort transactions by date descending
  const sortedTransactions = useMemo(
    () => sortByDateDesc(transactions),
    [transactions],
  );

  // Calculate summary stats
  const { totalSpent, transactionCount, avgPerDay } = useMemo(() => {
    const total = (transactions ?? []).reduce(
      (sum: number, t: ExpenseWithCategory) => sum + t.amount,
      0,
    );
    const count = (transactions ?? []).length;
    const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
    const isCurrentMonth =
      selectedYear === CURRENT_YEAR && selectedMonthIndex === CURRENT_MONTH_INDEX;
    const daysElapsed = isCurrentMonth ? new Date().getDate() : daysInMonth;
    const avg = daysElapsed > 0 ? total / daysElapsed : 0;

    return { totalSpent: total, transactionCount: count, avgPerDay: avg };
  }, [transactions, selectedYear, selectedMonthIndex]);

  // Calculate today total
  const todayTotal = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

    let tToday = 0;
    (transactions ?? []).forEach((t: ExpenseWithCategory) => {
      const d = t.date?.slice(0, 10);
      if (d === todayStr) tToday += t.amount;
    });
    return tToday;
  }, [transactions]);

  // Fetch categories on mount
  useEffect(() => {
    if (user) {
      getActiveCategoriesByUserId(user.id).then((data) => {
        dispatch(setCategories(data));
      });
    }
  }, [dispatch, user]);

  // Load available years
  useEffect(() => {
    if (user) {
      getAvailableExpenseYears(user.id).then((years) => {
        if (years.length > 0) {
          setAvailableYears(years);
        }
      });
    }
  }, [user]);

  // Fetch transactions when screen focuses or month changes
  useFocusEffect(
    useCallback(() => {
      if (user) {
        dispatch(setLoading(true));
        getAllExpensesByMonth(user.id, selectedMonth).then((data) => {
          dispatch(setTransactions(data));
        });
      }
    }, [dispatch, user, selectedMonth]),
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(() => {
    if (!refreshing || !user) return;

    getAllExpensesByMonth(user.id, selectedMonth).then((data) => {
      dispatch(setTransactions(data));
      setRefreshing(false);
    });
  }, [dispatch, refreshing, selectedMonth, user]);

  // Handle month/year selection from picker
  const handleMonthYearSelect = useCallback(
    (monthIndex: number, year: number) => {
      const monthStr = String(monthIndex + 1).padStart(2, '0');
      dispatch(setSelectedMonth(`${year}-${monthStr}`));
    },
    [dispatch],
  );

  return {
    refreshing,
    user,
    currencySymbol,
    onRefresh,
    sortedTransactions,
    selectedYear,
    selectedMonthIndex,
    selectedMonthName,
    selectedMonth,
    availableYears,
    totalSpent,
    transactionCount,
    avgPerDay,
    todayTotal,
    handleMonthYearSelect,
    showMonthPicker,
    setShowMonthPicker,
    currency,
  };
};
