import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Project } from "../../types";

import { styles } from "./styles";

export type HomeScreenProps = {
  projects: Project[];
  onOpenSettings: () => void;
  onOpenDatePicker: () => void;
  onOpenLibrary: () => void;
  onOpenProject: (project: Project) => void;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  projects,
  onOpenSettings,
  onOpenDatePicker,
  onOpenLibrary,
  onOpenProject,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Video Journal</Text>
        <TouchableOpacity onPress={onOpenSettings}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={onOpenDatePicker}>
        <Text style={styles.actionButtonText}>
          📅 Create Vlog from Date Range
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onOpenLibrary}>
        <Text style={styles.actionButtonText}>📚 Browse Media Library</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => Alert.alert("Coming Soon", "Auto-generate daily vlogs")}
      >
        <Text style={styles.actionButtonText}>🤖 Auto-Generate Daily Vlog</Text>
      </TouchableOpacity>

      <View style={styles.projectsList}>
        <Text style={styles.sectionTitle}>Recent Projects</Text>
        {projects.length === 0 ? (
          <Text style={styles.emptyText}>
            No projects yet. Create one to get started!
          </Text>
        ) : (
          projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              style={styles.projectItem}
              onPress={() => onOpenProject(project)}
            >
              <Text style={styles.projectName}>{project.name}</Text>
              <Text style={styles.projectDate}>
                {project.clips.length} clips •{" "}
                {new Date(project.updated_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};
