import React, { memo } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

interface SecondaryButtonProps {
  onPress(): void;
  buttonText: string;
  width?: number;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = memo(({ onPress, buttonText, width }) => (
  <TouchableOpacity onPress={onPress} hitSlop={8} accessibilityLabel={buttonText} accessibilityRole="button">
    <View
      className="h-11 p-2 mr-1 mt-1 rounded-md border-2 items-center justify-center border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
      style={width ? { width } : undefined}>
      <Text className="text-sm text-gray-900 dark:text-white">{buttonText}</Text>
    </View>
  </TouchableOpacity>
));

export default SecondaryButton;
