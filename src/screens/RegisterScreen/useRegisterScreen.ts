import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList, User } from '../../types';
import { loginSuccess, setLoading, setError } from '../../redux/slices/authSlice';
import { request } from '../../services/apiHelper';
import type { AppDispatch } from '../../redux/store';

import { nameSchema } from '../../utils/validationSchema';

export const useRegisterScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = useCallback(async () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    const nameVal = nameSchema.safeParse(fullName.trim());
    if (!nameVal.success) {
      setErrorMessage(nameVal.error.issues[0].message);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    dispatch(setLoading(true));

    try {
      // Check if email already exists
      const existing = await request<User[]>(`/users?email=${encodeURIComponent(email.trim())}`);
      if (existing.length > 0) {
        setErrorMessage('An account with this email already exists.');
        dispatch(setError('Email already exists.'));
        return;
      }

      // Generate sequential numeric ID
      const allUsers = await request<User[]>('/users');
      let nextId = 1;
      if (allUsers && allUsers.length > 0) {
        const numericIds = allUsers
          .map((u) => parseInt(u.id, 10))
          .filter((idNum) => !isNaN(idNum));
        if (numericIds.length > 0) {
          nextId = Math.max(...numericIds) + 1;
        }
      }
      const id = String(nextId);

      const newUser: User = {
        id,
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        currencyId: '',
        theme: 'system',
      };

      await request<User>('/users', {
        method: 'POST',
        body: JSON.stringify(newUser),
      });

      dispatch(loginSuccess(newUser));
    } catch {
      setErrorMessage('Registration failed. Please try again.');
      dispatch(setError('Registration failed.'));
    } finally {
      setIsLoading(false);
    }
  }, [fullName, email, password, confirmPassword, dispatch]);

  const handleGoToLogin = useCallback(() => {
    navigation.navigate('LoginScreen');
  }, [navigation]);

  return {
    fullName,
    setfullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    errorMessage,
    handleRegister,
    handleGoToLogin,
  };
};
