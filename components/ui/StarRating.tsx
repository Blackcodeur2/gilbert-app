import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { theme } from '../../constants/theme';

interface StarRatingProps {
  rating: number;
  size?: number;
  gap?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function AnimatedStar({ filled, size, onPress, interactive }: {
  filled: boolean;
  size: number;
  onPress?: () => void;
  interactive?: boolean;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={animStyle}
      onPress={interactive ? onPress : undefined}
      onPressIn={() => {
        if (interactive) scale.value = withSpring(1.3, { damping: 10, stiffness: 400 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 400 });
      }}
      hitSlop={interactive ? 6 : 0}
      disabled={!interactive}
    >
      <MaterialIcons
        name={filled ? 'star' : 'star-border'}
        size={size}
        color={filled ? theme.accent : theme.textMuted}
      />
    </AnimatedPressable>
  );
}

export function StarRating({ rating, size = 20, gap = 2, interactive = false, onRate }: StarRatingProps) {
  return (
    <View style={[styles.container, { gap }]}>
      {[1, 2, 3, 4, 5].map(star => (
        <AnimatedStar
          key={star}
          filled={star <= Math.round(rating)}
          size={size}
          interactive={interactive}
          onPress={() => onRate?.(star)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
