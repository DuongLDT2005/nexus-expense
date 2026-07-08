import { ScrollView, TextInput, View } from 'react-native';
import React, { useCallback, useEffect, useState, memo } from 'react';
import PrimaryView from '../atoms/PrimaryView';
import AppHeader from '../atoms/AppHeader';
import CustomInput from '../atoms/CustomInput';
import PrimaryText from '../atoms/PrimaryText';
import CategoryContainer from './CategoryContainer';
import PrimaryButton from '../atoms/PrimaryButton';
import DatePickerField from '../atoms/DatePickerField';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { MainStackParamList, Category } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrency } from '../../redux/slices/settingsSlice';
import { selectUser } from '../../redux/slices/authSlice';
import {
  selectActiveCategories,
  setCategories,
} from '../../redux/slices/categorySlice';
import {
  setTransactions,
  selectSelectedMonth,
} from '../../redux/slices/transactionSlice';
import {
  createExpense,
  updateExpenseById,
  getAllExpensesByMonth,
  getActiveCategoriesByUserId,
} from '../../services';
import { getISODateTime, formatDate } from '../../utils/dateUtils';
import {
  expenseAmountSchema,
  expenseDescriptionSchema,
  expenseSchema,
} from '../../utils/validationSchema';
import useColorScheme from '../../hooks/useColorScheme';
import type { AppDispatch } from '../../redux/store';

interface ExpenseEntryProps {
  type: string;
  route?: any;
}

