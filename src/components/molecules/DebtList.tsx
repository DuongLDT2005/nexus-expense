import React, { useCallback, useMemo, useRef, memo } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  Alert,
  RefreshControlProps,
} from 'react-native';
import Animated, { SharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useSelector } from 'react-redux';
import Icon from '../atoms/Icons';
import PrimaryText from '../atoms/PrimaryText';
import { Debt } from '../../types';
import { formatDate, formatCalendar } from '../../utils/dateUtils';
import { formatWithSymbol } from '../../utils/numberUtils';
import { selectCurrency } from '../../redux/slices/settingsSlice';

interface DebtListProps {
  handleEditDebt: (debtId: string) => void;
  handleDeleteDebt: (debtId: string) => void;
  individualDebts: Array<Debt>;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  tutorialSwipeRef?: React.RefObject<SwipeableMethods | null>;
}

interface GroupedDebt {
  date: string;
  debts: Array<Debt>;
  label: string;
}

const ACTION_WIDTH = 56;
const EDGE_INSET = 16;

const SwipeAction = ({
  progress,
  iconName,
  iconColor,
  backgroundColor,
  side,
  onPress,
}: {
  progress: SharedValue<number>;
  iconName: string;
  iconColor: string;
  backgroundColor: string;
  side: 'left' | 'right';
  onPress: () => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6, 1], [0, 0.8, 1]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.6, 1]) }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: ACTION_WIDTH + EDGE_INSET,
        paddingLeft: side === 'left' ? EDGE_INSET : 0,
        paddingRight: side === 'right' ? EDGE_INSET : 0,
      }}
    >
      <Animated.View
        className={`w-10 h-10 rounded-full items-center justify-center ${backgroundColor}`}
        style={animatedStyle}
      >
        <Icon name={iconName} size={18} color={iconColor} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const DebtRow = memo(({
  debt,
  onEdit,
  onDelete,
  openSwipeableRef,
  tutorialSwipeRef,
}: {
  debt: Debt;
  onEdit: (debt: Debt) => void;
  onDelete: (debtId: string) => void;
  openSwipeableRef: React.RefObject<SwipeableMethods | null>;
  tutorialSwipeRef?: React.RefObject<SwipeableMethods | null>;
}) => {
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const currency = useSelector(selectCurrency);
  const currencySymbol = currency?.symbol ?? '$';
  const currencyCode = currency?.code;

  const combinedRef = tutorialSwipeRef ?? swipeableRef;

  const handleSwipeWillOpen = useCallback(() => {
    if (openSwipeableRef.current && openSwipeableRef.current !== combinedRef.current) {
      try {
        openSwipeableRef.current.close();
      } catch (err) {
        // Safe catch if instance changed
      }
    }
    openSwipeableRef.current = combinedRef.current;
  }, [openSwipeableRef, combinedRef]);

  const handleLongPress = useCallback(() => {
    Alert.alert(
      'Options',
      'Choose an action for this debt entry',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Edit',
          onPress: () => onEdit(debt),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(debt.id),
        },
      ],
      { cancelable: true }
    );
  }, [debt, onEdit, onDelete]);

  // Set sign & colors based on type
  const isBorrow = debt.type === 'Borrow';
  const amountColorClass = isBorrow ? 'text-tertiary' : 'text-secondary';
  const amountSign = isBorrow ? '-' : '+';

  return (
    <View className="mb-2">
      <ReanimatedSwipeable
        ref={combinedRef}
        renderLeftActions={(progress, _translation, swipeableMethods) => (
          <SwipeAction
            progress={progress}
            iconName="pencil"
            iconColor="#006e2f"
            backgroundColor="bg-secondary-container"
            side="left"
            onPress={() => {
              onEdit(debt);
              swipeableMethods.close();
            }}
          />
        )}
        renderRightActions={(progress, _translation, swipeableMethods) => (
          <SwipeAction
            progress={progress}
            iconName="trash-2"
            iconColor="#95002b"
            backgroundColor="bg-tertiary-fixed-dim/30"
            side="right"
            onPress={() => {
              onDelete(debt.id);
              swipeableMethods.close();
            }}
          />
        )}
        onSwipeableWillOpen={handleSwipeWillOpen}
        friction={2}
        overshootLeft={false}
        overshootRight={false}
        overshootFriction={8}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={handleLongPress}
          className="mx-4 p-4 rounded-xl flex-row items-center justify-between bg-surface-container-lowest border border-outline-variant/30 shadow-sm"
        >
          <View className="flex-1 mr-4 gap-1">
            <PrimaryText className="font-outfit font-bold text-base text-on-surface" numberOfLines={1}>
              {debt.description}
            </PrimaryText>
            <PrimaryText className="text-xs font-outfit text-on-surface-variant">
              {formatDate(debt.date, 'Do MMM YYYY')}
            </PrimaryText>
          </View>
          <View className="items-end">
            <PrimaryText className={`font-outfit font-extrabold text-base ${amountColorClass}`}>
              {amountSign}
              {formatWithSymbol(debt.amount, currencySymbol, currencyCode)}
            </PrimaryText>
          </View>
        </TouchableOpacity>
      </ReanimatedSwipeable>
    </View>
  );
});

