import React from "react";
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryView from "../../components/atoms/PrimaryView";
import Icon from "../../components/atoms/Icons";
import { useChooseCurrencyScreen } from "./useChooseCurrencyScreen";
import useColorScheme from "../../hooks/useColorScheme";
import PrimaryButton from "../../components/atoms/PrimaryButton";
import CustomInput from "../../components/atoms/CustomInput";
import PrimaryText from "../../components/atoms/PrimaryText";
import AppHeader from "../../components/atoms/AppHeader";

export default function ChooseCurrencyScreen() {
  const navigation = useNavigation<any>();
  const {
    search,
    filteredCurrencies,
    selectedCurrency,
    isLoading,
    isFromSettings,
    handleSearch,
    handleCurrencySelect,
    handleCurrencySubmit,
  } = useChooseCurrencyScreen();

  const isDark = useColorScheme() === "dark";

  return (
    <PrimaryView
      useSidePadding={false}
      className="flex-grow flex flex-col justify-between bg-white dark:bg-surface-lowest"
    >
      {/* Header bar */}
      <AppHeader
        onPress={isFromSettings ? () => navigation && navigation.goBack() : undefined}
        text="Nexus"
      />

      <ScrollView
        className="bg-surface-low"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View className="mb-8 mt-4">
          <PrimaryText className="text-4xl font-outfit font-extrabold text-on-surface leading-tight tracking-tight mb-2">
            Choose your{"\n"}
            <PrimaryText className="text-primary">currency</PrimaryText>
          </PrimaryText>
          <PrimaryText className="text-on-surface-variant font-inter text-sm leading-relaxed">
            Select the currency you use daily for your primary expenses.
          </PrimaryText>
        </View>

        {/* Search */}
        <View className="mb-6">
          <CustomInput
            input={search}
            setInput={handleSearch}
            placeholder="Search currency..."
            leftIcon="search"
          />
        </View>

        {/* Currency List */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator color={isDark ? "#c3c0ff" : "#4f46e5"} />
          </View>
        ) : (
          <View className="gap-3">
            {filteredCurrencies.map((curr) => {
              const isSelected = selectedCurrency?.id === curr.id;
              return (
                <TouchableOpacity
                  key={curr.id}
                  onPress={() => handleCurrencySelect(curr)}
                  activeOpacity={0.8}
                >
                  <View
                    className={`w-full flex-row items-center justify-between p-3 rounded-2xl border ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-outline-variant/50 bg-surface-lowest"
                    }`}
                  >
                    <View className="flex-row items-center gap-4">
                      {/* Circle icon */}
                      <View
                        className={`w-12 h-12 rounded-full items-center justify-center ${
                          isSelected
                            ? "bg-primary"
                            : "bg-surface-container-high"
                        }`}
                      >
                        <PrimaryText
                          className={`font-inter font-bold text-lg ${
                            isSelected ? "text-primary-on" : "text-on-surface"
                          }`}
                        >
                          {curr.symbol}
                        </PrimaryText>
                      </View>

                      {/* Text info */}
                      <View className="text-left">
                        <PrimaryText className="font-outfit font-bold text-on-surface text-base">
                          {curr.name}
                        </PrimaryText>
                        <PrimaryText className="text-xs text-on-surface-variant font-inter font-medium uppercase tracking-wider mt-0.5">
                          {curr.code}
                        </PrimaryText>
                      </View>
                    </View>

                    {/* Checkmark */}
                    {isSelected && (
                      <Icon
                        name="check-circle"
                        size={22}
                        color={isDark ? "#c3c0ff" : "#4f46e5"}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Floating Continue button */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-outline-variant/10">
        <PrimaryButton
          onPress={handleCurrencySubmit}
          buttonTitle="Continue"
          disabled={!selectedCurrency}
          size="lg"
        />
      </View>
    </PrimaryView>
  );
}
