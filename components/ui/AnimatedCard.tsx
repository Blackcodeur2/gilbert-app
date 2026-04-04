import React, { useEffect } from 'react';
import { ViewStyle, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedCardProps {
  children: React.ReactNode;
  index?: number;
  delay?: number;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  disabled?: boolean;
}

export function AnimatedCard({ children, index = 0, delay, style, onPress, disabled }: AnimatedCardProps) {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  const computedDelay = delay ?? index * 80;

  useEffect(() => {
    progress.value = withDelay(
      computedDelay,
      withTiming(1, { duration: 450, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [24, 0]) },
      { scale: scale.value },
    ],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <AnimatedPressable
      style={[animatedStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      {children}
    </AnimatedPressable>
  );
}

interface AnimatedFadeInProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle | ViewStyle[];
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function AnimatedFadeIn({ children, delay = 0, style, direction = 'up' }: AnimatedFadeInProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const offset = 20;
    const transforms: any[] = [];
    switch (direction) {
      case 'up': transforms.push({ translateY: interpolate(progress.value, [0, 1], [offset, 0]) }); break;
      case 'down': transforms.push({ translateY: interpolate(progress.value, [0, 1], [-offset, 0]) }); break;
      case 'left': transforms.push({ translateX: interpolate(progress.value, [0, 1], [offset, 0]) }); break;
      case 'right': transforms.push({ translateX: interpolate(progress.value, [0, 1], [-offset, 0]) }); break;
    }
    return {
      opacity: progress.value,
      transform: transforms,
    };
  });

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}

interface AnimatedScaleButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
}

export function AnimatedScaleButton({ children, onPress, style, disabled }: AnimatedScaleButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[animatedStyle, style]}
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.93, { damping: 15, stiffness: 400 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 12, stiffness: 300 }); }}
      disabled={disabled}
    >
      {children}
    </AnimatedPressable>
  );
}
