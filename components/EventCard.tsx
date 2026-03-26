import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Event, getTimeStatus, formatTimeRange } from '../types/event';
import { CATEGORIES, Category } from '../constants/categories';
import { useMunicipalities } from '../hooks/useEvents';

interface Props {
  event: Event;
  variant?: 'default' | 'compact';
  isToday?: boolean;
}

export function EventCard({ event, variant = 'default', isToday = false }: Props) {
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
  const isEnded = status === 'ended';

  function handlePressIn() {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: false, speed: 60, bounciness: 0 }).start();
  }
  function handlePressOut() {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: false, speed: 22, bounciness: 8 }).start();
  }

  return (
    <View style={[styles.wrapper, variant === 'compact' && styles.wrapperCompact]}>
      <TouchableOpacity
        onPress={() => router.push(`/event/${event.id}`)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View style={[styles.card, isEnded && styles.cardEnded, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.topRow}>
            <View style={[styles.categoryTag, { backgroundColor: cat.bgColor }]}>
              <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              <Text style={[styles.categoryLabel, { color: cat.color }]}>{cat.label}</Text>
            </View>
            <View style={styles.topRowRight}>
              {status === 'live' && (
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>En curso</Text>
                </View>
              )}
              {status === 'ended' && (
                <Text style={styles.endedBadge}>Finalizado</Text>
              )}
              {status !== 'ended' && (
                <Text style={[styles.chevron, isEnded && styles.chevronEnded]}>›</Text>
              )}
            </View>
          </View>

          <Text style={[styles.title, isEnded && styles.titleEnded]} numberOfLines={2}>
            {event.title}
          </Text>

          {variant === 'default' && event.description && (
            <Text style={[styles.description, isEnded && styles.textEnded]} numberOfLines={2}>
              {event.description}
            </Text>
          )}

          <View style={styles.footer}>
            {timeRange ? (
              <View style={[styles.timeChip, status === 'live' && styles.timeChipLive, isEnded && styles.timeChipEnded]}>
                <Text style={[styles.timeChipText, status === 'live' && styles.timeChipTextLive, isEnded && styles.timeChipTextEnded]}>
                  🕐 {timeRange}
                </Text>
              </View>
            ) : null}
            {event.location && (
              <View style={styles.locationRow}>
                <View style={[styles.locationDot, { backgroundColor: isEnded ? '#CBD5E1' : cat.color }]} />
                <Text style={[styles.location, isEnded && styles.textEnded]} numberOfLines={1}>
                  {event.location}
                </Text>
              </View>
            )}
            {muniName && (
              <View style={styles.locationRow}>
                <View style={[styles.locationDot, { backgroundColor: isEnded ? '#CBD5E1' : '#A78BFA' }]} />
                <Text style={[styles.location, isEnded && styles.textEnded]} numberOfLines={1}>
                  {muniName}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginHorizontal: 16, marginBottom: 10 },
  wrapperCompact: { marginHorizontal: 8 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F0FD',
  },
  cardEnded: { backgroundColor: '#FAFAFA', borderColor: '#F1F5F9', shadowOpacity: 0.02 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 },
  categoryTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 4 },
  categoryEmoji: { fontSize: 11 },
  categoryLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  liveText: { fontSize: 11, fontWeight: '700', color: '#EF4444' },
  topRowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chevron: { fontSize: 20, color: '#C4B5FD', fontWeight: '300', lineHeight: 22 },
  chevronEnded: { color: '#E2E8F0' },
  endedBadge: { fontSize: 11, fontWeight: '600', color: '#94A3B8' },
  title: { fontSize: 15, fontWeight: '700', color: '#0F0A2A', marginBottom: 5, lineHeight: 21 },
  titleEnded: { color: '#94A3B8' },
  description: { fontSize: 13, color: '#64748B', lineHeight: 19, marginBottom: 8 },
  textEnded: { color: '#CBD5E1' },
  footer: { gap: 6, marginTop: 4 },
  timeChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timeChipLive: { backgroundColor: '#FEF2F2' },
  timeChipEnded: { backgroundColor: '#F8FAFC' },
  timeChipText: { fontSize: 12, fontWeight: '700', color: '#7C3AED' },
  timeChipTextLive: { color: '#EF4444' },
  timeChipTextEnded: { color: '#CBD5E1' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationDot: { width: 5, height: 5, borderRadius: 3, opacity: 0.7 },
  location: { fontSize: 12, color: '#94A3B8', flex: 1 },
});
