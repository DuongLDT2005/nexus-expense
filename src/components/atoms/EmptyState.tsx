import React, { ReactNode, memo } from "react";
import { View } from "react-native";
import Icon from "./Icons";
import type { IconName } from "./IconRegistry";
import PrimaryText from "./PrimaryText";
import useColorScheme from "../../hooks/useColorScheme";

type EmptyStateType = "Transactions" | "Insights" | "Debts" | "Categories";

interface EmptyStateProps {
  type: EmptyStateType;
  message?: string;
  actionButton?: ReactNode;
}

const iconMap: Record<EmptyStateType, IconName> = {
  Transactions: "receipt",
  Insights: "bar-chart-3",
  Debts: "hand-coins",
  Categories: "shapes",
};

const messageMap: Record<EmptyStateType, string> = {
  Transactions: "No transactions yet",
  Insights: "No insights yet",
  Debts: "No debts yet",
  Categories: "No categories yet",
};

const EmptyState: React.FC<EmptyStateProps> = memo(
  ({ type, message, actionButton }) => {
    const isDark = useColorScheme() === "dark";
    const iconColor = isDark ? "#c7c4d8" : "#777587";

    return (
      <View className="items-center justify-center mt-3 px-4">
        {/* Icon Wrapper */}
        <View className="w-14 h-14 rounded-2xl items-center justify-center bg-surface-high dark:bg-surface-variant/20 mb-4 shadow-sm">
          <Icon name={iconMap[type]} size={24} color={iconColor} />
        </View>
        {/* Message Label */}
        <PrimaryText className="text-base text-on-surface-variant font-inter font-medium text-center">
          {message ?? messageMap[type]}
        </PrimaryText>
        {/* Optional action button */}
        {actionButton && (
          <View className="mt-5 w-full max-w-[200px]">{actionButton}</View>
        )}
      </View>
    );
  },
);

export default EmptyState;
