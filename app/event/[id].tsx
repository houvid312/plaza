import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEvent, useMunicipalities } from '../../hooks/useEvents';
import { CATEGORIES, Category } from '../../constants/categories';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: event, isLoading } = useEvent(Number(id));
  const { data: municipalities } = useMunicipalities();

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
    label: event.category,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    emoji: '📌',
  };

  const dateObj = new Date(event.event_date + 'T00:00:00');
  const dateFormatted = dateObj.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  async function handleShare() {
    try {
      await Share.share({
        message: `${event.title} — ${dateFormatted}${event.location ? ` · ${event.location}` : ''}`,
        title: event.title,
      });
    } catch {}
  }

  const muniName = event.municipality_id
    ? (municipalities ?? []).find(m => m.id === event.municipality_id)?.name ?? null
    : null;

  const metaRows = [
    { emoji: '📅', label: 'Fecha', value: dateFormatted },
    event.event_time ? { emoji: '🕐', label: 'Hora', value: `${event.event_time} hs` } : null,
    event.location ? { emoji: '📍', label: 'Lugar', value: event.location } : null,
    event.address ? { emoji: '🗺️', label: 'Dirección', value: event.address } : null,
    muniName ? { emoji: '🏛️', label: 'Municipalidad', value: muniName } : null,
  ].filter(Boolean) as { emoji: string; label: string; value: string }[];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.heroBanner, { backgroundColor: cat.color }]}>
        <Text style={styles.heroEmoji}>{cat.emoji}</Text>
        <View style={styles.catTag}>
          <Text style={styles.catTagText}>{cat.emoji}  {cat.label}</Text>
        </View>
        <Text style={styles.heroTitle}>{event.title}</Text>
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
                <Text style={styles.metaValue}>{row.value}</Text>
              </View>
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

      <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
        <Text style={styles.shareBtnText}>Compartir evento</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  notFound: { fontSize: 16, color: '#6B7280' },
  heroBanner: { padding: 24, paddingTop: 32, paddingBottom: 32 },
  heroEmoji: { fontSize: 40, marginBottom: 12 },
  catTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 10,
  },
  catTagText: { color: '#fff', fontWeight: '700', fontSize: 11, letterSpacing: 0.5 },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', lineHeight: 30 },
  body: { padding: 20 },
  metaCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 14,
  },
  metaEmoji: { fontSize: 20, width: 28, textAlign: 'center' },
  metaTextContainer: { flex: 1 },
  metaLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', marginBottom: 2 },
  metaValue: { fontSize: 14, color: '#374151', fontWeight: '600' },
  descriptionSection: { marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 10 },
  description: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
  shareBtn: {
    marginHorizontal: 20,
    marginTop: 4,
    backgroundColor: '#F5F3FF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
  },
  shareBtnText: { color: '#7C3AED', fontWeight: '700', fontSize: 15 },
});
