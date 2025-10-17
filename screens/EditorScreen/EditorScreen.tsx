import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Alert } from "react-native";
import { Project, MediaItem } from "../../types";

import { styles } from "./styles";
import { Thumbnail } from "../../components/Thumbnail/Thumbnail";
import * as FileSystem from "expo-file-system";
// import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";

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

  // TODO...look more into ffmpeg and alternatives to what is available rn since it seems broken

  // const [isProcessing, setIsProcessing] = useState(false);
  // const [progress, setProgress] = useState(0);

  // const convertImageToVideo = async (
  //   imageUri: string,
  //   duration: number,
  //   outputPath: string
  // ) => {
  //   // Convert image to video with specified duration
  //   const command = `-loop 1 -i "${imageUri}" -c:v libx264 -t ${duration} -pix_fmt yuv420p -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" "${outputPath}"`;

  //   const session = await FFmpegKit.execute(command);
  //   const returnCode = await session.getReturnCode();

  //   return ReturnCode.isSuccess(returnCode);
  // };

  // const normalizeVideo = async (videoUri: string, outputPath: string) => {
  //   // Normalize video to standard resolution and codec
  //   const command = `-i "${videoUri}" -c:v libx264 -c:a aac -ar 44100 -ac 2 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" -pix_fmt yuv420p -r 30 "${outputPath}"`;

  //   const session = await FFmpegKit.execute(command);
  //   const returnCode = await session.getReturnCode();

  //   return ReturnCode.isSuccess(returnCode);
  // };

  // // try to stich photos together
  // const stitchMedia = async () => {
  //   if (project.clips.length === 0) {
  //     Alert.alert("No Media", "Please add photos or videos first");
  //     return;
  //   }

  //   setIsProcessing(true);
  //   setProgress(0);

  //   try {
  //     const tempDir = `${FileSystem.Paths.cache}temp_videos/`;
  //     const outputDir = `${FileSystem.Paths.document}`;

  //     // Create temp directory
  //     await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });

  //     // Step 1: Convert all media to videos and normalize
  //     const processedVideos = [];

  //     const mediaItems = project.clips;

  //     for (let i = 0; i < mediaItems.length; i++) {
  //       const item = mediaItems[i];
  //       const tempVideoPath = `${tempDir}video_${i}.mp4`;

  //       setProgress(((i + 1) / (mediaItems.length + 1)) * 50);

  //       if (item.type === "photo") {
  //         // Convert image to video
  //         const success = await convertImageToVideo(
  //           item.uri,
  //           2, // TODO make customizable
  //           tempVideoPath
  //         );

  //         if (!success) {
  //           throw new Error(`Failed to convert image ${i}`);
  //         }
  //       } else {
  //         // Normalize video
  //         const success = await normalizeVideo(item.uri, tempVideoPath);

  //         if (!success) {
  //           throw new Error(`Failed to process video ${i}`);
  //         }
  //       }

  //       processedVideos.push(tempVideoPath);
  //     }

  //     // Step 2: Create concat file
  //     const concatFilePath = `${tempDir}concat.txt`;
  //     const concatContent = processedVideos
  //       .map((path) => `file '${path}'`)
  //       .join("\n");

  //     await FileSystem.writeAsStringAsync(concatFilePath, concatContent);

  //     // Step 3: Concatenate all videos
  //     setProgress(75);
  //     const finalOutputPath = `${outputDir}stitched_video_${Date.now()}.mp4`;

  //     const concatCommand = `-f concat -safe 0 -i "${concatFilePath}" -c copy "${finalOutputPath}"`;

  //     const session = await FFmpegKit.execute(concatCommand);
  //     const returnCode = await session.getReturnCode();

  //     if (ReturnCode.isSuccess(returnCode)) {
  //       setProgress(100);

  //       // Clean up temp files
  //       await FileSystem.deleteAsync(tempDir, { idempotent: true });

  //       Alert.alert("Success!", `Video saved to: ${finalOutputPath}`, [
  //         {
  //           text: "OK",
  //           onPress: () => {
  //             setProgress(0);
  //           },
  //         },
  //       ]);
  //     } else {
  //       const logs = await session.getAllLogsAsString();
  //       throw new Error(`FFmpeg failed: ${logs}`);
  //     }
  //   } catch (error) {
  //     console.error("Stitching error:", error);
  //     Alert.alert("Error", `Failed to create video: ${error}`);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

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
                <Thumbnail mediaItem={clip} />
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
          onPress={() => {
            onStitch(project.clips);
          }}
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
