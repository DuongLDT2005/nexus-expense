import React, { memo, useCallback, useState } from 'react';
import { Modal, TouchableOpacity, View, Pressable, ScrollView } from 'react-native';
import PrimaryText from '../atoms/PrimaryText';
import Icon from '../atoms/Icons';
import useColorScheme from '../../hooks/useColorScheme';
import { getMonthNamesShort } from '../../utils/dateUtils';

const MONTHS_SHORT = getMonthNamesShort();

interface MonthYearPickerProps {
  visible: boolean;
  selectedMonth: number;
  selectedYear: number;
  availableYears: number[];
  onSelect: (monthIndex: number, year: number) => void;
  onClose: () => void;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = memo(
  ({ visible, selectedMonth, selectedYear, availableYears, onSelect, onClose }) => {
    const isDark = useColorScheme() === 'dark';
    const [tempMonth, setTempMonth] = useState(selectedMonth);
    const [tempYear, setTempYear] = useState(selectedYear);

    const handleConfirm = useCallback(() => {
      onSelect(tempMonth, tempYear);
      onClose();
    }, [tempMonth, tempYear, onSelect, onClose]);

    const handleYearChange = useCallback(
      (direction: 'prev' | 'next') => {
        const currentIndex = availableYears.indexOf(tempYear);
        if (direction === 'prev' && currentIndex < availableYears.length - 1) {
          setTempYear(availableYears[currentIndex + 1]);
        } else if (direction === 'next' && currentIndex > 0) {
          setTempYear(availableYears[currentIndex - 1]);
        }
      },
      [availableYears, tempYear],
    );

    const canGoPrev = availableYears.indexOf(tempYear) < availableYears.length - 1;
    const canGoNext = availableYears.indexOf(tempYear) > 0;

    const chevronColor = isDark ? '#c7c4d8' : '#464555';
    const disabledColor = isDark ? '#49454f' : '#d6d5dd';

    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={onClose}
        >
          <Pressable
            className="bg-white dark:bg-inverse-surface rounded-t-3xl px-5 pt-5 pb-8"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Year Selector */}
            <View className="flex-row items-center justify-between mb-5">
              <TouchableOpacity
                onPress={() => handleYearChange('prev')}
                disabled={!canGoPrev}
                activeOpacity={0.7}
                className="p-2"
              >
                <Icon
                  name="chevron-left"
                  size={20}
                  color={canGoPrev ? chevronColor : disabledColor}
                />
              </TouchableOpacity>
              <PrimaryText size={18} weight="bold" className="text-on-surface">
                {tempYear}
              </PrimaryText>
              <TouchableOpacity
                onPress={() => handleYearChange('next')}
                disabled={!canGoNext}
                activeOpacity={0.7}
                className="p-2"
              >
                <Icon
                  name="chevron-right"
                  size={20}
                  color={canGoNext ? chevronColor : disabledColor}
                />
              </TouchableOpacity>
            </View>

            {/* Month Grid */}
            <View className="flex-row flex-wrap justify-between gap-y-2.5">
              {MONTHS_SHORT.map((month, index) => {
                const isSelected = index === tempMonth && tempYear === tempYear;
                return (
                  <TouchableOpacity
                    key={month}
                    onPress={() => setTempMonth(index)}
                    activeOpacity={0.7}
                    className="w-[23%]"
                  >
                    <View
                      className={`py-3 rounded-xl items-center ${
                        index === tempMonth
                          ? 'bg-primary dark:bg-primary-fixed-dim'
                          : 'bg-surface-high dark:bg-surface-variant/20'
                      }`}
                    >
                      <PrimaryText
                        size={13}
                        weight={index === tempMonth ? 'bold' : 'medium'}
                        color={
                          index === tempMonth
                            ? isDark ? '#1d00a5' : '#ffffff'
                            : undefined
                        }
                      >
                        {month}
                      </PrimaryText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              onPress={handleConfirm}
              activeOpacity={0.8}
              className="mt-5 h-12 rounded-2xl bg-primary dark:bg-primary-fixed-dim items-center justify-center"
            >
              <PrimaryText
                size={14}
                weight="bold"
                color={isDark ? '#1d00a5' : '#ffffff'}
              >
                Confirm
              </PrimaryText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    );
  },
);

export default MonthYearPicker;
