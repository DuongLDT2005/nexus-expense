import React, { memo, useCallback } from "react";
import { TouchableOpacity, View, Alert } from "react-native";
import Icon from "../atoms/Icons";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateUser } from "../../redux/slices/authSlice";
import { updateUserById } from "../../services/userService";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MainStackParamList } from "../../types";
import PrimaryText from "../atoms/PrimaryText";
import useColorScheme from "../../hooks/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { nameSchema } from "../../utils/validationSchema";

interface HeaderContainerProps {
  headerText: string;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ headerText }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const isDark = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n: string) => n.charAt(0))
        .slice(0, 2)
        .join("")
    : "N";

  const handleProfileClick = useCallback(() => {
    Alert.prompt(
      "Update Name",
      "Enter your new display name:",
      async (newName) => {
        if (!newName) return;
        const nameVal = nameSchema.safeParse(newName.trim());
        if (!nameVal.success) {
          Alert.alert("Invalid Name", nameVal.error.issues[0].message);
          return;
        }
        if (user) {
          await updateUserById(user.id, { fullName: newName.trim() });
          dispatch(updateUser({ fullName: newName.trim() }));
        }
      },
      "plain-text",
      user?.fullName ?? "",
    );
  }, [user, dispatch]);

  return (
    <View
      className="flex-row items-end justify-between bg-white/80 dark:bg-inverse-surface/80 border-b border-surface-high dark:border-outline-variant px-4 shadow-sm"
      style={{
        paddingTop: insets.top,
        height: 45 + insets.top,
        paddingBottom: 12,
      }}
    >
      <View className="flex-row items-center gap-3">
        <TouchableOpacity onPress={handleProfileClick} activeOpacity={0.8}>
          <View className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <PrimaryText className="text-sm font-bold text-white">
              {initials.charAt(0)}
            </PrimaryText>
          </View>
        </TouchableOpacity>
        <PrimaryText className="font-bold text-xl tracking-tight text-primary dark:text-primary-fixed-dim">
          {headerText}
        </PrimaryText>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("SettingsScreen")}
        hitSlop={8}
        activeOpacity={0.7}
        className="active:scale-90"
      >
        <Icon
          name="settings"
          size={22}
          color={isDark ? "#c7c4d8" : "#464555"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(HeaderContainer);
