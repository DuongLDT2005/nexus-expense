import React, { memo } from "react";
import { TouchableOpacity, View, ActivityIndicator } from "react-native";
import PrimaryText from "./PrimaryText";
import Icon from "./Icons";
import useColorScheme from "../../hooks/useColorScheme";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface PrimaryButtonProps {
  onPress: () => void;
  buttonTitle: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  fontWeight?: "regular" | "medium" | "semibold" | "bold";
  textColor?: string;
}

const HEIGHT_NUM: Record<ButtonSize, number> = { sm: 40, md: 52, lg: 56 };
const FONT: Record<ButtonSize, number> = { sm: 12, md: 15, lg: 16 };
const ICON_S: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 20 };

const PrimaryButton: React.FC<PrimaryButtonProps> = memo(
  ({
    onPress,
    buttonTitle,
    disabled = false,
    loading = false,
    variant = "primary",
    size = "md",
    icon,
    iconPosition = "left",
    fullWidth = true,
    fontWeight,
    textColor,
  }) => {
    const isDark = useColorScheme() === "dark";
    const isDisabled = disabled || loading;

    // Design system background colors
    const bgClass =
      variant === "primary"
        ? "bg-primary shadow-xl shadow-primary/20 dark:shadow-black/40"
        : variant === "danger"
          ? "bg-error shadow-xl shadow-error/20 dark:shadow-black/40"
          : variant === "secondary"
            ? "bg-secondary shadow-md shadow-secondary/20 dark:shadow-black/40"
            : variant === "outline"
              ? "bg-surface-lowest border-[0.5px] border-outline-variant"
              : "bg-transparent"; // ghost

    // Resolve matching colors for Text & Icons according to design system
    const resolvedTextColor =
      textColor ||
      (variant === "primary"
        ? isDark
          ? "#1d00a5"
          : "#ffffff" // --on-primary
        : variant === "danger"
          ? isDark
            ? "#690005"
            : "#ffffff" // --on-error
          : variant === "secondary"
            ? isDark
              ? "#003824"
              : "#ffffff" // --on-secondary
            : variant === "outline"
              ? isDark
                ? "#e6e1e5"
                : "#1b1b1f" // --on-surface
              : isDark
                ? "#c3c0ff"
                : "#4f46e5"); // --primary

    // Resolve background style
    const bgStyle = (() => {
      if (variant === "primary") {
        return {
          backgroundColor: isDark ? "#7c78ff" : "#4338ca",
        };
      }
      if (variant === "secondary") {
        return {
          backgroundColor: isDark ? "#4ade80" : "#16a34a",
        };
      }
      if (variant === "outline") {
        return {
          backgroundColor: isDark ? "transparent" : "#fafafa",
          borderWidth: 1,
          borderStyle: "dashed" as const,
          borderColor: isDark ? "#555" : "#c0bfca",
        };
      }
      return { backgroundColor: "transparent" };
    })();

    const isRoundedRect = variant === "outline";
    const borderRadius = isRoundedRect ? 16 : 9999;

    const widthStyle = fullWidth ? { width: "100%" as const } : {};
    const iconEl = icon ? (
      <Icon name={icon} size={ICON_S[size]} color={resolvedTextColor} />
    ) : null;
    const resolvedFontWeight =
      fontWeight ||
      (variant === "outline" || size === "sm" ? "semibold" : "bold");

    return (
      <View style={[{ position: "relative" as const }, widthStyle]}>
        {/* Visual Button */}
        <View
          style={[
            {
              height: HEIGHT_NUM[size],
              borderRadius,
              alignItems: "center" as const,
              justifyContent: "center" as const,
              flexDirection: "row" as const,
              paddingHorizontal: 16,
              opacity: isDisabled ? 0.5 : 1,
            },
            bgStyle,
          ]}
          pointerEvents="none"
        >
          {loading ? (
            <ActivityIndicator size="small" color={resolvedTextColor} />
          ) : (
            <>
              {icon && iconPosition === "left" && (
                <View className="mr-2">{iconEl}</View>
              )}
              <PrimaryText
                size={FONT[size]}
                weight={resolvedFontWeight}
                color={resolvedTextColor}
                className="text-center"
              >
                {buttonTitle}
              </PrimaryText>
              {icon && iconPosition === "right" && (
                <View className="ml-2">{iconEl}</View>
              )}
            </>
          )}
        </View>

        {/* Touchable Overlay */}
        {!isDisabled && (
          <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            accessibilityLabel={buttonTitle}
            accessibilityRole="button"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius,
            }}
          />
        )}
      </View>
    );
  },
);

export default PrimaryButton;
