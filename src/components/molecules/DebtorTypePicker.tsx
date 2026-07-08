import React, { memo } from 'react';
import { View, TouchableOpacity, ScrollView, Text } from 'react-native';
import Icon from '../atoms/Icons';
import debtPresets from '../../../assets/jsons/defaultDebtAccounts.json';

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

const DebtorTypePicker: React.FC<DebtorTypePickerProps> = memo(({
  selectedType,
  onSelectType,
}) => {
  return (
    <View className="mb-4">
      <Text className="text-xs font-outfit font-medium text-on-surface-variant mb-2 uppercase tracking-wider">
        Type
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8, gap: 8 }}
      >
        {debtPresets.map((preset: Preset) => {
          const isSelected = selectedType === preset.name;
          const chipBg = isSelected
            ? 'bg-primary shadow-sm'
            : 'bg-surface-container-highest';
          const textClass = isSelected
            ? 'text-on-primary font-bold'
            : 'text-on-surface-variant font-normal';
          const iconColor = isSelected ? '#ffffff' : preset.color || '#757780';

          return (
            <TouchableOpacity
              key={preset._id}
              activeOpacity={0.7}
              onPress={() => onSelectType(preset.name, preset.icon, preset.color)}
              className={`flex-row items-center gap-2 px-4 py-2.5 rounded-xl ${chipBg}`}
            >
              <Icon name={preset.icon} size={16} color={iconColor} />
              <Text className={`text-sm font-outfit ${textClass}`}>
                {preset.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

export default DebtorTypePicker;
