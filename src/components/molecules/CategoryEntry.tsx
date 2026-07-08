import React, { memo } from 'react';
import { View, TouchableOpacity, ScrollView, Modal, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PrimaryView from '../atoms/PrimaryView';
import AppHeader from '../atoms/AppHeader';
import CustomInput from '../atoms/CustomInput';
import PrimaryText from '../atoms/PrimaryText';
import Icon from '../atoms/Icons';
import PrimaryButton from '../atoms/PrimaryButton';
import { useCategoryEntry } from '../../hooks/useCategoryEntry';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../constants/categoryIcons';

interface CategoryEntryProps {
  type: 'Add' | 'Update';
  route?: any;
}

const CategoryEntry: React.FC<CategoryEntryProps> = ({ type, route }) => {
  const navigation = useNavigation();
  const {
    isAddButton,
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
  } = useCategoryEntry(type, route?.params);

  const headerTitle = isAddButton ? 'Add Category' : 'Update Category';

  return (
    // Pattern 3: Modal Form Entry — dismissKeyboardOnTouch, AppHeader with back, ScrollView body, fixed footer
    <PrimaryView dismissKeyboardOnTouch useSidePadding={false} style={{ paddingTop: 0 }}>
      {/* AppHeader atom: pass onPress to show back arrow automatically */}
      <AppHeader
        onPress={navigation.goBack}
        text={headerTitle}
      />

      <ScrollView className="flex-1 mt-6 px-4 mb-24">
        {/* Category Name Section */}
        <View className="space-y-2 mb-6">
          <PrimaryText className="text-xs font-extrabold text-primary uppercase tracking-widest ml-1">
            Category Name
          </PrimaryText>
          <View className="mt-2">
            <CustomInput
              input={categoryName}
              setInput={setCategoryName}
              placeholder="e.g., Stationery"
              // The original HTML didn't use the built-in label from CustomInput to match the styling exactly,
              // but we can pass it if we want. We'll rely on the CustomInput UI inside atom.
            />
          </View>
        </View>

        {/* Appearance Selection Tiles */}
        <View className="space-y-4 mb-8">
          <PrimaryText className="text-xs font-extrabold text-on-surface-variant ml-1 uppercase tracking-widest">
            Appearance
          </PrimaryText>
          <View className="flex-row gap-4">
            {/* Icon Picker Tile */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleOpenIconPicker}
              className="flex-1 flex-col items-center justify-center p-6 bg-white rounded-xl space-y-4 shadow-sm border border-surface-container-high"
            >
              <View className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Icon name={selectedIcon || 'shapes'} size={24} color="#3525cd" />
              </View>
              <View className="items-center">
                <PrimaryText className="text-on-surface font-bold text-sm">Icon</PrimaryText>
                <PrimaryText className="text-on-surface-variant text-[11px] mt-0.5">Change glyph</PrimaryText>
              </View>
            </TouchableOpacity>

            {/* Color Picker Tile */}
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleOpenColorPicker}
              className="flex-1 flex-col items-center justify-center p-6 bg-white rounded-xl space-y-4 shadow-sm border border-surface-container-high"
            >
              <View className="w-14 h-14 p-1.5 bg-surface-container rounded-full flex items-center justify-center mb-4">
                <View className="w-full h-full rounded-full shadow-inner" style={{ backgroundColor: selectedColor || '#3525cd' }} />
              </View>
              <View className="items-center">
                <PrimaryText className="text-on-surface font-bold text-sm">Color</PrimaryText>
                <PrimaryText className="text-on-surface-variant text-[11px] mt-0.5">Brand Color</PrimaryText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pick From Defaults */}
        {isAddButton && filteredCategories.length > 0 && (
          <View className="space-y-4 mb-10">
            <View className="flex-row justify-between items-end px-1 mb-4">
              <PrimaryText className="text-xs font-extrabold text-on-surface-variant uppercase tracking-widest">
                Pick from defaults
              </PrimaryText>
              <TouchableOpacity>
                <PrimaryText className="text-primary text-xs font-bold underline">See all</PrimaryText>
              </TouchableOpacity>
            </View>
            
            <View className="flex-row flex-wrap gap-3">
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategoryNames.has(cat.name);
                return (
                  <TouchableOpacity
                    key={cat.name}
                    activeOpacity={0.9}
                    onPress={() => toggleCategorySelection(cat)}
                    className={`flex-row items-center gap-2.5 px-5 py-3 rounded-full transition-all shadow-sm ${
                      isSelected 
                        ? 'bg-primary shadow-md' 
                        : 'bg-white border border-surface-container-high'
                    }`}
                  >
                    <Icon 
                      name={cat.icon || 'shapes'} 
                      size={20} 
                      color={isSelected ? '#ffffff' : '#464555'} 
                    />
                    <PrimaryText className={`text-sm ${isSelected ? 'font-bold text-white' : 'font-semibold text-on-surface'}`}>
                      {cat.name}
                    </PrimaryText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View className="absolute bottom-0 w-full p-6 bg-white/90 border-t border-surface-container-high">
        <PrimaryButton
          onPress={handleSave}
          buttonTitle={isAddButton ? "Add Category" : "Update Category"}
          disabled={!isValid && selectedCategories.length === 0}
          size="lg"
        />
      </View>

      {/* Icon Picker Modal */}
      <Modal visible={isIconPickerVisible} transparent animationType="fade">
        <Pressable 
          className="flex-1 bg-black/50 justify-center items-center p-6"
          onPress={() => setIsIconPickerVisible(false)}
        >
          <Pressable className="bg-white w-full rounded-2xl p-6" onPress={e => e.stopPropagation()}>
            <PrimaryText className="text-lg font-bold mb-4 text-on-surface">Select Icon</PrimaryText>
            <FlatList
              data={CATEGORY_ICONS}
              numColumns={4}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedIcon(item);
                    setIsIconPickerVisible(false);
                  }}
                  className={`flex-1 aspect-square items-center justify-center m-1 rounded-xl ${selectedIcon === item ? 'bg-primary/20' : 'bg-surface-container'}`}
                >
                  <Icon name={item} size={24} color={selectedIcon === item ? '#3525cd' : '#464555'} />
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Color Picker Modal */}
      <Modal visible={isColorPickerVisible} transparent animationType="fade">
        <Pressable 
          className="flex-1 bg-black/50 justify-center items-center p-6"
          onPress={() => setIsColorPickerVisible(false)}
        >
          <Pressable className="bg-white w-full rounded-2xl p-6" onPress={e => e.stopPropagation()}>
            <PrimaryText className="text-lg font-bold mb-4 text-on-surface">Select Color</PrimaryText>
            <FlatList
              data={CATEGORY_COLORS}
              numColumns={5}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedColor(item);
                    setIsColorPickerVisible(false);
                  }}
                  className={`flex-1 aspect-square m-1 rounded-full items-center justify-center ${selectedColor === item ? 'border-2 border-primary' : ''}`}
                >
                  <View className="w-8 h-8 rounded-full" style={{ backgroundColor: item }} />
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </PrimaryView>
  );
};

export default memo(CategoryEntry);
