import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { selectUser } from '../../redux/slices/authSlice';
import { selectCurrency } from '../../redux/slices/settingsSlice';
import { useDebtDataSync } from '../../hooks/useDebtDataSync';
import { getDebtorByDebtorId } from '../../services/debtorService';
import { createDebt } from '../../services/debtService';
import { expenseSchema, expenseAmountSchema } from '../../utils/validationSchema';
import { getISODateTime } from '../../utils/dateUtils';
import { roundCurrency } from '../../utils/numberUtils';
import { HomeStackParamList } from '../../types';
import { Alert } from 'react-native';
import useColorScheme from '../../hooks/useColorScheme';

type AddDebtsScreenRouteProp = RouteProp<HomeStackParamList, 'AddDebtsScreen'>;

export const useAddDebtsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<AddDebtsScreenRouteProp>();
  const { debtorId } = route.params ?? {};
  const user = useSelector(selectUser);
  const currency = useSelector(selectCurrency);
  const { refreshAfterMutation } = useDebtDataSync();

  const [debtorName, setDebtorName] = useState('');
  const [debtsType, setDebtsType] = useState<'Borrow' | 'Lend'>('Borrow');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getISODateTime());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    let active = true;
    if (!debtorId) {
      Alert.alert('Error', 'Debtor ID is missing');
      navigation.goBack();
      return;
    }

    getDebtorByDebtorId(debtorId)
      .then(debtor => {
        if (!active) return;
        if (!debtor) {
          Alert.alert('Error', 'Debtor not found');
          navigation.goBack();
          return;
        }
        setDebtorName(debtor.title);
        setIsLoading(false);
      })
      .catch(() => {
        if (!active) return;
        Alert.alert('Error', 'Failed to fetch debtor details');
        navigation.goBack();
      });

    return () => {
      active = false;
    };
  }, [debtorId, navigation]);

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
    if (!isValid || !user?.id || !debtorId) return;
    setIsSaving(true);
    try {
      const parsedAmount = Number(amount);
      const roundedAmount = roundCurrency(parsedAmount, currency?.code);
      await createDebt(
        user.id,
        roundedAmount,
        description.trim(),
        debtorId,
        date,
        debtsType
      );
      await refreshAfterMutation();
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to add debt entry');
    } finally {
      setIsSaving(false);
    }
  }, [isValid, user?.id, debtorId, amount, description, date, debtsType, currency?.code, refreshAfterMutation, navigation]);

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

export default useAddDebtsScreen;
