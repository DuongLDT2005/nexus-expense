import React, { memo } from "react";
import { View, Modal, Pressable } from "react-native";
import PrimaryText from "../atoms/PrimaryText";
import PrimaryButton from "../atoms/PrimaryButton";
import Icon from "../atoms/Icons";
import useColorScheme from "../../hooks/useColorScheme";

interface ConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDamage?: boolean; // If true, make the confirm button styled with danger/error colors
}

const ConfirmModal: React.FC<ConfirmModalProps> = memo(
  ({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDamage = false,
  }) => {
    const isDark = useColorScheme() === "dark";
    const errorColor = isDark ? "#ffb4ab" : "#ba1a1a"; // --error in dark/light themes
    const errorContainerColor = isDark ? "#93000a" : "#ffdad6"; // --error-container

    return (
      <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
        <Pressable
          className="flex-1 bg-black/60 justify-center items-center p-6"
          style={{ width: "100%", height: "100%" }}
          onPress={onClose}
        >
          <Pressable
            className="bg-surface-lowest w-full max-w-[85%] rounded-2xl p-6 shadow-2xl border border-surface-high"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-4">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center`}
                style={{
                  backgroundColor: isDamage ? errorContainerColor : "#4f46e51A",
                }}
              >
                <Icon
                  name={isDamage ? "trash-2" : "info"}
                  size={20}
                  color={isDamage ? errorColor : "#4f46e5"}
                />
              </View>
              <PrimaryText className="text-lg font-extrabold text-on-surface font-inter flex-1">
                {title}
              </PrimaryText>
            </View>

            {/* Message */}
            <PrimaryText className="text-sm text-on-surface-variant font-inter mb-6 leading-5">
              {message}
            </PrimaryText>

            {/* Action Buttons */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <PrimaryButton
                  onPress={onClose}
                  buttonTitle={cancelText}
                  variant="outline"
                  size="sm"
                />
              </View>
              <View className="flex-1">
                <PrimaryButton
                  onPress={() => {
                    onConfirm();
                    onClose();
                  }}
                  buttonTitle={confirmText}
                  variant={isDamage ? "danger" : "primary"}
                  size="sm"
                />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  },
);

export default ConfirmModal;
