import React, { memo } from 'react';
import { View, Text } from 'react-native';
import Icon from '../atoms/Icons';
import { getCurrentMonthName } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/numberUtils';

interface TransactionCardProps {
  currencySymbol: string;
  day: string;
  totalSpent: number;
}

const TransactionCard: React.FC<TransactionCardProps> = memo(({ currencySymbol, day, totalSpent }) => {
  const label = day === 'This Month' ? `${getCurrentMonthName()}'s` : `${day}'s`;
  const amount = Number.isInteger(totalSpent) ? formatCurrency(totalSpent) : formatCurrency(Number(totalSpent.toFixed(2)));

  return (
    <View className="w-[155px] rounded-xl p-3 gap-3 mr-3 bg-gray-50 dark:bg-gray-900">
      <View className="w-8 h-8 rounded-lg items-center justify-center bg-green-100 dark:bg-green-900/30">
        <Icon name="calendar" size={15} color="#22c55e" />
      </View>
      <View>
        <Text className="text-sm font-semibold text-gray-900 dark:text-white">{label}</Text>
        <Text className="text-xs text-gray-500 dark:text-gray-400">Transactions</Text>
      </View>
      <View className="rounded-lg py-2 px-3 bg-green-50 dark:bg-green-900/20">
        <Text className="text-sm font-semibold text-gray-900 dark:text-white">{currencySymbol}{amount}</Text>
      </View>
    </View>
  );
});

export default TransactionCard;
