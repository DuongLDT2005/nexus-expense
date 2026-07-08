import React, { useCallback, memo } from 'react';
import { View, TouchableOpacity, FlatList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import Icon from '../atoms/Icons';
import { Debtor, Debt, HomeStackParamList } from '../../types';
import { selectCurrency } from '../../redux/slices/settingsSlice';
import { formatWithSymbol } from '../../utils/numberUtils';
import { computeDebtorNet, getDebtorRowMeta } from '../../utils/debtUtils';

interface DebtorListProps {
  debtors: Debtor[];
  allDebts: Debt[];
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const DebtorList: React.FC<DebtorListProps> = memo(({
  debtors,
  allDebts,
  ListHeaderComponent,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const currency = useSelector(selectCurrency);
  const currencySymbol = currency?.symbol ?? '$';
  const currencyCode = currency?.code;

  const handlePressDebtor = useCallback((debtorId: string, debtorName: string, debtorType: string) => {
    navigation.navigate('IndividualDebtsScreen', { debtorId });
  }, [navigation]);

  const renderDebtorItem = useCallback(({ item: debtor }: { item: Debtor }) => {
    const net = computeDebtorNet(allDebts, debtor.id);
    const meta = getDebtorRowMeta(net);

    // Initial avatar letters
    const initials = debtor.title
      .split(' ')
      .map(word => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    // Badge styling matching Stitch
    let badgeBg = 'bg-surface-container-high';
    let badgeText = 'text-on-surface-variant';

    if (net < 0) {
      badgeBg = 'bg-secondary-container';
      badgeText = 'text-on-secondary-container';
    } else if (net > 0) {
      badgeBg = 'bg-tertiary-fixed-dim/20';
      badgeText = 'text-tertiary';
    }

    return (
      <TouchableOpacity
        onPress={() => handlePressDebtor(debtor.id, debtor.title, debtor.type)}
        activeOpacity={0.7}
        className="p-4 flex-row items-center justify-between hover:bg-surface-container-low"
      >
        <View className="flex-row items-center gap-4 flex-1">
          {/* Avatar Container with 15% opacity dynamic bg */}
          <View
            style={{ backgroundColor: (debtor.color || '#4f46e5') + '26' }}
            className="w-12 h-12 rounded-xl items-center justify-center"
          >
            {debtor.icon ? (
              <Icon name={debtor.icon} size={20} color={debtor.color || '#4f46e5'} />
            ) : (
              <Text
                style={{ color: debtor.color || '#4f46e5' }}
                className="font-bold text-sm font-outfit"
              >
                {initials}
              </Text>
            )}
          </View>

          <View className="flex-1">
            <Text className="font-outfit font-bold text-base text-on-surface" numberOfLines={1}>
              {debtor.title}
            </Text>
            <Text className="text-xs font-outfit text-on-surface-variant">
              {meta.label}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <View className="items-end mr-1">
            <Text className={`font-outfit font-extrabold text-sm ${meta.amountClass}`}>
              {net > 0 ? '-' : net < 0 ? '+' : ''}
              {formatWithSymbol(Math.abs(net), currencySymbol, currencyCode)}
            </Text>
            <View className={`px-2 py-0.5 rounded-full ${badgeBg} mt-1`}>
              <Text className={`text-[10px] font-bold uppercase tracking-tighter ${badgeText}`}>
                {meta.badge}
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={16} color="#757780" />
        </View>
      </TouchableOpacity>
    );
  }, [allDebts, currencySymbol, currencyCode, handlePressDebtor]);

  const ListEmpty = useCallback(() => (
    <View className="items-center justify-center mt-20 px-4">
      <View className="w-14 h-14 rounded-2xl items-center justify-center bg-surface-container-high dark:bg-surface-variant/20 mb-4">
        <Icon name="users" size={24} color="#757780" />
      </View>
      <Text className="text-sm font-outfit text-on-surface-variant font-medium text-center">
        No one here yet
      </Text>
    </View>
  ), []);

  return (
    <FlatList
      data={debtors}
      renderItem={renderDebtorItem}
      keyExtractor={item => item.id}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmpty}
      contentContainerStyle={{ paddingBottom: 80 }}
      className="mx-4 bg-surface-container-lowest rounded-2xl border border-outline-variant divide-y divide-outline-variant/30 overflow-hidden shadow-sm"
    />
  );
});

export default memo(DebtorList);
