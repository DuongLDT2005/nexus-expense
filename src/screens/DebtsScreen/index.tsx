import React, { memo, useRef, useCallback, useState, useMemo } from "react";
import { View, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import PrimaryView from "../../components/atoms/PrimaryView";
import HeaderContainer from "../../components/molecules/HeaderContainer";
import CustomLoader from "../../components/atoms/CustomLoader";
import Icon from "../../components/atoms/Icons";
import PrimaryText from "../../components/atoms/PrimaryText";
import { useDebtsScreen } from "./useDebtsScreen";
import { formatWithSymbol } from "../../utils/numberUtils";
import { HomeStackParamList, Debtor } from "../../types";
import useColorScheme from "../../hooks/useColorScheme";
import ConfirmModal from "../../components/molecules/ConfirmModal";
import { softDeleteDebtorById } from "../../services/debtorService";
import { deleteAllDebtsByDebtorId } from "../../services/debtService";
import { computeDebtorNet } from "../../utils/debtUtils";
import DebtorList from "../../components/molecules/DebtorList";

function DebtsListHeader({
  totalOthersOweYou,
  totalYouOweOthers,
  currencySymbol,
  currencyCode,
  isTabPerson,
  onSetTabPerson,
  onSetTabAccounts,
  othersCount,
  youCount,
}: {
  totalOthersOweYou: number;
  totalYouOweOthers: number;
  currencySymbol: string;
  currencyCode?: string;
  isTabPerson: boolean;
  onSetTabPerson: () => void;
  onSetTabAccounts: () => void;
  othersCount: number;
  youCount: number;
}) {
  const isDark = useColorScheme() === "dark";
  return (
    <View className="mb-4 mt-3">
      {/* Bento-style Cards */}
      <View className="flex-col gap-4 mb-6">
        {/* Others owe you card */}
        <View className="flex-1 bg-surface-high p-4 rounded-md border border-surface-highest relative overflow-hidden shadow-sm">
          <View className="flex-col gap-1">
            <PrimaryText className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase font-inter">
              Others owe you
            </PrimaryText>
            <View className="flex-col mt-1">
              <PrimaryText className="text-2xl font-extrabold text-secondary">
                {formatWithSymbol(
                  totalOthersOweYou,
                  currencySymbol,
                  currencyCode,
                )}
              </PrimaryText>
              <PrimaryText className="text-on-surface-variant text-[11px] font-medium mt-1">
                from {othersCount} {othersCount === 1 ? "account" : "accounts"}
              </PrimaryText>
            </View>
          </View>
          <View className="mt-2 flex-row">
            <View className="px-2 py-1 bg-secondary-container rounded-full">
              <PrimaryText className="text-[10px] font-bold text-secondary-on-container uppercase">
                Lent
              </PrimaryText>
            </View>
          </View>
        </View>

        {/* You owe others card */}
        <View className="flex-1 bg-surface-high p-4 rounded-md border border-surface-highest relative overflow-hidden shadow-sm">
          <View className="flex-col gap-1">
            <PrimaryText className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase font-inter">
              You owe others
            </PrimaryText>
            <View className="flex-col mt-1">
              <PrimaryText className="text-2xl font-extrabold text-tertiary">
                {formatWithSymbol(
                  totalYouOweOthers,
                  currencySymbol,
                  currencyCode,
                )}
              </PrimaryText>
              <PrimaryText className="text-on-surface-variant text-[11px] font-medium mt-1">
                to {youCount} {youCount === 1 ? "account" : "accounts"}
              </PrimaryText>
            </View>
          </View>
          <View className="mt-2 flex-row">
            <View className="px-2 py-1 bg-error-container rounded-full">
              <PrimaryText className="text-[10px] font-bold text-error-on-container uppercase">
                Borrowed
              </PrimaryText>
            </View>
          </View>
        </View>
      </View>

      {/* Segmented Tab Bar */}
      <View className="flex-row p-1 w-full max-w-xs mx-auto md:mx-0">
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSetTabPerson}
          className={
            "flex-1 py-2 rounded-sm items-center justify-center shadow-sm " +
            (isTabPerson ? "bg-primary" : "bg-surface-variant")
          }
        >
          <PrimaryText
            className={
              "text-xs font-inter font-bold " +
              (isTabPerson ? "text-primary-on" : "text-on-surface-variant")
            }
          >
            Person
          </PrimaryText>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSetTabAccounts}
          className={
            "flex-1 py-2 rounded-sm items-center justify-center shadow-sm " +
            (!isTabPerson ? "bg-primary" : "bg-surface-variant")
          }
        >
          <PrimaryText
            className={
              "text-xs font-inter font-bold " +
              (!isTabPerson ? "text-primary-on" : "text-on-surface-variant")
            }
          >
            Accounts
          </PrimaryText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function DebtsScreen() {
  const isDark = useColorScheme() === "dark";
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const {
    debtors,
    allDebts,
    activeTabDebtors,
    totalYouOweOthers,
    totalOthersOweYou,
    isTabPerson,
    handleSetTab,
    isLoading,
    error,
    refetch,
    currencySymbol,
    currencyCode,
  } = useDebtsScreen();

  const [debtorToDelete, setDebtorToDelete] = useState<string | null>(null);
  const openSwipeableRef = useRef<{ close: () => void } | null>(null);

  const othersCount = useMemo(() => {
    return debtors.filter((d) => computeDebtorNet(allDebts, d.id) < 0).length;
  }, [debtors, allDebts]);

  const youCount = useMemo(() => {
    return debtors.filter((d) => computeDebtorNet(allDebts, d.id) > 0).length;
  }, [debtors, allDebts]);

  const handleEdit = useCallback(
    (debtor: Debtor) => {
      navigation.navigate("UpdateDebtorScreen", { debtorId: debtor.id });
    },
    [navigation],
  );

  const handleDelete = useCallback(
    (debtorId: string) => {
      const debtor = debtors.find((d) => d.id === debtorId);
      if (!debtor) return;
      const debtorDebts = allDebts.filter((d) => d.debtorId === debtorId);

      if (debtorDebts.length === 0) {
        setDebtorToDelete(debtorId);
      } else {
        Alert.alert(
          "Settle Required",
          `First you need to settle payment with ${debtor.title}`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Settle",
              onPress: async () => {
                try {
                  await deleteAllDebtsByDebtorId(debtorId);
                  refetch();
                } catch (err) {
                  Alert.alert("Error", "Failed to settle payments");
                }
              },
            },
          ],
        );
      }
    },
    [debtors, allDebts, refetch],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (debtorToDelete) {
      try {
        await softDeleteDebtorById(debtorToDelete);
        setDebtorToDelete(null);
        refetch();
      } catch (err) {
        Alert.alert("Error", "Failed to delete debtor");
      }
    }
  }, [debtorToDelete, refetch]);

  const listHeader = (
    <DebtsListHeader
      totalOthersOweYou={totalOthersOweYou}
      totalYouOweOthers={totalYouOweOthers}
      currencySymbol={currencySymbol}
      currencyCode={currencyCode}
      isTabPerson={isTabPerson}
      onSetTabPerson={() => handleSetTab("Person")}
      onSetTabAccounts={() => handleSetTab("Other")}
      othersCount={othersCount}
      youCount={youCount}
    />
  );

  return (
    <PrimaryView
      useSidePadding={false}
      className="bg-surface-low"
      style={{ paddingTop: 0, paddingBottom: 0 }}
    >
      <HeaderContainer headerText="Debts" />
      <View className="flex-1">
        {isLoading && debtors.length === 0 ? (
          <View className="flex-1 w-full justify-center items-center">
            <CustomLoader message="Loading debts data..." />
          </View>
        ) : error && debtors.length === 0 ? (
          <View className="flex-grow justify-center items-center px-6">
            <PrimaryText className="text-error font-inter font-bold text-center text-base mb-2">
              Failed to connect
            </PrimaryText>
            <PrimaryText className="text-on-surface-variant text-center text-sm font-inter mb-4">
              {error}
            </PrimaryText>
            <TouchableOpacity
              onPress={refetch}
              className="bg-primary px-4 py-2 rounded-full"
            >
              <PrimaryText className="text-white font-inter font-bold">
                Retry
              </PrimaryText>
            </TouchableOpacity>
          </View>
        ) : (
          <DebtorList
            debtors={activeTabDebtors}
            allDebts={allDebts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            ListHeaderComponent={listHeader}
          />
        )}
      </View>
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          className="w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:scale-90"
          onPress={() => navigation.navigate("AddDebtorScreen")}
        >
          <Icon name="plus" size={30} color={isDark ? "#1d00a5" : "#ffffff"} />
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={debtorToDelete !== null}
        onClose={() => setDebtorToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Debtor"
        message="Are you sure you want to delete this debtor? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDamage={true}
      />
    </PrimaryView>
  );
}
