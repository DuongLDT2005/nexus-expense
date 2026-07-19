import React from 'react';
import { useRoute } from '@react-navigation/native';
import CategoryEntry from '../../components/molecules/CategoryEntry';

export default function UpdateCategoryScreen() {
  const route = useRoute();
  return <CategoryEntry type="Update" route={route} />;
}
