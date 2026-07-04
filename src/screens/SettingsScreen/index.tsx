import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { selectUser, logout } from "../../redux/slices/authSlice";
import { selectCurrency } from "../../redux/slices/settingsSlice";
import PrimaryView from "../../components/atoms/PrimaryView";
import AppHeader from "../../components/atoms/AppHeader";
import PrimaryText from "../../components/atoms/PrimaryText";
import PrimaryButton from "../../components/atoms/PrimaryButton";
import Icon from "../../components/atoms/Icons";
import useColorScheme from "../../hooks/useColorScheme";

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const user = useSelector(selectUser);
  const currency = useSelector(selectCurrency);
  const isDark = useColorScheme() === "dark";

  const handleLogout = () => {
    dispatch(logout());
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n: string) => n.charAt(0))
        .slice(0, 2)
        .join("")
    : "U";

  return (
    <PrimaryView
      useSidePadding={false}
      className="flex-grow flex flex-col justify-between bg-white dark:bg-surface-lowest"
      style={{ paddingTop: 0 }}
    >
      {/* Header bar */}
      <AppHeader
        onPress={() => navigation.goBack()}
        text="Settings"
      />

      <ScrollView
        className="bg-surface-low"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 24,
          justifyContent: "space-between",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-between">
          <View className="gap-6">
            {/* User Profile Card */}
            <View className="bg-surface-lowest border border-outline-variant/30 rounded-3xl p-5 flex-row items-center gap-4 shadow-sm">
              <View className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <PrimaryText className="text-xl font-bold text-on-primary">
                  {initials}
                </PrimaryText>
              </View>
              <View className="flex-1">
                <PrimaryText className="font-outfit font-bold text-lg text-on-surface">
                  {user?.fullName}
                </PrimaryText>
                <PrimaryText className="text-sm text-on-surface-variant font-inter mt-0.5">
                  {user?.email}
                </PrimaryText>
              </View>
            </View>

            {/* Settings Options Card */}
            <View className="bg-surface-lowest border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
              {/* Currency Option */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ChooseCurrencyScreen", {
                    isFromSettings: true,
                  })
                }
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-5 border-b border-surface-container-high dark:border-outline-variant/10"
              >
                <View className="flex-row items-center gap-3.5">
                  <View className="w-10 h-10 rounded-2xl bg-secondary/10 items-center justify-center">
                    <Icon
                      name="banknote"
                      size={20}
                      color={isDark ? "#4edea3" : "#006e2f"}
                    />
                  </View>
                  <View>
                    <PrimaryText className="font-outfit font-bold text-base text-on-surface">
                      Primary Currency
                    </PrimaryText>
                    <PrimaryText className="text-xs text-on-surface-variant font-inter mt-0.5">
                      Configure your default currency
                    </PrimaryText>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <PrimaryText className="text-sm font-semibold text-primary font-inter">
                    {currency ? `${currency.code} (${currency.symbol})` : "Not set"}
                  </PrimaryText>
                  <Icon name="chevron-right" size={20} color="#777587" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <View className="mt-12 mb-6">
            <PrimaryButton
              onPress={handleLogout}
              buttonTitle="Log Out"
              variant="outline"
              size="lg"
              textColor={isDark ? "#ffb2b7" : "#ba1a1a"} // error color from Stitch theme
            />
          </View>
        </View>
      </ScrollView>
    </PrimaryView>
  );
}
