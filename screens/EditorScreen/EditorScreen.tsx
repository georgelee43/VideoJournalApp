import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Project, MediaItem } from "../../types";

import { styles } from "./styles";

export type EditorScreenProps = {
  project: Project | null;
  onSaveAndBack: () => void;
  onRemoveClip: (index: number) => void;
  onStitch: (clips: MediaItem[]) => void;
  onGenerateNarration: (project: Project) => void;
  onExport: () => void;
  onDeleteProject: () => void;
};

export const EditorScreen: React.FC<EditorScreenProps> = ({
  project,
  onSaveAndBack,
  onRemoveClip,
  onStitch,
  onGenerateNarration,
  onExport,
  onDeleteProject,
}) => {
  if (!project) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onSaveAndBack}>
          <Text style={styles.backButton}>← Save & Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{project.name}</Text>
      </View>

      <View style={styles.editorSection}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <ScrollView horizontal style={styles.timeline}>
          {project.clips.map((clip, index) => (
            <View key={clip.id} style={styles.timelineClip}>
              <View style={styles.clipPreview}>
                <Text>{clip.type === "video" ? "▶️" : "📷"}</Text>
              </View>
              <Text style={styles.clipDuration}>{clip.duration || 0}s</Text>
              <View style={styles.clipActions}>
                <TouchableOpacity onPress={() => onRemoveClip(index)}>
                  <Text style={styles.clipAction}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.editorSection}>
        <Text style={styles.sectionTitle}>Tools</Text>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => onStitch(project.clips)}
        >
          <Text style={styles.toolButtonText}>🎬 Stitch Videos Together</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toolButton}
          onPress={() => onGenerateNarration(project)}
        >
          <Text style={styles.toolButtonText}>🤖 Generate AI Narration</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, styles.exportButton]}
          onPress={onExport}
        >
          <Text style={[styles.toolButtonText, styles.exportButtonText]}>
            💾 Export Vlog
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, styles.deleteButton]}
          onPress={onDeleteProject}
        >
          <Text style={[styles.toolButtonText, styles.deleteButtonText]}>
            🗑️ Delete Project
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
