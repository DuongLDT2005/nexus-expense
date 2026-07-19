import React, { useCallback, useMemo } from "react";
import { View, SectionList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryView from "../../components/atoms/PrimaryView";
import AppHeader from "../../components/atoms/AppHeader";
import PrimaryText from "../../components/atoms/PrimaryText";
import Icon from "../../components/atoms/Icons";
import { useCategoryTransactionScreen } from "./useCategoryTransactionScreen";
import { Expense } from "../../types";

export default function CategoryTransactionScreen() {
  const navigation = useNavigation<any>();
  const {
    groupedTransactions,
    totalAmount,
    categoryName,
    categoryColor,
    categoryIcon,
    monthLabel,
    transactions,
    formatAmount,
    isLoading,
  } = useCategoryTransactionScreen();

  // ─── Sub-components (only used in this screen, no complex logic) ─────────

  const listHeader = useMemo(
    () => (
      <View className="rounded-md py-6 px-6 mb-6 mt-4 bg-surface-high flex-row items-center gap-4 border border-surface-high">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: (categoryColor || "#4f46e5") + "1A" }}
        >
          <Icon
            name={categoryIcon || "shapes"}
            size={24}
            color={categoryColor || "#4f46e5"}
          />
        </View>
        <View className="flex-1">
          <PrimaryText className="text-xs text-on-surface-variant font-medium font-inter">
            {monthLabel}
          </PrimaryText>
          <PrimaryText
            className="text-3xl font-bold tracking-tight text-on-surface"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatAmount(totalAmount)}
          </PrimaryText>
        </View>
        <View className="px-3 py-2 rounded-full bg-surface-highest">
          <PrimaryText className="text-xs font-bold text-on-surface-variant font-inter">
            {transactions.length} txns
          </PrimaryText>
        </View>
      </View>
    ),
    [
      categoryColor,
      categoryIcon,
      monthLabel,
      totalAmount,
      transactions.length,
      formatAmount,
    ],
  );

  const listEmpty = useMemo(
    () => (
      <View className="items-center justify-center py-20 px-10">
        <View className="h-32 w-32 mb-6 items-center justify-center rounded-full bg-surface-high">
          <Icon name="receipt" size={64} color="#777587" />
        </View>
        <PrimaryText className="text-on-surface text-xl font-bold mb-2 text-center">
          No transactions in {categoryName}
        </PrimaryText>
        <PrimaryText className="text-on-surface-variant text-sm text-center font-inter">
          Looks like you haven't recorded any {categoryName.toLowerCase()}{" "}
          expenses for this month yet.
        </PrimaryText>
      </View>
    ),
    [categoryName],
  );

  const renderItem = useCallback(
    ({ item }: { item: Expense }) => {
      const timeDisplay = item.time ?? "";
      return (
        <View className="mb-3 rounded-md bg-surface-lowest border border-outline-variant/15 shadow-sm overflow-hidden">
          <View className="flex-row items-center p-4 gap-3">
            {/* Category icon — fixed width, never shrinks */}
            <View
              className="shrink-0 h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: (categoryColor || "#4f46e5") + "1A" }}
            >
              <Icon
                name={categoryIcon || "shapes"}
                size={22}
                color={categoryColor || "#4f46e5"}
              />
            </View>

            {/* Title + description — flex-1 so it fills space and wraps if needed */}
            <View className="flex-1 min-w-0">
              <PrimaryText
                className="text-on-surface text-sm font-bold leading-snug"
                numberOfLines={2}
              >
                {item.title}
              </PrimaryText>
              <PrimaryText
                className="text-on-surface-variant text-xs font-normal mt-0.5 font-inter"
                numberOfLines={2}
              >
                {item.description
                  ? `${item.description}${timeDisplay ? " · " + timeDisplay : ""}`
                  : timeDisplay}
              </PrimaryText>
            </View>

            {/* Amount — shrink-0 so it NEVER moves regardless of title length */}
            <View className="shrink-0 items-end pl-2">
              <PrimaryText
                className="text-tertiary text-sm font-bold"
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                -{formatAmount(item.amount)}
              </PrimaryText>
            </View>
          </View>
        </View>
      );
    },
    [categoryIcon, categoryColor, formatAmount],
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }: any) => (
      <PrimaryText className="text-on-surface-variant text-sm font-bold uppercase tracking-widest px-2 mb-3 mt-4 font-inter">
        {title}
      </PrimaryText>
    ),
    [],
  );

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <PrimaryView
      useSidePadding={false}
      className="bg-surface-low"
      style={{ paddingTop: 0, paddingBottom: 0 }}
    >
      {/* AppHeader (atom) with back button — Pattern 2: Detail Screen */}
      <AppHeader onPress={() => navigation.goBack()} text={categoryName} />

      <View className="flex-1">
        <SectionList
          sections={groupedTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            transactions.length === 0 && !isLoading ? listEmpty : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 15,
            paddingBottom: 25,
          }}
        />
      </View>
    </PrimaryView>
  );
}
