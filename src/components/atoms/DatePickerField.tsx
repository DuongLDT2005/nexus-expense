import React, { useCallback, useState, memo } from 'react';
import { Keyboard, Platform, TouchableOpacity, View } from 'react-native';
import Icon from './Icons';
import PrimaryText from './PrimaryText';
import { formatDate } from '../../utils/dateUtils';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import useColorScheme from '../../hooks/useColorScheme';

interface DatePickerFieldProps {
  createdAt: string;
  setCreatedAt: (value: string) => void;
  label?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DatePickerField: React.FC<DatePickerFieldProps> = memo(
  ({ createdAt, setCreatedAt, label, minDate, maxDate }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const isDark = useColorScheme() === 'dark';
    const iconColor = isDark ? '#c7c4d8' : '#777587';

    const handleDateChange = useCallback(
      (_event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
          const formattedDateValue = formatDate(selectedDate, 'YYYY-MM-DDTHH:mm:ss');
          setCreatedAt(formattedDateValue);
        }
      },
      [setCreatedAt],
    );

    const handleOpenDatePicker = useCallback(() => {
      Keyboard.dismiss();
      setShowDatePicker(true);
    }, []);

    return (
      <View className="mb-4">
        {label && (
          <PrimaryText className="text-[10px] font-outfit font-bold text-on-surface-variant mb-1.5 tracking-widest uppercase">
            {label}
          </PrimaryText>
        )}
        <TouchableOpacity
          onPress={handleOpenDatePicker}
          activeOpacity={0.7}
          className="h-12 rounded-2xl px-3.5 flex-row items-center bg-white dark:bg-surface-high border-[1px] border-outline-variant/40"
        >
          <Icon name="calendar" size={18} color={iconColor} />
          <PrimaryText size={14} className="flex-1 ml-2">{formatDate(createdAt, 'MMMM DD, YYYY')}</PrimaryText>
          <Icon name="chevron-down" size={18} color={iconColor} />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(createdAt)}
            mode="date"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={minDate}
            maximumDate={maxDate}
          />
        )}
      </View>
    );
  },
);

export default DatePickerField;
