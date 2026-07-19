import React, { memo, useRef, useCallback, useState } from "react";
import { View, TouchableOpacity, RefreshControl, FlatList } from "react-native";
import PrimaryView from "../../components/atoms/PrimaryView";
import HeaderContainer from "../../components/molecules/HeaderContainer";
import PrimaryText from "../../components/atoms/PrimaryText";
import Icon from "../../components/atoms/Icons";
import EmptyState from "../../components/atoms/EmptyState";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { useCategoryScreen } from "./useCategoryScreen";
import { Category } from "../../types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../types";

import useColorScheme from "../../hooks/useColorScheme";

import { TouchableOpacity as GestureTouchableOpacity } from "react-native-gesture-handler";
import ConfirmModal from "../../components/molecules/ConfirmModal";

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
        className={`h-full items-center justify-center ${bgClassName}`}
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

const CategoryRow = memo(
  ({
    category,
    onEdit,
    onDelete,
    openSwipeableRef,
    stats,
    currencySymbol,
  }: {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
    openSwipeableRef: React.RefObject<{ close: () => void } | null>;
    stats: { count: number; totalAmount: number };
    currencySymbol: string;
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

    const navigation =
      useNavigation<NativeStackNavigationProp<MainStackParamList>>();

    const formatAmount = (amount: number) => {
      return `${currencySymbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const editIconColor = isDark ? "#c3c0ff" : "#4f46e5"; // --primary
    const editBgClass = "bg-surface-highest";
    const deleteIconColor = isDark ? "#400010" : "#95002b"; // --tertiary
    const deleteBgClass = "bg-tertiary-fixed-dim";

    const fallbackColor = isDark ? "#c3c0ff" : "#4f46e5";

    return (
      <View className="mb-4 bg-surface-lowest border border-surface-high rounded-md overflow-hidden shadow-sm">
        <ReanimatedSwipeable
          ref={swipeableRef}
          renderLeftActions={(progress, _translation, swipeableMethods) => (
            <SwipeAction
              progress={progress}
              iconName="pencil"
              iconColor={editIconColor}
              bgClassName={editBgClass}
              onPress={() => {
                onEdit(category);
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
                onDelete(category.id);
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
              navigation.navigate("CategoryTransactionScreen", {
                categoryId: category.id,
                categoryName: category.name,
                categoryColor: category.color,
                categoryIcon: category.icon,
                yearMonth: new Date().toISOString().slice(0, 7),
              })
            }
            className="bg-surface-lowest p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-4">
              <View
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: (category.color || fallbackColor) + "1A",
                }}
              >
                <Icon
                  name={category.icon || "shapes"}
                  size={24}
                  color={category.color || fallbackColor}
                />
              </View>
              <View>
                <PrimaryText className="font-bold text-on-surface text-lg">
                  {category.name}
                </PrimaryText>
                <PrimaryText className="text-sm text-on-surface-variant font-inter">
                  {stats.count} Transactions
                </PrimaryText>
              </View>
            </View>
            <View className="items-end">
              <PrimaryText className="text-primary font-bold" numberOfLines={1}>
                {formatAmount(stats.totalAmount)}
              </PrimaryText>
            </View>
          </TouchableOpacity>
        </ReanimatedSwipeable>
      </View>
    );
  },
);

export default function CategoryScreen() {
  const isDark = useColorScheme() === "dark";
  const {
    categories,
    refreshing,
    onRefresh,
    handleEdit,
    handleDelete,
    currencySymbol,
    getCategoryStats,
  } = useCategoryScreen();
  
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const openSwipeableRef = useRef<{ close: () => void } | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const renderCategoryItem = useCallback(
    ({ item: category }: { item: Category }) => (
      <CategoryRow
        category={category}
        onEdit={handleEdit}
        onDelete={(id) => setCategoryToDelete(id)}
        openSwipeableRef={openSwipeableRef}
        stats={getCategoryStats(category.id)}
        currencySymbol={currencySymbol}
      />
    ),
    [handleEdit, getCategoryStats, currencySymbol],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View className="mt-[30%]">
        <EmptyState type={"Categories"} />
      </View>
    ),
    [],
  );

  const ListHeaderComponent = useCallback(
    () => (
      <View className="mb-6">
        <PrimaryText className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
          Manage Categories
        </PrimaryText>
        <PrimaryText className="text-on-surface-variant text-sm font-inter">
          Organize your spending with custom labels and icons.
        </PrimaryText>
      </View>
    ),
    [],
  );

  return (
    <PrimaryView
      useSidePadding={false}
      className="bg-surface-low"
      style={{ paddingTop: 0, paddingBottom: 0 }}
    >
      <HeaderContainer headerText="Categories" />
      <View className="flex-1">
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item: Category) => String(item.id)}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 25,
            paddingBottom: 25,
          }}
        />
      </View>
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          className="w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:scale-90"
          onPress={() => navigation.navigate("AddCategoryScreen")}
        >
          <Icon name="plus" size={30} color={isDark ? "#1d00a5" : "#ffffff"} />
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={() => {
          if (categoryToDelete) {
            handleDelete(categoryToDelete);
          }
        }}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDamage={true}
      />
    </PrimaryView>
  );
}