const DebtGroup = memo(({
  group,
  handleEditDebt,
  handleDeleteDebt,
  openSwipeableRef,
  tutorialSwipeRef,
  isFirstGroup,
}: {
  group: GroupedDebt;
  handleEditDebt: (debtId: string) => void;
  handleDeleteDebt: (debtId: string) => void;
  openSwipeableRef: React.RefObject<SwipeableMethods | null>;
  tutorialSwipeRef?: React.RefObject<SwipeableMethods | null>;
  isFirstGroup?: boolean;
}) => {
  const onEdit = useCallback((debt: Debt) => {
    handleEditDebt(debt.id);
  }, [handleEditDebt]);

  const onDelete = useCallback((debtId: string) => {
    handleDeleteDebt(debtId);
  }, [handleDeleteDebt]);

  return (
    <View className="mb-4">
      <Text className="text-xs font-outfit font-bold text-on-surface-variant mb-2 px-6 uppercase tracking-wider">
        {group.label}
      </Text>
      {group.debts.map((debt, index) => (
        <DebtRow
          key={debt.id}
          debt={debt}
          onEdit={onEdit}
          onDelete={onDelete}
          openSwipeableRef={openSwipeableRef}
          tutorialSwipeRef={isFirstGroup && index === 0 ? tutorialSwipeRef : undefined}
        />
      ))}
    </View>
  );
});

const DebtList: React.FC<DebtListProps> = ({
  handleEditDebt,
  handleDeleteDebt,
  individualDebts,
  ListHeaderComponent,
  refreshControl,
  tutorialSwipeRef,
}) => {
  const openSwipeableRef = useRef<SwipeableMethods | null>(null);

  const groupedData: GroupedDebt[] = useMemo(() => {
    const groupedMap = new Map<string, Array<Debt>>();

    individualDebts?.forEach(debt => {
      const dateKey = formatDate(debt.date, 'YYYY-MM-DD');
      const currentGroup = groupedMap.get(dateKey) ?? [];
      currentGroup.push(debt);
      groupedMap.set(dateKey, currentGroup);
    });

    return Array.from(groupedMap.keys()).map(dateKey => ({
      date: dateKey,
      debts: groupedMap.get(dateKey) ?? [],
      label: formatCalendar(dateKey),
    }));
  }, [individualDebts]);

  const renderGroupItem = useCallback(
    ({ item, index }: { item: GroupedDebt; index: number }) => (
      <DebtGroup
        group={item}
        handleEditDebt={handleEditDebt}
        handleDeleteDebt={handleDeleteDebt}
        openSwipeableRef={openSwipeableRef}
        tutorialSwipeRef={index === 0 ? tutorialSwipeRef : undefined}
        isFirstGroup={index === 0}
      />
    ),
    [handleEditDebt, handleDeleteDebt, tutorialSwipeRef]
  );

  const ListEmpty = useCallback(() => (
    <View className="items-center justify-center mt-20 px-4">
      <View className="w-14 h-14 rounded-2xl items-center justify-center bg-surface-container-high dark:bg-surface-variant/20 mb-4">
        <Icon name="hand-coins" size={24} color="#757780" />
      </View>
      <Text className="text-sm font-outfit text-on-surface-variant font-medium text-center">
        No entries yet
      </Text>
    </View>
  ), []);

  return (
    <View className="flex-1">
      <FlatList
        data={groupedData}
        renderItem={renderGroupItem}
        keyExtractor={item => item.date}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmpty}
        refreshControl={refreshControl}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

export default memo(DebtList);
