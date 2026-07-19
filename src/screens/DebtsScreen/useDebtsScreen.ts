import { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { selectDebtors, selectDebts } from '../../redux/slices/debtSlice';
import { selectCurrency } from '../../redux/slices/settingsSlice';
import { useDebtDataSync } from '../../hooks/useDebtDataSync';
import { computeSummaryTotals } from '../../utils/debtUtils';
import { DEBTOR_TAB } from '../../constants/debtTypes';
import useColorScheme from '../../hooks/useColorScheme';

export const useDebtsScreen = () => {
  const { isLoading, error, fetchDebtData } = useDebtDataSync();
  const debtors = useSelector(selectDebtors);
  const allDebts = useSelector(selectDebts);
  const currency = useSelector(selectCurrency);
  const isDark = useColorScheme() === 'dark';
  const [debtorTypeTab, setDebtorTypeTab] = useState<'Person' | 'Other'>(DEBTOR_TAB.PERSON);

  const currencySymbol = currency?.symbol ?? '$';
  const currencyCode = currency?.code;
  const fabIconColor = isDark ? '#c3c0ff' : '#ffffff';

  useFocusEffect(
    useCallback(() => {
      fetchDebtData();
    }, [fetchDebtData])
  );

  const activeDebtors = useMemo(
    () => debtors.filter(d => d.debtorStatus),
    [debtors]
  );

  const { personDebtors, otherAccountsDebtors } = useMemo(() => ({
    personDebtors: activeDebtors.filter(d => d.type === DEBTOR_TAB.PERSON),
    otherAccountsDebtors: activeDebtors.filter(d => d.type !== DEBTOR_TAB.PERSON),
  }), [activeDebtors]);

  const { totalYouOweOthers, totalOthersOweYou } = useMemo(
    () => computeSummaryTotals(activeDebtors, allDebts),
    [activeDebtors, allDebts]
  );

  const handleSetTab = useCallback((tab: 'Person' | 'Other') => {
    setDebtorTypeTab(tab);
  }, []);

  const isTabPerson = debtorTypeTab === DEBTOR_TAB.PERSON;
  const activeTabDebtors = isTabPerson ? personDebtors : otherAccountsDebtors;

  return {
    debtors: activeDebtors,
    allDebts,
    personDebtors,
    otherAccountsDebtors,
    activeTabDebtors,
    totalYouOweOthers,
    totalOthersOweYou,
    debtorTypeTab,
    isTabPerson,
    handleSetTab,
    isLoading,
    error,
    refetch: fetchDebtData,
    currencySymbol,
    currencyCode,
    fabIconColor,
  };
};

export default useDebtsScreen;
