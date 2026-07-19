import React from 'react';
import DebtorEntry from '../../components/molecules/DebtorEntry';
import { useUpdateDebtorScreen } from './useUpdateDebtorScreen';

export default function UpdateDebtorScreen() {
  return <DebtorEntry type="Update" {...useUpdateDebtorScreen()} />;
}
