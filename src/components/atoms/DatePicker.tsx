import React, { useState, useCallback, memo } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import Icon from './Icons';
import PrimaryText from './PrimaryText';
import { formatDate } from '../../utils/dateUtils';
import useColorScheme from '../../hooks/useColorScheme';

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = memo(({
  value,
  onChange,
  label,
  minDate,
  maxDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#c7c4d8' : '#757780';

  const dateValue = value ? new Date(value) : new Date();

  const handleDateChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      const formatted = formatDate(selectedDate, 'YYYY-MM-DDTHH:mm:ss');
      onChange(formatted);
    }
  }, [onChange]);

  const togglePicker = useCallback(() => {
    setShowPicker(prev => !prev);
  }, []);

  return (
    <View className="mb-4">
      {label && (
        <PrimaryText className="text-xs font-medium text-on-surface-variant mb-1">
          {label}
        </PrimaryText>
      )}

      <TouchableOpacity
        onPress={togglePicker}
        activeOpacity={0.7}
        className="h-12 flex-row items-center rounded-2xl px-3 border-[1.5px] border-transparent bg-surface-high"
      >
        <View className="mr-2">
          <Icon name="calendar" size={18} color={iconColor} />
        </View>
        <PrimaryText className="text-sm font-medium text-on-surface">
          {formatDate(dateValue, 'Do MMM YYYY')}
        </PrimaryText>
      </TouchableOpacity>

      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal
          visible={showPicker}
          transparent
          animationType="fade"
          onRequestClose={togglePicker}
        >
          <TouchableOpacity
            className="flex-1 bg-black/40 justify-end"
            activeOpacity={1}
            onPress={togglePicker}
          >
            <TouchableOpacity
              activeOpacity={1}
              className="bg-surface-container-lowest dark:bg-surface-dim rounded-t-3xl border-t border-outline-variant/30 px-6 pt-4 pb-8"
            >
              <View className="flex-row justify-between items-center mb-4">
                <PrimaryText className="text-base font-bold text-on-surface">
                  {label || 'Select Date'}
                </PrimaryText>
                <TouchableOpacity onPress={togglePicker}>
                  <PrimaryText className="text-sm font-bold text-primary">
                    Done
                  </PrimaryText>
                </TouchableOpacity>
              </View>

              <View className="items-center justify-center bg-transparent">
                <DateTimePicker
                  value={dateValue}
                  mode="date"
                  display="inline"
                  onChange={handleDateChange}
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  themeVariant={isDark ? 'dark' : 'light'}
                />
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
});

export default DatePicker;
