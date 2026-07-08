import { RefreshControl, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import React, { useCallback, useMemo, useRef, useState, memo } from 'react';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated';
import Icon from '../atoms/Icons';
import PrimaryText from '../atoms/PrimaryText';
import { formatDate, formatCalendar } from '../../utils/dateUtils';
import { formatWithSymbol } from '../../utils/numberUtils';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList } from '../../types';
import {
  deleteExpenseById,
  getAllExpensesByMonth,
  getAllExpensesByDate,
} from '../../services';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTransactions,
  selectSelectedMonth,
} from '../../redux/slices/transactionSlice';
import { selectUser } from '../../redux/slices/authSlice';
import { selectCurrency } from '../../redux/slices/settingsSlice';
import useColorScheme from '../../hooks/useColorScheme';
import { FlashList } from '@shopify/flash-list';
import type { AppDispatch } from '../../redux/store';
import type { ExpenseWithCategory } from '../../services/expenseService';

interface TransactionListProps {
  allExpenses: ExpenseWithCategory[];
  targetDate?: string;
  targetMonth?: string;
  edgeToEdge?: boolean;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentContainerStyle?: { paddingBottom?: number };
}

interface GroupedExpense {
  date: string;
  expenses: ExpenseWithCategory[];
  label: string;
}

const ACTION_WIDTH = 50;
const EDGE_INSET = 16;

// ─── Swipe Action Button ─────────────────────────────────────────────────────

const SwipeAction = ({
  progress,
  iconName,
  iconColor,
  backgroundColor,
  side,
  onPress,
  edgeToEdge = false,
}: {
  progress: SharedValue<number>;
  iconName: string;
  iconColor: string;
  backgroundColor: string;
  side: 'left' | 'right';
  onPress: () => void;
  edgeToEdge?: boolean;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6, 1], [0, 0.8, 1]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.6, 1]) }],
  }));

  const extraPadding = edgeToEdge ? EDGE_INSET : 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flex: 1,
        width: ACTION_WIDTH + extraPadding,
        paddingLeft: side === 'left' ? extraPadding : 0,
        paddingRight: side === 'right' ? extraPadding : 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor,
          },
          animatedStyle,
        ]}
      >
        <Icon name={iconName} size={18} color={iconColor} />
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Single Expense Row ──────────────────────────────────────────────────────

