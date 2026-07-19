import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDebtDataSync } from '../../hooks/useDebtDataSync';
import { getDebtorByDebtorId, updateDebtorById } from '../../services/debtorService';
import { nameSchema } from '../../utils/validationSchema';
import { HomeStackParamList, DebtorPreset } from '../../types';
import debtPresets from '../../../assets/jsons/defaultDebtAccounts.json';
import { Alert } from 'react-native';

type UpdateDebtorScreenRouteProp = RouteProp<HomeStackParamList, 'UpdateDebtorScreen'>;

export const useUpdateDebtorScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const route = useRoute<UpdateDebtorScreenRouteProp>();
  const { debtorId } = route.params ?? {};
  const { refreshAfterMutation } = useDebtDataSync();

  const [title, setTitle] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<DebtorPreset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    if (!debtorId) {
      Alert.alert('Error', 'Debtor ID is missing');
      navigation.goBack();
      return;
    }

    getDebtorByDebtorId(debtorId)
      .then(debtor => {
        if (!active) return;
        if (!debtor) {
          Alert.alert('Error', 'Debtor not found');
          navigation.goBack();
          return;
        }
        setTitle(debtor.title);
        // Find matching preset from defaultDebtAccounts.json
        const matchedPreset = debtPresets.find(p => p.name === debtor.type);
        if (matchedPreset) {
          setSelectedPreset({
            name: matchedPreset.name,
            icon: matchedPreset.icon,
            color: matchedPreset.color,
          });
        }
        setIsLoading(false);
      })
      .catch(err => {
        if (!active) return;
        Alert.alert('Error', 'Failed to fetch debtor details');
        navigation.goBack();
      });

    return () => {
      active = false;
    };
  }, [debtorId, navigation]);

  const handleSelectPreset = useCallback((name: string, icon: string, color: string) => {
    setSelectedPreset({ name, icon, color });
  }, []);

  const isValid = nameSchema.safeParse(title).success && selectedPreset !== null;

  const handleSave = useCallback(async () => {
    if (!isValid || !debtorId || !selectedPreset) return;
    setIsSaving(true);
    try {
      await updateDebtorById(
        debtorId,
        title.trim(),
        selectedPreset.name,
        selectedPreset.icon,
        selectedPreset.color
      );
      await refreshAfterMutation();
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update debtor');
    } finally {
      setIsSaving(false);
    }
  }, [isValid, debtorId, title, selectedPreset, refreshAfterMutation, navigation]);

  return {
    title,
    setTitle,
    selectedPreset,
    handleSelectPreset,
    isValid,
    isLoading,
    isSaving,
    handleSave,
  };
};

export default useUpdateDebtorScreen;
