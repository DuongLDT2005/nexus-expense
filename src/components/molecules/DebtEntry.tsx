import React from "react";
import {
  View,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryView from "../atoms/PrimaryView";
import AppHeader from "../atoms/AppHeader";
import PrimaryButton from "../atoms/PrimaryButton";
import CustomInput from "../atoms/CustomInput";
import PrimaryText from "../atoms/PrimaryText";
import CustomLoader from "../atoms/CustomLoader";
import Icon from "../atoms/Icons";
import DatePicker from "../atoms/DatePicker";
import { expenseSchema } from "../../utils/validationSchema";
import useColorScheme from "../../hooks/useColorScheme";

interface DebtEntryProps {
  type: "Add" | "Update";
  debtorName: string;
  debtsType: "Borrow" | "Lend";
  handleToggleType: (type: "Borrow" | "Lend") => void;
  description: string;
  setDescription: (val: string) => void;
  amount: string;
  setAmount: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  isLoading?: boolean;
  isSaving: boolean;
  handleSave: () => void;
  isValid: boolean;
  handleAmountFocus: () => void;
  amountErrors: Array<{ message: string }>;
  currencySymbol: string;
  placeholderColor?: string;
}

const DebtEntry: React.FC<DebtEntryProps> = ({
  type,
  debtorName,
  debtsType,
  handleToggleType,
  description,
  setDescription,
  amount,
  setAmount,
  date,
  setDate,
  isLoading = false,
  isSaving,
  handleSave,
  isValid,
  handleAmountFocus,
  amountErrors,
  currencySymbol,
  placeholderColor = "#777587",
}) => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === "dark";
  const isAddButton = type === "Add";
  const isBorrow = debtsType === "Borrow";

  if (isLoading) {
    return (
      <PrimaryView
        dismissKeyboardOnTouch
        useSidePadding={false}
        style={{ paddingTop: 0 }}
      >
        <AppHeader
          onPress={() => navigation.goBack()}
          text={isAddButton ? "Add Debt" : "Edit Debt"}
        />
        <View className="flex-1 w-full justify-center items-center">
          <CustomLoader message="Loading details..." />
        </View>
      </PrimaryView>
    );
  }

  return (
    <PrimaryView
      dismissKeyboardOnTouch
      useSidePadding={false}
      style={{ paddingTop: 0 }}
    >
      <AppHeader
        onPress={() => navigation.goBack()}
        text={isAddButton ? "Add Debt" : "Edit Debt"}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-grow bg-surface-low"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Identity Header */}
          <View className="items-center py-6">
            <PrimaryText className="text-md font-bold text-on-surface-variant uppercase tracking-widest font-inter">
              Transaction with
            </PrimaryText>
            <PrimaryText className="text-xl font-extrabold text-on-surface mt-1 font-inter">
              {debtorName}
            </PrimaryText>
          </View>

          {/* Transaction Type Picker (Toggles) */}
          <View className="flex-row p-1 bg-surface-high rounded-lg mb-6">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleToggleType("Borrow")}
              className="flex-1 flex-row gap-2 py-3 rounded-lg items-center justify-center border border-outline-variant/10 shadow-sm"
              style={{
                backgroundColor: isBorrow
                  ? "#95002b"
                  : isDark
                    ? "rgba(234, 230, 244, 0.1)"
                    : "rgba(234, 230, 244, 0.3)",
              }}
            >
              <Icon
                name="arrow-down-left"
                size={16}
                color={isBorrow ? "#ffffff" : isDark ? "#c7c4d8" : "#777587"}
              />
              <Text
                className="text-sm font-outfit font-bold"
                style={{
                  color: isBorrow ? "#ffffff" : isDark ? "#e4e1ee" : "#464555",
                }}
              >
                Borrowing
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleToggleType("Lend")}
              className="flex-1 flex-row gap-2 py-3 rounded-lg items-center justify-center border border-outline-variant/10 shadow-sm"
              style={{
                backgroundColor: !isBorrow
                  ? "#006e2f"
                  : isDark
                    ? "rgba(234, 230, 244, 0.1)"
                    : "rgba(234, 230, 244, 0.3)",
              }}
            >
              <Icon
                name="arrow-up-right"
                size={16}
                color={!isBorrow ? "#ffffff" : isDark ? "#c7c4d8" : "#777587"}
              />
              <Text
                className="text-sm font-outfit font-bold"
                style={{
                  color: !isBorrow ? "#ffffff" : isDark ? "#e4e1ee" : "#464555",
                }}
              >
                Lending
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View className="space-y-6">
            {/* Description */}
            <View className="space-y-2 mb-6">
              <PrimaryText className="text-sm font-extrabold text-on-surface-variant tracking-widest ml-1 font-inter">
                Description
              </PrimaryText>
              <View className="mt-2">
                <CustomInput
                  input={description}
                  setInput={setDescription}
                  placeholder="eg. Coffee"
                  schema={expenseSchema}
                  leftIcon="pencil"
                />
              </View>
            </View>

            {/* Amount */}
            <View className="space-y-2 mb-6">
              <PrimaryText className="text-sm font-extrabold text-on-surface-variant tracking-widest ml-1 font-inter">
                Amount
              </PrimaryText>
              <View className="mt-2">
                <View
                  className={`h-12 flex-row items-center rounded-2xl px-3 border-[1.5px] ${
                    amountErrors.length > 0
                      ? "border-error"
                      : "border-transparent"
                  } bg-surface-high`}
                >
                  <Text className="text-sm font-outfit font-extrabold text-primary mr-1">
                    {currencySymbol}
                  </Text>
                  <TextInput
                    className="flex-1 h-12 text-sm font-outfit font-medium text-on-surface"
                    value={amount}
                    onChangeText={setAmount}
                    onFocus={handleAmountFocus}
                    placeholder="0.00"
                    placeholderTextColor={placeholderColor}
                    keyboardType="numeric"
                  />
                </View>
                {amountErrors.length > 0 && (
                  <View className="mt-1">
                    {amountErrors.map((err) => (
                      <Text
                        key={err.message}
                        className="text-xs font-outfit text-error font-medium"
                      >
                        {err.message}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Date */}
            <View className="space-y-2 mb-6">
              <PrimaryText className="text-sm font-extrabold text-on-surface-variant tracking-widest ml-1 font-inter">
                Date
              </PrimaryText>
              <View className="mt-2">
                <DatePicker value={date} onChange={setDate} />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="absolute bottom-0 w-full p-6 bg-surface-lowest/90 border-t border-surface-high dark:border-outline-variant">
        <PrimaryButton
          buttonTitle={isAddButton ? "Add Debt" : "Update Debt"}
          onPress={handleSave}
          disabled={!isValid || isSaving}
          loading={isSaving}
          size="lg"
        />
      </View>
    </PrimaryView>
  );
};

export default DebtEntry;
