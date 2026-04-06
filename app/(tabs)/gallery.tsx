import { MaterialIcons } from "@expo/vector-icons";
import { FlashList as RealFlashList } from "@shopify/flash-list";
const FlashList: any = RealFlashList;
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  borderRadius,
  spacing,
  theme,
  typography,
} from "../../constants/theme";
import { getImageSource } from "../../constants/assets";
import {
  type GalleryItem,
} from "../../services/mockData";
import { usePublicData } from "../../hooks/useSupabaseData";

const { width: SCREEN_W } = Dimensions.get("window");
const GRID_GAP = 4;
const ITEM_SIZE = (SCREEN_W - spacing.lg * 2 - GRID_GAP * 2) / 3;

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const { gallery } = usePublicData();

  const galleryCategories = ["Tous", ...Array.from(new Set(gallery.map(g => g.category).filter(Boolean)))];

  const filteredItems =
    selectedCategory === "Tous"
      ? gallery
      : gallery.filter((g) => g.category === selectedCategory);

  const renderGalleryItem = useCallback(
    ({ item }: { item: GalleryItem }) => (
      <Pressable
        style={styles.gridItem}
        onPress={() => {
          Haptics.selectionAsync();
          setSelectedItem(item);
        }}
      >
        <Image
          source={getImageSource(item.imageUrl)}
          style={styles.gridImage}
          contentFit="cover"
        />
        {item.isFeatured && (
          <View style={styles.featuredDot}>
            <MaterialIcons name="star" size={10} color={theme.accent} />
          </View>
        )}
      </Pressable>
    ),
    [],
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notre Galerie</Text>
        <Text style={styles.headerSubtitle}>
          {gallery.length} réalisations
        </Text>
      </View>

      {/* Category Filter */}
      <View style={{ height: 48 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            gap: spacing.sm,
          }}
        >
          {galleryCategories.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.chip,
                selectedCategory === cat && styles.chipActive,
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedCategory(cat);
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === cat && styles.chipTextActive,
                ]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Gallery Grid */}
      <View style={{ flex: 1, marginTop: spacing.md }}>
        <FlashList
          data={filteredItems}
          renderItem={renderGalleryItem}
          numColumns={3}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: insets.bottom + 16,
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: GRID_GAP }} />}
        />
      </View>

      {/* Fullscreen Modal */}
      <Modal visible={!!selectedItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalClose}
            onPress={() => setSelectedItem(null)}
          >
            <MaterialIcons name="close" size={28} color="#FFF" />
          </Pressable>
          {selectedItem && (
            <View style={styles.modalContent}>
              <Image
                source={getImageSource(selectedItem.imageUrl)}
                style={styles.modalImage}
                contentFit="contain"
              />
              <View style={styles.modalInfo}>
                <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                <Text style={styles.modalDesc}>{selectedItem.description}</Text>
                <View style={styles.modalCatBadge}>
                  <Text style={styles.modalCatText}>
                    {selectedItem.category}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h1,
    color: theme.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: theme.textSecondary,
    marginTop: 4,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.surface,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: theme.border,
  },
  chipActive: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.textSecondary,
  },
  chipTextActive: {
    color: theme.textOnPrimary,
  },

  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: borderRadius.sm,
    overflow: "hidden",
    marginHorizontal: GRID_GAP / 3,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  featuredDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalClose: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: SCREEN_W - 32,
    alignItems: "center",
  },
  modalImage: {
    width: SCREEN_W - 32,
    height: SCREEN_W - 32,
    borderRadius: borderRadius.lg,
  },
  modalInfo: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  modalCatBadge: {
    backgroundColor: "rgba(232,80,126,0.3)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  modalCatText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.primaryLight,
  },
});
