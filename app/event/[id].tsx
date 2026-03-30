import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEvent, useMunicipalities, useIsFavorite, useToggleFavorite } from '../../hooks/useEvents';
import { CATEGORIES, Category } from '../../constants/categories';
import { getTimeStatus } from '../../types/event';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const STATUS_CONFIG = {
  live:     { label: '● En curso',     bg: '#FEE2E2', color: '#DC2626' },
  upcoming: { label: '◷ Por comenzar', bg: '#EDE9FE', color: '#7C3AED' },
  ended:    { label: '✓ Finalizado',   bg: '#F3F4F6', color: '#6B7280' },
  unknown:  null,
};

function formatTime(t: string) {
  const [h, m] = t.split(':');
  return `${h}:${m}`;
}

function calcDuration(start: string, end: string): string {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);
  if (mins <= 0) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: event, isLoading } = useEvent(Number(id));
  const { data: municipalities } = useMunicipalities();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { data: isFav } = useIsFavorite(Number(id));
  const { mutate: toggleFav, isPending: isTogglingFav } = useToggleFavorite();

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    notFound: { fontSize: 16, color: colors.textMuted },
    heroBanner: { padding: 24, paddingTop: 32, paddingBottom: 32 },
    heroEmoji: { fontSize: 40, marginBottom: 12 },
    catTag: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(255,255,255,0.25)',
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10,
    },
    catTagText: { color: '#fff', fontWeight: '700', fontSize: 11, letterSpacing: 0.5 },
    heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', lineHeight: 30 },
    statusBadge: { alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    statusBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    body: { padding: 20 },
    metaCard: {
      backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden', marginBottom: 20,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    metaRow: {
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
      borderBottomWidth: 1, borderBottomColor: colors.borderLight, gap: 14,
    },
    metaEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
    metaTextContainer: { flex: 1 },
    metaLabel: { fontSize: 11, color: colors.textFaint, fontWeight: '600', marginBottom: 2 },
    metaValueRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    metaValue: { fontSize: 14, color: colors.textSub, fontWeight: '600' },
    durationPill: { backgroundColor: colors.surfaceAlt, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
    durationPillText: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
    inlineStatus: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
    inlineStatusText: { fontSize: 11, fontWeight: '700' },
    descriptionSection: { marginBottom: 16 },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 10 },
    description: { fontSize: 15, color: colors.textMuted, lineHeight: 24 },
    actionRow: { flexDirection: 'row', marginHorizontal: 20, marginTop: 4, gap: 10 },
    favBtn: {
      flex: 1, backgroundColor: '#FFF1F2', borderRadius: 14, paddingVertical: 14,
      alignItems: 'center', borderWidth: 1.5, borderColor: '#FECDD3',
    },
    favBtnActive: { backgroundColor: '#F43F5E', borderColor: '#F43F5E' },
    favBtnText: { color: '#F43F5E', fontWeight: '700', fontSize: 15 },
    favBtnTextActive: { color: '#fff' },
    shareBtn: {
      flex: 1, backgroundColor: colors.surfacePrimaryLight, borderRadius: 14, paddingVertical: 14,
      alignItems: 'center', borderWidth: 1.5, borderColor: colors.borderPrimary,
    },
    shareBtnCompact: { flex: 1 },
    shareBtnText: { color: '#7C3AED', fontWeight: '700', fontSize: 15 },
  }), [colors]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }
  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Evento no encontrado</Text>
      </View>
    );
  }

  const cat = CATEGORIES[event.category as Category] ?? {
    label: event.category, color: '#6B7280', bgColor: '#F3F4F6', emoji: '📌',
  };

  const dateObj = new Date(event.event_date + 'T00:00:00');
  const dateFormatted = dateObj.toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const dateCapitalized = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);

  const timeStatus = getTimeStatus(event.event_time, event.event_time_end, event.event_date);
  const statusCfg = STATUS_CONFIG[timeStatus];

  const timeLabel = event.event_time
    ? event.event_time_end
      ? `${formatTime(event.event_time)} — ${formatTime(event.event_time_end)} hs`
      : `${formatTime(event.event_time)} hs`
    : null;

  const duration = event.event_time && event.event_time_end
    ? calcDuration(event.event_time, event.event_time_end)
    : null;

  async function handleShare() {
    try {
      await Share.share({
        message: `${event.title} — ${dateCapitalized}${event.location ? ` · ${event.location}` : ''}`,
        title: event.title,
      });
    } catch {}
  }

  const muniName = event.municipality_id
    ? (municipalities ?? []).find(m => m.id === event.municipality_id)?.name ?? null
    : null;

  const metaRows = [
    { emoji: '📅', label: 'Fecha', value: dateCapitalized, extra: null },
    timeLabel
      ? { emoji: '🕐', label: 'Horario', value: timeLabel, extra: duration ? `${duration}` : null }
      : null,
    event.location ? { emoji: '📍', label: 'Lugar', value: event.location, extra: null } : null,
    event.address  ? { emoji: '🗺️', label: 'Dirección', value: event.address, extra: null } : null,
    event.category !== 'religious' ? { emoji: '🎟️', label: 'Entrada', value: event.price ?? 'Entrada libre', extra: null } : null,
    muniName       ? { emoji: '🏛️', label: 'Municipalidad', value: muniName, extra: null } : null,
  ].filter(Boolean) as { emoji: string; label: string; value: string; extra: string | null }[];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.heroBanner, { backgroundColor: cat.color }]}>
        <Text style={styles.heroEmoji}>{cat.emoji}</Text>
        <View style={styles.catTag}>
          <Text style={styles.catTagText}>{cat.emoji}  {cat.label}</Text>
        </View>
        <Text style={styles.heroTitle}>{event.title}</Text>

        {statusCfg && (
          <View style={[styles.statusBadge, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
            <Text style={styles.statusBadgeText}>{statusCfg.label}</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.metaCard}>
          {metaRows.map((row, i) => (
            <View
              key={row.label}
              style={[styles.metaRow, i === metaRows.length - 1 && { borderBottomWidth: 0 }]}
            >
              <Text style={styles.metaEmoji}>{row.emoji}</Text>
              <View style={styles.metaTextContainer}>
                <Text style={styles.metaLabel}>{row.label}</Text>
                <View style={styles.metaValueRow}>
                  <Text style={styles.metaValue}>{row.value}</Text>
                  {row.extra && (
                    <View style={styles.durationPill}>
                      <Text style={styles.durationPillText}>{row.extra}</Text>
                    </View>
                  )}
                </View>
              </View>
              {row.label === 'Horario' && statusCfg && (
                <View style={[styles.inlineStatus, { backgroundColor: statusCfg.bg }]}>
                  <Text style={[styles.inlineStatusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {event.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Sobre el evento</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionRow}>
        {user && (
          <TouchableOpacity
            style={[styles.favBtn, isFav && styles.favBtnActive]}
            onPress={() => toggleFav({ eventId: event.id, isFav: !!isFav })}
            activeOpacity={0.75}
            disabled={isTogglingFav}
          >
            {isTogglingFav
              ? <ActivityIndicator size="small" color={isFav ? '#fff' : '#F43F5E'} />
              : <Text style={[styles.favBtnText, isFav && styles.favBtnTextActive]}>
                  {isFav ? '♥  Guardado' : '♡  Guardar'}
                </Text>
            }
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.shareBtn, user && styles.shareBtnCompact]}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Text style={styles.shareBtnText}>Compartir</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}
