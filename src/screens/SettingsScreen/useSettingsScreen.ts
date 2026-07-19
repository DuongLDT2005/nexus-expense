import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, logout, updateUser } from '../../redux/slices/authSlice';
import { selectCurrency, selectTheme, setTheme } from '../../redux/slices/settingsSlice';
import { updateUserById } from '../../services/userService';
import type { AppDispatch } from '../../redux/store';

export const useSettingsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const user = useSelector(selectUser);
  const currency = useSelector(selectCurrency);
  const theme = useSelector(selectTheme);

  // Theme selector state
  const [themeSelectionVisible, setThemeSelectionVisible] = useState(false);

  // Theme Toggles
  const handleThemeChange = useCallback(async (selectedTheme: 'light' | 'dark' | 'system') => {
    if (!user) return;

    try {
      // Update in Database
      await updateUserById(user.id, { theme: selectedTheme });
      
      // Update Auth Slice User
      dispatch(updateUser({ theme: selectedTheme }));

      // Update Settings Slice Theme
      dispatch(setTheme(selectedTheme));
      
      setThemeSelectionVisible(false);
    } catch (err) {
      console.error('Failed to update theme:', err);
    }
  }, [user, dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    user,
    currency,
    theme,
    themeSelectionVisible,
    setThemeSelectionVisible,
    handleThemeChange,
    handleLogout,
  };
};
