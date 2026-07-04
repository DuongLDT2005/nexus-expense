import React, { ReactNode, memo } from 'react';
import { Keyboard, Platform, StatusBar, StyleProp, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PrimaryViewProps {
  children?: ReactNode;
  dismissKeyboardOnTouch?: boolean;
  useBottomPadding?: boolean;
  useSidePadding?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const PrimaryView: React.FC<PrimaryViewProps> = memo(({
  children,
  dismissKeyboardOnTouch = false,
  useBottomPadding = true,
  useSidePadding = true,
  className = '',
  style,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPad = useBottomPadding ? (Platform.OS === 'ios' ? insets.bottom : insets.bottom + 10) : 0;

  const hasBg = className.includes('bg-');
  const content = (
    <View
      className={`flex-1 ${hasBg ? '' : 'bg-background'} ${useSidePadding ? 'px-[4%]' : ''} ${className}`}
      style={[{ paddingTop: insets.top, paddingBottom: bottomPad }, style]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {children}
    </View>
  );

  if (dismissKeyboardOnTouch) {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {content}
      </TouchableWithoutFeedback>
    );
  }
  return content;
});

export default PrimaryView;
