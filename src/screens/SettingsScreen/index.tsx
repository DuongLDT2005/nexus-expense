import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryView from "../../components/atoms/PrimaryView";
import PrimaryText from "../../components/atoms/PrimaryText";
import PrimaryButton from "../../components/atoms/PrimaryButton";
import Icon from "../../components/atoms/Icons";
import useColorScheme from "../../hooks/useColorScheme";
import { useSettingsScreen } from "./useSettingsScreen";

import AppHeader from "../../components/atoms/AppHeader";

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const isDark = useColorScheme() === "dark";

  const {
    user,
    currency,
    theme,
    themeSelectionVisible,
    setThemeSelectionVisible,
    handleThemeChange,
    handleLogout,
  } = useSettingsScreen();

  const getThemeText = (themeVal: string) => {
    switch (themeVal) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      default:
        return `System (${isDark ? "Dark" : "Light"})`;
    }
  };

  const getThemeIcon = (themeVal: string) => {
    switch (themeVal) {
      case "light":
        return "sun";
      case "dark":
        return "moon";
      default:
        return "sun-moon";
    }
  };

  return (
    <PrimaryView
      useSidePadding={false}
      className="flex-grow flex flex-col justify-between bg-surface-low dark:bg-surface-lowest"
      style={{ paddingTop: 0 }}
    >
      {/* Header bar */}
      <AppHeader onPress={() => navigation.goBack()} text="Settings" />

      <ScrollView
        className="bg-surface-low dark:bg-surface-lowest"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingVertical: 20,
          justifyContent: "space-between",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-between gap-8">
          <View className="gap-6">
            {/* User Profile Card */}
            <View className="bg-surface-lowest dark:bg-surface-low rounded-2xl p-6 shadow-sm border border-surface-high dark:border-outline-variant/10 flex items-center justify-center">
              <View className="flex flex-col items-center gap-4 w-full">
                <View className="w-20 h-20 rounded-full bg-primary-fixed dark:bg-primary/20 flex items-center justify-center overflow-hidden">
                  <Icon
                    name="user"
                    size={40}
                    color={isDark ? "#c3c0ff" : "#3525cd"}
                  />
                </View>
                <View className="text-center items-center">
                  <PrimaryText className="font-headline font-bold text-[22px] text-on-background dark:text-on-surface">
                    {user?.fullName}
                  </PrimaryText>
                  <PrimaryText className="text-on-surface-variant dark:text-outline text-sm mt-0.5 font-inter">
                    {user?.email}
                  </PrimaryText>

                  {/* Edit Profile Action Button */}
                  <View className="mt-4">
                    <PrimaryButton
                      onPress={() => navigation.navigate("UpdateProfileScreen")}
                      buttonTitle="Edit Profile"
                      variant="outline"
                      size="sm"
                      icon="pencil"
                      fullWidth={false}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Options Card */}
            <View className="bg-surface-lowest dark:bg-surface-low rounded-2xl overflow-hidden shadow-sm border border-surface-high dark:border-outline-variant/10">
              {/* Theme Settings Option */}
              <TouchableOpacity
                onPress={() => setThemeSelectionVisible(true)}
                activeOpacity={0.7}
                className="w-full flex-row items-center gap-4 px-4 py-4 hover:bg-surface-low dark:hover:bg-surface-variant/20 transition-colors"
              >
                <View className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary-fixed dark:bg-primary/20 text-primary">
                  <Icon
                    name={getThemeIcon(theme)}
                    size={20}
                    color={isDark ? "#c3c0ff" : "#3525cd"}
                  />
                </View>
                <View className="flex-1 flex-row items-center justify-between">
                  <PrimaryText className="font-headline font-bold text-[15px] text-on-surface">
                    Theme
                  </PrimaryText>
                  <View className="flex-row items-center gap-2">
                    <PrimaryText className="text-on-surface-variant dark:text-outline text-sm font-inter">
                      {getThemeText(theme)}
                    </PrimaryText>
                    <Icon
                      name="chevron-right"
                      size={20}
                      color={isDark ? "#918fa1" : "#c7c4d8"}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {/* Divider */}
              <View className="mx-4 h-[1px] bg-surface-high dark:bg-outline-variant/10" />

              {/* Currency Settings Option */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ChooseCurrencyScreen", {
                    isFromSettings: true,
                  })
                }
                activeOpacity={0.7}
                className="w-full flex-row items-center gap-4 px-4 py-4 hover:bg-surface-low dark:hover:bg-surface-variant/20 transition-colors"
              >
                <View className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary-fixed dark:bg-primary/20 text-primary">
                  <Icon
                    name="banknote"
                    size={20}
                    color={isDark ? "#c3c0ff" : "#3525cd"}
                  />
                </View>
                <View className="flex-1 flex-row items-center justify-between">
                  <PrimaryText className="font-headline font-bold text-[15px] text-on-surface">
                    Currency
                  </PrimaryText>
                  <View className="flex-row items-center gap-2">
                    <View className="flex-row items-center gap-1.5 bg-surface-low dark:bg-surface-lowest px-2 py-0.5 rounded-lg">
                      <PrimaryText className="font-bold text-xs text-primary dark:text-primary-fixed-dim">
                        {currency ? currency.symbol : "$"}
                      </PrimaryText>
                      <PrimaryText className="text-on-surface-variant dark:text-outline text-[11px] font-semibold font-inter">
                        {currency ? currency.name : "Not set"}
                      </PrimaryText>
                    </View>
                    <Icon
                      name="chevron-right"
                      size={20}
                      color={isDark ? "#918fa1" : "#c7c4d8"}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Log Out Section */}
          <View className="pt-8 pb-12">
            <PrimaryButton
              onPress={handleLogout}
              buttonTitle="Log Out"
              variant="danger"
              icon="power"
              size="md"
            />
          </View>
        </View>
      </ScrollView>

      {/* 🎨 THEME SELECTION MODAL */}
      <Modal
        visible={themeSelectionVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setThemeSelectionVisible(false)}
        statusBarTranslucent
      >
        <Pressable
          className="flex-1 bg-black/60 justify-center items-center p-6"
          style={{ width: "100%", height: "100%" }}
          onPress={() => setThemeSelectionVisible(false)}
        >
          <Pressable
            className="w-full max-w-[300px] bg-surface-lowest dark:bg-surface-low border border-surface-high dark:border-outline-variant/10 rounded-3xl p-6 shadow-2xl gap-5"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center">
              <PrimaryText className="font-headline font-bold text-lg text-on-surface">
                Appearance Theme
              </PrimaryText>
            </View>

            <View className="gap-2">
              {(["light", "dark", "system"] as const).map((t) => {
                const isSelected = theme === t;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => handleThemeChange(t)}
                    activeOpacity={0.7}
                    className={`flex-row items-center justify-between p-4 rounded-2xl border ${
                      isSelected
                        ? "bg-primary/10 border-primary dark:bg-primary-fixed-dim/10 dark:border-primary-fixed-dim"
                        : "bg-surface-low/50 dark:bg-surface-lowest/5 border-transparent"
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <Icon
                        name={getThemeIcon(t)}
                        size={18}
                        color={
                          isSelected
                            ? isDark
                              ? "#c3c0ff"
                              : "#3525cd"
                            : "#777587"
                        }
                      />
                      <PrimaryText
                        className={`font-inter text-sm font-semibold ${
                          isSelected
                            ? "text-primary dark:text-primary-fixed-dim"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {getThemeText(t)}
                      </PrimaryText>
                    </View>
                    {isSelected && (
                      <Icon
                        name="check"
                        size={16}
                        color={isDark ? "#c3c0ff" : "#3525cd"}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <PrimaryButton
              onPress={() => setThemeSelectionVisible(false)}
              buttonTitle="Close"
              variant="primary"
            />
          </Pressable>
        </Pressable>
      </Modal>
    </PrimaryView>
  );
}
