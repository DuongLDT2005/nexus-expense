import React from 'react';
import DebtorEntry from '../../components/molecules/DebtorEntry';
import { useAddDebtorScreen } from './useAddDebtorScreen';

export default function AddDebtorScreen() {
  return <DebtorEntry type="Add" {...useAddDebtorScreen()} />;
}
