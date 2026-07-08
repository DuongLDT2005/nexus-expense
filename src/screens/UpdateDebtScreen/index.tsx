import React from 'react';
import { View, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryView from '../../components/atoms/PrimaryView';
import AppHeader from '../../components/atoms/AppHeader';
import PrimaryButton from '../../components/atoms/PrimaryButton';
import CustomInput from '../../components/atoms/CustomInput';
import PrimaryText from '../../components/atoms/PrimaryText';
import CustomLoader from '../../components/atoms/CustomLoader';
import Icon from '../../components/atoms/Icons';
import DatePicker from '../../components/atoms/DatePicker';
import { useUpdateDebtScreen } from './useUpdateDebtScreen';
import { expenseSchema } from '../../utils/validationSchema';

export default function UpdateDebtScreen() {
  const navigation = useNavigation();
  const {
    debtorName,
    debtsType,
    handleToggleType,
    description,
    setDescription,
    amount,
    setAmount,
    date,
    setDate,
    isLoading,
    isSaving,
    handleSave,
    isValid,
    handleAmountFocus,
    amountErrors,
    currencySymbol,
    inactiveIconColor,
    placeholderColor,
  } = useUpdateDebtScreen();

  if (isLoading) {
    return (
      <PrimaryView dismissKeyboardOnTouch useSidePadding={false} style={{ paddingTop: 0 }}>
        <AppHeader onPress={() => navigation.goBack()} text="Edit Debt" />
        <View className="flex-grow justify-center items-center">
          <CustomLoader message="Loading details..." />
        </View>
      </PrimaryView>
    );
  }

  const isBorrow = debtsType === 'Borrow';

  return (
    <PrimaryView dismissKeyboardOnTouch useSidePadding={false} style={{ paddingTop: 0 }}>
      <AppHeader onPress={() => navigation.goBack()} text="Edit Debt" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-grow bg-surface-container-low"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center py-6">
            <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              Transaction with
            </Text>
            <PrimaryText className="text-xl font-extrabold text-on-surface mt-1">
              {debtorName}
            </PrimaryText>
          </View>

          <View className="flex-row p-1 bg-surface-container-high rounded-2xl mb-6">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleToggleType('Borrow')}
              className={`flex-1 flex-row gap-2 py-3 rounded-xl items-center justify-center ${
                isBorrow ? 'bg-tertiary' : ''
              }`}
            >
              <Icon name="arrow-down-left" size={16} color={isBorrow ? '#ffffff' : inactiveIconColor} />
              <Text
                className={`text-sm font-outfit font-bold ${
                  isBorrow ? 'text-on-tertiary' : 'text-on-surface-variant'
                }`}
              >
                Borrowing
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleToggleType('Lend')}
              className={`flex-1 flex-row gap-2 py-3 rounded-xl items-center justify-center ${
                !isBorrow ? 'bg-secondary' : ''
              }`}
            >
              <Icon name="arrow-up-right" size={16} color={!isBorrow ? '#ffffff' : inactiveIconColor} />
              <Text
                className={`text-sm font-outfit font-bold ${
                  !isBorrow ? 'text-on-secondary' : 'text-on-surface-variant'
                }`}
              >
                Lending
              </Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <CustomInput
              input={description}
              setInput={setDescription}
              placeholder="eg. Coffee"
              label="Description"
              schema={expenseSchema}
              leftIcon="pencil"
            />

            <View className="mb-4">
              <Text className="text-xs font-outfit font-medium text-on-surface-variant mb-1">
                Amount
              </Text>
              <View
                className={`h-12 flex-row items-center rounded-2xl px-3 border-[1.5px] ${
                  amountErrors.length > 0 ? 'border-error' : 'border-transparent'
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
                  {amountErrors.map((err: { message: string }) => (
                    <Text key={err.message} className="text-xs font-outfit text-error font-medium">
                      {err.message}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            <DatePicker value={date} onChange={setDate} label="Date" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant/20">
        <PrimaryButton
          buttonTitle="Update Debt"
          onPress={handleSave}
          disabled={!isValid || isSaving}
          loading={isSaving}
          size="lg"
        />
      </View>
    </PrimaryView>
  );
}
