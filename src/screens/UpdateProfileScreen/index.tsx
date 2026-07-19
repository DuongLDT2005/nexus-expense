import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryView from "../../components/atoms/PrimaryView";
import PrimaryText from "../../components/atoms/PrimaryText";
import Icon from "../../components/atoms/Icons";
import CustomInput from "../../components/atoms/CustomInput";
import PrimaryButton from "../../components/atoms/PrimaryButton";
import AppHeader from "../../components/atoms/AppHeader";
import { useUpdateProfileScreen } from "./useUpdateProfileScreen";
import useColorScheme from "../../hooks/useColorScheme";

export default function UpdateProfileScreen() {
  const navigation = useNavigation();
  const isDark = useColorScheme() === "dark";

  const {
    fullName,
    setFullName,
    email,
    setEmail,
    profileError,
    isSaving,
    handleSaveProfile,
    isPasswordModalVisible,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    isSavingPassword,
    handleSavePassword,
    closePasswordModal,
    openPasswordModal,
  } = useUpdateProfileScreen();

  return (
    <PrimaryView
      useSidePadding={false}
      className="flex-grow flex flex-col justify-between bg-surface-low dark:bg-surface-lowest"
      style={{ paddingTop: 0 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header bar */}
        <AppHeader onPress={() => navigation.goBack()} text="Edit Profile" />

        <ScrollView
          className="bg-surface-low dark:bg-surface-lowest flex-1"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 32,
            paddingBottom: 120, // space for fixed footer
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Input Fields Group */}
          <View className="w-full gap-5">
            {/* Full Name */}
            <CustomInput
              input={fullName}
              setInput={setFullName}
              placeholder="Full Name"
              label="Full Name"
              leftIcon="user"
            />

            {/* Email Address */}
            <CustomInput
              input={email}
              setInput={setEmail}
              placeholder="Email Address"
              label="Email Address"
              leftIcon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Security Change Password Link */}
            <View>
              <PrimaryText className="text-[10px] font-outfit font-bold text-on-surface-variant mb-1.5 tracking-widest uppercase">
                Security
              </PrimaryText>
              <TouchableOpacity
                onPress={openPasswordModal}
                activeOpacity={0.7}
                className="h-12 flex-row items-center rounded-2xl px-3 border-[1px] border-outline-variant/40 bg-surface-high dark:bg-surface-low active:scale-[0.98] duration-150"
              >
                <View className="mr-2">
                  <Icon
                    name="lock"
                    size={18}
                    color={isDark ? "#c3c0ff" : "#4f46e5"}
                  />
                </View>
                <PrimaryText className="flex-1 text-sm font-outfit font-medium text-on-surface text-left">
                  Change Password
                </PrimaryText>
                <Icon
                  name="chevron-right"
                  size={18}
                  color={isDark ? "#c3c0ff" : "#4f46e5"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {profileError && (
            <PrimaryText className="text-sm font-semibold text-error text-center mt-4 font-inter">
              {profileError}
            </PrimaryText>
          )}
        </ScrollView>

        {/* Fixed Footer Action Button */}
        <View className="absolute bottom-0 w-full p-6 bg-surface-lowest/90 border-t border-surface-high dark:border-outline-variant">
          <PrimaryButton
            onPress={handleSaveProfile}
            buttonTitle={isSaving ? "Saving..." : "Save Changes"}
            disabled={isSaving}
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>

      {/* 🔑 CHANGE PASSWORD BOTTOM SHEET MODAL */}
      <Modal
        visible={isPasswordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closePasswordModal}
        statusBarTranslucent
      >
        <View className="flex-1 justify-end bg-black/40">
          {/* Clickable Scrim to Dismiss */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={closePasswordModal}
            className="absolute inset-0"
          />

          {/* Sheet Body Container */}
          <View className="relative w-full bg-surface-low dark:bg-surface-low rounded-t-[2rem] p-6 shadow-2xl gap-5 border-t border-outline-variant/10 pb-10">
            {/* Drag Handle indicator */}
            <View className="w-12 h-1.5 bg-outline-variant dark:bg-outline rounded-full self-center mb-2" />

            <View className="items-center">
              <PrimaryText className="font-headline font-bold text-lg text-on-surface dark:text-on-surface">
                Change Password
              </PrimaryText>
            </View>

            <View className="gap-4">
              {/* Current Password */}
              <CustomInput
                input={currentPassword}
                setInput={setCurrentPassword}
                placeholder="Enter current password"
                label="Current Password"
                secureTextEntry={true}
                leftIcon="lock"
              />

              {/* New Password */}
              <CustomInput
                input={newPassword}
                setInput={setNewPassword}
                placeholder="Enter new password"
                label="New Password"
                secureTextEntry={true}
                leftIcon="lock"
              />

              {/* Confirm Password */}
              <CustomInput
                input={confirmPassword}
                setInput={setConfirmPassword}
                placeholder="Confirm new password"
                label="Confirm New Password"
                secureTextEntry={true}
                leftIcon="lock"
              />
            </View>

            {passwordError && (
              <PrimaryText className="text-sm font-semibold text-error text-center font-inter">
                {passwordError}
              </PrimaryText>
            )}

            <View className="mt-4">
              <PrimaryButton
                onPress={handleSavePassword}
                buttonTitle={
                  isSavingPassword ? "Updating..." : "Update Password"
                }
                disabled={isSavingPassword}
                size="md"
              />
            </View>
          </View>
        </View>
      </Modal>
    </PrimaryView>
  );
}
