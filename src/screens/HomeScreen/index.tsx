import React, { useCallback, useEffect, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../../types";
import { useHomeScreen } from "./useHomeScreen";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";

import Icon from "../../components/atoms/Icons";
import PrimaryView from "../../components/atoms/PrimaryView";
import PrimaryText from "../../components/atoms/PrimaryText";
import EmptyState from "../../components/atoms/EmptyState";
import HeaderContainer from "../../components/molecules/HeaderContainer";
import TransactionList from "../../components/molecules/TransactionList";
import MonthYearPicker from "../../components/molecules/MonthYearPicker";
import { formatWithSymbol } from "../../utils/numberUtils";
import useColorScheme from "../../hooks/useColorScheme";

export default function HomeScreen() {
  const {
    refreshing,
    currencySymbol,
    onRefresh,
    sortedTransactions,
    selectedYear,
    selectedMonthIndex,
    selectedMonthName,
    selectedMonth,
    availableYears,
    todayTotal,
    totalSpent,
    handleMonthYearSelect,
    showMonthPicker,
    setShowMonthPicker,
    currency,
  } = useHomeScreen();

  const user = useSelector(selectUser);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const isDark = useColorScheme() === "dark";

  // Redirect to ChooseCurrency if not set
  useEffect(() => {
    if (user && !user.currencyId) {
      navigation.navigate("ChooseCurrencyScreen", { isFromSettings: false });
    }
  }, [user, navigation]);

  const greetingText = user?.fullName
    ? `Hey, ${user.fullName.split(" ")[0]}`
    : "Hey, there";

  // ─── Summary Cards + Section Title (List Header) ──────────────────────────

  const listHeader = useMemo(
    () => (
      <View className="px-4">
        {/* Month / Today summary cards */}
        <View className="flex-row gap-3 mt-4 mb-5">
          {/* MONTH card */}
          <TouchableOpacity
            onPress={() => setShowMonthPicker(true)}
            activeOpacity={0.7}
            className="flex-1 rounded-2xl px-4 py-3.5 bg-white dark:bg-surface-variant/20 border border-surface-high"
          >
            <View className="flex-row items-center justify-between mb-2.5">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{
                  backgroundColor: isDark
                    ? "rgba(139,130,255,0.2)"
                    : "rgba(79,70,229,0.15)",
                }}
              >
                <Icon
                  name="calendar"
                  size={19}
                  color={isDark ? "#a5a0ff" : "#4f46e5"}
                />
              </View>
              <View className="flex-row items-center gap-1 bg-surface-variant/10 px-2 py-1 rounded-full border border-surface-high">
                <PrimaryText size={10} weight="semibold" className="text-on-surface-variant font-inter">
                  {selectedMonthName} {selectedYear}
                </PrimaryText>
                <Icon
                  name="chevron-down"
                  size={10}
                  color={isDark ? "#a5a0ff" : "#4f46e5"}
                />
              </View>
            </View>
            <PrimaryText
              size={10}
              weight="bold"
              className="text-on-surface-variant tracking-widest uppercase mb-1"
            >
              This Month
            </PrimaryText>
            <PrimaryText size={22} weight="bold" variant="number">
              {formatWithSymbol(totalSpent, currencySymbol, currency?.code)}
            </PrimaryText>
          </TouchableOpacity>

          {/* TODAY card */}
          <View
            className="flex-1 rounded-2xl px-4 py-3.5 bg-white dark:bg-surface-variant/20 border border-surface-high"
          >
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mb-2.5"
              style={{
                backgroundColor: isDark
                  ? "rgba(74,222,128,0.18)"
                  : "rgba(22,163,74,0.13)",
              }}
            >
              <Icon
                name="calendar-days"
                size={19}
                color={isDark ? "#86efac" : "#16a34a"}
              />
            </View>
            <PrimaryText
              size={10}
              weight="bold"
              className="text-on-surface-variant tracking-widest uppercase mb-1"
            >
              Today
            </PrimaryText>
            <PrimaryText size={22} weight="bold" variant="number">
              {formatWithSymbol(todayTotal, currencySymbol, currency?.code)}
            </PrimaryText>
          </View>
        </View>

        <PrimaryText
          size={16}
          weight="bold"
          className="mb-2 mt-2 text-secondary"
        >
          All Transactions
        </PrimaryText>
      </View>
    ),
    [
      totalSpent,
      todayTotal,
      selectedMonthName,
      selectedYear,
      currencySymbol,
      isDark,
      setShowMonthPicker,
      currency,
    ],
  );

  // ─── Empty State ──────────────────────────────────────────────────────────

  const listEmpty = useMemo(
    () => (
      <View className="px-4">
        <EmptyState type="Transactions" />
      </View>
    ),
    [],
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <PrimaryView
        useSidePadding={false}
        useBottomPadding={false}
        className="bg-surface-low"
        style={{ paddingTop: 0 }}
      >
        <HeaderContainer headerText={greetingText} />

        <TransactionList
          allExpenses={sortedTransactions}
          edgeToEdge
          targetMonth={selectedMonth}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={listEmpty}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </PrimaryView>

      {/* FAB - Add Transaction */}
      <View className="absolute bottom-5 right-5 z-10">
        <TouchableOpacity
          className="w-14 h-14 rounded-full items-center justify-center"
          style={{
            backgroundColor: "#4338ca",
            shadowColor: "#4338ca",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 8,
          }}
          onPress={() => navigation.navigate("AddTransactionsScreen")}
          accessibilityLabel="Add transaction"
          accessibilityRole="button"
        >
          <Icon name="plus" size={26} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Month/Year Picker Modal */}
      <MonthYearPicker
        visible={showMonthPicker}
        selectedMonth={selectedMonthIndex}
        selectedYear={selectedYear}
        availableYears={availableYears}
        onSelect={handleMonthYearSelect}
        onClose={() => setShowMonthPicker(false)}
      />
    </>
  );
}
