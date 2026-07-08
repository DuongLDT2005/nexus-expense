import React from 'react';
import { useRoute } from '@react-navigation/native';
import ExpenseEntry from '../../components/molecules/ExpenseEntry';

export default function UpdateTransactionScreen() {
  const route = useRoute();
  return <ExpenseEntry type="Update" route={route} />;
}
