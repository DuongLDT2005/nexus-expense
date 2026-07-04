import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../types";

import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen/index";
import RegisterScreen from "../screens/RegisterScreen/index";

const Stack = createNativeStackNavigator<
  AuthStackParamList & { HomeScreen: undefined }
>();

interface OnboardingStackProps {
  initialRouteName?: keyof AuthStackParamList;
}

const OnboardingStack: React.FC<OnboardingStackProps> = ({
  initialRouteName = "WelcomeScreen",
}) => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName={initialRouteName}
  >
    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
  </Stack.Navigator>
);

export default OnboardingStack;
