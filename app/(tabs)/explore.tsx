import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { useUpcomingEvents, useMunicipalities, Municipality } from '../../hooks/useEvents';
import { EventCard } from '../../components/EventCard';
import { CategoryPill } from '../../components/CategoryPill';
import { ALL_CATEGORIES, Category } from '../../constants/categories';
import { Event } from '../../types/event';

function groupByDate(events: Event[]): Record<string, Event[]> {
  return events.reduce(
    (acc, event) => {
      const date = event.event_date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(event);
      return acc;
    },
    {} as Record<string, Event[]>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return 'Hoy';
  if (date.toDateString() === tomorrow.toDateString()) return 'Mañana';
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export default function ExploreScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [muniModalOpen, setMuniModalOpen] = useState(false);
  const { data: municipalities } = useMunicipalities();

  useEffect(() => {
    if (municipalities && selectedMunicipality === null) {
      const marinilla = municipalities.find(m => m.slug === 'marinilla');
      if (marinilla) setSelectedMunicipality(marinilla);
    }
  }, [municipalities]);
  const { data: events, isLoading } = useUpcomingEvents(
    selectedCategory === 'all' ? undefined : selectedCategory,
    selectedMunicipality?.id
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 14,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const grouped = events ? groupByDate(events) : {};
  const dates = Object.keys(grouped).sort();

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View
        style={[
          styles.animatedWrapper,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explorar</Text>
          <View style={styles.headerSubRow}>
            <Text style={styles.headerSub}>Próximos eventos</Text>
            {(municipalities ?? []).length > 0 && (
              <TouchableOpacity onPress={() => setMuniModalOpen(true)} activeOpacity={0.7} style={styles.muniChip}>
                <Text style={styles.muniChipText}>{selectedMunicipality ? selectedMunicipality.name : 'Todas'}</Text>
                <Text style={styles.muniChipChevron}>▾</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Modal visible={muniModalOpen} transparent animationType="fade" onRequestClose={() => setMuniModalOpen(false)}>
          <Pressable style={styles.modalBackdrop} onPress={() => setMuniModalOpen(false)}>
            <Pressable style={styles.modalSheet} onPress={() => {}}>
              <Text style={styles.modalTitle}>Municipalidad</Text>
              <TouchableOpacity style={styles.modalOption} onPress={() => { setSelectedMunicipality(null); setMuniModalOpen(false); }} activeOpacity={0.75}>
                <Text style={[styles.modalOptionText, selectedMunicipality === null && styles.modalOptionTextActive]}>Todas</Text>
                {selectedMunicipality === null && <Text style={styles.modalCheckmark}>✓</Text>}
              </TouchableOpacity>
              {(municipalities ?? []).map(m => (
                <TouchableOpacity key={m.id} style={styles.modalOption} onPress={() => { setSelectedMunicipality(m); setMuniModalOpen(false); }} activeOpacity={0.75}>
                  <Text style={[styles.modalOptionText, selectedMunicipality?.id === m.id && styles.modalOptionTextActive]}>{m.name}</Text>
                  {selectedMunicipality?.id === m.id && <Text style={styles.modalCheckmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </Pressable>
          </Pressable>
        </Modal>

        <View style={styles.categoriesWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 6 }}
          >
            <CategoryPill
              category="all"
              selected={selectedCategory === 'all'}
              onPress={() => setSelectedCategory('all')}
            />
            {ALL_CATEGORIES.map((cat) => (
              <CategoryPill
                key={cat.id}
                category={cat.id}
                selected={selectedCategory === cat.id}
                onPress={() => setSelectedCategory(cat.id)}
              />
            ))}
          </ScrollView>
          <View style={styles.categoriesFade} pointerEvents="none" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#7C3AED" />
            </View>
          ) : dates.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🗓️</Text>
              <Text style={styles.emptyTitle}>Sin eventos próximos</Text>
              <Text style={styles.emptyText}>
                No hay eventos programados en esta categoría.
              </Text>
            </View>
          ) : (
            <>
              {dates.map((date) => (
                <View key={date} style={styles.dateGroup}>
                  <View style={styles.dateLabelRow}>
                    <View style={styles.dateDot} />
                    <Text style={styles.dateLabel}>{formatDate(date)}</Text>
                  </View>
                  {grouped[date].map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </View>
              ))}
              <View style={{ height: 90 }} />
            </>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAF8' },
  animatedWrapper: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F0A2A',
    letterSpacing: -0.5,
  },
  headerSub: { fontSize: 13, color: '#94A3B8' },
  headerSubRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 3 },
  muniChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#EDE9FE', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  muniChipText: { fontSize: 11, fontWeight: '700', color: '#7C3AED', letterSpacing: 0.2 },
  muniChipChevron: { fontSize: 9, color: '#7C3AED' },
  categoriesWrap: { height: 52, marginBottom: 4, position: 'relative' as const },
  categoriesFade: { position: 'absolute' as const, right: 0, top: 0, bottom: 0, width: 36, backgroundColor: '#FAFAF8' },
  centered: { paddingVertical: 60, alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 6 },
  emptyText: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
  dateGroup: { marginBottom: 6 },
  dateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 10,
  },
  dateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C4B5FD',
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36 },
  modalTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalOptionText: { fontSize: 15, color: '#374151', fontWeight: '500' },
  modalOptionTextActive: { color: '#7C3AED', fontWeight: '700' },
  modalCheckmark: { fontSize: 16, color: '#7C3AED', fontWeight: '700' },
});
