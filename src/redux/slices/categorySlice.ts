import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryState, Category } from '../../types';

const initialState: CategoryState = {
  items: [],
  isLoading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setCategories(state, action: PayloadAction<Category[]>) {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addCategory(state, action: PayloadAction<Category>) {
      state.items.push(action.payload);
    },
    updateCategory(state, action: PayloadAction<Category>) {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    removeCategory(state, action: PayloadAction<string>) {
      state.items = state.items.filter(c => c.id !== action.payload);
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setLoading, setCategories, addCategory, updateCategory, removeCategory, setError } = categorySlice.actions;

export const selectCategories = (state: { category: CategoryState }) => state.category.items;
export const selectActiveCategories = (state: { category: CategoryState }) =>
  state.category.items.filter(c => c.categoryStatus);
export const selectCategoryLoading = (state: { category: CategoryState }) => state.category.isLoading;

export default categorySlice.reducer;
