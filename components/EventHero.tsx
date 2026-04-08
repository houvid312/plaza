import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Event, getTimeStatus, formatTimeRange } from '../types/event';
import { CATEGORIES, Category } from '../constants/categories';
import { useMunicipalities } from '../hooks/useEvents';

interface Props {
  event: Event;
  isToday?: boolean;
}

export function EventHero({ event, isToday = false }: Props) {
  const router = useRouter();
  const cat = CATEGORIES[event.category as Category] ?? {
    label: event.category,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    emoji: '📌',
  };

  const { data: municipalities } = useMunicipalities();
  const muniName = event.municipality_id
    ? (municipalities ?? []).find(m => m.id === event.municipality_id)?.name ?? null
    : null;

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const status = isToday ? getTimeStatus(event.event_time, event.event_time_end) : null;
  const timeRange = formatTimeRange(event.event_time, event.event_time_end);

  function handlePressIn() {
    Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, speed: 60, bounciness: 0 }).start();
  }
  function handlePressOut() {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 22, bounciness: 8 }).start();
  }

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.hero, { backgroundColor: cat.color }]}
        onPress={() => router.push(`/event/${event.id}`)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.decorBig} />
        <View style={styles.decorSmall} />

        <View style={styles.inner}>
          <View style={styles.topRow}>
            {status === 'live' ? (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>RESONANDO AHORA</Text>
              </View>
            ) : (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>✦ RESONANCIA DESTACADA</Text>
              </View>
            )}
            <View style={styles.emojiBox}>
              <Text style={styles.heroEmoji}>{cat.emoji}</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>{event.title}</Text>
          {event.description && (
            <Text style={styles.heroDescription} numberOfLines={2}>
              {event.description}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.metaRow}>
              {timeRange ? (
                <View style={[styles.metaChip, status === 'live' && styles.metaChipLive]}>
                  <Text style={styles.metaText}>🕐 {timeRange}</Text>
                </View>
              ) : null}
              {event.location && (
                <View style={styles.metaChip}>
                  <Text style={styles.metaText} numberOfLines={1}>📍 {event.location}</Text>
                </View>
              )}
              {muniName && (
                <View style={styles.metaChip}>
                  <Text style={styles.metaText} numberOfLines={1}>🏛️ {muniName}</Text>
                </View>
              )}
              {event.category !== 'religious' && (
                <View style={styles.metaChip}>
                  <Text style={styles.metaText}>🎟 {event.price ?? 'Entrada libre'}</Text>
                </View>
              )}
            </View>
            <View style={styles.cta}>
              <Text style={[styles.ctaText, { color: cat.color }]}>Ver →</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 16, marginBottom: 8 },
  hero: { borderRadius: 24, overflow: 'hidden', minHeight: 220 },
  decorBig: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.1)', top: -50, right: -40 },
  decorSmall: { position: 'absolute', width: 90, height: 90, borderRadius: 45, backgroundColor: 'rgba(255,255,255,0.08)', bottom: -20, right: 80 },
  inner: { padding: 22, paddingBottom: 20 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EF4444', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' },
  liveBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  emojiBox: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 22 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', lineHeight: 30, marginBottom: 8 },
  heroDescription: { fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 20, marginBottom: 18 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  metaRow: { flexDirection: 'row', gap: 8, flex: 1, flexWrap: 'wrap' },
  metaChip: { backgroundColor: 'rgba(0,0,0,0.18)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  metaChipLive: { backgroundColor: 'rgba(0,0,0,0.3)' },
  metaText: { fontSize: 12, color: 'rgba(255,255,255,0.92)', fontWeight: '600' },
  cta: { backgroundColor: 'rgba(255,255,255,0.96)', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 },
  ctaText: { fontWeight: '800', fontSize: 13 },
});
