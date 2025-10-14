import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { styles } from "./styles";

export type SettingsScreenProps = {
  onBack: () => void;
  onSignOut: () => void;
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onSignOut,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity
          style={[styles.toolButton, styles.deleteButton]}
          onPress={onSignOut}
        >
          <Text style={[styles.toolButtonText, styles.deleteButtonText]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Text style={styles.settingsText}>
          Configure notifications, backup settings, and more.
        </Text>
      </View>
    </View>
  );
};
