import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    fontSize: 18,
    color: "#007AFF",
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  editorSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  timeline: {
    flexDirection: "row",
  },
  timelineClip: {
    width: 100,
    marginRight: 12,
    alignItems: "center",
  },
  clipPreview: {
    width: 80,
    height: 60,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  clipDuration: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  clipActions: {
    flexDirection: "row",
  },
  clipAction: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "bold",
  },
  toolButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  toolButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  exportButton: {
    backgroundColor: "#34C759",
  },
  exportButtonText: {
    color: "white",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
  },
  deleteButtonText: {
    color: "white",
  },
});
