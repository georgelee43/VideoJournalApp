import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  authTitle: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  authSubtitle: {
    fontSize: 20,
    marginBottom: 32,
    textAlign: "center",
    color: "#666",
  },
  authInput: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  authButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  authButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  authToggle: {
    marginTop: 16,
    textAlign: "center",
    color: "#007AFF",
  },
});
