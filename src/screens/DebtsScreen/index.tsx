import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import PrimaryView from '../../components/atoms/PrimaryView';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import EmptyState from '../../components/atoms/EmptyState';
import CustomLoader from '../../components/atoms/CustomLoader';
import Icon from '../../components/atoms/Icons';
import DebtorList from '../../components/molecules/DebtorList';
import { useDebtsScreen } from './useDebtsScreen';
import { formatWithSymbol } from '../../utils/numberUtils';
import { HomeStackParamList } from '../../types';

function DebtsListHeader({
  totalOthersOweYou,
  totalYouOweOthers,
  currencySymbol,
  currencyCode,
  isTabPerson,
  onSetTabPerson,
  onSetTabAccounts,
}: {
  totalOthersOweYou: number;
  totalYouOweOthers: number;
  currencySymbol: string;
  currencyCode?: string;
  isTabPerson: boolean;
  onSetTabPerson: () => void;
  onSetTabAccounts: () => void;
}) {
  return (
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
          onPress={onSetTabPerson}
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
          onPress={onSetTabAccounts}
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
}

export default function DebtsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const {
    debtors,
    allDebts,
    activeTabDebtors,
    totalYouOweOthers,
    totalOthersOweYou,
    isTabPerson,
    handleSetTab,
    isLoading,
    error,
    refetch,
    currencySymbol,
    currencyCode,
    fabIconColor,
  } = useDebtsScreen();

  const listHeader = (
    <DebtsListHeader
      totalOthersOweYou={totalOthersOweYou}
      totalYouOweOthers={totalYouOweOthers}
      currencySymbol={currencySymbol}
      currencyCode={currencyCode}
      isTabPerson={isTabPerson}
      onSetTabPerson={() => handleSetTab('Person')}
      onSetTabAccounts={() => handleSetTab('Other')}
    />
  );

  return (
    <View className="flex-1 bg-background relative">
      <PrimaryView useSidePadding={false} style={{ paddingTop: 0, flex: 1 }}>
        <HeaderContainer headerText="Debts" />

        {isLoading && debtors.length === 0 ? (
          <View className="flex-grow justify-center items-center">
            <CustomLoader message="Loading debts data..." />
          </View>
        ) : error && debtors.length === 0 ? (
          <View className="flex-grow justify-center items-center px-6">
            <Text className="text-error font-outfit font-bold text-center text-base mb-2">
              Failed to connect
            </Text>
            <Text className="text-on-surface-variant text-center text-sm font-outfit mb-4">
              {error}
            </Text>
            <TouchableOpacity
              onPress={refetch}
              className="bg-primary px-4 py-2 rounded-full"
            >
              <Text className="text-white font-outfit font-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : debtors.length === 0 ? (
          <View className="flex-grow justify-center px-4">
            <EmptyState type="Debts" />
          </View>
        ) : (
          <DebtorList
            debtors={activeTabDebtors}
            allDebts={allDebts}
            ListHeaderComponent={listHeader}
          />
        )}
      </PrimaryView>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddDebtorScreen')}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg z-40"
      >
        <Icon name="plus-circle" size={30} color={fabIconColor} />
      </TouchableOpacity>
    </View>
  );
}
