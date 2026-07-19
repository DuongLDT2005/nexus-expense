import React, { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from '../atoms/Icons';
import PrimaryText from '../atoms/PrimaryText';
import useColorScheme from '../../hooks/useColorScheme';
import type { Category } from '../../types';

interface CategoryContainerProps {
  categories: Category[];
  toggleCategorySelection: (category: Category) => void;
  selectedCategories: Category[];
}

const CategoryContainer: React.FC<CategoryContainerProps> = memo(
  ({ categories, toggleCategorySelection, selectedCategories }) => {
    const isDark = useColorScheme() === 'dark';

    return (
      <View className="flex-row flex-wrap">
        {categories.map((category) => {
          const isSelected = category?.name === selectedCategories[0]?.name;

          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => toggleCategorySelection(category)}
              activeOpacity={0.7}
              className="w-1/4 items-center mb-3"
            >
              <View
                className={`w-14 h-14 rounded-2xl items-center justify-center ${
                  isSelected
                    ? 'bg-primary dark:bg-primary-fixed-dim'
                    : 'bg-white dark:bg-surface-variant/20'
                }`}
                style={
                  !isSelected
                    ? {
                        borderWidth: 1,
                        borderColor: isDark ? 'rgba(199,196,216,0.2)' : 'rgba(0,0,0,0.08)',
                      }
                    : undefined
                }
              >
                {!!category.icon && (
                  <Icon
                    name={category.icon}
                    size={22}
                    color={
                      isSelected
                        ? isDark ? '#1d00a5' : '#ffffff'
                        : category.color || (isDark ? '#c7c4d8' : '#777587')
                    }
                  />
                )}
              </View>
              <PrimaryText
                size={11}
                weight={isSelected ? 'semibold' : 'regular'}
                className="mt-1.5 text-center"
                color={
                  isSelected
                    ? isDark ? '#c3c0ff' : '#4f46e5'
                    : undefined
                }
                numberOfLines={1}
              >
                {category.name}
              </PrimaryText>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  },
);

export default CategoryContainer;
