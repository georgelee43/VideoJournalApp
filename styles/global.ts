import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const GRID_ITEM_SIZE = (width - 48) / 3;

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  settingsIcon: {
    fontSize: 28,
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
  actionButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
  },
  projectsList: {
    marginTop: 24,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 24,
  },
  projectItem: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "600",
  },
  projectDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  filterBar: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    margin: 4,
  },
  thumbnailContainer: {
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  selected: {
    borderWidth: 3,
    borderColor: "#007AFF",
  },
  thumbnailText: {
    fontSize: 32,
  },
  duration: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    padding: 4,
    borderRadius: 4,
    fontSize: 10,
  },
  date: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  editorSection: {
    marginBottom: 24,
  },
  timeline: {
    flexDirection: "row",
  },
  timelineClip: {
    width: 100,
    marginRight: 8,
  },
  clipPreview: {
    width: 100,
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  clipDuration: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  clipActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  clipAction: {
    fontSize: 18,
    color: "#ff3b30",
  },
  toolButton: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  toolButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  exportButton: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  exportButtonText: {
    color: "white",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
    borderColor: "#ff3b30",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
});
