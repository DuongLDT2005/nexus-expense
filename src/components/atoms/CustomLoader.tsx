import React, { memo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import PrimaryText from './PrimaryText';
import useColorScheme from '../../hooks/useColorScheme';

interface CustomLoaderProps {
  message?: string;
}

const CustomLoader: React.FC<CustomLoaderProps> = memo(({ message }) => {
  const isDark = useColorScheme() === 'dark';
  const loaderColor = isDark ? '#c3c0ff' : '#4f46e5';

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color={loaderColor} />
      {message && (
        <PrimaryText className="text-sm text-on-surface-variant font-inter mt-4 text-center">
          {message}
        </PrimaryText>
      )}
    </View>
  );
});

export default CustomLoader;
