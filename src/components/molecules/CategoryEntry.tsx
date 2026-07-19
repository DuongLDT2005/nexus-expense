import React, { memo } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryView from "../atoms/PrimaryView";
import AppHeader from "../atoms/AppHeader";
import CustomInput from "../atoms/CustomInput";
import PrimaryText from "../atoms/PrimaryText";
import Icon from "../atoms/Icons";
import PrimaryButton from "../atoms/PrimaryButton";
import { useCategoryEntry } from "../../hooks/useCategoryEntry";
import { CATEGORY_ICONS, CATEGORY_COLORS } from "../../constants/categoryIcons";
import useColorScheme from "../../hooks/useColorScheme";

interface CategoryEntryProps {
  type: "Add" | "Update";
  route?: any;
}

const CategoryEntry: React.FC<CategoryEntryProps> = ({ type, route }) => {
  const navigation = useNavigation();
  const isDark = useColorScheme() === "dark";
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

  const headerTitle = isAddButton ? "Add Category" : "Update Category";

  const primaryColor = isDark ? "#c3c0ff" : "#4f46e5";
  const onSurfaceVariantColor = isDark ? "#c7c4d8" : "#464555";

  return (
    // Pattern 3: Modal Form Entry — dismissKeyboardOnTouch, AppHeader with back, ScrollView body, fixed footer
    <PrimaryView
      dismissKeyboardOnTouch
      useSidePadding={false}
      className="bg-surface-low"
      style={{ paddingTop: 0, paddingBottom: 0 }}
    >
      {/* AppHeader atom: pass onPress to show back arrow automatically */}
      <AppHeader onPress={navigation.goBack} text={headerTitle} />

      <ScrollView className="flex-1 mt-6 px-4 mb-24">
        {/* Category Name Section */}
        <View className="space-y-2 mb-6">
          <PrimaryText className="text-sm font-extrabold text-on-surface-variant tracking-widest ml-1 font-inter">
            Category Name
          </PrimaryText>
          <View className="mt-2">
            <CustomInput
              input={categoryName}
              setInput={setCategoryName}
              placeholder="e.g., Stationery"
            />
          </View>
        </View>

        {/* Appearance Selection Tiles */}
        <View className="space-y-2 mb-8">
          <PrimaryText className="text-sm font-extrabold text-on-surface-variant ml-1 tracking-widest font-inter">
            Appearance
          </PrimaryText>
          <View className="flex-row gap-4 mt-2">
            {/* Icon Picker Tile */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenIconPicker}
              className="flex-1 flex-col items-center justify-center p-6 bg-surface-lowest rounded-lg space-y-4 shadow-sm border border-surface-high"
            >
              <View
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{
                  backgroundColor: (selectedColor || primaryColor) + "1A",
                }}
              >
                <Icon
                  name={selectedIcon || "shapes"}
                  size={24}
                  color={selectedColor || primaryColor}
                />
              </View>
              <View className="items-center">
                <PrimaryText className="text-on-surface font-bold text-sm">
                  Icon
                </PrimaryText>
                <PrimaryText className="text-on-surface-variant text-[11px] mt-0.5">
                  Change glyph
                </PrimaryText>
              </View>
            </TouchableOpacity>

            {/* Color Picker Tile */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenColorPicker}
              className="flex-1 flex-col items-center justify-center p-6 bg-surface-lowest rounded-lg space-y-4 shadow-sm border border-surface-high"
            >
              <View className="w-14 h-14 p-1.5 bg-surface-container rounded-full flex items-center justify-center mb-4">
                <View
                  className="w-full h-full rounded-full shadow-inner"
                  style={{ backgroundColor: selectedColor || primaryColor }}
                />
              </View>
              <View className="items-center">
                <PrimaryText className="text-on-surface font-bold text-sm">
                  Color
                </PrimaryText>
                <PrimaryText className="text-on-surface-variant text-[11px] mt-0.5">
                  Brand Color
                </PrimaryText>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pick From Defaults */}
        {isAddButton && filteredCategories.length > 0 && (
          <View className="space-y-4 mb-10">
            <View className="flex-row items-center gap-2 mb-2 px-1">
              <PrimaryText className="text-sm font-extrabold text-on-surface-variant font-inter tracking-widest">
                Pick from defaults
              </PrimaryText>
              <View className="flex-1 h-[0.5px] bg-surface-high" />
              <View className="flex-row items-center gap-0.5 opacity-60">
                <PrimaryText className="text-[10px] text-on-surface-variant font-bold uppercase">
                  Swipe
                </PrimaryText>
                <Icon
                  name="chevron-right"
                  size={12}
                  color={onSurfaceVariantColor}
                />
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-4 px-4 mt-1.5"
              contentContainerStyle={{ paddingRight: 24 }}
            >
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategoryNames.has(cat.name);
                return (
                  <TouchableOpacity
                    key={cat.name}
                    activeOpacity={0.7}
                    onPress={() => toggleCategorySelection(cat)}
                    className={`flex-row items-center gap-1.5 py-3 px-3.5 mr-2 rounded-lg border ${
                      isSelected
                        ? "bg-primary border-transparent"
                        : "bg-surface-lowest border-surface-high"
                    }`}
                  >
                    <Icon
                      name={cat.icon || "shapes"}
                      size={16}
                      color={isSelected ? (isDark ? "#1d00a5" : "#ffffff") : onSurfaceVariantColor}
                    />
                    <PrimaryText
                      className={`text-[13px] ${isSelected ? (isDark ? "font-bold text-primary-on" : "font-bold text-white") : "font-semibold text-on-surface"}`}
                    >
                      {cat.name}
                    </PrimaryText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View className="absolute bottom-0 w-full p-6 bg-surface-lowest/90 border-t border-surface-high dark:border-outline-variant">
        <PrimaryButton
          onPress={handleSave}
          buttonTitle={isAddButton ? "Add Category" : "Update Category"}
          disabled={!isValid && selectedCategories.length === 0}
          size="lg"
        />
      </View>

      {/* Icon Picker Modal */}
      <Modal visible={isIconPickerVisible} transparent animationType="fade" statusBarTranslucent>
        <Pressable
          className="flex-1 bg-black/60 justify-center items-center p-6"
          onPress={() => setIsIconPickerVisible(false)}
        >
          <Pressable
            className="bg-surface-lowest w-full max-w-[90%] max-h-[75%] rounded-2xl p-6 shadow-2xl border border-surface-high"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-between items-center mb-5">
              <PrimaryText className="text-lg font-extrabold text-on-surface font-inter">
                Select Icon
              </PrimaryText>
              <TouchableOpacity
                onPress={() => setIsIconPickerVisible(false)}
                className="w-8 h-8 rounded-full bg-surface-container items-center justify-center"
              >
                <Icon name="x" size={16} color={onSurfaceVariantColor} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CATEGORY_ICONS}
              numColumns={4}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedIcon(item);
                    setIsIconPickerVisible(false);
                  }}
                  className={`aspect-square items-center justify-center m-1.5 rounded-xl border flex-1 ${
                    selectedIcon === item
                      ? "bg-primary/10 border-primary"
                      : "bg-surface-container border-transparent"
                  }`}
                  style={{ minHeight: 56 }}
                >
                  <Icon
                    name={item}
                    size={22}
                    color={
                      selectedIcon === item
                        ? primaryColor
                        : onSurfaceVariantColor
                    }
                  />
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {/* Color Picker Modal */}
      <Modal visible={isColorPickerVisible} transparent animationType="fade" statusBarTranslucent>
        <Pressable
          className="flex-1 bg-black/60 justify-center items-center p-6"
          onPress={() => setIsColorPickerVisible(false)}
        >
          <Pressable
            className="bg-surface-lowest w-full max-w-[90%] max-h-[75%] rounded-2xl p-6 shadow-2xl border border-surface-high"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-between items-center mb-5">
              <PrimaryText className="text-lg font-extrabold text-on-surface font-inter">
                Select Color
              </PrimaryText>
              <TouchableOpacity
                onPress={() => setIsColorPickerVisible(false)}
                className="w-8 h-8 rounded-full bg-surface-container items-center justify-center"
              >
                <Icon name="x" size={16} color={onSurfaceVariantColor} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={CATEGORY_COLORS}
              numColumns={5}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedColor(item);
                    setIsColorPickerVisible(false);
                  }}
                  className={`aspect-square m-1.5 rounded-full items-center justify-center border-2 ${
                    selectedColor === item
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  style={{ minHeight: 48, minWidth: 48 }}
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center shadow-inner"
                    style={{ backgroundColor: item }}
                  >
                    {selectedColor === item && (
                      <Icon name="check" size={16} color="#ffffff" />
                    )}
                  </View>
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
