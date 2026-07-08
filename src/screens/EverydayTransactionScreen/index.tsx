import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { HomeStackParamList } from '../../types';
import { useEverydayTransactionScreen } from './useEverydayTransactionScreen';

import AppHeader from '../../components/atoms/AppHeader';
import PrimaryView from '../../components/atoms/PrimaryView';
import PrimaryText from '../../components/atoms/PrimaryText';
import Icon from '../../components/atoms/Icons';
import TransactionList from '../../components/molecules/TransactionList';
import { formatDate } from '../../utils/dateUtils';
import { formatWithSymbol } from '../../utils/numberUtils';
import useColorScheme from '../../hooks/useColorScheme';

export default function EverydayTransactionScreen() {
  const route =
    useRoute<RouteProp<HomeStackParamList, 'EverydayTransactionScreen'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const isDark = useColorScheme() === 'dark';

  const {
    formattedDate,
    expenseDate,
    transactions,
    totalAmountForTheDay,
    currencySymbol,
    currency,
  } = useEverydayTransactionScreen(route);

  // ─── List Header — Total Spent Banner ──────────────────────────────────────

  const listHeader = useMemo(
    () => (
      <View className="rounded-2xl py-6 px-4 bg-[#f0f0fa] dark:bg-surface-variant/20 mt-6 mb-6 items-center justify-center">
        <PrimaryText size={10} weight="bold" className="text-on-surface-variant tracking-widest uppercase mb-1.5">
          Total spent today
        </PrimaryText>
        <PrimaryText size={32} weight="bold" variant="number">
          {formatWithSymbol(totalAmountForTheDay, currencySymbol, currency?.code)}
        </PrimaryText>
      </View>
    ),
    [totalAmountForTheDay, currencySymbol, currency],
  );

  // ─── Empty State ──────────────────────────────────────────────────────────

  const iconColor = isDark ? '#c7c4d8' : '#777587';

  const listEmpty = useMemo(
    () => (
      <View className="items-center justify-center mt-[30%]">
        <View className="w-12 h-12 rounded-full items-center justify-center bg-surface-high dark:bg-surface-variant/20">
          <Icon name="receipt" size={22} color={iconColor} />
        </View>
        <PrimaryText size={13} className="text-on-surface-variant mt-2.5 text-center">
          No transactions on {formatDate(expenseDate, 'Do MMM YY')}
        </PrimaryText>
      </View>
    ),
    [expenseDate, iconColor],
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <PrimaryView useSidePadding={false}>
      <AppHeader
        onPress={() => navigation.goBack()}
        text="Everyday Transactions"
        rightAction={
          <PrimaryText size={12} className="text-on-surface-variant font-medium">
            {formatDate(expenseDate, 'MMM DD, YYYY')}
          </PrimaryText>
        }
      />
      <View className="flex-1 px-4">
        <TransactionList
          allExpenses={transactions}
          targetDate={expenseDate}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
        />
      </View>
    </PrimaryView>
  );
}
