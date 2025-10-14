import React from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { MediaItem } from "../../types";
import { globalStyles } from "../../styles/global";

// import { Video } from "expo-av"; TODO

import { styles } from "./styles";

export type LibraryScreenProps = {
  mediaLibrary: MediaItem[];
  selectedMedia: MediaItem[];
  onBack: () => void;
  onOpenDatePicker: () => void;
  onToggleSelect: (item: MediaItem) => void;
  onCreateFromSelected: () => void;
};

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  mediaLibrary,
  selectedMedia,
  onBack,
  onOpenDatePicker,
  onToggleSelect,
  onCreateFromSelected,
}) => {
  const renderItem = (item: MediaItem) => {
    // TODO: implement for video when I can actually check
    if (item.type === "video") {
      return (
        <Text style={styles.thumbnailText}>
          {item.type === "video" ? "▶️" : "📷"}
        </Text>
      );
    }

    return <Image source={{ uri: item.uri }} style={styles.thumbnailImage} />;
  };

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
            style={globalStyles.gridItem}
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
                {renderItem(item)}
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
};
