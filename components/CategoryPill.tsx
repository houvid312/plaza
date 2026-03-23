import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { CATEGORIES, Category } from '../constants/categories';

interface Props {
  category: Category | 'all';
  selected: boolean;
  onPress: () => void;
}

export function CategoryPill({ category, selected, onPress }: Props) {
  const isAll = category === 'all';
  const cat = isAll ? null : CATEGORIES[category];
  const color = cat?.color ?? '#7C3AED';
  const label = cat?.label ?? 'Todos';
  const emoji = cat?.emoji ?? '·';

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: selected ? 1.04 : 1,
      useNativeDriver: true,
      speed: 22,
      bounciness: 6,
    }).start();
  }, [selected]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Animated.View
        style={[
          styles.pill,
          selected
            ? { backgroundColor: color, borderColor: color }
            : { backgroundColor: '#fff', borderColor: '#EEEBF8' },
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={[styles.label, { color: selected ? '#fff' : '#4B5563' }]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
    gap: 5,
  },
  emoji: { fontSize: 13 },
  label: { fontSize: 12, fontWeight: '600', letterSpacing: 0.1 },
});
