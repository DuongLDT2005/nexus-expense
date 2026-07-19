import React from "react";
import { View, TouchableOpacity, RefreshControl, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PrimaryView from "../../components/atoms/PrimaryView";
import AppHeader from "../../components/atoms/AppHeader";
import CustomLoader from "../../components/atoms/CustomLoader";
import Icon from "../../components/atoms/Icons";
import DebtList from "../../components/molecules/DebtList";
import { useIndividualDebtsScreen } from "./useIndividualDebtsScreen";
import { formatWithSymbol } from "../../utils/numberUtils";
import { HomeStackParamList } from "../../types";

function IndividualDebtsListHeader({
  totalBorrowings,
  totalLendings,
  debtorTotal,
  currencySymbol,
  currencyCode,
  isTabBorrow,
  onSetBorrowTab,
  onSetLendTab,
  onMarkAsPaid,
  onUpdateDebtor,
  onDeleteDebtor,
}: {
  totalBorrowings: number;
  totalLendings: number;
  debtorTotal: number;
  currencySymbol: string;
  currencyCode?: string;
  isTabBorrow: boolean;
  onSetBorrowTab: () => void;
  onSetLendTab: () => void;
  onMarkAsPaid: () => void;
  onUpdateDebtor: () => void;
  onDeleteDebtor: () => void;
}) {
  let statusText = "Settled";
  let statusColorClass = "text-on-surface";

  if (debtorTotal > 0) {
    statusText = `You owe ${formatWithSymbol(debtorTotal, currencySymbol, currencyCode)}`;
    statusColorClass = "text-tertiary";
  } else if (debtorTotal < 0) {
    statusText = `Owes you ${formatWithSymbol(Math.abs(debtorTotal), currencySymbol, currencyCode)}`;
    statusColorClass = "text-secondary";
  }

  return (
    <View className="px-4 mb-6 mt-4">
      {/* Side-by-side summary cards */}
      <View className="flex-row gap-4 mb-6">
        <View className="flex-1 bg-surface-lowest p-4 rounded-md shadow-sm border-l-4 border-tertiary">
          <Text className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 font-inter">
            Borrowed
          </Text>
          <Text className="text-xl font-bold text-tertiary">
            {formatWithSymbol(totalBorrowings, currencySymbol, currencyCode)}
          </Text>
        </View>
        <View className="flex-1 bg-surface-lowest p-4 rounded-md shadow-sm border-l-4 border-secondary">
          <Text className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 font-inter">
            Lent
          </Text>
          <Text className="text-xl font-bold text-secondary">
            {formatWithSymbol(totalLendings, currencySymbol, currencyCode)}
          </Text>
        </View>
      </View>

      {/* Net Balance & Action Row */}
      <View className="bg-surface-lowest p-4 rounded-lg mb-8 flex-row items-center justify-between shadow-sm">
        <View className="flex-col gap-0.5">
          <Text className="text-xs font-semibold text-outline uppercase font-inter">
            Status
          </Text>
          <Text className={`text-lg font-bold ${statusColorClass}`}>
            {statusText}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={onMarkAsPaid}
            activeOpacity={0.7}
            className="w-10 h-10 items-center justify-center rounded-full bg-secondary-container"
          >
            <Icon name="check-circle" size={18} color="#007432" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onUpdateDebtor}
            activeOpacity={0.7}
            className="w-10 h-10 items-center justify-center rounded-full bg-primary"
          >
            <Icon name="pencil" size={18} color="#dad7ff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDeleteDebtor}
            activeOpacity={0.7}
            className="w-10 h-10 items-center justify-center rounded-full bg-tertiary-fixed-dim"
          >
            <Icon name="trash-2" size={18} color="#95002b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Pill Navigation with static classNames */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSetBorrowTab}
          className="px-6 py-2 rounded-full"
          style={{
            backgroundColor: isTabBorrow ? "#95002b" : "#eae6f4",
          }}
        >
          <Text
            className="text-sm font-semibold font-outfit"
            style={{
              color: isTabBorrow ? "#ffffff" : "#464555",
            }}
          >
            Borrowed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSetLendTab}
          className="px-6 py-2 rounded-full"
          style={{
            backgroundColor: !isTabBorrow ? "#006e2f" : "#eae6f4",
          }}
        >
          <Text
            className="text-sm font-semibold font-outfit"
            style={{
              color: !isTabBorrow ? "#ffffff" : "#464555",
            }}
          >
            Lent
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function IndividualDebtsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const {
    debtorName,
    debtorId,
    refreshing,
    onRefresh,
    isTabBorrow,
    handleSetTab,
    currentDebts,
    totalBorrowings,
    totalLendings,
    debtorTotal,
    handleEditDebt,
    handleDeleteDebt,
    handleMarkAsPaid,
    handleUpdateDebtor,
    handleDeleteDebtor,
    isLoadingDebtor,
    currencySymbol,
    currencyCode,
    isDark,
    fabIconColor,
  } = useIndividualDebtsScreen();

  const listHeader = (
    <IndividualDebtsListHeader
      totalBorrowings={totalBorrowings}
      totalLendings={totalLendings}
      debtorTotal={debtorTotal}
      currencySymbol={currencySymbol}
      currencyCode={currencyCode}
      isTabBorrow={isTabBorrow}
      onSetBorrowTab={() => handleSetTab("Borrow")}
      onSetLendTab={() => handleSetTab("Lend")}
      onMarkAsPaid={handleMarkAsPaid}
      onUpdateDebtor={handleUpdateDebtor}
      onDeleteDebtor={handleDeleteDebtor}
    />
  );

  if (isLoadingDebtor) {
    return (
      <View className="flex-1 bg-surface-low relative">
        <PrimaryView
          useSidePadding={false}
          className="bg-surface-low"
          style={{ paddingTop: 0, flex: 1 }}
        >
          <AppHeader
            onPress={() => navigation.goBack()}
            text="Individual Debts"
          />
          <View className="flex-1 w-full justify-center items-center">
            <CustomLoader message="Loading details..." />
          </View>
        </PrimaryView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface-low relative">
      <PrimaryView
        useSidePadding={false}
        className="bg-surface-low"
        style={{ paddingTop: 0, flex: 1 }}
      >
        <AppHeader onPress={() => navigation.goBack()} text={debtorName} />

        <DebtList
          handleEditDebt={handleEditDebt}
          handleDeleteDebt={handleDeleteDebt}
          individualDebts={currentDebts}
          ListHeaderComponent={listHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4f46e5"]}
              tintColor={isDark ? "#c3c0ff" : "#4f46e5"}
            />
          }
        />
      </PrimaryView>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate("AddDebtsScreen", { debtorId })}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg z-40"
      >
        <Icon name="plus" size={30} color={fabIconColor} />
      </TouchableOpacity>
    </View>
  );
}
