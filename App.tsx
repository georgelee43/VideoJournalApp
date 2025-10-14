// App.tsx - Main Application Entry Point with Supabase Integration
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as MediaLibrary from "expo-media-library";

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
import { HomeScreen } from "./screens/HomeScreen/HomeScreen";
import { LibraryScreen } from "./screens/LibraryScreen/LibraryScreen";
import { EditorScreen } from "./screens/EditorScreen/EditorScreen";
import { SettingsScreen } from "./screens/SettingsScreen/SettingsScreen";
import { MediaItem, Project, UserSettings } from "./types";
import { globalStyles as styles } from "./styles/global";
import { modalStyles } from "./styles/modal";

// Initialize Supabase client
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL; // e.g., https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  // initial check for library permissions and load initial assets
  useEffect(() => {
    getPermissionAndLoadAssets();
  }, []);

  const getPermissionAndLoadAssets = async () => {
    // Check if permission is granted
    if (permissionResponse?.status !== "granted") {
      const { status } = await requestPermission();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
        return;
      }
    }

    loadAssets();
  };

  const loadAssets = async () => {
    // TODO: update for photo and videos...
    const media = await MediaLibrary.getAssetsAsync({
      first: 6,
      mediaType: ["photo", "video"],
      sortBy: ["creationTime"],
    });

    const assetsWithInfo: MediaItem[] = await Promise.all(
      media.assets.map(async (asset) => {
        const info = await MediaLibrary.getAssetInfoAsync(asset.id);

        return {
          id: asset.id,
          uri: info.localUri || info.uri,
          type: "photo",
          timestamp: asset.creationTime,
        };
      })
    );
    setMediaLibrary(assetsWithInfo);
  };

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

      // Load media library metadata ???
      // const { data: mediaData, error: mediaError } = await supabase
      //   .from("media")
      //   .select("*")
      //   .eq("user_id", userId)
      //   .order("timestamp", { ascending: false });

      // if (mediaError) throw mediaError;

      // if (mediaData) {
      //   setMediaLibrary(mediaData);
      // }

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
                <Text style={modalStyles.confirmButtonText}>
                  Create Project
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

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

  // TODO: use React Navigator at some point
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
