import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch } from '../redux/store';
import { selectUser } from '../redux/slices/authSlice';
import { createCategory, updateCategoryById, getCategoryById, getActiveCategoriesByUserId } from '../services/categoryService';
import { setCategories } from '../redux/slices/categorySlice';
import { Category } from '../types';
import { DEFAULT_CATEGORY_SUGGESTIONS, DefaultCategorySuggestion } from '../constants/categoryIcons';


export const useCategoryEntry = (type: 'Add' | 'Update', routeParams?: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  const isAddButton = type === 'Add';
  const categoryId: string | undefined = routeParams?.categoryId;

  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>('#3525cd');
  const [isLoadingExisting, setIsLoadingExisting] = useState(!isAddButton);
  
  // Modal states
  const [isIconPickerVisible, setIsIconPickerVisible] = useState(false);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  // When Update mode: fetch the existing category data by ID
  useEffect(() => {
    if (!isAddButton && categoryId) {
      getCategoryById(categoryId).then(cat => {
        if (cat) {
          setCategoryName(cat.name);
          setSelectedIcon(cat.icon ?? null);
          setSelectedColor(cat.color ?? '#3525cd');
        }
        setIsLoadingExisting(false);
      });
    }
  }, [isAddButton, categoryId]);

  const existingCategories = useSelector((state: any) => state.category?.items || []) as Category[];
  const existingCategoryNamesSet = useMemo(() => new Set(existingCategories.map(c => c.name)), [existingCategories]);

  // Filter out already existing categories from suggestions
  const filteredCategories = useMemo(
    () => DEFAULT_CATEGORY_SUGGESTIONS.filter(cat => !existingCategoryNamesSet.has(cat.name)),
    [existingCategoryNamesSet]
  );

  const [selectedCategories, setSelectedCategories] = useState<DefaultCategorySuggestion[]>([]);
  const selectedCategoryNames = useMemo(() => new Set(selectedCategories.map(c => c.name)), [selectedCategories]);

  const toggleCategorySelection = useCallback((category: DefaultCategorySuggestion) => {
    if (selectedCategoryNames.has(category.name)) {
      setSelectedCategories([]);
      setCategoryName('');
    } else {
      setSelectedCategories([category]);
      setCategoryName(category.name);
      setSelectedIcon(category.icon);
      setSelectedColor(category.color);
    }
  }, [selectedCategoryNames]);

  const isValid = categoryName.trim().length > 0 || selectedCategories.length > 0;

  const refreshCategories = useCallback(async () => {
    if (user?.id) {
      const data = await getActiveCategoriesByUserId(user.id);
      dispatch(setCategories(data));
    }
  }, [user?.id, dispatch]);

  const handleSave = useCallback(async () => {
    if (!user?.id) return;

    try {
      if (isAddButton) {
        if (selectedCategories.length > 0) {
          // Add multiple selected defaults
          for (const cat of selectedCategories) {
            await createCategory(cat.name, user.id, cat.icon, cat.color);
          }
        } else {
          // Add single custom category
          await createCategory(categoryName, user.id, selectedIcon, selectedColor);
        }
      } else {
        // Update existing
        if (categoryId) {
          await updateCategoryById(categoryId, categoryName, selectedIcon ?? undefined, selectedColor ?? undefined);
        }
      }

      await refreshCategories();
      navigation.goBack();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  }, [isAddButton, selectedCategories, categoryName, selectedIcon, selectedColor, user?.id, categoryId, navigation, refreshCategories]);

  const handleOpenIconPicker = useCallback(() => {
    setIsIconPickerVisible(true);
  }, []);

  const handleOpenColorPicker = useCallback(() => {
    setIsColorPickerVisible(true);
  }, []);

  return {
    isAddButton,
    isLoadingExisting,
    categoryName,
    setCategoryName,
    selectedIcon,
    setSelectedIcon,
    selectedColor,
    setSelectedColor,
    filteredCategories,
    selectedCategoryNames,
    toggleCategorySelection,
    handleSave,
    isValid,
    handleOpenIconPicker,
    handleOpenColorPicker,
    selectedCategories,
    isIconPickerVisible,
    setIsIconPickerVisible,
    isColorPickerVisible,
    setIsColorPickerVisible,
  };
};
