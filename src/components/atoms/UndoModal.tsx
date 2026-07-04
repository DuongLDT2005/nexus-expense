import React, { useEffect, useRef, memo, useCallback } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

interface UndoModalProps {
  isVisible: boolean;
  type: string;
  onUndo: () => void;
  timeout?: number;
  onTimeout?: () => void;
}

const UndoModal: React.FC<UndoModalProps> = ({ isVisible, type, onUndo, timeout = 0, onTimeout }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isVisible && timeout > 0) {
      timeoutRef.current = setTimeout(() => { onTimeout?.(); }, timeout);
    }
    return () => { if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; } };
  }, [isVisible, timeout, onTimeout]);

  const handleUndo = useCallback(() => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    onUndo();
  }, [onUndo]);

  if (!isVisible) return null;

  return (
    <View className="h-16 w-[99.5%] rounded-xl flex-row items-center justify-between px-3 mb-1 bg-gray-100 dark:bg-gray-800">
      <Text className="text-xs text-gray-700 dark:text-gray-200">1 {type} is deleted</Text>
      <TouchableOpacity onPress={handleUndo} activeOpacity={0.7}>
        <View className="px-3 py-1 rounded-md bg-green-500 items-center justify-center">
          <Text className="text-xs font-semibold text-white">Undo</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(UndoModal);
