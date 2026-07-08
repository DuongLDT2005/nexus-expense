import React from "react";
import { View, TouchableOpacity, ScrollView, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Circle } from "react-native-svg";
import dayjs from "dayjs";
import PrimaryView from "../../components/atoms/PrimaryView";
import PrimaryText from "../../components/atoms/PrimaryText";
import PrimaryButton from "../../components/atoms/PrimaryButton";
import Icon from "../../components/atoms/Icons";
import CustomLoader from "../../components/atoms/CustomLoader";
import EmptyState from "../../components/atoms/EmptyState";
import useColorScheme from "../../hooks/useColorScheme";
import { useReportsScreen } from "./useReportsScreen";
import { formatCurrency } from "../../utils/numberUtils";

export default function ReportsScreen() {
  const navigation = useNavigation<any>();
  const isDark = useColorScheme() === "dark";

  const {
    user,
    currencySymbol,
    selectedMonth,
    setSelectedMonth,
    formattedMonthLabel,
    totalSpending,
    avgSpendingPerDay,
    categoryBreakdown,
    heatmapData,
    heatmapPadding,
    monthPickerVisible,
    setMonthPickerVisible,
    recentMonthsList,
    loading,
    error,
    refetch,
    handlePrevMonth,
    handleNextMonth,
  } = useReportsScreen();

  const userInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n.charAt(0))
        .slice(0, 2)
        .join("")
    : "N";

  // Daily Activity Heatmap Grid calculations
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Helper to determine intensity bg colors
  const getIntensityClass = (intensity: number) => {
    switch (intensity) {
      case 1:
        return "bg-secondary/20 dark:bg-secondary/15";
      case 2:
        return "bg-secondary/40 dark:bg-secondary/30";
      case 3:
        return "bg-secondary/60 dark:bg-secondary/50 text-white";
      case 4:
        return "bg-secondary/85 dark:bg-secondary/80 text-white shadow-sm border border-secondary/30";
      default:
        return "bg-surface-high dark:bg-surface-container/10";
    }
  };

  // SVG pie chart dynamic computations
  const svgRadius = 40;
  const svgCircumference = 2 * Math.PI * svgRadius; // 251.2
  let accumulatedPercentage = 0;

  return (
    <PrimaryView
      useSidePadding={false}
      className="flex-grow flex flex-col justify-between bg-surface-low dark:bg-surface-lowest"
      style={{ paddingTop: 0 }}
    >
      {/* Fixed TopAppBar Header */}
      <View className="w-full bg-white dark:bg-surface-low border-b border-surface-high dark:border-outline-variant/10 flex-row justify-between items-center px-4 h-16 shadow-sm">
        <View className="flex-row items-center gap-3">
          <View className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <PrimaryText className="text-white font-bold text-sm">{userInitials}</PrimaryText>
          </View>
          <PrimaryText className="font-bold text-2xl tracking-tight text-primary dark:text-primary-fixed-dim">
            Reports
          </PrimaryText>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsScreen")}
          activeOpacity={0.7}
          className="flex items-center justify-center p-2 rounded-full hover:bg-surface-container"
        >
          <Icon name="settings" size={24} color={isDark ? "#outline" : "#464555"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="bg-surface-low dark:bg-surface-lowest flex-1"
        contentContainerStyle={{ paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="flex-grow justify-center items-center py-24">
            <CustomLoader message="Crunching report data..." />
          </View>
        ) : error ? (
          <View className="flex-grow justify-center items-center px-6 py-20 gap-4">
            <PrimaryText className="text-error font-semibold text-center text-lg">
              Failed to load reports
            </PrimaryText>
            <PrimaryText className="text-on-surface-variant text-center font-inter max-w-[280px]">
              {error}
            </PrimaryText>
            <TouchableOpacity
              onPress={refetch}
              activeOpacity={0.7}
              className="bg-primary px-6 py-3 rounded-full shadow-sm"
            >
              <PrimaryText className="text-on-primary font-bold">Retry</PrimaryText>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="px-4 gap-6">
            {/* Control Row (Month selector and statistics) */}
            <View className="gap-4">
              <View className="flex-col gap-4">
                {/* Active Month Selector Button */}
                <View className="flex-row items-center justify-between">
                  <TouchableOpacity
                    onPress={() => setMonthPickerVisible(true)}
                    activeOpacity={0.7}
                    className="flex-row items-center gap-2 bg-primary dark:bg-primary-container px-5 py-2.5 rounded-xl font-semibold shadow-md active:scale-95 transition-transform"
                  >
                    <PrimaryText className="text-white dark:text-on-primary-container font-headline font-bold text-sm">
                      {formattedMonthLabel}
                    </PrimaryText>
                    <Icon name="chevron-down" size={16} color="#ffffff" />
                  </TouchableOpacity>

                  {/* Left / Right month controls */}
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={handlePrevMonth}
                      className="w-10 h-10 rounded-xl bg-surface-lowest dark:bg-surface-low border border-surface-high dark:border-outline-variant/10 items-center justify-center"
                    >
                      <Icon name="chevron-left" size={20} color={isDark ? "#c3c0ff" : "#3525cd"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleNextMonth}
                      className="w-10 h-10 rounded-xl bg-surface-lowest dark:bg-surface-low border border-surface-high dark:border-outline-variant/10 items-center justify-center"
                    >
                      <Icon name="chevron-right" size={20} color={isDark ? "#c3c0ff" : "#3525cd"} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Statistics Cards */}
                <View className="flex-row gap-4 w-full">
                  <View className="flex-1 bg-white dark:bg-surface-low p-4 rounded-xl border border-surface-high dark:border-outline-variant/10 shadow-sm">
                    <PrimaryText className="text-on-surface-variant dark:text-outline text-[10px] font-bold uppercase tracking-wider mb-1">
                      Total
                    </PrimaryText>
                    <PrimaryText className="text-xl font-bold text-on-surface">
                      {currencySymbol}{formatCurrency(totalSpending)}
                    </PrimaryText>
                  </View>
                  <View className="flex-1 bg-white dark:bg-surface-low p-4 rounded-xl border border-surface-high dark:border-outline-variant/10 shadow-sm">
                    <PrimaryText className="text-on-surface-variant dark:text-outline text-[10px] font-bold uppercase tracking-wider mb-1">
                      Avg/Day
                    </PrimaryText>
                    <PrimaryText className="text-xl font-bold text-on-surface">
                      {currencySymbol}{formatCurrency(avgSpendingPerDay)}
                    </PrimaryText>
                  </View>
                </View>
              </View>
            </View>

            {/* Daily Activity Heatmap Card */}
            <View className="bg-white dark:bg-surface-low p-6 rounded-2xl shadow-sm border border-surface-high dark:border-outline-variant/10 gap-5">
              <View className="flex-row items-center justify-between mb-2">
                <PrimaryText className="text-lg font-bold text-on-surface dark:text-on-surface">
                  Daily Activity
                </PrimaryText>
                <Icon name="calendar" size={20} color={isDark ? "#outline" : "#777587"} />
              </View>

              {/* Grid layout */}
              <View className="gap-2">
                {/* Weekday columns header */}
                <View className="flex-row justify-between mb-1">
                  {weekdays.map((day) => (
                    <View key={day} className="flex-1 items-center">
                      <PrimaryText className="text-xs font-bold text-on-surface-variant dark:text-outline">
                        {day}
                      </PrimaryText>
                    </View>
                  ))}
                </View>

                {/* Calendar Days Matrix */}
                <View className="flex-row flex-wrap">
                  {/* Padding columns */}
                  {Array.from({ length: heatmapPadding }).map((_, i) => (
                    <View
                      key={`pad-${i}`}
                      style={{ width: `${100 / 7}%` }}
                      className="aspect-square p-0.5"
                    />
                  ))}

                  {/* Heatmap cells */}
                  {heatmapData.map((day) => (
                    <TouchableOpacity
                      key={day.dayNum}
                      onPress={() =>
                        navigation.navigate("EverydayTransactionScreen", {
                          date: day.dateStr,
                        })
                      }
                      style={{ width: `${100 / 7}%` }}
                      className="aspect-square p-0.5"
                    >
                      <View
                        className={`w-full h-full rounded-lg items-center justify-center ${getIntensityClass(
                          day.intensity
                        )}`}
                      >
                        <PrimaryText
                          style={{ fontSize: 9 }}
                          className={`font-semibold ${
                            day.intensity >= 3 ? "text-white" : "text-on-surface-variant"
                          }`}
                        >
                          {day.dayNum}
                        </PrimaryText>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Legend panel */}
              <View className="flex-row items-center justify-end gap-2 mt-2">
                <PrimaryText className="text-[10px] font-bold text-on-surface-variant dark:text-outline">
                  Less
                </PrimaryText>
                <View className="flex-row gap-1">
                  <View className="w-3.5 h-3.5 rounded-sm bg-surface-high dark:bg-surface-container/10" />
                  <View className="w-3.5 h-3.5 rounded-sm bg-secondary/20" />
                  <View className="w-3.5 h-3.5 rounded-sm bg-secondary/40" />
                  <View className="w-3.5 h-3.5 rounded-sm bg-secondary/60" />
                  <View className="w-3.5 h-3.5 rounded-sm bg-secondary" />
                </View>
                <PrimaryText className="text-[10px] font-bold text-on-surface-variant dark:text-outline">
                  More
                </PrimaryText>
              </View>
            </View>

            {/* Spending Distribution Card */}
            {categoryBreakdown.length === 0 ? (
              <View className="bg-white dark:bg-surface-low p-6 rounded-2xl shadow-sm border border-surface-high dark:border-outline-variant/10">
                <EmptyState
                  type="Insights"
                  message="No category breakdown details for this month."
                />
              </View>
            ) : (
              <View className="bg-white dark:bg-surface-low p-6 rounded-2xl shadow-sm border border-surface-high dark:border-outline-variant/10 gap-6">
                <PrimaryText className="text-lg font-bold text-on-surface">
                  Spending Distribution
                </PrimaryText>

                <View className="flex-col items-center gap-8 mt-2">
                  {/* Circle SVG ring */}
                  <View className="relative w-48 h-48 items-center justify-center flex">
                    <Svg width="192" height="192" viewBox="0 0 100 100" className="transform -rotate-90">
                      {/* Background circle */}
                      <Circle
                        cx="50"
                        cy="50"
                        r={svgRadius}
                        stroke={isDark ? "#302f39" : "#eae6f4"}
                        strokeWidth="12"
                        fill="transparent"
                      />

                      {/* Segments mapping */}
                      {categoryBreakdown.map((item) => {
                        const dashOffset = svgCircumference - (item.percentage / 100) * svgCircumference;
                        const angle = (accumulatedPercentage / 100) * 360;
                        accumulatedPercentage += item.percentage;

                        return (
                          <Circle
                            key={item.id}
                            cx="50"
                            cy="50"
                            r={svgRadius}
                            stroke={item.color}
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={svgCircumference}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            origin="50, 50"
                            rotation={angle}
                          />
                        );
                      })}
                    </Svg>

                    {/* Text center label overlay */}
                    <View className="absolute inset-0 items-center justify-center flex flex-col">
                      <PrimaryText className="text-[10px] font-bold text-on-surface-variant dark:text-outline uppercase tracking-wider">
                        Spent
                      </PrimaryText>
                      <PrimaryText className="text-xl font-bold text-on-surface">
                        {currencySymbol}{formatCurrency(totalSpending)}
                      </PrimaryText>
                    </View>
                  </View>

                  {/* Distribution Categories Legend List */}
                  <View className="w-full gap-4 pt-4 border-t border-surface-high dark:border-outline-variant/10">
                    {categoryBreakdown.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() =>
                          navigation.navigate("CategoryTransactionScreen", {
                            categoryId: item.id,
                          })
                        }
                        activeOpacity={0.7}
                        className="flex-row items-center justify-between"
                      >
                        <View className="flex-row items-center gap-3">
                          <View
                            style={{ backgroundColor: item.color }}
                            className="w-3.5 h-3.5 rounded-full"
                          />
                          <PrimaryText className="font-semibold text-on-surface text-sm">
                            {item.name}
                          </PrimaryText>
                        </View>
                        <View className="items-end">
                          <PrimaryText className="font-bold text-sm text-on-surface">
                            {currencySymbol}{formatCurrency(item.amount)}
                          </PrimaryText>
                          <PrimaryText className="text-[10px] text-on-surface-variant dark:text-outline font-bold uppercase mt-0.5">
                            {item.percentage}%
                          </PrimaryText>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* 📅 MONTH SELECTOR MODAL */}
      <Modal
        visible={monthPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMonthPickerVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="w-full max-w-[300px] bg-white dark:bg-surface-low border border-surface-high dark:border-outline-variant/10 rounded-3xl p-6 shadow-2xl gap-5">
            <View className="items-center">
              <PrimaryText className="font-headline font-bold text-lg text-on-surface">
                Select Month
              </PrimaryText>
            </View>

            <View className="gap-2">
              {recentMonthsList.map((m) => {
                const isSelected = selectedMonth === m;
                const displayLabel = dayjs(m).format("MMMM YYYY");
                return (
                  <TouchableOpacity
                    key={m}
                    onPress={() => {
                      setSelectedMonth(m);
                      setMonthPickerVisible(false);
                    }}
                    activeOpacity={0.7}
                    className={`flex-row items-center justify-between p-4 rounded-xl border ${
                      isSelected
                        ? "bg-primary/10 border-primary"
                        : "bg-surface-low/50 dark:bg-surface-lowest/5 border-transparent"
                    }`}
                  >
                    <PrimaryText
                      className={`font-inter text-sm font-semibold ${
                        isSelected ? "text-primary font-bold" : "text-on-surface-variant"
                      }`}
                    >
                      {displayLabel}
                    </PrimaryText>
                    {isSelected && (
                      <Icon name="check" size={16} color={isDark ? "#c3c0ff" : "#3525cd"} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <PrimaryButton
              onPress={() => setMonthPickerVisible(false)}
              buttonTitle="Cancel"
              variant="outline"
            />
          </View>
        </View>
      </Modal>
    </PrimaryView>
  );
}
