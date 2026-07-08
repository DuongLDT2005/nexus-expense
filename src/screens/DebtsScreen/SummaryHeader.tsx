import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { formatWithSymbol } from '../../utils/numberUtils';

interface SummaryHeaderProps {
  totalOthersOweYou: number;
  totalYouOweOthers: number;
  currencySymbol: string;
  currencyCode?: string;
  isTabPerson: boolean;
  handleSetTab: (tab: 'Person' | 'Other') => void;
}

const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  totalOthersOweYou,
  totalYouOweOthers,
  currencySymbol,
  currencyCode,
  isTabPerson,
  handleSetTab,
}) => (
  <View className="mb-6 mt-4">
    <View className="flex-row gap-4 mb-6">
      <View className="flex-1 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 relative overflow-hidden">
        <View className="flex-col gap-1">
          <Text className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
            Others owe you
          </Text>
          <Text className="text-xl font-extrabold text-secondary">
            {formatWithSymbol(totalOthersOweYou, currencySymbol, currencyCode)}
          </Text>
        </View>
        <View className="mt-4 flex-row">
          <View className="px-2 py-0.5 bg-secondary-container rounded-full">
            <Text className="text-[9px] font-bold text-on-secondary-container uppercase">
              Lent
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-1 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 relative overflow-hidden">
        <View className="flex-col gap-1">
          <Text className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">
            You owe others
          </Text>
          <Text className="text-xl font-extrabold text-tertiary">
            {formatWithSymbol(totalYouOweOthers, currencySymbol, currencyCode)}
          </Text>
        </View>
        <View className="mt-4 flex-row">
          <View className="px-2 py-0.5 bg-error-container rounded-full">
            <Text className="text-[9px] font-bold text-on-error-container uppercase">
              Borrowed
            </Text>
          </View>
        </View>
      </View>
    </View>

    <View className="flex-row p-1 bg-surface-container-high rounded-xl w-60 mx-auto mb-2">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleSetTab('Person')}
        className={`flex-1 py-2 rounded-lg items-center justify-center ${
          isTabPerson ? 'bg-primary shadow-sm' : ''
        }`}
      >
        <Text
          className={`text-xs font-outfit font-bold ${
            isTabPerson ? 'text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          Person
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleSetTab('Other')}
        className={`flex-1 py-2 rounded-lg items-center justify-center ${
          !isTabPerson ? 'bg-primary shadow-sm' : ''
        }`}
      >
        <Text
          className={`text-xs font-outfit font-bold ${
            !isTabPerson ? 'text-on-primary' : 'text-on-surface-variant'
          }`}
        >
          Accounts
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default memo(SummaryHeader);
