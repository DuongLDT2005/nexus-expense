import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DebtState, Debt, Debtor } from '../../types';

const initialState: DebtState = {
  debtors: [],
  debts: [],
  isLoading: false,
  error: null,
};

const debtSlice = createSlice({
  name: 'debt',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setDebtors(state, action: PayloadAction<Debtor[]>) {
      state.debtors = action.payload;
    },
    addDebtor(state, action: PayloadAction<Debtor>) {
      state.debtors.push(action.payload);
    },
    updateDebtor(state, action: PayloadAction<Debtor>) {
      const index = state.debtors.findIndex(d => d.id === action.payload.id);
      if (index !== -1) state.debtors[index] = action.payload;
    },
    removeDebtor(state, action: PayloadAction<string>) {
      state.debtors = state.debtors.filter(d => d.id !== action.payload);
    },
    setDebts(state, action: PayloadAction<Debt[]>) {
      state.debts = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addDebt(state, action: PayloadAction<Debt>) {
      state.debts.push(action.payload);
    },
    updateDebt(state, action: PayloadAction<Debt>) {
      const index = state.debts.findIndex(d => d.id === action.payload.id);
      if (index !== -1) state.debts[index] = action.payload;
    },
    removeDebt(state, action: PayloadAction<string>) {
      state.debts = state.debts.filter(d => d.id !== action.payload);
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setDebtors,
  addDebtor,
  updateDebtor,
  removeDebtor,
  setDebts,
  addDebt,
  updateDebt,
  removeDebt,
  setError,
} = debtSlice.actions;

export const selectDebtors = (state: { debt: DebtState }) => state.debt.debtors;
export const selectDebts = (state: { debt: DebtState }) => state.debt.debts;
export const selectDebtLoading = (state: { debt: DebtState }) => state.debt.isLoading;

export default debtSlice.reducer;
