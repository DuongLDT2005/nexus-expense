import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppDispatch } from '../../redux/store';
import { MainStackParamList, Category, Expense } from '../../types';
import { selectUser } from '../../redux/slices/authSlice';
import { softDeleteCategoryById, getActiveCategoriesByUserId } from '../../services/categoryService';
import { setCategories } from '../../redux/slices/categorySlice';
import { getAllExpensesByUserId } from '../../services/expenseService';

export const useCategoryScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useSelector(selectUser);
  
  // Use state from Redux
  const categories = useSelector((state: any) => state.category?.items || []) as Category[];
  const currencySymbol = useSelector((state: any) => state.settings?.currency?.symbol || '$');

  const [refreshing, setRefreshing] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchCategoryData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const [data, exp] = await Promise.all([
        getActiveCategoriesByUserId(user.id),
        getAllExpensesByUserId(user.id),
      ]);
      dispatch(setCategories(data));
      setExpenses(exp as unknown as Expense[]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, [user?.id, dispatch]);

  useFocusEffect(
    useCallback(() => {
      fetchCategoryData();
    }, [fetchCategoryData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCategoryData();
    setRefreshing(false);
  }, [fetchCategoryData]);

  const handleEdit = useCallback((category: Category) => {
    navigation.navigate('UpdateCategoryScreen', { categoryId: category.id });
  }, [navigation]);

  const handleDelete = useCallback(async (categoryId: string) => {
    try {
      await softDeleteCategoryById(categoryId);
      await fetchCategoryData();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }, [fetchCategoryData]);
  
  const getCategoryStats = useCallback((categoryId: string) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const categoryTxns = expenses.filter(
      t => t.categoryId === categoryId && t.date?.startsWith(currentMonth)
    );
    const count = categoryTxns.length;
    const totalAmount = categoryTxns.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return { count, totalAmount };
  }, [expenses]);

  return {
    categories,
    refreshing,
    onRefresh,
    handleEdit,
    handleDelete,
    currencySymbol,
    getCategoryStats
  };
};
