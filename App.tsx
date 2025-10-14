// App.tsx - Main Application Entry Point with Supabase Integration
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// Supabase imports
// npm install @supabase/supabase-js
// npm install react-native-url-polyfill
import "react-native-url-polyfill/auto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Other required dependencies:
// npm install @react-native-camera-roll/camera-roll
// npm install react-native-video
// npm install @react-native-community/slider
// npm install react-native-fs
// npm install @notifee/react-native
// npm install date-fns
// npm install react-native-get-random-values (required for UUID)
import "react-native-get-random-values";

import { AuthScreen } from "./screens/AuthScreen/AuthScreen";

// Initialize Supabase client
// IMPORTANT: Replace these with your actual Supabase project credentials
const SUPABASE_URL = "https://tltjhjbhuhvohaymqwhk.supabase.co"; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsdGpoamJodWh2b2hheW1xd2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzOTI0NjEsImV4cCI6MjA3NTk2ODQ2MX0.BRRNmDx8ulvKkDXRL-7bGX9uijbeRV_NXYFMmSUZ0vw";

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const { width } = Dimensions.get("window");
const GRID_ITEM_SIZE = (width - 48) / 3;

interface MediaItem {
  id: string;
  uri: string;
  type: "video" | "photo";
  timestamp: number;
  duration?: number;
  thumbnail?: string;
  storage_path?: string; // Supabase Storage path
  public_url?: string; // Public URL from Supabase
  uploaded_at?: string;
}

interface Project {
  id: string;
  name: string;
  date_range_start: string;
  date_range_end: string;
  clips: MediaItem[];
  soundtrack?: string;
  narration?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  thumbnail_url?: string;
}

interface UserSettings {
  user_id: string;
  notifications_enabled: boolean;
  auto_backup: boolean;
  daily_reminder_time: string;
  theme: "light" | "dark";
  created_at: string;
  updated_at: string;
}

