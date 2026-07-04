import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState, Currency } from '../../types';

const initialState: SettingsState = {
  currency: null,
  theme: 'system',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<Currency>) {
      state.currency = action.payload;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark' | 'system'>) {
      state.theme = action.payload;
    },
  },
});

export const { setCurrency, setTheme } = settingsSlice.actions;

export const selectCurrency = (state: { settings: SettingsState }) => state.settings.currency;
export const selectTheme = (state: { settings: SettingsState }) => state.settings.theme;

export default settingsSlice.reducer;
