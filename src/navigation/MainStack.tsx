import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { selectUser, loginSuccess } from "../redux/slices/authSlice";
import HomeStack from "./HomeStack";
import OnboardingStack from "./OnboardingStack";
import ChooseCurrencyScreen from "../screens/ChooseCurrencyScreen";
import type { RootStackParamList } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

const RootStack = createNativeStackNavigator<RootStackParamList>();

const MainStack = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [isInitializing, setIsInitializing] = useState(true);

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
