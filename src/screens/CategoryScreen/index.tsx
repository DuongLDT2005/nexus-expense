import React, { memo, useRef, useCallback } from 'react';
import { View, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import PrimaryView from '../../components/atoms/PrimaryView';
import HeaderContainer from '../../components/molecules/HeaderContainer';
import PrimaryText from '../../components/atoms/PrimaryText';
import Icon from '../../components/atoms/Icons';
import EmptyState from '../../components/atoms/EmptyState';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import type { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { SharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { useCategoryScreen } from './useCategoryScreen';
import { Category } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types';

const ACTION_WIDTH = 55;

const SwipeAction = memo(({
  progress,
  iconName,
  iconColor,
  backgroundColor,
  onPress,
}: {
  progress: SharedValue<number>;
  iconName: string;
  iconColor: string;
  backgroundColor: string;
  onPress: () => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6, 1], [0, 0.8, 1]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.6, 1]) }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="h-full items-center justify-center"
      style={{ width: ACTION_WIDTH }}>
      <Animated.View className="w-12 h-full items-center justify-center" style={[animatedStyle, { backgroundColor }]}>
        <Icon name={iconName} size={22} color={iconColor} />
      </Animated.View>
    </TouchableOpacity>
  );
});

const CategoryRow = memo(({
  category,
  onEdit,
  onDelete,
  openSwipeableRef,
  stats,
  currencySymbol
}: {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  openSwipeableRef: React.RefObject<{ close: () => void } | null>;
  stats: { count: number; totalAmount: number };
  currencySymbol: string;
}) => {
  const swipeableRef = useRef<SwipeableMethods | null>(null);

  const handleSwipeWillOpen = useCallback(() => {
    if (openSwipeableRef.current && openSwipeableRef.current !== swipeableRef.current) {
      openSwipeableRef.current.close();
    }
    openSwipeableRef.current = swipeableRef.current;
  }, [openSwipeableRef]);

  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <View className="mb-4">
      <ReanimatedSwipeable
        ref={swipeableRef}
        renderLeftActions={(progress, _translation, swipeableMethods) => (
          <SwipeAction
            progress={progress}
            iconName="pencil"
            iconColor="#3525cd" // primary
            backgroundColor="#e4e1ee" // surface-container-highest
            onPress={() => {
              onEdit(category);
              swipeableMethods.close();
            }}
          />
        )}
        renderRightActions={(progress, _translation, swipeableMethods) => (
          <SwipeAction
            progress={progress}
            iconName="trash-2"
            iconColor="#95002b" // tertiary
            backgroundColor="#ffb2b7" // tertiary-fixed-dim
            onPress={() => {
              onDelete(category.id);
              swipeableMethods.close();
            }}
          />
        )}
        onSwipeableWillOpen={handleSwipeWillOpen}
        friction={2}
        overshootLeft={false}
        overshootRight={false}
        overshootFriction={8}>
        
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CategoryTransactionScreen', {
            categoryId: category.id,
            categoryName: category.name,
            categoryColor: category.color,
            categoryIcon: category.icon,
            yearMonth: new Date().toISOString().slice(0, 7),
          })}
          className="bg-surface-container-low p-5 flex-row items-center justify-between rounded-lg shadow-sm"
        >
          <View className="flex-row items-center gap-4">
            <View 
              className="w-12 h-12 rounded-xl flex items-center justify-center" 
              style={{ backgroundColor: (category.color || '#3525cd') + '1A' }}
            >
              <Icon name={category.icon || 'shapes'} size={24} color={category.color || '#3525cd'} />
            </View>
            <View>
              <PrimaryText className="font-bold text-on-surface text-lg">{category.name}</PrimaryText>
              <PrimaryText className="text-sm text-on-surface-variant">{stats.count} Transactions</PrimaryText>
            </View>
          </View>
          <View className="items-end">
            <PrimaryText className="text-primary font-bold">{formatAmount(stats.totalAmount)}</PrimaryText>
            <PrimaryText className="text-[10px] uppercase tracking-widest text-outline">This Month</PrimaryText>
          </View>
        </TouchableOpacity>
      </ReanimatedSwipeable>
    </View>
  );
});

export default function CategoryScreen() {
  const { categories, refreshing, onRefresh, handleEdit, handleDelete, currencySymbol, getCategoryStats } = useCategoryScreen();
  const openSwipeableRef = useRef<{ close: () => void } | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const renderCategoryItem = useCallback(
    ({ item: category }: { item: Category }) => (
      <CategoryRow
        category={category}
        onEdit={handleEdit}
        onDelete={handleDelete}
        openSwipeableRef={openSwipeableRef}
        stats={getCategoryStats(category.id)}
        currencySymbol={currencySymbol}
      />
    ),
    [handleEdit, handleDelete, getCategoryStats, currencySymbol]
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View className="mt-[30%]">
        <EmptyState type={'Categories'} />
      </View>
    ),
    []
  );

  return (
    <PrimaryView useSidePadding={false} style={{ paddingTop: 0 }}>
      <HeaderContainer headerText="Categories" />
      
      <View className="flex-1 mt-6 px-6">
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item: Category) => String(item.id)}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>

      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          className="w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:scale-90"
          onPress={() => navigation.navigate('AddCategoryScreen')}
        >
          <Icon name="plus" size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </PrimaryView>
  );
}
