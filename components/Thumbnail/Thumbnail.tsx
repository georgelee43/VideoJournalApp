import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as VideoThumbnails from "expo-video-thumbnails";
import * as FileSystem from "expo-file-system";
import { MediaItem } from "../../types";

import { styles } from "./styles";

type ThumbnailProps = {
  mediaItem: MediaItem;
};

export const Thumbnail: React.FC<ThumbnailProps> = ({ mediaItem }) => {
  // if photo get the asset info, if video, get the thumbnail
  const [thumbnail, setThumbnail] = useState("");

  async function getMediaLibraryAsset() {
    try {
      const info = await MediaLibrary.getAssetInfoAsync(mediaItem.id);

      if (mediaItem.type == "video") {
        try {
          const videoUri = info.localUri || info.uri;

          // Generate thumbnail from the video
          const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
            time: 1000, // 1 second into the video
            quality: 0.8,
          });

          setThumbnail(uri);
        } catch (error) {
          console.error("Error generating video thumbnail:", error);
          // Fallback: try with original URI
          try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
              mediaItem.uri,
              {
                time: 1000,
                quality: 0.5,
              }
            );
            setThumbnail(uri);
          } catch (fallbackError) {
            console.error(
              "Fallback thumbnail generation failed:",
              fallbackError
            );
            setThumbnail(""); // Will show video icon
          }
        }
      } else {
        setThumbnail(info.localUri || info.uri);
      }
    } catch (error) {
      console.error("Error getting asset info:", error);
      setThumbnail(""); // Will show placeholder icon
    }
  }
  useEffect(() => {
    getMediaLibraryAsset();
  }, [mediaItem.id]);

  return (
    <>
      {thumbnail ? (
        <Image source={{ uri: thumbnail }} style={styles.thumbnailImage} />
      ) : (
        <Text style={styles.thumbnailText}>
          {mediaItem.type === "video" ? "▶️" : "📷"}
        </Text>
      )}
    </>
  );
};
