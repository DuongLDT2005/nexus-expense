// ─── Auth / User ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  currencyId: string;
  theme: 'light' | 'dark' | 'system';
  username?: string;
}

// ─── Currency ────────────────────────────────────────────────────────────────

export interface Currency {
  id: string;
  name: string;
  symbol: string;
  code: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  color: string;
  categoryStatus: boolean;
}

// ─── Expense / Transaction ───────────────────────────────────────────────────

export interface Expense {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  amount: number;
  description?: string;
  date: string;  // ISO date string: YYYY-MM-DD
  time?: string; // HH:MM (24h format)
}

// ─── Debt ────────────────────────────────────────────────────────────────────

export interface Debtor {
  id: string;
  userId: string;
  title: string;
  type: string;
  debtorStatus: boolean;
  icon?: string;
  color: string;
}

export interface Debt {
  id: string;
  userId: string;
  debtorId: string;
  amount: number;
  description: string;
  date: string;
  type: string;
}

export interface DebtorPreset {
  name: string;
  icon: string;
  color: string;
}

// ─── Redux State Shapes ──────────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface CategoryState {
  items: Category[];
  isLoading: boolean;
  error: string | null;
}

export interface TransactionState {
  items: Expense[];
  selectedMonth: string; // Format: YYYY-MM
  isLoading: boolean;
  error: string | null;
}

export interface DebtState {
  debtors: Debtor[];
  debts: Debt[];
  isLoading: boolean;
  error: string | null;
}

export interface SettingsState {
  currency: Currency | null;
  theme: 'light' | 'dark' | 'system';
}

// ─── Navigation Param Lists ──────────────────────────────────────────────────

export type AuthStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type HomeStackParamList = {
  TabNavigator: undefined;
  SettingsScreen: undefined;
  UpdateProfileScreen: undefined;
  AddTransactionsScreen: undefined;
  UpdateTransactionScreen: {
    expenseId: string;
    expenseTitle: string;
    expenseDescription: string;
    category: Category;
    expenseDate: string;
    expenseAmount: number;
  };
  AddCategoryScreen: undefined;
  UpdateCategoryScreen: { categoryId: string };
  AddDebtorScreen: undefined;
  UpdateDebtorScreen: { debtorId: string };
  IndividualDebtsScreen: { debtorId: string };
  AddDebtsScreen: { debtorId: string };
  UpdateDebtScreen: { debtId: string };
  EverydayTransactionScreen: { date: string };
  CategoryTransactionScreen: {
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    categoryIcon?: string;
    yearMonth: string;
  };
  ChooseCurrencyScreen: { isFromSettings?: boolean } | undefined;
};

export type TabParamList = {
  HomeScreen: undefined;
  ReportsScreen: undefined;
  CategoryScreen: undefined;
  DebtsScreen: undefined;
};

export type RootStackParamList = {
  OnboardingStack: undefined;
  ChooseCurrencyScreen: { isFromSettings?: boolean } | undefined;
  HomeStack: undefined;
}

export type MainStackParamList = HomeStackParamList;