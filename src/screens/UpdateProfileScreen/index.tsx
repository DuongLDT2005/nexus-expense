import React from "react";
import { View, TouchableOpacity, ScrollView, TextInput, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryView from "../../components/atoms/PrimaryView";
import PrimaryText from "../../components/atoms/PrimaryText";
import Icon from "../../components/atoms/Icons";
import useColorScheme from "../../hooks/useColorScheme";
import { useUpdateProfileScreen } from "./useUpdateProfileScreen";

export default function UpdateProfileScreen() {
  const navigation = useNavigation();
  const isDark = useColorScheme() === "dark";

  const {
    fullName,
    setFullName,
    email,
    setEmail,
    username,
    setUsername,
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
    isCurrentPasswordVisible,
    setIsCurrentPasswordVisible,
    isNewPasswordVisible,
    setIsNewPasswordVisible,
    isConfirmPasswordVisible,
    setIsConfirmPasswordVisible,
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
        {/* TopAppBar Header */}
        <View className="w-full bg-white dark:bg-surface-low flex-row items-center justify-between px-4 py-3 border-b border-surface-high dark:border-outline-variant/10 shadow-sm">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-low transition-colors duration-100"
            >
              <Icon name="arrow-left" size={24} color={isDark ? "#ffffff" : "#000000"} />
            </TouchableOpacity>
            <PrimaryText className="font-headline text-lg font-bold text-on-background dark:text-on-surface">
              Edit Profile
            </PrimaryText>
          </View>
          <View className="w-10" />
        </View>

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
            <View className="gap-1.5">
              <PrimaryText className="text-on-surface-variant dark:text-outline text-xs font-bold ml-1">
                Full Name
              </PrimaryText>
              <View className="h-14 px-5 rounded-full bg-white dark:bg-surface-low flex-row items-center gap-3 border border-surface-high dark:border-outline-variant/10">
                <Icon name="user" size={20} color="#777587" />
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Full Name"
                  placeholderTextColor={isDark ? "#777587" : "#c7c4d8"}
                  className="flex-grow bg-transparent p-0 text-on-background dark:text-on-surface font-semibold text-sm outline-none"
                  style={{ includeFontPadding: false }}
                />
              </View>
            </View>

            {/* Email Address */}
            <View className="gap-1.5">
              <PrimaryText className="text-on-surface-variant dark:text-outline text-xs font-bold ml-1">
                Email Address
              </PrimaryText>
              <View className="h-14 px-5 rounded-full bg-white dark:bg-surface-low flex-row items-center gap-3 border border-surface-high dark:border-outline-variant/10">
                <Icon name="mail" size={20} color="#777587" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email Address"
                  placeholderTextColor={isDark ? "#777587" : "#c7c4d8"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="flex-grow bg-transparent p-0 text-on-background dark:text-on-surface font-semibold text-sm outline-none"
                  style={{ includeFontPadding: false }}
                />
              </View>
            </View>

            {/* Username */}
            <View className="gap-1.5">
              <PrimaryText className="text-on-surface-variant dark:text-outline text-xs font-bold ml-1">
                Username
              </PrimaryText>
              <View className="h-14 px-5 rounded-full bg-white dark:bg-surface-low flex-row items-center gap-3 border border-surface-high dark:border-outline-variant/10">
                <Icon name="at-sign" size={20} color="#777587" />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Username"
                  placeholderTextColor={isDark ? "#777587" : "#c7c4d8"}
                  autoCapitalize="none"
                  className="flex-grow bg-transparent p-0 text-on-background dark:text-on-surface font-semibold text-sm outline-none"
                  style={{ includeFontPadding: false }}
                />
              </View>
            </View>
          </View>

          {profileError && (
            <PrimaryText className="text-sm font-semibold text-error text-center mt-4 font-inter">
              {profileError}
            </PrimaryText>
          )}

          {/* Security Change Password Link */}
          <View className="w-full mt-8">
            <TouchableOpacity
              onPress={openPasswordModal}
              activeOpacity={0.7}
              className="w-full h-14 px-5 rounded-full bg-surface-high dark:bg-surface-low flex-row items-center gap-3 border border-surface-high dark:border-outline-variant/10 active:scale-[0.98] duration-150"
            >
              <Icon name="lock" size={20} color="#777587" />
              <PrimaryText className="text-on-background dark:text-on-surface font-bold flex-grow text-left text-sm">
                Change Password
              </PrimaryText>
              <Icon name="chevron-right" size={20} color="#c7c4d8" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Fixed Footer Action Button */}
        <View className="absolute bottom-0 left-0 w-full px-6 py-4 bg-white dark:bg-surface-low border-t border-surface-high dark:border-outline-variant/10 flex-row">
          <TouchableOpacity
            onPress={handleSaveProfile}
            disabled={isSaving}
            activeOpacity={0.8}
            className="flex-1 bg-primary dark:bg-primary-fixed-dim h-14 rounded-full shadow-lg items-center justify-center active:scale-95 duration-100"
          >
            <PrimaryText className="text-white dark:text-on-primary-fixed font-bold text-[15px]">
              {isSaving ? "Saving..." : "Save Changes"}
            </PrimaryText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* 🔑 CHANGE PASSWORD BOTTOM SHEET MODAL */}
      <Modal
        visible={isPasswordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closePasswordModal}
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
              <View className="gap-1.5">
                <PrimaryText className="text-on-surface-variant dark:text-outline text-xs font-bold ml-1">
                  Current Password
                </PrimaryText>
                <View className="h-14 px-5 rounded-full bg-white dark:bg-surface-lowest flex-row items-center gap-3 border border-surface-high dark:border-outline-variant/10">
                  <Icon name="lock" size={20} color="#777587" />
                  <TextInput
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Enter current password"
                    placeholderTextColor={isDark ? "#777587" : "#c7c4d8"}
                    secureTextEntry={!isCurrentPasswordVisible}
                    className="flex-grow bg-transparent p-0 text-on-background dark:text-on-surface font-semibold text-sm outline-none"
                    style={{ includeFontPadding: false }}
                  />
                  <TouchableOpacity
                    onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}
                  >
                    <Icon
                      name={isCurrentPasswordVisible ? "eye-off" : "eye"}
                      size={20}
                      color="#777587"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View className="gap-1.5">
                <PrimaryText className="text-on-surface-variant dark:text-outline text-xs font-bold ml-1">
                  New Password
                </PrimaryText>
                <View className="h-14 px-5 rounded-full bg-white dark:bg-surface-lowest flex-row items-center gap-3 border border-surface-high dark:border-outline-variant/10">
                  <Icon name="lock" size={20} color="#777587" />
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor={isDark ? "#777587" : "#c7c4d8"}
                    secureTextEntry={!isNewPasswordVisible}
                    className="flex-grow bg-transparent p-0 text-on-background dark:text-on-surface font-semibold text-sm outline-none"
                    style={{ includeFontPadding: false }}
                  />
                  <TouchableOpacity
                    onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                  >
                    <Icon
                      name={isNewPasswordVisible ? "eye-off" : "eye"}
                      size={20}
                      color="#777587"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View className="gap-1.5">
                <PrimaryText className="text-on-surface-variant dark:text-outline text-xs font-bold ml-1">
                  Confirm New Password
                </PrimaryText>
                <View className="h-14 px-5 rounded-full bg-white dark:bg-surface-lowest flex-row items-center gap-3 border border-surface-high dark:border-outline-variant/10">
                  <Icon name="lock" size={20} color="#777587" />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor={isDark ? "#777587" : "#c7c4d8"}
                    secureTextEntry={!isConfirmPasswordVisible}
                    className="flex-grow bg-transparent p-0 text-on-background dark:text-on-surface font-semibold text-sm outline-none"
                    style={{ includeFontPadding: false }}
                  />
                  <TouchableOpacity
                    onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                  >
                    <Icon
                      name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                      size={20}
                      color="#777587"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {passwordError && (
              <PrimaryText className="text-sm font-semibold text-error text-center font-inter">
                {passwordError}
              </PrimaryText>
            )}

            <TouchableOpacity
              onPress={handleSavePassword}
              disabled={isSavingPassword}
              activeOpacity={0.8}
              className="w-full bg-primary dark:bg-primary-fixed-dim h-14 rounded-full shadow-lg items-center justify-center mt-4 active:scale-95 duration-100"
            >
              <PrimaryText className="text-white dark:text-on-primary-fixed font-bold text-sm">
                {isSavingPassword ? "Updating..." : "Update Password"}
              </PrimaryText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </PrimaryView>
  );
}
