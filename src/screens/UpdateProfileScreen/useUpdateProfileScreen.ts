import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { selectUser, updateUser } from '../../redux/slices/authSlice';
import { updateUserById } from '../../services/userService';
import { nameSchema } from '../../utils/validationSchema';
import { request } from '../../services/apiHelper';
import type { User } from '../../types';
import type { AppDispatch } from '../../redux/store';

export const useUpdateProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  // Profile Edit fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Prepopulate values on mount
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Password Modal states
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Profile Saving
  const handleSaveProfile = useCallback(async () => {
    if (!user) return;

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    // 1. Validations
    const nameVal = nameSchema.safeParse(trimmedName);
    if (!nameVal.success) {
      setProfileError(nameVal.error.issues[0].message);
      return;
    }

    if (!trimmedEmail) {
      setProfileError('Email is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setProfileError('Invalid email format.');
      return;
    }

    setIsSaving(true);
    setProfileError(null);

    try {
      // 2. Check duplicate email
      if (trimmedEmail !== user.email) {
        const existing = await request<User[]>(`/users?email=${encodeURIComponent(trimmedEmail)}`);
        const duplicate = existing.find(u => u.id !== user.id);
        if (duplicate) {
          setProfileError('An account with this email already exists.');
          setIsSaving(false);
          return;
        }
      }

      // 3. Save to database
      await updateUserById(user.id, {
        fullName: trimmedName,
        email: trimmedEmail,
      });

      // 4. Dispatch update to Redux
      dispatch(updateUser({
        fullName: trimmedName,
        email: trimmedEmail,
      }));

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err: any) {
      setProfileError(err?.message || 'Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  }, [fullName, email, user, dispatch, navigation]);

  // Password Saving
  const handleSavePassword = useCallback(async () => {
    if (!user) return;

    if (!currentPassword) {
      setPasswordError('Current password is required.');
      return;
    }

    if (currentPassword !== user.password) {
      setPasswordError('Incorrect current password.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from current password.');
      return;
    }

    setIsSavingPassword(true);
    setPasswordError(null);

    try {
      await updateUserById(user.id, { password: newPassword });
      dispatch(updateUser({ password: newPassword }));

      Alert.alert('Success', 'Password updated successfully!');
      setIsPasswordModalVisible(false);
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password.');
    } finally {
      setIsSavingPassword(false);
    }
  }, [currentPassword, newPassword, confirmPassword, user, dispatch]);

  const openPasswordModal = useCallback(() => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
    setIsPasswordModalVisible(true);
  }, []);

  const closePasswordModal = useCallback(() => {
    setIsPasswordModalVisible(false);
    setPasswordError(null);
  }, []);

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    profileError,
    isSaving,
    handleSaveProfile,
    isPasswordModalVisible,
    setIsPasswordModalVisible,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordError,
    isCurrentPasswordVisible,
    setIsCurrentPasswordVisible,
    isNewPasswordVisible,
    setIsNewPasswordVisible,
    isConfirmPasswordVisible,
    setIsConfirmPasswordVisible,
    isSavingPassword,
    handleSavePassword,
    openPasswordModal,
    closePasswordModal,
  };
};
