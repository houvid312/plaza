import React, { useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Event, getTimeStatus, formatTimeRange } from '../types/event';
import { CATEGORIES, Category } from '../constants/categories';
import { useMunicipalities, useIsFavorite, useToggleFavorite } from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

interface Props {
  event: Event;
  variant?: 'default' | 'compact';
  isToday?: boolean;
  showDate?: boolean;
}

export function EventCard({ event, variant = 'default', isToday = false, showDate = false }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { colors } = useTheme();
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

  const { data: isFav } = useIsFavorite(event.id);
  const { mutate: toggleFav, isPending: isTogglingFav } = useToggleFavorite();

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

  const styles = useMemo(() => StyleSheet.create({
    wrapper: { marginHorizontal: 16, marginBottom: 10 },
    wrapperCompact: { marginHorizontal: 8 },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 16,
      shadowColor: '#6D28D9',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.07,
      shadowRadius: 14,
      elevation: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardEnded: { backgroundColor: colors.bgAlt, borderColor: colors.borderLight, shadowOpacity: 0.02 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 },
    categoryTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 4 },
    categoryEmoji: { fontSize: 11 },
    categoryLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
    liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
    liveText: { fontSize: 11, fontWeight: '700', color: '#EF4444' },
    topRowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    heartIcon: { fontSize: 18, color: '#F43F5E' },
    heartIconActive: { color: '#F43F5E' },
    heartIconGuest: { color: colors.borderMedium },
    chevron: { fontSize: 20, color: '#C4B5FD', fontWeight: '300', lineHeight: 22 },
    chevronEnded: { color: colors.borderLight },
    endedBadge: { fontSize: 11, fontWeight: '600', color: colors.textFaint },
    title: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 5, lineHeight: 21 },
    titleEnded: { color: colors.textFaint },
    description: { fontSize: 13, color: colors.textMuted, lineHeight: 19, marginBottom: 8 },
    textEnded: { color: colors.borderMedium },
    footer: { gap: 6, marginTop: 4 },
    timeRow: { flexDirection: 'row', alignItems: 'center' },
    timeInline: { fontSize: 12, fontWeight: '700', color: '#7C3AED' },
    timeInlineLive: { color: '#EF4444' },
    timeSep: { fontSize: 12, color: colors.borderMedium },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    locationDot: { width: 5, height: 5, borderRadius: 3, opacity: 0.7 },
    location: { fontSize: 12, color: colors.textFaint, flex: 1 },
    dateLabel: { fontSize: 11, color: colors.textFaint, fontWeight: '500', textTransform: 'capitalize' },
    priceText: { fontSize: 11, fontWeight: '600' },
    priceTextFree: { color: '#7C3AED' },
    priceTextPaid: { color: '#D97706' },
  }), [colors]);

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
              <TouchableOpacity
                onPress={() => {
                  if (!user) {
                    showToast({
                      message: '¡Guardá lo que te gusta!',
                      sub: 'Uníte a la comunidad para no perderte nada 🎉',
                      duration: 6000,
                      actions: [
                        { label: 'Iniciar sesión', onPress: () => router.push('/auth/login') },
                        { label: 'Crear cuenta', onPress: () => router.push('/auth/register') },
                      ],
                    });
                    return;
                  }
                  toggleFav({ eventId: event.id, isFav: !!isFav });
                }}
                disabled={isTogglingFav}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                activeOpacity={0.7}
              >
                {isTogglingFav
                  ? <ActivityIndicator size="small" color="#F43F5E" />
                  : <Text style={[styles.heartIcon, isFav && styles.heartIconActive, !user && styles.heartIconGuest]}>
                      {isFav ? '♥' : '♡'}
                    </Text>
                }
              </TouchableOpacity>
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
            {event.location && (
              <View style={styles.locationRow}>
                <View style={[styles.locationDot, { backgroundColor: isEnded ? '#CBD5E1' : cat.color }]} />
                <Text style={[styles.location, isEnded && styles.textEnded]} numberOfLines={1}>
                  {event.location}
                </Text>
              </View>
            )}
            {event.category !== 'religious' && (() => {
              const priceVal = event.price ?? 'Entrada libre';
              const isFree = priceVal.toLowerCase() === 'entrada libre';
              const priceNode = (
                <Text style={[styles.priceText, isFree ? styles.priceTextFree : styles.priceTextPaid, isEnded && styles.textEnded]}>
                  🎟 {priceVal}
                </Text>
              );
              if (muniName) {
                return (
                  <View style={[styles.locationRow, { justifyContent: 'space-between' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                      <View style={[styles.locationDot, { backgroundColor: isEnded ? '#CBD5E1' : '#A78BFA' }]} />
                      <Text style={[styles.location, isEnded && styles.textEnded]} numberOfLines={1}>
                        {muniName}
                      </Text>
                    </View>
                    {priceNode}
                  </View>
                );
              }
              return (
                <View style={{ alignItems: 'flex-end' }}>
                  {priceNode}
                </View>
              );
            })()}
            {(timeRange || (showDate && event.event_date)) ? (
              <View style={styles.timeRow}>
                {timeRange ? (
                  <Text style={[styles.timeInline, status === 'live' && styles.timeInlineLive, isEnded && styles.textEnded]}>
                    🕐 {timeRange}
                  </Text>
                ) : null}
                {timeRange && showDate && event.event_date ? (
                  <Text style={[styles.timeSep, isEnded && styles.textEnded]}> · </Text>
                ) : null}
                {showDate && event.event_date ? (
                  <Text style={[styles.dateLabel, isEnded && styles.textEnded]}>
                    {new Date(event.event_date + 'T00:00:00').toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}
