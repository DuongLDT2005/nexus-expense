import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { selectDebts } from '../../redux/slices/debtSlice';
import { selectCurrency } from '../../redux/slices/settingsSlice';
import { useDebtDataSync } from '../../hooks/useDebtDataSync';
import { getDebtorByDebtorId, deleteDebtorById } from '../../services/debtorService';
import { deleteDebtById, deleteAllDebtsByDebtorId } from '../../services/debtService';
import { sortByDateDesc } from '../../utils/dateUtils';
import { HomeStackParamList } from '../../types';
import { Alert } from 'react-native';
import useColorScheme from '../../hooks/useColorScheme';
import { DEBT_TYPE } from '../../constants/debtTypes';

type IndividualDebtsScreenRouteProp = RouteProp<HomeStackParamList, 'IndividualDebtsScreen'>;

export const useIndividualDebtsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<IndividualDebtsScreenRouteProp>();
  const { debtorId } = route.params ?? {};
  const { fetchDebtData, refreshAfterMutation } = useDebtDataSync();

  const allDebts = useSelector(selectDebts);
  const currency = useSelector(selectCurrency);
  const isDark = useColorScheme() === 'dark';
  const currencySymbol = currency?.symbol ?? '$';
  const currencyCode = currency?.code;
  const fabIconColor = isDark ? '#c3c0ff' : '#ffffff';
  const [debtorName, setDebtorName] = useState('');
  const [debtorType, setDebtorType] = useState('');
  const [debtorColor, setDebtorColor] = useState('#4f46e5');
  const [debtorIcon, setDebtorIcon] = useState('user');
  const [refreshing, setRefreshing] = useState(false);
  const [debtsTypeTab, setDebtsTypeTab] = useState<'Borrow' | 'Lend'>(DEBT_TYPE.BORROW);
  const [isLoadingDebtor, setIsLoadingDebtor] = useState(true);

  // Load debtor details on focus
  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!debtorId) {
        Alert.alert('Error', 'Debtor ID is missing');
        navigation.goBack();
        return;
      }

      setIsLoadingDebtor(true);
      getDebtorByDebtorId(debtorId)
        .then(debtor => {
          if (!active) return;
          if (!debtor) {
            Alert.alert('Error', 'Debtor not found');
            navigation.goBack();
            return;
          }
          setDebtorName(debtor.title);
          setDebtorType(debtor.type);
          setDebtorColor(debtor.color);
          setDebtorIcon(debtor.icon);
          setIsLoadingDebtor(false);
        })
        .catch(() => {
          if (!active) return;
          Alert.alert('Error', 'Failed to fetch debtor details');
          navigation.goBack();
        });

      fetchDebtData();

      return () => {
        active = false;
      };
    }, [debtorId, fetchDebtData, navigation])
  );

  const individualDebts = useMemo(() => {
    return allDebts.filter(d => d.debtorId === debtorId);
  }, [allDebts, debtorId]);

  const { sortedBorrowings, sortedLendings, totalBorrowings, totalLendings, debtorTotal } = useMemo(() => {
    const sorted = sortByDateDesc(individualDebts);
    const borrowings = sorted.filter(d => d.type === DEBT_TYPE.BORROW);
    const lendings = sorted.filter(d => d.type === 'Lend');

    const bTotal = borrowings.reduce((sum, d) => sum + d.amount, 0);
    const lTotal = lendings.reduce((sum, d) => sum + d.amount, 0);

    return {
      sortedBorrowings: borrowings,
      sortedLendings: lendings,
      totalBorrowings: bTotal,
      totalLendings: lTotal,
      debtorTotal: bTotal - lTotal,
    };
  }, [individualDebts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchDebtData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchDebtData]);

  const handleEditDebt = useCallback((debtId: string) => {
    navigation.navigate('UpdateDebtScreen', { debtId });
  }, [navigation]);

  const handleDeleteDebt = useCallback((debtId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this debt entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDebtById(debtId);
              await refreshAfterMutation();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete debt entry');
            }
          },
        },
      ]
    );
  }, [refreshAfterMutation]);

  const handleMarkAsPaid = useCallback(() => {
    Alert.alert(
      'Settle Payment',
      `You want to settle payment with ${debtorName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Settle',
          onPress: async () => {
            try {
              await deleteAllDebtsByDebtorId(debtorId);
              await refreshAfterMutation();
            } catch (err) {
              Alert.alert('Error', 'Failed to settle payments');
            }
          },
        },
      ]
    );
  }, [debtorId, debtorName, refreshAfterMutation]);

  const handleUpdateDebtor = useCallback(() => {
    navigation.navigate('UpdateDebtorScreen', { debtorId });
  }, [debtorId, navigation]);

  const handleDeleteDebtor = useCallback(() => {
    if (individualDebts.length === 0) {
      Alert.alert(
        'Delete Debtor',
        `Delete ${debtorName}? This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteDebtorById(debtorId);
                await refreshAfterMutation();
                navigation.goBack();
              } catch (err) {
                Alert.alert('Error', 'Failed to delete debtor');
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Settle Required',
        `First you need to settle payment with ${debtorName}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Settle',
            onPress: async () => {
              try {
                await deleteAllDebtsByDebtorId(debtorId);
                await refreshAfterMutation();
              } catch (err) {
                Alert.alert('Error', 'Failed to settle payments');
              }
            },
          },
        ]
      );
    }
  }, [debtorId, debtorName, individualDebts.length, refreshAfterMutation, navigation]);

  const handleSetTab = useCallback((tab: 'Borrow' | 'Lend') => {
    setDebtsTypeTab(tab);
  }, []);

  const isTabBorrow = debtsTypeTab === DEBT_TYPE.BORROW;
  const currentDebts = isTabBorrow ? sortedBorrowings : sortedLendings;

  return {
    debtorName,
    debtorId,
    debtorType,
    debtorColor,
    debtorIcon,
    refreshing,
    onRefresh,
    debtsTypeTab,
    isTabBorrow,
    handleSetTab,
    sortedBorrowings,
    sortedLendings,
    currentDebts,
    totalBorrowings,
    totalLendings,
    debtorTotal,
    handleEditDebt,
    handleDeleteDebt,
    handleMarkAsPaid,
    handleUpdateDebtor,
    handleDeleteDebtor,
    isLoadingDebtor,
    currencySymbol,
    currencyCode,
    isDark,
    fabIconColor,
  };
};

export default useIndividualDebtsScreen;
