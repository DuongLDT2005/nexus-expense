import { useEffect } from 'react';
import { ColorSchemeName, useColorScheme as _useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { selectTheme } from '../redux/slices/settingsSlice';

/**
 * Custom hook wrapping React Native's useColorScheme to support user-selected themes
 * from Redux, and synchronizes the active theme state with Nativewind.
 */
export default function useColorScheme(): NonNullable<ColorSchemeName> {
  const reduxTheme = useSelector(selectTheme);
  const systemScheme = _useColorScheme();
  const { setColorScheme } = useNativewindColorScheme();

  const activeTheme = reduxTheme === 'system' ? (systemScheme || 'light') : reduxTheme;

  useEffect(() => {
    // Sync theme with Nativewind
    setColorScheme(activeTheme);
  }, [activeTheme, setColorScheme]);

  return (activeTheme || 'light') as NonNullable<ColorSchemeName>;
}
