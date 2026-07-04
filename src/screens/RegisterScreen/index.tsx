import React from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import PrimaryView from "../../components/atoms/PrimaryView";
import CustomInput from "../../components/atoms/CustomInput";
import PrimaryButton from "../../components/atoms/PrimaryButton";
import Icon from "../../components/atoms/Icons";
import PrimaryText from "../../components/atoms/PrimaryText";
import { useRegisterScreen } from "./useRegisterScreen";
import useColorScheme from "../../hooks/useColorScheme";
import { nameSchema } from "../../utils/validationSchema";

export default function RegisterScreen() {
  const {
    fullName,
    setfullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    errorMessage,
    handleRegister,
    handleGoToLogin,
  } = useRegisterScreen();
  const isDark = useColorScheme() === "dark";

  return (
    <PrimaryView useSidePadding={false} className="bg-surface-high">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header outside the card */}
          <View className="items-center mb-5">
            <View className="w-20 h-20 rounded-3xl bg-primary/10 items-center justify-center mb-4">
              <Icon
                name="user-plus"
                size={36}
                color={isDark ? "#c3c0ff" : "#4f46e5"}
              />
            </View>
            <PrimaryText className="text-3xl font-outfit font-extrabold text-on-surface text-center mb-2">
              Elevate Your Finances
            </PrimaryText>
            <PrimaryText className="text-sm text-on-surface-variant font-inter text-center max-w-[280px] leading-relaxed">
              Join the exclusive circle of Nexus Expense
            </PrimaryText>
          </View>

          {/* Form Card Container */}
          <View className="bg-surface-lowest border border-outline-variant/30 rounded-[32px] p-8 shadow-2xl shadow-indigo-950/5 dark:shadow-black/40">
            {/* Form */}
            <View className="gap-5">
              {/* Error message */}
              {errorMessage ? (
                <View className="flex-row items-center gap-3 bg-error-container/20 rounded-2xl px-4 py-3 border-[0.5px] border-error/20">
                  <Icon name="alert-circle" size={18} color="#ba1a1a" />
                  <PrimaryText className="text-error font-inter font-medium text-xs flex-1">
                    {errorMessage}
                  </PrimaryText>
                </View>
              ) : null}

              <CustomInput
                input={fullName}
                setInput={setfullName}
                placeholder="Enter your full name"
                label="Full Name"
                autoCapitalize="none"
                leftIcon="user"
                schema={nameSchema}
              />

              <CustomInput
                input={email}
                setInput={setEmail}
                placeholder="Enter your email"
                label="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail"
              />

              <CustomInput
                input={password}
                setInput={setPassword}
                placeholder="••••••••"
                label="Password"
                secureTextEntry={true}
                leftIcon="lock"
              />

              <CustomInput
                input={confirmPassword}
                setInput={setConfirmPassword}
                placeholder="••••••••"
                label="Confirm Password"
                secureTextEntry={true}
                leftIcon="lock"
              />
            </View>

            {/* Register button */}
            <View className="mt-8">
              <PrimaryButton
                onPress={handleRegister}
                buttonTitle="Create Account"
                loading={isLoading}
                size="lg"
              />
            </View>

            {/* Login link */}
            <View className="flex-row justify-center items-center mt-8 gap-1.5">
              <PrimaryText className="text-on-surface-variant font-inter text-sm">
                Already part of the network?
              </PrimaryText>
              <TouchableOpacity onPress={handleGoToLogin} activeOpacity={0.7}>
                <PrimaryText className="text-primary font-inter font-bold text-sm">
                  Log In
                </PrimaryText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PrimaryView>
  );
}
