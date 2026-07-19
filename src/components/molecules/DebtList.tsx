import React, { useCallback, useMemo, useRef, memo, useState } from "react";
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  Alert,
  RefreshControlProps,
} from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import { useSelector } from "react-redux";
import Icon from "../atoms/Icons";
import PrimaryText from "../atoms/PrimaryText";
import { Debt } from "../../types";
import { formatDate, formatCalendar } from "../../utils/dateUtils";
import { formatWithSymbol } from "../../utils/numberUtils";
import { selectCurrency } from "../../redux/slices/settingsSlice";
import { DEBT_TYPE } from "../../constants/debtTypes";
import EmptyState from "../atoms/EmptyState";
import useColorScheme from "../../hooks/useColorScheme";
import { TouchableOpacity as GestureTouchableOpacity } from "react-native-gesture-handler";
import ConfirmModal from "./ConfirmModal";

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

const ACTION_WIDTH = 55;

const SwipeAction = memo(
  ({
    progress,
    iconName,
    iconColor,
    bgClassName,
    onPress,
  }: {
    progress: SharedValue<number>;
    iconName: string;
    iconColor: string;
    bgClassName: string;
    onPress: () => void;
  }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: interpolate(progress.value, [0, 0.6, 1], [0, 0.8, 1]),
      transform: [{ scale: interpolate(progress.value, [0, 1], [0.6, 1]) }],
    }));

    return (
      <View
        className={"h-full items-center justify-center " + bgClassName}
        style={{ width: ACTION_WIDTH }}
      >
        <GestureTouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          style={{
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={iconName} size={20} color={iconColor} />
        </GestureTouchableOpacity>
      </View>
    );
  },
);

const DebtRow = memo(
  ({
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
    const isDark = useColorScheme() === "dark";
    const swipeableRef = useRef<SwipeableMethods | null>(null);
    const currency = useSelector(selectCurrency);
    const currencySymbol = currency?.symbol ?? "$";
    const currencyCode = currency?.code;

    const combinedRef = tutorialSwipeRef ?? swipeableRef;

    const handleSwipeWillOpen = useCallback(() => {
      if (
        openSwipeableRef.current &&
        openSwipeableRef.current !== combinedRef.current
      ) {
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
        "Options",
        "Choose an action for this debt entry",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Edit",
            onPress: () => onEdit(debt),
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => onDelete(debt.id),
          },
        ],
        { cancelable: true },
      );
    }, [debt, onEdit, onDelete]);

    // Set sign & colors based on type
    const isBorrow = debt.type === DEBT_TYPE.BORROW;
    const amountColorClass = isBorrow ? "text-tertiary" : "text-secondary";
    const amountSign = isBorrow ? "-" : "+";

    const editIconColor = isDark ? "#c3c0ff" : "#4f46e5";
    const editBgClass = "bg-surface-highest";
    const deleteIconColor = isDark ? "#400010" : "#95002b";
    const deleteBgClass = "bg-tertiary-fixed-dim";

    return (
      <View className="mb-3 mx-4 bg-surface-lowest border border-surface-high rounded-md overflow-hidden shadow-sm">
        <ReanimatedSwipeable
          ref={combinedRef}
          renderLeftActions={(progress, _translation, swipeableMethods) => (
            <SwipeAction
              progress={progress}
              iconName="pencil"
              iconColor={editIconColor}
              bgClassName={editBgClass}
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
              iconColor={deleteIconColor}
              bgClassName={deleteBgClass}
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
            className="bg-surface-lowest p-3 flex-row items-center justify-between"
          >
            <View className="flex-1 mr-4 gap-1">
              <PrimaryText
                className="font-outfit font-bold text-base text-on-surface"
                numberOfLines={1}
              >
                {debt.description}
              </PrimaryText>
              <PrimaryText className="text-xs font-outfit text-on-surface-variant">
                {formatDate(debt.date, "Do MMM YYYY")}
              </PrimaryText>
            </View>
            <View className="items-end">
              <PrimaryText
                className={`font-outfit font-extrabold text-base ${amountColorClass}`}
              >
                {amountSign}
                {formatWithSymbol(debt.amount, currencySymbol, currencyCode)}
              </PrimaryText>
            </View>
          </TouchableOpacity>
        </ReanimatedSwipeable>
      </View>
    );
  },
);

const DebtGroup = memo(
  ({
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
    const onEdit = useCallback(
      (debt: Debt) => {
        handleEditDebt(debt.id);
      },
      [handleEditDebt],
    );

    const onDelete = useCallback(
      (debtId: string) => {
        handleDeleteDebt(debtId);
      },
      [handleDeleteDebt],
    );

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
            tutorialSwipeRef={
              isFirstGroup && index === 0 ? tutorialSwipeRef : undefined
            }
          />
        ))}
      </View>
    );
  },
);

const DebtList: React.FC<DebtListProps> = ({
  handleEditDebt,
  handleDeleteDebt,
  individualDebts,
  ListHeaderComponent,
  refreshControl,
  tutorialSwipeRef,
}) => {
  const openSwipeableRef = useRef<SwipeableMethods | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const groupedData: GroupedDebt[] = useMemo(() => {
    const groupedMap = new Map<string, Array<Debt>>();

    individualDebts?.forEach((debt) => {
      const dateKey = formatDate(debt.date, "YYYY-MM-DD");
      const currentGroup = groupedMap.get(dateKey) ?? [];
      currentGroup.push(debt);
      groupedMap.set(dateKey, currentGroup);
    });

    return Array.from(groupedMap.keys()).map((dateKey) => ({
      date: dateKey,
      debts: groupedMap.get(dateKey) ?? [],
      label: formatCalendar(dateKey),
    }));
  }, [individualDebts]);

  const confirmDelete = useCallback(() => {
    if (deleteTargetId) {
      handleDeleteDebt(deleteTargetId);
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, handleDeleteDebt]);

  const cancelDelete = useCallback(() => {
    setDeleteTargetId(null);
  }, []);

  const onDeletePress = useCallback((debtId: string) => {
    setDeleteTargetId(debtId);
  }, []);

  const renderGroupItem = useCallback(
    ({ item, index }: { item: GroupedDebt; index: number }) => (
      <DebtGroup
        group={item}
        handleEditDebt={handleEditDebt}
        handleDeleteDebt={onDeletePress}
        openSwipeableRef={openSwipeableRef}
        tutorialSwipeRef={index === 0 ? tutorialSwipeRef : undefined}
        isFirstGroup={index === 0}
      />
    ),
    [handleEditDebt, onDeletePress, tutorialSwipeRef],
  );

  const ListEmpty = useCallback(
    () => (
      <View className="mt-[20%]">
        <EmptyState type="Debts" />
      </View>
    ),
    [],
  );

  return (
    <View className="flex-1">
      <FlatList
        data={groupedData}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.date}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmpty}
        refreshControl={refreshControl}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <ConfirmModal
        visible={deleteTargetId !== null}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Debt"
        message="Are you sure you want to delete this debt entry?"
        isDamage={true}
      />
    </View>
  );
};

export default memo(DebtList);
