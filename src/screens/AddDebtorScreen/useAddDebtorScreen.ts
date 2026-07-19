import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { selectUser } from '../../redux/slices/authSlice';
import { useDebtDataSync } from '../../hooks/useDebtDataSync';
import { createDebtor } from '../../services/debtorService';
import { nameSchema } from '../../utils/validationSchema';
import { HomeStackParamList, DebtorPreset } from '../../types';
import { Alert } from 'react-native';

export const useAddDebtorScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const user = useSelector(selectUser);
  const { refreshAfterMutation } = useDebtDataSync();

  const [title, setTitle] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<DebtorPreset | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSelectPreset = useCallback((name: string, icon: string, color: string) => {
    setSelectedPreset({ name, icon, color });
  }, []);

  const isValid = nameSchema.safeParse(title).success && selectedPreset !== null;

  const handleSave = useCallback(async () => {
    if (!isValid || !user?.id || !selectedPreset) return;
    setIsSaving(true);
    try {
      await createDebtor(
        title.trim(),
        user.id,
        selectedPreset.icon,
        selectedPreset.name, // "Person", "Credit Card", etc.
        selectedPreset.color
      );
      await refreshAfterMutation();
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to add debtor');
    } finally {
      setIsSaving(false);
    }
  }, [isValid, user?.id, title, selectedPreset, refreshAfterMutation, navigation]);

  return {
    title,
    setTitle,
    selectedPreset,
    handleSelectPreset,
    isValid,
    isSaving,
    handleSave,
  };
};

export default useAddDebtorScreen;
