import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import {
  setLoading,
  setDebtors,
  setDebts,
  setError,
  selectDebtLoading,
} from '../redux/slices/debtSlice';
import { getActiveDebtorsByUserId, getAllDebtsByUserId } from '../services';
import type { DebtState } from '../types';

export const useDebtDataSync = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectDebtLoading);
  const error = useSelector((state: { debt: DebtState }) => state.debt.error);

  const fetchDebtData = useCallback(async () => {
    if (!user?.id) return;
    dispatch(setLoading(true));
    try {
      const [debtors, debts] = await Promise.all([
        getActiveDebtorsByUserId(user.id),
        getAllDebtsByUserId(user.id),
      ]);
      dispatch(setDebtors(debtors));
      dispatch(setDebts(debts));
    } catch (e) {
      dispatch(setError(e instanceof Error ? e.message : 'Failed to fetch debt data'));
    }
  }, [user?.id, dispatch]);

  const refreshAfterMutation = useCallback(async () => {
    if (!user?.id) return;
    dispatch(setLoading(true));
    try {
      const [debtors, debts] = await Promise.all([
        getActiveDebtorsByUserId(user.id),
        getAllDebtsByUserId(user.id),
      ]);
      dispatch(setDebtors(debtors));
      dispatch(setDebts(debts));
    } catch (e) {
      dispatch(setError(e instanceof Error ? e.message : 'Failed to refresh debt data'));
      throw e;
    }
  }, [user?.id, dispatch]);

  return {
    isLoading,
    error,
    fetchDebtData,
    refreshAfterMutation,
  };
};

export default useDebtDataSync;