const ExpenseEntry: React.FC<ExpenseEntryProps> = ({ type, route }) => {
  const expenseData = route?.params;
  const isAddButton = type === 'Add';
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();
  const isDark = useColorScheme() === 'dark';

  const [hasInteracted, setHasInteracted] = useState(false);
  const categories = useSelector(selectActiveCategories);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    isAddButton
      ? []
      : categories?.filter(
          (category: Category) =>
            category?.name === expenseData?.category?.name,
        ) ?? [],
  );

  const [createdAt, setCreatedAt] = useState(
    isAddButton ? getISODateTime() : expenseData?.expenseDate ?? getISODateTime(),
  );
  const [expenseTitle, setExpenseTitle] = useState(
    isAddButton ? '' : expenseData?.expenseTitle ?? '',
  );
  const [expenseDescription, setExpenseDescription] = useState(
    isAddButton ? '' : expenseData?.expenseDescription ?? '',
  );
  const [expenseAmount, setExpenseAmount] = useState(
    isAddButton ? '' : String(expenseData?.expenseAmount ?? ''),
  );

  const expenseAmountError = hasInteracted
    ? expenseAmountSchema?.safeParse(Number(expenseAmount)).error?.issues || []
    : [];

  const isValid =
    expenseSchema.safeParse(expenseTitle).success &&
    expenseDescriptionSchema.safeParse(expenseDescription).success &&
    expenseAmountSchema.safeParse(Number(expenseAmount)).success;

  const user = useSelector(selectUser);
  const currency = useSelector(selectCurrency);
  const selectedMonth = useSelector(selectSelectedMonth);
  const currencySymbol = currency?.symbol ?? '$';

  useEffect(() => {
    if (user) {
      getActiveCategoriesByUserId(user.id).then((data) => {
        dispatch(setCategories(data));
      });
    }
  }, [dispatch, user]);

  const handleAddCategory = useCallback(() => {
    navigation.navigate('AddCategoryScreen');
  }, [navigation]);

  const handleTextInputFocus = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const refreshTransactions = useCallback(
    async (yearMonth: string) => {
      if (!user) return;
      const data = await getAllExpensesByMonth(user.id, yearMonth);
      dispatch(setTransactions(data));
    },
    [user, dispatch],
  );

  const handleAddExpense = useCallback(async () => {
    if (!isValid || selectedCategories.length === 0 || !user) return;

    const categoryId = selectedCategories[0].id;
    try {
      await createExpense(
        user.id,
        expenseTitle,
        Number(expenseAmount),
        expenseDescription,
        categoryId,
        createdAt,
      );
      const yearMonth = formatDate(createdAt, 'YYYY-MM');
      await refreshTransactions(yearMonth);
      navigation.goBack();
    } catch (error) {
      if (__DEV__) {
        console.error('Error creating expense:', error);
      }
    }
  }, [
    isValid,
    selectedCategories,
    user,
    expenseTitle,
    expenseAmount,
    expenseDescription,
    createdAt,
    refreshTransactions,
    navigation,
  ]);

  const handleUpdateExpense = useCallback(async () => {
    if (!isValid || selectedCategories.length === 0 || !user) return;

    const categoryId = selectedCategories[0].id;
    try {
      await updateExpenseById(
        expenseData?.expenseId,
        categoryId,
        expenseTitle,
        Number(expenseAmount),
        expenseDescription,
        createdAt,
      );
      const yearMonth = formatDate(createdAt, 'YYYY-MM');
      await refreshTransactions(yearMonth);
      navigation.goBack();
    } catch (error) {
      if (__DEV__) {
        console.error('Error updating expense:', error);
      }
    }
  }, [
    isValid,
    selectedCategories,
    expenseData?.expenseId,
    expenseTitle,
    expenseAmount,
    expenseDescription,
    createdAt,
    refreshTransactions,
    navigation,
    user,
  ]);

  const toggleCategorySelection = useCallback(
    (category: Category) => {
      if (selectedCategories.some((c) => c.id === category.id)) {
        setSelectedCategories([]);
      } else {
        setSelectedCategories([category]);
      }
    },
    [selectedCategories],
  );

  const amountPlaceholderColor = isDark ? '#918fa1' : '#757780';

  return (
    <PrimaryView dismissKeyboardOnTouch useSidePadding={false} style={{ paddingTop: 0 }}>
      <AppHeader
        onPress={() => navigation.goBack()}
        text={isAddButton ? 'Add Transaction' : 'Edit Transaction'}
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mt-4">
          <CustomInput
            input={expenseTitle}
            setInput={setExpenseTitle}
            placeholder="eg. Biryani"
            label="Title"
            schema={expenseSchema}
          />
        </View>

        <View className="mt-3">
          <CustomInput
            input={expenseDescription}
            setInput={setExpenseDescription}
            placeholder="eg. From Aroma's"
            label="Description"
            schema={expenseDescriptionSchema}
            multiline
          />
        </View>

        <View className="mt-3">
          <PrimaryText className="text-[10px] font-outfit font-bold text-on-surface-variant mb-1.5 tracking-widest uppercase">
            Amount
          </PrimaryText>
          <View
            className={`h-12 items-center rounded-2xl pl-3 justify-start flex-row bg-white dark:bg-surface-high border-[1px] border-outline-variant/40 ${
              expenseAmountError.length > 0 ? 'mb-1' : 'mb-4'
            }`}
          >
            <PrimaryText size={15} variant="number" className="text-on-surface-variant">
              {currencySymbol}
            </PrimaryText>
            <TextInput
              className="px-3 h-12 flex-1 text-sm font-inter font-medium text-on-surface"
              style={{ includeFontPadding: false }}
              value={expenseAmount}
              onChangeText={setExpenseAmount}
              placeholder="0.00"
              onChange={handleTextInputFocus}
              placeholderTextColor={amountPlaceholderColor}
              keyboardType="numeric"
            />
          </View>
          {expenseAmountError.length > 0 && (
            <View className="mb-2.5">
              {expenseAmountError.map((error: { message: string }) => (
                <PrimaryText
                  key={error.message}
                  className="text-xs font-outfit text-error font-medium"
                >
                  {error.message}
                </PrimaryText>
              ))}
            </View>
          )}
        </View>

        <DatePickerField
          createdAt={createdAt}
          setCreatedAt={setCreatedAt}
          label="Date"
        />

        <PrimaryText className="text-[10px] font-outfit font-bold text-on-surface-variant mb-2 tracking-widest uppercase">
          Category
        </PrimaryText>
        <CategoryContainer
          categories={categories}
          toggleCategorySelection={toggleCategorySelection}
          selectedCategories={selectedCategories}
        />
        <PrimaryButton
          onPress={handleAddCategory}
          buttonTitle="+ Add Category"
          variant="outline"
          size="sm"
          fullWidth={true}
        />
      </ScrollView>

      <View className="px-5 pb-4 pt-2">
        <PrimaryButton
          onPress={isAddButton ? handleAddExpense : handleUpdateExpense}
          buttonTitle={isAddButton ? 'Add Transaction' : 'Update Transaction'}
          disabled={!isValid || selectedCategories.length === 0}
        />
      </View>
    </PrimaryView>
  );
};

export default memo(ExpenseEntry);
