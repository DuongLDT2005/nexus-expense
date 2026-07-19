import React, { ReactNode } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "./Icons";
import PrimaryText from "./PrimaryText";
import useColorScheme from "../../hooks/useColorScheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppHeaderProps {
  onPress?: () => void;
  text: string;
  subtitle?: string;
  iconSize?: number;
  rightAction?: ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = React.memo(
  ({ onPress, text, subtitle, iconSize = 24, rightAction }) => {
    const isDark = useColorScheme() === "dark";
    const iconColor = isDark ? "#c3c0ff" : "#4f46e5";
    const insets = useSafeAreaInsets();

    return (
      <View
        className="flex-row items-center justify-between w-full bg-white/80 dark:bg-inverse-surface/80 border-b border-surface-high dark:border-outline-variant px-4 shadow-sm"
        style={{
          paddingTop: insets.top,
          height: 45 + insets.top,
          paddingBottom: 12,
        }}
      >
        <View className="flex-row items-center flex-1">
          {onPress ? (
            <TouchableOpacity
              onPress={onPress}
              hitSlop={8}
              accessibilityLabel="Go back"
              accessibilityRole="button"
              activeOpacity={0.7}
            >
              <View className="p-2 -ml-2 mr-2 rounded-full active:scale-90">
                <Icon name="arrow-left" size={iconSize} color={iconColor} />
              </View>
            </TouchableOpacity>
          ) : (
            <View className="w-10" />
          )}

          <View className="flex-1 items-center justify-center">
            <PrimaryText
              className="font-outfit font-extrabold text-primary text-xl text-center"
              numberOfLines={1}
            >
              {text}
            </PrimaryText>
            {subtitle && (
              <PrimaryText
                size={12}
                className="text-on-surface-variant font-inter mt-0.5 text-center"
                numberOfLines={1}
              >
                {subtitle}
              </PrimaryText>
            )}
          </View>

          {rightAction ? (
            <View className="ml-2">{rightAction}</View>
          ) : (
            <View className="w-10" />
          )}
        </View>
      </View>
    );
  },
);

export default AppHeader;
