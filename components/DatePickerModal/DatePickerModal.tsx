import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { modalStyles } from "../../styles/modal";

export type DatePickerModalProps = {
  visible: boolean;
  start: string;
  end: string;
  onChangeStart: (text: string) => void;
  onChangeEnd: (text: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  start,
  end,
  onChangeStart,
  onChangeEnd,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>Select Date Range</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Start Date (YYYY-MM-DD)"
            value={start}
            onChangeText={onChangeStart}
          />
          <TextInput
            style={modalStyles.input}
            placeholder="End Date (YYYY-MM-DD)"
            value={end}
            onChangeText={onChangeEnd}
          />
          <View style={modalStyles.modalButtons}>
            <TouchableOpacity
              style={[modalStyles.modalButton, modalStyles.cancelButton]}
              onPress={onCancel}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.modalButton, modalStyles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={modalStyles.confirmButtonText}>Create Project</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