const ExpenseRow: React.FC<{
  expense: ExpenseWithCategory;
  onEdit: (expense: ExpenseWithCategory) => void;
  onDelete: (expenseId: string) => void;
  openSwipeableRef: React.RefObject<{ close: () => void } | null>;
  edgeToEdge: boolean;
}> = React.memo(({ expense, onEdit, onDelete, openSwipeableRef, edgeToEdge }) => {
  const isDark = useColorScheme() === 'dark';
  const currency = useSelector(selectCurrency);
  const currencySymbol = currency?.symbol ?? '$';
  const currencyCode = currency?.code;
  const swipeableRef = useRef<SwipeableMethods | null>(null);

  const editColor = isDark ? '#22c55e' : '#22c55e';
  const deleteColor = isDark ? '#f97316' : '#f97316';
  const actionBg = isDark ? 'rgba(199,196,216,0.1)' : 'rgba(79,70,229,0.06)';

  const handleSwipeWillOpen = useCallback(() => {
    if (openSwipeableRef.current && openSwipeableRef.current !== swipeableRef.current) {
      openSwipeableRef.current.close();
    }
    openSwipeableRef.current = swipeableRef.current;
  }, [openSwipeableRef]);

  return (
    <View className="mb-3">
      <ReanimatedSwipeable
        ref={swipeableRef}
        renderLeftActions={(progress, _translation, swipeableMethods) => (
          <SwipeAction
            progress={progress}
            iconName="pencil"
            iconColor={editColor}
            backgroundColor={actionBg}
            side="left"
            edgeToEdge={edgeToEdge}
            onPress={() => {
              onEdit(expense);
              swipeableMethods.close();
            }}
          />
        )}
        renderRightActions={(progress, _translation, swipeableMethods) => (
          <SwipeAction
            progress={progress}
            iconName="trash-2"
            iconColor={deleteColor}
            backgroundColor={actionBg}
            side="right"
            edgeToEdge={edgeToEdge}
            onPress={() => {
              onDelete(String(expense.id));
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
        <View
          className={`rounded-2xl flex-row items-center justify-between px-4 py-4 bg-white dark:bg-surface-variant/20 ${edgeToEdge ? 'mx-4' : ''
            }`}
        >
          <View className="flex-row items-center flex-1">
            <View
              className="w-11 h-11 items-center justify-center rounded-xl mr-3"
              style={{ backgroundColor: expense.category?.color ? `${expense.category.color}30` : (isDark ? 'rgba(199,196,216,0.15)' : 'rgba(79,70,229,0.12)') }}
            >
              <Icon
                name={expense.category?.icon || 'circle-dot'}
                size={20}
                color={expense.category?.color || (isDark ? '#c3c0ff' : '#4f46e5')}
              />
            </View>
            <View className="flex-1 gap-0.5">
              <PrimaryText weight="semibold" size={14} numberOfLines={1}>
                {expense.title}
              </PrimaryText>
              <PrimaryText size={11} className="text-on-surface-variant" numberOfLines={1}>
                {expense.category?.name}
                {' • '}
                {formatDate(expense.date, 'hh:mm A')}
              </PrimaryText>
            </View>
          </View>
          <View className="ml-2.5 items-end">
            <PrimaryText size={14} weight="semibold" variant="number">
              -{formatWithSymbol(expense.amount, currencySymbol, currencyCode)}
            </PrimaryText>
          </View>
        </View>
      </ReanimatedSwipeable>
    </View>
  );
});

// ─── Inline Undo Banner ──────────────────────────────────────────────────────

const InlineUndo: React.FC<{
  onUndo: () => void;
  edgeToEdge: boolean;
}> = memo(({ onUndo, edgeToEdge }) => {
  return (
    <View className="mb-1">
      <View
        className={`rounded-xl flex-row items-center justify-between px-3.5 py-3 bg-surface-high dark:bg-surface-variant/20 ${edgeToEdge ? 'mx-4' : ''
          }`}
      >
        <PrimaryText size={13} className="text-on-surface-variant">
          Transaction deleted
        </PrimaryText>
        <TouchableOpacity
          onPress={onUndo}
          activeOpacity={0.7}
          className="py-2 px-3.5 rounded-[10px] bg-primary dark:bg-primary-fixed-dim"
        >
          <PrimaryText
            size={12}
            weight="semibold"
            className="text-white dark:text-[#1d00a5]"
          >
            Undo
          </PrimaryText>
        </TouchableOpacity>
      </View>
    </View>
  );
});

// ─── Transaction Group (one date) ────────────────────────────────────────────

const TransactionItem: React.FC<{
  expenses: ExpenseWithCategory[];
  label: string;
  groupDate: string;
  targetDate?: string;
  targetMonth?: string;
  openSwipeableRef: React.RefObject<{ close: () => void } | null>;
  edgeToEdge: boolean;
}> = React.memo(
  ({ expenses: initialExpenses, label, groupDate, targetDate, targetMonth, openSwipeableRef, edgeToEdge }) => {
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector(selectUser);
    const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
    const deletionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [expenses, setExpenses] = useState(initialExpenses);
    const [deletedItemId, setDeletedItemId] = useState<string | null>(null);

    // Sync with parent when initial data changes
    React.useEffect(() => {
      setExpenses(initialExpenses);
      setDeletedItemId(null);
      if (deletionTimeoutRef.current) {
        clearTimeout(deletionTimeoutRef.current);
      }
    }, [initialExpenses]);

    const handleEdit = useCallback(
      (expense: ExpenseWithCategory) => {
        navigation.navigate('UpdateTransactionScreen', {
          expenseId: String(expense.id),
          expenseTitle: expense.title,
          expenseDescription: expense.description ?? '',
          category: expense.category as any,
          expenseDate: expense.date,
          expenseAmount: expense.amount,
        });
      },
      [navigation],
    );

    const handleDelete = useCallback(
      (expenseId: string) => {
        setDeletedItemId(expenseId);

        if (deletionTimeoutRef.current) {
          clearTimeout(deletionTimeoutRef.current);
        }

        deletionTimeoutRef.current = setTimeout(async () => {
          setExpenses((prev) => prev.filter((e) => String(e.id) !== expenseId));
          setDeletedItemId(null);
          await deleteExpenseById(expenseId);

          if (user) {
            if (targetMonth) {
              const data = await getAllExpensesByMonth(user.id, targetMonth);
              dispatch(setTransactions(data));
            }
          }
        }, 3000);
      },
      [dispatch, targetDate, targetMonth, user],
    );

    const handleUndo = useCallback(() => {
      if (deletionTimeoutRef.current) {
        clearTimeout(deletionTimeoutRef.current);
        deletionTimeoutRef.current = null;
      }
      setDeletedItemId(null);
    }, []);

    return (
      <View>
        {!targetDate && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('EverydayTransactionScreen', { date: groupDate })}
            style={{
              paddingHorizontal: edgeToEdge ? 16 : 0,
              marginTop: 30,
              marginBottom: 12
            }}
          >
            <PrimaryText size={11} weight="bold" className="text-on-surface-variant tracking-widest uppercase">
              {label}
            </PrimaryText>
          </TouchableOpacity>
        )}
        {expenses.map((item) =>
          String(item.id) === deletedItemId ? (
            <InlineUndo key={String(item.id)} onUndo={handleUndo} edgeToEdge={edgeToEdge} />
          ) : (
            <ExpenseRow
              key={String(item.id)}
              expense={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              openSwipeableRef={openSwipeableRef}
              edgeToEdge={edgeToEdge}
            />
          ),
        )}
      </View>
    );
  },
);

// ─── Main TransactionList ────────────────────────────────────────────────────

const TransactionList: React.FC<TransactionListProps> = ({
  allExpenses,
  targetDate,
  targetMonth,
  edgeToEdge = false,
  ListHeaderComponent,
  ListEmptyComponent,
  refreshing,
  onRefresh,
  contentContainerStyle,
}) => {
  const openSwipeableRef = useRef<{ close: () => void } | null>(null);

  const groupedData: GroupedExpense[] = useMemo(() => {
    const groupedExpenses = new Map<string, ExpenseWithCategory[]>();

    allExpenses?.forEach((expense) => {
      const date = formatDate(expense.date, 'YYYY-MM-DD');
      const currentGroup = groupedExpenses.get(date) ?? [];
      currentGroup.push(expense);
      groupedExpenses.set(date, currentGroup);
    });

    const sortedDates = Array.from(groupedExpenses.keys()).sort((a, b) => {
      return new Date(b).getTime() - new Date(a).getTime();
    });

    return sortedDates.map((date) => ({
      date,
      expenses: (groupedExpenses.get(date) ?? []).sort((a, b) =>
        b.date.localeCompare(a.date),
      ),
      label: formatCalendar(date),
    }));
  }, [allExpenses]);

  const renderGroupItem = useCallback(
    ({ item }: { item: GroupedExpense }) => (
      <TransactionItem
        expenses={item.expenses}
        targetDate={targetDate}
        targetMonth={targetMonth}
        label={item.label}
        groupDate={item.date}
        openSwipeableRef={openSwipeableRef}
        edgeToEdge={edgeToEdge}
      />
    ),
    [targetDate, targetMonth, edgeToEdge],
  );

  const refreshControl = useMemo(
    () =>
      onRefresh ? (
        <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh} />
      ) : undefined,
    [refreshing, onRefresh],
  );

  return (
    <FlashList
      data={groupedData}
      renderItem={renderGroupItem}
      keyExtractor={(item) => item.date}
      extraData={allExpenses}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={contentContainerStyle}
    />
  );
};

export default memo(TransactionList);
