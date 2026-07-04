import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';
import { loginSuccess, setLoading, setError } from '../../redux/slices/authSlice';
import { getAllUsers } from '../../services/userService';
import { request } from '../../services/apiHelper';
import type { User } from '../../types';
import type { AppDispatch } from '../../redux/store';

export const useLoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    dispatch(setLoading(true));

    try {
      // Find user by email in the JSON server
      const users = await request<User[]>(`/users?email=${encodeURIComponent(email.trim())}`);
      const matched = users.find(
        (u) => u.email === email.trim() && u.password === password,
      );

      if (!matched) {
        setErrorMessage('Invalid email or password.');
        dispatch(setError('Invalid email or password.'));
        return;
      }

      dispatch(loginSuccess(matched));
    } catch {
      setErrorMessage('Login failed. Please try again.');
      dispatch(setError('Login failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }, [email, password, dispatch]);

  const handleGoToRegister = useCallback(() => {
    navigation.navigate('RegisterScreen');
  }, [navigation]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleLogin,
    handleGoToRegister,
  };
};
