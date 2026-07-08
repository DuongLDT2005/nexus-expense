import React, { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from './Icons';
import PrimaryText from './PrimaryText';
import useColorScheme from '../../hooks/useColorScheme';

interface AppHeaderProps {
  onPress?: () => void;
  text: string;
  subtitle?: string;
  iconSize?: number;
  rightAction?: ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = React.memo(({ onPress, text, subtitle, iconSize = 24, rightAction }) => {
  const isDark = useColorScheme() === 'dark';
  const iconColor = isDark ? '#e6e1e5' : '#1b1b1f';

  return (
    <View className="flex-row items-center w-full bg-white dark:bg-surface-lowest px-6 py-4">
      {/* Centered title (absolute) */}
      <View className="absolute left-0 right-0 items-center justify-center" pointerEvents="none">
        <PrimaryText 
          className="font-outfit font-bold text-on-surface text-lg text-center" 
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

      {/* Back button (z-above title) */}
      {onPress ? (
        <TouchableOpacity 
          onPress={onPress} 
          hitSlop={12} 
          accessibilityLabel="Go back" 
          accessibilityRole="button"
          activeOpacity={0.7}
          style={{ zIndex: 1 }}
        >
          <View className="p-2 -ml-2 rounded-full">
            <Icon name="arrow-left" size={iconSize} color={iconColor} />
          </View>
        </TouchableOpacity>
      ) : (
        <View className="w-10" />
      )}

      <View className="flex-1" />

      {/* Right action */}
      {rightAction ? (
        <View className="ml-2" style={{ zIndex: 1 }}>{rightAction}</View>
      ) : (
        <View className="w-10" />
      )}
    </View>
  );
});

export default AppHeader;
