import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TransactionState, Expense } from '../../types';

const now = new Date();
const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

const initialState: TransactionState = {
  items: [],
  selectedMonth: defaultMonth,
  isLoading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setTransactions(state, action: PayloadAction<Expense[]>) {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addTransaction(state, action: PayloadAction<Expense>) {
      state.items.push(action.payload);
    },
    updateTransaction(state, action: PayloadAction<Expense>) {
      const index = state.items.findIndex(e => e.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    removeTransaction(state, action: PayloadAction<string>) {
      state.items = state.items.filter(e => e.id !== action.payload);
    },
    setSelectedMonth(state, action: PayloadAction<string>) {
      state.selectedMonth = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setTransactions,
  addTransaction,
  updateTransaction,
  removeTransaction,
  setSelectedMonth,
  setError,
} = transactionSlice.actions;

export const selectTransactions = (state: { transaction: TransactionState }) => state.transaction.items;
export const selectSelectedMonth = (state: { transaction: TransactionState }) => state.transaction.selectedMonth;
export const selectTransactionLoading = (state: { transaction: TransactionState }) => state.transaction.isLoading;

export default transactionSlice.reducer;
