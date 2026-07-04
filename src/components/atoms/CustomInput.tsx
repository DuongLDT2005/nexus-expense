import React, { useState, useCallback, memo } from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  KeyboardTypeOptions,
  Text,
} from "react-native";
import Icon from "./Icons";
import { ZodType } from "zod";
import useColorScheme from "../../hooks/useColorScheme";

interface CustomInputProps {
  input: string;
  setInput: (value: string) => void;
  placeholder: string;
  label?: string;
  schema?: ZodType<string>;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  multiline?: boolean;
  maxLength?: number;
  onBlur?: () => void;
  onFocus?: () => void;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  disabled?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = memo(
  ({
    input,
    setInput,
    placeholder,
    label,
    schema,
    keyboardType,
    autoCapitalize,
    autoFocus = false,
    secureTextEntry = false,
    multiline = false,
    maxLength,
    onBlur,
    onFocus,
    leftIcon,
    rightIcon,
    onRightIconPress,
    disabled = false,
  }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const colorScheme = useColorScheme();

    const isDark = colorScheme === "dark";
    const labelColor = isDark ? "#c7c4d8" : "#757780";
    const placeholderColor = isDark ? "#918fa1" : "#757780";
    const iconColor = labelColor;

    const errors = hasInteracted
      ? schema?.safeParse(input).error?.issues || []
      : [];

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);
    const handleBlur = useCallback(() => {
      setIsFocused(false);
      setHasInteracted(true);
      onBlur?.();
    }, [onBlur]);
    const handleChangeText = useCallback(
      (text: string) => {
        setInput(text);
        if (!hasInteracted) setHasInteracted(true);
      },
      [setInput, hasInteracted],
    );

    const handleTogglePasswordVisibility = useCallback(() => {
      setIsPasswordVisible((prev) => !prev);
    }, []);

    const borderClass =
      errors.length > 0 ? "border-error" : "border-transparent";

    const bgClass = disabled ? "bg-surface-dim" : "bg-surface-high";

    const resolvedSecureTextEntry = secureTextEntry && !isPasswordVisible;
    const resolvedRightIcon =
      secureTextEntry && !rightIcon
        ? isPasswordVisible
          ? "eye-off"
          : "eye"
        : rightIcon;
    const resolvedOnRightIconPress =
      secureTextEntry && !rightIcon
        ? handleTogglePasswordVisibility
        : onRightIconPress;

    return (
      <View className={disabled ? "opacity-60" : ""}>
        {label && (
          <Text className="text-xs font-outfit font-medium text-on-surface-variant mb-1">
            {label}
          </Text>
        )}
        <View
          className={`h-12 flex-row items-center rounded-2xl px-3 border-[1.5px] ${borderClass} ${bgClass}`}
        >
          {leftIcon && (
            <View className="mr-2">
              <Icon name={leftIcon} size={18} color={iconColor} />
            </View>
          )}
          <TextInput
            className="flex-1 h-12 text-sm font-outfit font-medium text-on-surface"
            value={input}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={placeholderColor}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoFocus={autoFocus}
            secureTextEntry={resolvedSecureTextEntry}
            multiline={multiline}
            maxLength={maxLength}
            editable={!disabled}
          />
          {resolvedRightIcon && (
            <TouchableOpacity
              onPress={resolvedOnRightIconPress}
              disabled={!resolvedOnRightIconPress}
              className="ml-2"
            >
              <Icon name={resolvedRightIcon} size={18} color={iconColor} />
            </TouchableOpacity>
          )}
        </View>
        {errors.length > 0 && (
          <View className="mt-1">
            {errors.map((err: { message: string }) => (
              <Text
                key={err.message}
                className="text-xs font-outfit text-error font-medium"
              >
                {err.message}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  },
);

export default CustomInput;
