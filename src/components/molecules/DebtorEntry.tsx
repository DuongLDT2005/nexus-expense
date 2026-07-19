import React from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryView from "../atoms/PrimaryView";
import AppHeader from "../atoms/AppHeader";
import PrimaryButton from "../atoms/PrimaryButton";
import CustomInput from "../atoms/CustomInput";
import PrimaryText from "../atoms/PrimaryText";
import CustomLoader from "../atoms/CustomLoader";
import Icon from "../atoms/Icons";
import DebtorTypePicker from "./DebtorTypePicker";
import { nameSchema } from "../../utils/validationSchema";

interface DebtorEntryProps {
  type: "Add" | "Update";
  title: string;
  setTitle: (val: string) => void;
  selectedPreset: { name: string; icon: string; color: string } | null;
  handleSelectPreset: (name: string, icon: string, color: string) => void;
  isValid: boolean;
  isSaving: boolean;
  handleSave: () => void;
  isLoading?: boolean;
}

const DebtorEntry: React.FC<DebtorEntryProps> = ({
  type,
  title,
  setTitle,
  selectedPreset,
  handleSelectPreset,
  isValid,
  isSaving,
  handleSave,
  isLoading = false,
}) => {
  const navigation = useNavigation();
  const isAddButton = type === "Add";

  if (isLoading) {
    return (
      <PrimaryView
        dismissKeyboardOnTouch
        useSidePadding={false}
        style={{ paddingTop: 0 }}
      >
        <AppHeader
          onPress={() => navigation.goBack()}
          text={isAddButton ? "Add Person" : "Edit Person"}
        />
        <View className="flex-1 w-full justify-center items-center">
          <CustomLoader
            message={isAddButton ? "Loading..." : "Loading person details..."}
          />
        </View>
      </PrimaryView>
    );
  }

  return (
    <PrimaryView
      dismissKeyboardOnTouch
      useSidePadding={false}
      className="bg-surface-low"
      style={{ paddingTop: 0, paddingBottom: 0 }}
    >
      <AppHeader
        onPress={() => navigation.goBack()}
        text={isAddButton ? "Add Debtor" : "Edit Debtor"}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1 mt-2 px-4 mb-24"
          keyboardShouldPersistTaps="handled"
        >
          {/* Identity illustration/header matching Stitch HTML */}
          <View className="items-center py-6">
            <View
              style={{
                backgroundColor: (selectedPreset?.color || "#4f46e5") + "20",
              }}
              className="w-24 h-24 rounded-full items-center justify-center border border-outline-variant/30"
            >
              <Icon
                name={selectedPreset?.icon || "user"}
                size={48}
                color={selectedPreset?.color || "#4f46e5"}
              />
            </View>
            <PrimaryText className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-3 font-inter">
              Profile Identity
            </PrimaryText>
          </View>

          {/* Preset Type Picker */}
          <DebtorTypePicker
            selectedType={selectedPreset?.name ?? null}
            onSelectType={handleSelectPreset}
          />

          {/* Name Input */}
          <View className="space-y-2 mb-2">
            <PrimaryText className="text-sm font-extrabold text-on-surface-variant tracking-widest ml-1 font-inter mb-2">
              Name
            </PrimaryText>
            <CustomInput
              input={title}
              setInput={setTitle}
              placeholder="eg. John Doe or Axis"
              schema={nameSchema}
              leftIcon="user-plus"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Footer Button */}
      <View className="absolute bottom-0 w-full p-6 bg-surface-lowest/90 border-t border-surface-high dark:border-outline-variant">
        <PrimaryButton
          buttonTitle={isAddButton ? "Add Debtor" : "Update Debtor"}
          onPress={handleSave}
          disabled={!isValid || isSaving}
          loading={isSaving}
          size="lg"
        />
      </View>
    </PrimaryView>
  );
};

export default React.memo(DebtorEntry);
