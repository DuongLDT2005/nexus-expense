import React, { ReactNode, memo } from 'react';
import { Text, TextProps, Pressable } from 'react-native';

interface PrimaryTextProps extends TextProps {
  children?: ReactNode;
  size?: number;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  variant?: 'text' | 'number';
  color?: string;
  onPress?: () => void;
  selectable?: boolean;
}

const PrimaryText: React.FC<PrimaryTextProps> = memo(({
  children,
  size,
  weight,
  variant,
  color,
  onPress,
  selectable = false,
  numberOfLines,
  ellipsizeMode,
  style,
  className = '',
  ...props
}) => {
  const resolvedEllipsizeMode = ellipsizeMode ?? (numberOfLines ? 'tail' : undefined);

  // Default to Outfit font for general text and Inter for numbers/body text
  const hasFontFamilyClass = className.includes('font-');
  const defaultFontClass = hasFontFamilyClass ? '' : (variant === 'number' ? 'font-inter' : 'font-outfit');

  // Build inline styles only for properties explicitly passed as props
  const inlineStyle: any = {
    includeFontPadding: false,
  };
  if (size !== undefined) {
    inlineStyle.fontSize = size;
  }
  if (weight !== undefined) {
    inlineStyle.fontWeight = weight === 'bold' ? '700' : weight === 'semibold' ? '600' : weight === 'medium' ? '500' : '400';
  }
  if (color !== undefined) {
    inlineStyle.color = color;
  }

  const textEl = (
    <Text
      className={`text-on-surface ${defaultFontClass} ${className}`}
      style={[inlineStyle, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={resolvedEllipsizeMode}
      selectable={selectable}
      {...props}
    >
      {children}
    </Text>
  );

  if (onPress) return <Pressable onPress={onPress} hitSlop={8}>{textEl}</Pressable>;
  return textEl;
});

export default PrimaryText;
