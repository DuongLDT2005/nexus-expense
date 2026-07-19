import React, { memo } from "react";
import { View, TouchableOpacity, ScrollView, Text } from "react-native";
import Icon from "../atoms/Icons";
import debtPresets from "../../../assets/jsons/defaultDebtAccounts.json";
import PrimaryText from "../atoms/PrimaryText";
import useColorScheme from "../../hooks/useColorScheme";

interface Preset {
  _id: string;
  name: string;
  icon: string;
  color: string;
}

interface DebtorTypePickerProps {
  selectedType: string | null;
  onSelectType: (name: string, icon: string, color: string) => void;
}

const DebtorTypePicker: React.FC<DebtorTypePickerProps> = memo(
  ({ selectedType, onSelectType }) => {
    const isDark = useColorScheme() === "dark";

    return (
      <View className="space-y-2 mb-2">
        <PrimaryText className="text-sm font-extrabold text-on-surface-variant tracking-widest ml-1 font-inter mb-2">
          Type
        </PrimaryText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8, gap: 8 }}
        >
          {debtPresets.map((preset: Preset) => {
            const isSelected = selectedType === preset.name;
            const iconColor = isSelected
              ? isDark ? "#1d00a5" : "#ffffff"
              : preset.color || (isDark ? "#c7c4d8" : "#757780");

            return (
              <TouchableOpacity
                key={preset._id}
                activeOpacity={0.7}
                onPress={() =>
                  onSelectType(preset.name, preset.icon, preset.color)
                }
                className="flex-row items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{
                  backgroundColor: isSelected
                    ? (isDark ? "#c3c0ff" : "#4f46e5")
                    : (isDark ? "rgba(234, 230, 244, 0.1)" : "#e4e1ee"),
                }}
              >
                <Icon name={preset.icon} size={16} color={iconColor} />
                <Text
                  className="text-sm font-outfit"
                  style={{
                    color: isSelected ? (isDark ? "#1d00a5" : "#ffffff") : (isDark ? "#e4e1ee" : "#464555"),
                    fontWeight: isSelected ? "700" : "400",
                  }}
                >
                  {preset.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  },
);

export default DebtorTypePicker;
