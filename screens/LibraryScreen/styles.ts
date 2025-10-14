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
  thumbnailContainer: {
    position: "relative",
  },
  thumbnail: {
    width: "95%",
    aspectRatio: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    fontSize: 12,
    padding: 2,
    borderRadius: 4,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
