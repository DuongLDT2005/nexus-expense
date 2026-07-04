import { ColorSchemeName, useColorScheme as _useColorScheme } from 'react-native';

/**
 * Custom hook wrapping React Native's useColorScheme to ensure a non-nullable theme name.
 */
export default function useColorScheme(): NonNullable<ColorSchemeName> {
  return _useColorScheme() as NonNullable<ColorSchemeName>;
}