export default function App() {
  const [view, setView] = useState<"home" | "library" | "editor" | "settings">(
    "home"
  );
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showAuth, setShowAuth] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // Supabase Authentication State
  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserData(session.user.id);
        setShowAuth(false);
      } else {
        setShowAuth(true);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadUserData(session.user.id);
        setShowAuth(false);
      } else {
        setShowAuth(true);
        setProjects([]);
        setMediaLibrary([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load all user data from Supabase
  const loadUserData = async (userId: string) => {
    try {
      // Load projects from Supabase
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (projectsError) throw projectsError;

      if (projectsData) {
        setProjects(projectsData);
      }

      // Load media library metadata
      const { data: mediaData, error: mediaError } = await supabase
        .from("media")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

      if (mediaError) throw mediaError;

      if (mediaData) {
        setMediaLibrary(mediaData);
      }

      // Load user settings
      await loadUserSettings(userId);
    } catch (error: any) {
      console.error("Error loading user data:", error);
      Alert.alert("Error", error.message || "Failed to load your data");
    }
  };

  // Authentication Functions
  const signUp = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;

      Alert.alert(
        "Success",
        "Account created! Please check your email to verify your account.",
        [{ text: "OK", onPress: () => setIsSignUp(false) }]
      );
    } catch (error: any) {
      Alert.alert("Sign Up Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;
    } catch (error: any) {
      Alert.alert("Sign In Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setProjects([]);
      setMediaLibrary([]);
      setCurrentProject(null);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // Save or Update project in Supabase
  const saveProjectToSupabase = async (project: Project) => {
    if (!session) return;

    try {
      const projectData = {
        name: project.name,
        date_range_start: project.date_range_start,
        date_range_end: project.date_range_end,
        clips: project.clips,
        soundtrack: project.soundtrack,
        narration: project.narration,
        user_id: session.user.id,
        thumbnail_url: project.thumbnail_url,
        updated_at: new Date().toISOString(),
      };

      if (project.id && !project.id.startsWith("temp-")) {
        // Update existing project
        const { data, error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", project.id)
          .select()
          .single();

        if (error) throw error;
        return data.id;
      } else {
        // Create new project
        const { data, error } = await supabase
          .from("projects")
          .insert([{ ...projectData, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) throw error;
        return data.id;
      }
    } catch (error: any) {
      console.error("Error saving project:", error);
      Alert.alert("Error", error.message || "Failed to save project");
      return null;
    }
  };

  // Delete project from Supabase
  const deleteProjectFromSupabase = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      setProjects(projects.filter((p) => p.id !== projectId));
      Alert.alert("Success", "Project deleted");
    } catch (error: any) {
      console.error("Error deleting project:", error);
      Alert.alert("Error", error.message || "Failed to delete project");
    }
  };

  // Upload media to Supabase Storage
  const uploadMediaToStorage = async (mediaItem: MediaItem) => {
    if (!session) return null;

    try {
      const fileExt = mediaItem.uri.split(".").pop();
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
      const filePath = `media/${fileName}`;

      // Read file as blob (you'll need react-native-fs for this)
      // This is a simplified example - actual implementation needs proper file handling
      const { data, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(
          filePath,
          {
            uri: mediaItem.uri,
          } as any,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("videos").getPublicUrl(filePath);

      // Save metadata to database
      const { error: dbError } = await supabase.from("media").insert([
        {
          user_id: session.user.id,
          storage_path: filePath,
          public_url: publicUrl,
          type: mediaItem.type,
          timestamp: mediaItem.timestamp,
          duration: mediaItem.duration,
          uploaded_at: new Date().toISOString(),
        },
      ]);

      if (dbError) throw dbError;

      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading media:", error);
      Alert.alert("Error", error.message || "Failed to upload media");
      return null;
    }
  };

  // Load user settings
  const loadUserSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned

      if (!data) {
        // Create default settings
        const defaultSettings = {
          user_id: userId,
          notifications_enabled: true,
          auto_backup: false,
          daily_reminder_time: "20:00",
          theme: "light",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: insertError } = await supabase
          .from("user_settings")
          .insert([defaultSettings]);

        if (insertError) throw insertError;
      }
    } catch (error: any) {
      console.error("Error loading settings:", error);
    }
  };

  // Save user settings
  const saveUserSettings = async (settings: Partial<UserSettings>) => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from("user_settings")
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq("user_id", session.user.id);

      if (error) throw error;

      Alert.alert("Success", "Settings saved");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", error.message || "Failed to save settings");
    }
  };

  const loadMediaLibrary = async () => {
    // Implementation with @react-native-camera-roll/camera-roll
    console.log("Loading media library...");

    // Mock data for demonstration
    const mockMedia: MediaItem[] = [
      {
        id: "1",
        uri: "video1.mp4",
        type: "video",
        timestamp: Date.now() - 86400000,
        duration: 45,
      },
      {
        id: "2",
        uri: "video2.mp4",
        type: "video",
        timestamp: Date.now() - 172800000,
        duration: 30,
      },
      {
        id: "3",
        uri: "photo1.jpg",
        type: "photo",
        timestamp: Date.now() - 259200000,
      },
    ];
    setMediaLibrary(mockMedia);
  };

  const filterMediaByDateRange = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    return mediaLibrary.filter(
      (item) => item.timestamp >= startDate && item.timestamp <= endDate
    );
  };

  const createProjectFromDateRange = async () => {
    if (!dateRange.start || !dateRange.end || !session) {
      Alert.alert("Error", "Please select both start and end dates");
      return;
    }

    const filteredMedia = filterMediaByDateRange(
      dateRange.start,
      dateRange.end
    );

    if (filteredMedia.length === 0) {
      Alert.alert("No Media", "No videos found in this date range");
      return;
    }

    const newProject: Project = {
      id: `temp-${Date.now()}`,
      name: `Vlog ${new Date(dateRange.start).toLocaleDateString()}`,
      date_range_start: dateRange.start,
      date_range_end: dateRange.end,
      clips: filteredMedia,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: session.user.id,
    };

    // Save to Supabase
    const savedId = await saveProjectToSupabase(newProject);
    if (savedId) {
      newProject.id = savedId;
      setProjects([newProject, ...projects]);
      setCurrentProject(newProject);
      setView("editor");
      setShowDatePicker(false);
    }
  };

  const generateAINarration = async (project: Project) => {
    Alert.alert(
      "AI Narration",
      "This feature requires integration with AI services like OpenAI GPT-4 Vision. You can call the API from your backend or edge functions."
    );
  };

  const stitchVideos = async (clips: MediaItem[]) => {
    Alert.alert(
      "Stitching Videos",
      "This feature requires FFmpeg integration. Install react-native-ffmpeg package."
    );
  };

  // (moved) Authentication Screen

  // Home Screen (moved)

  // Home Screen (hoisted)
  type HomeScreenProps = {
    projects: Project[];
    onOpenSettings: () => void;
    onOpenDatePicker: () => void;
    onOpenLibrary: () => void;
    onOpenProject: (project: Project) => void;
  };

  function HomeScreen({
    projects,
    onOpenSettings,
    onOpenDatePicker,
    onOpenLibrary,
    onOpenProject,
  }: HomeScreenProps) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Video Journal</Text>
          <TouchableOpacity onPress={onOpenSettings}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onOpenDatePicker}
        >
          <Text style={styles.actionButtonText}>
            📅 Create Vlog from Date Range
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onOpenLibrary}>
          <Text style={styles.actionButtonText}>📚 Browse Media Library</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            Alert.alert("Coming Soon", "Auto-generate daily vlogs")
          }
        >
          <Text style={styles.actionButtonText}>
            🤖 Auto-Generate Daily Vlog
          </Text>
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
  }

  // Library Screen (hoisted)
  type LibraryScreenProps = {
    mediaLibrary: MediaItem[];
    selectedMedia: MediaItem[];
    onBack: () => void;
    onOpenDatePicker: () => void;
    onToggleSelect: (item: MediaItem) => void;
    onCreateFromSelected: () => void;
  };

  function LibraryScreen({
    mediaLibrary,
    selectedMedia,
    onBack,
    onOpenDatePicker,
    onToggleSelect,
    onCreateFromSelected,
  }: LibraryScreenProps) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Media Library</Text>
        </View>

        <View style={styles.filterBar}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={onOpenDatePicker}
          >
            <Text>Filter by Date</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={mediaLibrary}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => onToggleSelect(item)}
            >
              <View style={styles.thumbnailContainer}>
                <View
                  style={[
                    styles.thumbnail,
                    selectedMedia.find((m) => m.id === item.id) &&
                      styles.selected,
                  ]}
                >
                  <Text style={styles.thumbnailText}>
                    {item.type === "video" ? "▶️" : "📷"}
                  </Text>
                </View>
                {item.duration && (
                  <Text style={styles.duration}>{item.duration}s</Text>
                )}
              </View>
              <Text style={styles.date}>
                {new Date(item.timestamp).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
        />

        {selectedMedia.length > 0 && (
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={onCreateFromSelected}
          >
            <Text style={styles.floatingButtonText}>
              Create Project ({selectedMedia.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Editor Screen (hoisted)
  type EditorScreenProps = {
    project: Project | null;
    onSaveAndBack: () => void;
    onRemoveClip: (index: number) => void;
    onStitch: (clips: MediaItem[]) => void;
    onGenerateNarration: (project: Project) => void;
    onExport: () => void;
    onDeleteProject: () => void;
  };

  function EditorScreen({
    project,
    onSaveAndBack,
    onRemoveClip,
    onStitch,
    onGenerateNarration,
    onExport,
    onDeleteProject,
  }: EditorScreenProps) {
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
  }

  // Settings Screen (hoisted)
  type SettingsScreenProps = {
    onBack: () => void;
    onSignOut: () => void;
  };

  function SettingsScreen({ onBack, onSignOut }: SettingsScreenProps) {
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
  }

  // Date Range Picker Modal (hoisted)
  type DatePickerModalProps = {
    visible: boolean;
    start: string;
    end: string;
    onChangeStart: (text: string) => void;
    onChangeEnd: (text: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
  };

  function DatePickerModal({
    visible,
    start,
    end,
    onChangeStart,
    onChangeEnd,
    onCancel,
    onConfirm,
  }: DatePickerModalProps) {
    return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date Range</Text>
            <TextInput
              style={styles.input}
              placeholder="Start Date (YYYY-MM-DD)"
              value={start}
              onChangeText={onChangeStart}
            />
            <TextInput
              style={styles.input}
              placeholder="End Date (YYYY-MM-DD)"
              value={end}
              onChangeText={onChangeEnd}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={onConfirm}
              >
                <Text style={styles.confirmButtonText}>Create Project</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  // Library Grid View (moved)

  // Editor Screen (moved)

  // Settings Screen (moved)

  // Date Range Picker Modal (moved)

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (showAuth) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AuthScreen
          email={email}
          password={password}
          isSignUp={isSignUp}
          loading={loading}
          onChangeEmail={setEmail}
          onChangePassword={setPassword}
          onSubmit={isSignUp ? signUp : signIn}
          onToggleMode={() => setIsSignUp(!isSignUp)}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {view === "home" && (
        <HomeScreen
          projects={projects}
          onOpenSettings={() => setView("settings")}
          onOpenDatePicker={() => setShowDatePicker(true)}
          onOpenLibrary={() => setView("library")}
          onOpenProject={(project) => {
            setCurrentProject(project);
            setView("editor");
          }}
        />
      )}

      {view === "library" && (
        <LibraryScreen
          mediaLibrary={mediaLibrary}
          selectedMedia={selectedMedia}
          onBack={() => setView("home")}
          onOpenDatePicker={() => setShowDatePicker(true)}
          onToggleSelect={(item) => {
            const isSelected = selectedMedia.find((m) => m.id === item.id);
            if (isSelected) {
              setSelectedMedia(selectedMedia.filter((m) => m.id !== item.id));
            } else {
              setSelectedMedia([...selectedMedia, item]);
            }
          }}
          onCreateFromSelected={async () => {
            const newProject: Project = {
              id: `temp-${Date.now()}`,
              name: `Project ${projects.length + 1}`,
              date_range_start: new Date(
                selectedMedia[0].timestamp
              ).toISOString(),
              date_range_end: new Date(
                selectedMedia[selectedMedia.length - 1].timestamp
              ).toISOString(),
              clips: selectedMedia,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: session!.user.id,
            };

            const savedId = await saveProjectToSupabase(newProject);
            if (savedId) {
              newProject.id = savedId;
              setProjects([newProject, ...projects]);
              setCurrentProject(newProject);
              setView("editor");
              setSelectedMedia([]);
            }
          }}
        />
      )}

      {view === "editor" && (
        <EditorScreen
          project={currentProject}
          onSaveAndBack={async () => {
            if (currentProject) {
              await saveProjectToSupabase(currentProject);
            }
            setView("home");
          }}
          onRemoveClip={(index) => {
            if (!currentProject) return;
            const updatedClips = [...currentProject.clips];
            updatedClips.splice(index, 1);
            const updatedProject = {
              ...currentProject,
              clips: updatedClips,
              updated_at: new Date().toISOString(),
            };
            setCurrentProject(updatedProject);
            saveProjectToSupabase(updatedProject);
          }}
          onStitch={(clips) => stitchVideos(clips)}
          onGenerateNarration={(project) => generateAINarration(project)}
          onExport={() => Alert.alert("Export", "Rendering final video...")}
          onDeleteProject={() => {
            if (!currentProject) return;
            Alert.alert(
              "Delete Project",
              "Are you sure? This cannot be undone.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => {
                    deleteProjectFromSupabase(currentProject.id);
                    setView("home");
                  },
                },
              ]
            );
          }}
        />
      )}

      {view === "settings" && (
        <SettingsScreen onBack={() => setView("home")} onSignOut={signOut} />
      )}

      <DatePickerModal
        visible={showDatePicker}
        start={dateRange.start}
        end={dateRange.end}
        onChangeStart={(text) => setDateRange({ ...dateRange, start: text })}
        onChangeEnd={(text) => setDateRange({ ...dateRange, end: text })}
        onCancel={() => setShowDatePicker(false)}
        onConfirm={createProjectFromDateRange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  confirmButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
  },
});
