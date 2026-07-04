import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../types";
import PrimaryView from "../../components/atoms/PrimaryView";
import Icon from "../../components/atoms/Icons";
import useColorScheme from "../../hooks/useColorScheme";
import PrimaryButton from "../../components/atoms/PrimaryButton";
import PrimaryText from "../../components/atoms/PrimaryText";

export default function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const isDark = useColorScheme() === "dark";

  return (
    <PrimaryView
      useSidePadding={false}
      className="relative overflow-hidden bg-background"
    >
      {/* Background Decorative Circles */}
      <View className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full" />
      <View className="absolute top-1/2 -right-32 w-80 h-80 bg-secondary/10 rounded-full" />

      <View className="flex-1 justify-between px-6 py-8 z-10">
        {/* Main Content Area */}
        <View className="flex-1 justify-center items-center">
          {/* Icon Container */}
          <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center mb-8 shadow-sm">
            <Icon
              name="wallet"
              size={36}
              color={isDark ? "#c3c0ff" : "#4f46e5"}
            />
          </View>

          {/* Headline */}
          <PrimaryText className="text-4xl font-outfit font-extrabold text-on-surface text-center tracking-tight leading-tight mb-4">
            Welcome to <PrimaryText className="text-primary">Nexus</PrimaryText> Expense
          </PrimaryText>

          {/* Subtext */}
          <PrimaryText className="text-on-surface-variant font-inter text-base text-center leading-relaxed max-w-xs">
            Track your spending, manage budgets, and take control of your
            finances.
          </PrimaryText>
        </View>

        {/* Actions Footer */}
        <View className="w-full gap-y-4">
          {/* Primary Action Button */}
          <PrimaryButton
            onPress={() => navigation.navigate("RegisterScreen")}
            buttonTitle="Get Started"
            size="lg"
          />

          {/* Secondary Action Button */}
          <PrimaryButton
            onPress={() => navigation.navigate("LoginScreen")}
            buttonTitle="I already have an account"
            variant="outline"
            size="lg"
            fontWeight="semibold"
          />

          {/* Optional micro-link */}
          <View className="items-center pt-2">
            <PrimaryText className="text-[10px] text-on-surface-variant/60 font-inter font-medium tracking-wide">
              By continuing, you agree to our{" "}
              <PrimaryText className="underline">Terms</PrimaryText>
            </PrimaryText>
          </View>
        </View>
      </View>
    </PrimaryView>
  );
}
