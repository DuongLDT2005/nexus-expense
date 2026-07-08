import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryView from '../../components/atoms/PrimaryView';
import AppHeader from '../../components/atoms/AppHeader';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import CustomInput from '../../components/atoms/CustomInput';
import PrimaryText from '../../components/atoms/PrimaryText';
import CustomLoader from '../../components/atoms/CustomLoader';
import Icon from '../../components/atoms/Icons';
import DebtorTypePicker from '../../components/molecules/DebtorTypePicker';
import { useUpdateDebtorScreen } from './useUpdateDebtorScreen';
import { nameSchema } from '../../utils/validationSchema';

export default function UpdateDebtorScreen() {
  const navigation = useNavigation();
  const {
    title,
    setTitle,
    selectedPreset,
    handleSelectPreset,
    isValid,
    isLoading,
    isSaving,
    handleSave,
  } = useUpdateDebtorScreen();

  if (isLoading) {
    return (
      <PrimaryView dismissKeyboardOnTouch useSidePadding={false} style={{ paddingTop: 0 }}>
        <AppHeader onPress={() => navigation.goBack()} text="Edit Person" />
        <View className="flex-grow justify-center items-center">
          <CustomLoader message="Loading person details..." />
        </View>
      </PrimaryView>
    );
  }

  return (
    <PrimaryView dismissKeyboardOnTouch useSidePadding={false} style={{ paddingTop: 0 }}>
      <AppHeader onPress={() => navigation.goBack()} text="Edit Person" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-grow bg-surface-container-low"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Identity illustration/header matching Stitch HTML */}
          <View className="items-center py-6">
            <View
              style={{ backgroundColor: (selectedPreset?.color || '#4f46e5') + '20' }}
              className="w-24 h-24 rounded-full items-center justify-center border border-outline-variant/30"
            >
              <Icon
                name={selectedPreset?.icon || 'user'}
                size={48}
                color={selectedPreset?.color || '#4f46e5'}
              />
            </View>
            <PrimaryText className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-3">
              Profile Identity
            </PrimaryText>
          </View>

          {/* Preset Type Picker */}
          <DebtorTypePicker
            selectedType={selectedPreset?.name ?? null}
            onSelectType={handleSelectPreset}
          />

          {/* Name Input */}
          <View className="mt-4 mb-6">
            <CustomInput
              input={title}
              setInput={setTitle}
              placeholder="eg. John Doe or Axis"
              label="Name"
              schema={nameSchema}
              leftIcon="badge"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Footer Button */}
      <View className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant/20">
        <PrimaryButton
          buttonTitle="Update Details"
          onPress={handleSave}
          disabled={!isValid || isSaving}
          loading={isSaving}
          size="lg"
        />
      </View>
    </PrimaryView>
  );
}
