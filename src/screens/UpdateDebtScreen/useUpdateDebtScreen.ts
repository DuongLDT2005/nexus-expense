import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { selectCurrency } from '../../redux/slices/settingsSlice';
import { useDebtDataSync } from '../../hooks/useDebtDataSync';
import { getDebtorByDebtorId } from '../../services/debtorService';
import { getDebtById, updateDebtById } from '../../services/debtService';
import { expenseSchema, expenseAmountSchema } from '../../utils/validationSchema';
import { roundCurrency } from '../../utils/numberUtils';
import { HomeStackParamList } from '../../types';
import { Alert } from 'react-native';
import useColorScheme from '../../hooks/useColorScheme';

type UpdateDebtScreenRouteProp = RouteProp<HomeStackParamList, 'UpdateDebtScreen'>;

export const useUpdateDebtScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<UpdateDebtScreenRouteProp>();
  const { debtId } = route.params ?? {};
  const currency = useSelector(selectCurrency);
  const { refreshAfterMutation } = useDebtDataSync();

  const [debtorName, setDebtorName] = useState('');
  const [debtorId, setDebtorId] = useState('');
  const [debtsType, setDebtsType] = useState<'Borrow' | 'Lend'>('Borrow');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    let active = true;
    if (!debtId) {
      Alert.alert('Error', 'Debt ID is missing');
      navigation.goBack();
      return;
    }

    const loadData = async () => {
      try {
        const debt = await getDebtById(debtId);
        if (!active) return;
        if (!debt) {
          Alert.alert('Error', 'Debt entry not found');
          navigation.goBack();
          return;
        }

        setDebtorId(debt.debtorId);
        setDebtsType(debt.type as 'Borrow' | 'Lend');
        setDescription(debt.description);
        setAmount(String(debt.amount));
        setDate(debt.date);

        const debtor = await getDebtorByDebtorId(debt.debtorId);
        if (!active) return;
        if (!debtor) {
          Alert.alert('Error', 'Debtor not found');
          navigation.goBack();
          return;
        }
        setDebtorName(debtor.title);
        setIsLoading(false);
      } catch (err) {
        if (!active) return;
        Alert.alert('Error', 'Failed to fetch details');
        navigation.goBack();
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [debtId, navigation]);

  const handleToggleType = useCallback((type: 'Borrow' | 'Lend') => {
    setDebtsType(type);
  }, []);

  const handleAmountFocus = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const isValid =
    expenseSchema.safeParse(description).success &&
    expenseAmountSchema.safeParse(Number(amount)).success;

  const amountErrors = hasInteracted
    ? expenseAmountSchema.safeParse(Number(amount)).error?.issues || []
    : [];

  const currencySymbol = currency?.symbol ?? '$';
  const isDark = useColorScheme() === 'dark';
  const inactiveIconColor = isDark ? '#c7c4d8' : '#464555';
  const placeholderColor = isDark ? '#918fa1' : '#757780';

  const handleSave = useCallback(async () => {
    if (!isValid || !debtId || !debtorId) return;
    setIsSaving(true);
    try {
      const parsedAmount = Number(amount);
      const roundedAmount = roundCurrency(parsedAmount, currency?.code);
      await updateDebtById(
        debtId,
        debtorId,
        roundedAmount,
        description.trim(),
        date,
        debtsType
      );
      await refreshAfterMutation();
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update debt entry');
    } finally {
      setIsSaving(false);
    }
  }, [isValid, debtId, debtorId, amount, description, date, debtsType, currency?.code, refreshAfterMutation, navigation]);

  return {
    debtorName,
    debtsType,
    handleToggleType,
    description,
    setDescription,
    amount,
    setAmount,
    date,
    setDate,
    isLoading,
    isSaving,
    handleSave,
    isValid,
    handleAmountFocus,
    amountErrors,
    currencySymbol,
    isDark,
    inactiveIconColor,
    placeholderColor,
  };
};

export default useUpdateDebtScreen;
