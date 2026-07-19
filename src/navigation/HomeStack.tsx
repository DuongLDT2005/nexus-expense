import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { HomeStackParamList, TabParamList } from "../types";

// Screens - Tab
import HomeScreen from "../screens/HomeScreen";
import ReportsScreen from "../screens/ReportsScreen";
import CategoryScreen from "../screens/CategoryScreen";
import DebtsScreen from "../screens/DebtsScreen";

// Screens - Stack
import SettingsScreen from "../screens/SettingsScreen";
import UpdateProfileScreen from "../screens/UpdateProfileScreen";
import AddTransactionsScreen from "../screens/AddTransactionsScreen";
import UpdateTransactionScreen from "../screens/UpdateTransactionScreen";
import AddCategoryScreen from "../screens/AddCategoryScreen";
import UpdateCategoryScreen from "../screens/UpdateCategoryScreen";
import AddDebtorScreen from "../screens/AddDebtorScreen";
import IndividualDebtsScreen from "../screens/IndividualDebtsScreen";
import AddDebtsScreen from "../screens/AddDebtsScreen";
import UpdateDebtScreen from "../screens/UpdateDebtScreen";
import UpdateDebtorScreen from "../screens/UpdateDebtorScreen";
import EverydayTransactionScreen from "../screens/EverydayTransactionScreen";
import CategoryTransactionScreen from "../screens/CategoryTransactionScreen";
import ChooseCurrencyScreen from "../screens/ChooseCurrencyScreen";

import Icon from "../components/atoms/Icons";
import useColorScheme from "../hooks/useColorScheme";

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

interface TabIconProps {
  focused: boolean;
  label: string;
  iconName: string;
}

const TabIcon = ({ focused, label, iconName }: TabIconProps) => {
  const isDark = useColorScheme() === "dark";
  const activeColor = isDark ? "#c3c0ff" : "#4f46e5"; // primary-fixed-dim / primary-container
  const inactiveColor = isDark ? "#c7c4d8" : "#464555"; // outline-variant / on-surface-variant
  const color = focused ? activeColor : inactiveColor;

  return (
    <View
      style={{
        width: 72,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={iconName} size={20} color={color} />
      <Text
        numberOfLines={1}
        style={{
          color,
          fontSize: 10,
          lineHeight: 14,
          fontWeight: focused ? "700" : "600",
          marginTop: 4,
          textAlign: "center",
          fontFamily: "System",
        }}
      >
        {label}
      </Text>
    </View>
  );
};

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const isDark = useColorScheme() === "dark";
  const bottomPadding = Math.max(insets.bottom, 6);

  return (
    <View
      className="bg-surface-lowest border-t border-surface-high flex-row justify-around items-center px-4 overflow-hidden"
      style={{
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 8,
        paddingBottom: bottomPadding,
        paddingTop: 8,
        height: 64 + bottomPadding,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{
              alignItems: "center",
              justifyContent: "center",
              transform: [{ scale: isFocused ? 1.05 : 1.0 }],
            }}
          >
            {options.tabBarIcon?.({ focused: isFocused, color: "", size: 24 })}
          </Pressable>
        );
      })}
    </View>
  );
};

const TabStack = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Home" iconName="home" />
          ),
        }}
      />
      <Tab.Screen
        name="ReportsScreen"
        component={ReportsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Reports" iconName="bar-chart-3" />
          ),
        }}
      />
      <Tab.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Categories" iconName="shapes" />
          ),
        }}
      />
      <Tab.Screen
        name="DebtsScreen"
        component={DebtsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Debts" iconName="credit-card" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Tab Navigator */}
      <Stack.Screen name="TabNavigator" component={TabStack} />

      {/* Các màn hình thuộc Group 1 (Detail Screens) */}
      <Stack.Group>
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="UpdateProfileScreen" component={UpdateProfileScreen} />
        <Stack.Screen
          name="EverydayTransactionScreen"
          component={EverydayTransactionScreen}
        />
        <Stack.Screen
          name="CategoryTransactionScreen"
          component={CategoryTransactionScreen}
        />
        <Stack.Screen
          name="IndividualDebtsScreen"
          component={IndividualDebtsScreen}
        />
        <Stack.Screen
          name="ChooseCurrencyScreen"
          component={ChooseCurrencyScreen}
        />
      </Stack.Group>

      {/* Các màn hình thuộc Group 2 (Add / Update Screens) */}
      <Stack.Group
        screenOptions={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      >
        <Stack.Screen
          name="AddTransactionsScreen"
          component={AddTransactionsScreen}
        />
        <Stack.Screen
          name="UpdateTransactionScreen"
          component={UpdateTransactionScreen}
        />
        <Stack.Screen name="AddCategoryScreen" component={AddCategoryScreen} />
        <Stack.Screen
          name="UpdateCategoryScreen"
          component={UpdateCategoryScreen}
        />
        <Stack.Screen name="AddDebtorScreen" component={AddDebtorScreen} />
        <Stack.Screen
          name="UpdateDebtorScreen"
          component={UpdateDebtorScreen}
        />
        <Stack.Screen name="AddDebtsScreen" component={AddDebtsScreen} />
        <Stack.Screen name="UpdateDebtScreen" component={UpdateDebtScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default HomeStack;
