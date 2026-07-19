import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { User, Currency } from '../../types';
import { selectUser, updateUser } from '../../redux/slices/authSlice';
import { setCurrency } from '../../redux/slices/settingsSlice';
import { getAllCurrencies, CurrencyData } from '../../services/currencyService';
import { updateUserById } from '../../services/userService';
import type { AppDispatch } from '../../redux/store';

type ChooseCurrencyRouteProp = RouteProp<
  { ChooseCurrencyScreen: { isFromSettings?: boolean } | undefined },
  "ChooseCurrencyScreen"
>;

export const useChooseCurrencyScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const route = useRoute<ChooseCurrencyRouteProp>();
  const isFromSettings = route.params?.isFromSettings ?? false;

  const user = useSelector(selectUser);

  const [search, setSearch] = useState('');
  const [currencies, setCurrencies] = useState<CurrencyData[]>([]);
  const [filteredCurrencies, setFilteredCurrencies] = useState<CurrencyData[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch currencies on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setIsLoading(true);
      const data = await getAllCurrencies();
      setCurrencies(data);
      setFilteredCurrencies(data);
      
      // Auto select user's current currency if exists
      if (user?.currencyId) {
        const found = data.find(c => c.id === user.currencyId);
        if (found) {
          setSelectedCurrency(found);
        }
      }
      setIsLoading(false);
    };
    fetchCurrencies();
  }, [user]);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
    const searchItem = text.toLowerCase().trim();
    if (!searchItem) {
      setFilteredCurrencies(currencies);
      return;
    }
    const filtered = currencies.filter(c => {
      return (
        c.code.toLowerCase().includes(searchItem) ||
        c.name.toLowerCase().includes(searchItem) ||
        c.symbol.toLowerCase().includes(searchItem)
      );
    });
    setFilteredCurrencies(filtered);
  }, [currencies]);

  const handleCurrencySelect = useCallback((currency: CurrencyData) => {
    setSelectedCurrency((prev) => (prev?.id === currency.id ? null : currency));
  }, []);

  const handleCurrencySubmit = useCallback(async () => {
    if (!selectedCurrency || !user) return;

    try {
      // 1. Update user currencyId in DB
      await updateUserById(user.id, { currencyId: selectedCurrency.id });
      
      // 2. Update Redux Auth State
      dispatch(updateUser({ currencyId: selectedCurrency.id }));
      
      // 3. Update Redux Settings state
      const mappedCurrency: Currency = {
        id: selectedCurrency.id,
        code: selectedCurrency.code,
        name: selectedCurrency.name,
        symbol: selectedCurrency.symbol,
      };
      dispatch(setCurrency(mappedCurrency));

      // 4. Navigate
      if (navigation) {
        if (isFromSettings) {
          navigation.goBack();
        } else {
          // If we can go back to HomeScreen, do so. Otherwise navigate to TabNavigator.
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('HomeStack');
          }
        }
      }
    } catch (err) {
      console.error('Failed to select currency:', err);
    }
  }, [selectedCurrency, user, dispatch, isFromSettings, navigation]);

  return {
    search,
    filteredCurrencies,
    selectedCurrency,
    isLoading,
    isFromSettings,
    handleSearch,
    handleCurrencySelect,
    handleCurrencySubmit,
  };
};
