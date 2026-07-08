import React, { useCallback, useMemo } from 'react';
import { View, SectionList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryView from '../../components/atoms/PrimaryView';
import AppHeader from '../../components/atoms/AppHeader';
import PrimaryText from '../../components/atoms/PrimaryText';
import Icon from '../../components/atoms/Icons';
import { useCategoryTransactionScreen } from './useCategoryTransactionScreen';
import { Expense } from '../../types';

export default function CategoryTransactionScreen() {
  const navigation = useNavigation();
  const {
    groupedTransactions,
    totalAmount,
    categoryName,
    categoryColor,
    categoryIcon,
    monthLabel,
    transactions,
    formatAmount,
    isLoading
  } = useCategoryTransactionScreen();

  // ─── Sub-components (only used in this screen, no complex logic) ─────────

  const listHeader = useMemo(() => (
    <View className="rounded-xl py-6 px-4 mb-6 mt-4 bg-surface-container-high flex-row items-center gap-4 border border-outline-variant/30">
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: (categoryColor || '#4f46e5') + '1A' }}
      >
        <Icon name={categoryIcon || 'shapes'} size={20} color={categoryColor || '#4f46e5'} />
      </View>
      <View className="flex-1">
        <PrimaryText className="text-xs text-on-surface-variant font-medium">{monthLabel}</PrimaryText>
        <PrimaryText className="text-3xl font-bold tracking-tight text-on-surface">
          {formatAmount(totalAmount)}
        </PrimaryText>
      </View>
      <View className="px-3 py-1.5 rounded-full bg-surface-container-highest">
        <PrimaryText className="text-xs font-bold text-on-surface-variant">{transactions.length} txns</PrimaryText>
      </View>
    </View>
  ), [categoryColor, categoryIcon, monthLabel, totalAmount, transactions.length, formatAmount]);

  const listEmpty = useMemo(() => (
    <View className="items-center justify-center py-20 px-10">
      <View className="h-32 w-32 mb-6 items-center justify-center rounded-full bg-surface-container-high">
        <Icon name="receipt" size={64} color="#777587" />
      </View>
      <PrimaryText className="text-on-surface text-xl font-bold mb-2 text-center">
        No transactions in {categoryName}
      </PrimaryText>
      <PrimaryText className="text-on-surface-variant text-sm text-center">
        Looks like you haven't recorded any {categoryName.toLowerCase()} expenses for this month yet.
      </PrimaryText>
    </View>
  ), [categoryName]);

  const renderItem = useCallback(({ item }: { item: Expense }) => {
    const timeDisplay = item.time ?? '';
    return (
      <View className="mb-3 rounded-xl bg-white border border-outline-variant/15 shadow-sm overflow-hidden">
        <View className="flex-row items-center p-4 gap-3">
          {/* Category icon — fixed width, never shrinks */}
          <View
            className="shrink-0 h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: (categoryColor || '#4f46e5') + '1A' }}
          >
            <Icon name={categoryIcon || 'shapes'} size={22} color={categoryColor || '#4f46e5'} />
          </View>

          {/* Title + description — flex-1 so it fills space and wraps if needed */}
          <View className="flex-1 min-w-0">
            <PrimaryText className="text-on-surface text-sm font-bold leading-snug" numberOfLines={2}>
              {item.title}
            </PrimaryText>
            <PrimaryText className="text-on-surface-variant text-xs font-normal mt-0.5" numberOfLines={2}>
              {item.description
                ? `${item.description}${timeDisplay ? ' · ' + timeDisplay : ''}`
                : timeDisplay}
            </PrimaryText>
          </View>

          {/* Amount — shrink-0 so it NEVER moves regardless of title length */}
          <View className="shrink-0 items-end pl-2">
            <PrimaryText className="text-tertiary text-sm font-bold">
              -{formatAmount(item.amount)}
            </PrimaryText>
          </View>
        </View>
      </View>
    );
  }, [categoryIcon, categoryColor, formatAmount]);

  const renderSectionHeader = useCallback(({ section: { title } }: any) => (
    <PrimaryText className="text-on-surface-variant text-sm font-bold uppercase tracking-widest px-2 mb-3 mt-4">
      {title}
    </PrimaryText>
  ), []);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    // PrimaryView already handles SafeArea — no need for useSafeAreaInsets
    <PrimaryView useSidePadding={false} style={{ paddingTop: 0 }}>
      {/* AppHeader (atom) with back button — Pattern 2: Detail Screen */}
      <AppHeader
        onPress={() => navigation.goBack()}
        text={categoryName}
      />

      <View className="flex-1 px-6">
        <SectionList
          sections={groupedTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={transactions.length === 0 && !isLoading ? listEmpty : null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </PrimaryView>
  );
}
