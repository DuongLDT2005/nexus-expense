import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { selectUser, loginSuccess } from "../redux/slices/authSlice";
import { setCurrency, setTheme, selectTheme } from "../redux/slices/settingsSlice";
import { getAllCurrencies } from "../services/currencyService";
import HomeStack from "./HomeStack";
import OnboardingStack from "./OnboardingStack";
import ChooseCurrencyScreen from "../screens/ChooseCurrencyScreen";
import type { RootStackParamList } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, useColorScheme as useSystemColorScheme } from "react-native";
import { useColorScheme as useNativewindColorScheme } from "nativewind";

const RootStack = createNativeStackNavigator<RootStackParamList>();

const MainStack = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const reduxTheme = useSelector(selectTheme);
  const systemScheme = useSystemColorScheme();
  const { setColorScheme } = useNativewindColorScheme();
  const [isInitializing, setIsInitializing] = useState(true);

  // Sync Nativewind theme scheme at the root level
  useEffect(() => {
    const activeTheme = reduxTheme === 'system' ? (systemScheme || 'light') : reduxTheme;
    setColorScheme(activeTheme);
  }, [reduxTheme, systemScheme, setColorScheme]);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@nexus_user");
        if (storedUser) {
          dispatch(loginSuccess(JSON.parse(storedUser)));
        }
      } catch (e) {
        console.error("Failed to load user session:", e);
      } finally {
        setIsInitializing(false);
      }
    };
    loadSession();
  }, [dispatch]);

  // Sync user's currencyId and theme with settings slice
  useEffect(() => {
    const syncSettings = async () => {
      if (user) {
        // Sync Currency
        if (user.currencyId) {
          try {
            const allCurrencies = await getAllCurrencies();
            const found = allCurrencies.find((c) => c.id === user.currencyId);
            if (found) {
              dispatch(
                setCurrency({
                  id: found.id,
                  code: found.code,
                  name: found.name,
                  symbol: found.symbol,
                }),
              );
            }
          } catch (e) {
            console.error("Failed to sync settings currency:", e);
          }
        }

        // Sync Theme
        if (user.theme) {
          dispatch(setTheme(user.theme));
        }
      }
    };
    syncSettings();
  }, [user?.currencyId, user?.theme, dispatch]);

  if (isInitializing) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <RootStack.Screen name="OnboardingStack" component={OnboardingStack} />
      ) : (
        <>
          <RootStack.Screen name="HomeStack" component={HomeStack} />
          <RootStack.Screen
            name="ChooseCurrencyScreen"
            component={ChooseCurrencyScreen}
          />
        </>
      )}
    </RootStack.Navigator>
  );
};

export default MainStack;
