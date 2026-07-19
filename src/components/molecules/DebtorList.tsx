import React, { memo, useRef, useCallback } from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { TouchableOpacity as GestureTouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { selectCurrency } from "../../redux/slices/settingsSlice";
import Icon from "../atoms/Icons";
import PrimaryText from "../atoms/PrimaryText";
import EmptyState from "../atoms/EmptyState";
import { Debtor, Debt, HomeStackParamList } from "../../types";
import { formatWithSymbol } from "../../utils/numberUtils";
import { computeDebtorNet, getDebtorRowMeta } from "../../utils/debtUtils";
import useColorScheme from "../../hooks/useColorScheme";

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

const DebtorRow = memo(
  ({
    debtor,
    allDebts,
    currencySymbol,
    currencyCode,
    onEdit,
    onDelete,
    openSwipeableRef,
    navigation,
  }: {
    debtor: Debtor;
    allDebts: any[];
    currencySymbol: string;
    currencyCode?: string;
    onEdit: (debtor: Debtor) => void;
    onDelete: (id: string) => void;
    openSwipeableRef: React.RefObject<{ close: () => void } | null>;
    navigation: any;
  }) => {
    const isDark = useColorScheme() === "dark";
    const swipeableRef = useRef<SwipeableMethods | null>(null);

    const handleSwipeWillOpen = useCallback(() => {
      if (
        openSwipeableRef.current &&
        openSwipeableRef.current !== swipeableRef.current
      ) {
        openSwipeableRef.current.close();
      }
      openSwipeableRef.current = swipeableRef.current;
    }, [openSwipeableRef]);

    const net = computeDebtorNet(allDebts, debtor.id);
    const meta = getDebtorRowMeta(net);

    const initials = debtor.title
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const editIconColor = isDark ? "#c3c0ff" : "#4f46e5";
    const editBgClass = "bg-surface-highest";
    const deleteIconColor = isDark ? "#ffb2b7" : "#95002b";
    const deleteBgClass = "bg-tertiary-fixed-dim";

    const fallbackColor = isDark ? "#c3c0ff" : "#4f46e5";

    let badgeBg = "bg-surface-highest";
    let badgeText = "text-on-surface-variant";

    if (net < 0) {
      badgeBg = "bg-secondary-container";
      badgeText = "text-secondary-on-container";
    } else if (net > 0) {
      badgeBg = "bg-tertiary-fixed-dim/50";
      badgeText = "text-tertiary";
    }

    return (
      <View className="mb-3 bg-surface-lowest border border-surface-high rounded-md overflow-hidden shadow-sm">
        <ReanimatedSwipeable
          ref={swipeableRef}
          renderLeftActions={(progress, _translation, swipeableMethods) => (
            <SwipeAction
              progress={progress}
              iconName="pencil"
              iconColor={editIconColor}
              bgClassName={editBgClass}
              onPress={() => {
                onEdit(debtor);
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
                onDelete(debtor.id);
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
            onPress={() =>
              navigation.navigate("IndividualDebtsScreen", {
                debtorId: debtor.id,
              })
            }
            className="bg-surface-lowest p-3 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-4 flex-1">
              <View
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: (debtor.color || fallbackColor) + "1A",
                }}
              >
                {debtor.icon ? (
                  <Icon
                    name={debtor.icon}
                    size={24}
                    color={debtor.color || fallbackColor}
                  />
                ) : (
                  <PrimaryText
                    style={{ color: debtor.color || fallbackColor }}
                    className="font-bold text-sm font-outfit"
                  >
                    {initials}
                  </PrimaryText>
                )}
              </View>
              <View className="flex-1">
                <PrimaryText
                  className="font-bold text-on-surface text-lg"
                  numberOfLines={1}
                >
                  {debtor.title}
                </PrimaryText>
                <PrimaryText className="text-sm text-on-surface-variant font-inter">
                  {meta.label}
                </PrimaryText>
              </View>
            </View>
            <View className="items-end mr-1">
              <PrimaryText
                className={`font-bold text-base ${meta.amountClass}`}
                numberOfLines={1}
              >
                {net > 0 ? "-" : net < 0 ? "+" : ""}
                {formatWithSymbol(Math.abs(net), currencySymbol, currencyCode)}
              </PrimaryText>
              <View className={`px-2 py-0.5 rounded-full overflow-hidden ${badgeBg} mt-1`}>
                <PrimaryText
                  className={`text-[10px] font-bold uppercase tracking-tighter ${badgeText}`}
                >
                  {meta.badge}
                </PrimaryText>
              </View>
            </View>
          </TouchableOpacity>
        </ReanimatedSwipeable>
      </View>
    );
  },
);

interface DebtorListProps {
  debtors: Debtor[];
  allDebts: Debt[];
  onEdit: (debtor: Debtor) => void;
  onDelete: (id: string) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  refreshControl?: React.ReactElement<any>;
}

const DebtorList: React.FC<DebtorListProps> = memo(
  ({
    debtors,
    allDebts,
    onEdit,
    onDelete,
    ListHeaderComponent,
    refreshControl,
  }) => {
    const navigation =
      useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
    const currency = useSelector(selectCurrency);
    const currencySymbol = currency?.symbol ?? "$";
    const currencyCode = currency?.code;
    const openSwipeableRef = useRef<{ close: () => void } | null>(null);

    const renderDebtorItem = useCallback(
      ({ item: debtor }: { item: Debtor }) => (
        <DebtorRow
          debtor={debtor}
          allDebts={allDebts}
          currencySymbol={currencySymbol}
          currencyCode={currencyCode}
          onEdit={onEdit}
          onDelete={onDelete}
          openSwipeableRef={openSwipeableRef}
          navigation={navigation}
        />
      ),
      [allDebts, currencySymbol, currencyCode, onEdit, onDelete, navigation],
    );

    const ListEmptyComponent = useCallback(
      () => (
        <View className="mt-10">
          <EmptyState type="Debts" />
        </View>
      ),
      [],
    );

    return (
      <FlatList
        data={debtors}
        renderItem={renderDebtorItem}
        keyExtractor={(item: Debtor) => String(item.id)}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
      />
    );
  },
);

export default memo(DebtorList);
