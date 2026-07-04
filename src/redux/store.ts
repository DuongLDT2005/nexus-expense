import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import transactionReducer from './slices/transactionSlice';
import debtReducer from './slices/debtSlice';
import settingsReducer from './slices/settingsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@nexus_user';

const authPersistenceMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  if (action.type.startsWith('auth/')) {
    const authState = store.getState().auth;
    if (authState.user) {
      AsyncStorage.setItem(USER_KEY, JSON.stringify(authState.user)).catch(e => 
        console.error('Failed to save user session:', e)
      );
    } else {
      AsyncStorage.removeItem(USER_KEY).catch(e => 
        console.error('Failed to clear user session:', e)
      );
    }
  }
  
  return result;
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    transaction: transactionReducer,
    debt: debtReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authPersistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
