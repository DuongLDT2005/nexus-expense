// User Service
export {
  createUser,
  updateUserById,
  getUserById,
  getAllUsers,
} from './userService';

// Category Service
export {
  createCategory,
  softDeleteCategoryById,
  updateCategoryById,
  getAllCategories,
  getAllCategoriesByUserId,
  getActiveCategoriesByUserId,
  getCategoryById,
} from './categoryService';

// Expense Service
export {
  createExpense,
  updateExpenseById,
  deleteExpenseById,
  getAllExpensesByUserId,
  getAllExpensesByUserIdWithCategory,
  getAllExpensesByDate,
  getAllExpensesByMonth,
  getAllExpensesByCategoryAndMonth,
  getAvailableExpenseYears,
  getExpenseById,
} from './expenseService';
export type {ExpenseWithCategory} from './expenseService';

// Currency Service
export {
  createCurrency,
  updateCurrencyById,
  getCurrencyById,
  getCurrencyByUserId,
  getAllCurrencies,
} from './currencyService';

// Debtor Service
export {
  createDebtor,
  softDeleteDebtorById,
  deleteDebtorById,
  updateDebtorById,
  getAllDebtors,
  getAllDebtorsByUserId,
  getActiveDebtorsByUserId,
  getDebtorByDebtorId,
} from './debtorService';

// Debt Service
export {
  createDebt,
  updateDebtById,
  deleteDebtById,
  deleteAllDebtsByDebtorId,
  getAllDebtsByUserId,
  getAllDebtsByUserIdAndDebtorId,
  getDebtById,
} from './debtService';
