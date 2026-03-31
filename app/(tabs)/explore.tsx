import React, { useState, useRef, useEffect, useMemo } from 'react';
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
import { ALL_CATEGORIES, Category, PARISHES, Parish } from '../../constants/categories';
import { Event } from '../../types/event';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function pad(n: number) { return String(n).padStart(2, '0'); }

function ParishFilter({ visible, selectedParish, onSelect }: {
  visible: boolean;
  selectedParish: Parish | 'all';
  onSelect: (p: Parish | 'all') => void;
}) {
  const { colors } = useTheme();
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, { toValue: visible ? 1 : 0, duration: 220, useNativeDriver: false }),
      Animated.timing(opacityAnim, { toValue: visible ? 1 : 0, duration: 180, useNativeDriver: false }),
    ]).start();
  }, [visible]);

  const maxHeight = heightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 54] });
  const pillBase = useMemo(() => ({
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#D97706', backgroundColor: colors.surface, marginRight: 8,
  } as const), [colors]);

  return (
    <Animated.View style={{ height: maxHeight, opacity: opacityAnim, overflow: 'hidden' }}>
      <View style={{ position: 'relative', marginBottom: 2 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 5, alignItems: 'center' }}>
          <TouchableOpacity
            style={[pillBase, selectedParish === 'all' && { backgroundColor: '#B45309', borderColor: '#B45309' }]}
            onPress={() => onSelect('all')} activeOpacity={0.75}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: selectedParish === 'all' ? '#fff' : '#B45309' }}>Todas</Text>
          </TouchableOpacity>
          {PARISHES.map((p) => (
            <TouchableOpacity key={p}
              style={[pillBase, selectedParish === p && { backgroundColor: '#B45309', borderColor: '#B45309' }]}
              onPress={() => onSelect(p)} activeOpacity={0.75}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: selectedParish === p ? '#fff' : '#B45309' }}>{p}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 32, backgroundColor: colors.bg }} pointerEvents="none" />
      </View>
    </Animated.View>
  );
}

function buildDatePills() {
  const today = new Date();
  const pills: { label: string; value: string }[] = [{ label: 'Todos', value: 'all' }];
  for (let i = 0; i < 8; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    let label: string;
    if (i === 0) label = 'Hoy';
    else if (i === 1) label = 'Mañana';
    else label = d.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' });
    pills.push({ label, value });
  }
  return pills;
}

const DATE_PILLS = buildDatePills();

function groupByDate(events: Event[]): Record<string, Event[]> {
  return events.reduce((acc, event) => {
    const date = event.event_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return 'Hoy';
  if (date.toDateString() === tomorrow.toDateString()) return 'Mañana';
  const raw = date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export default function ExploreScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(
    user?.preferences?.category ? new Set([user.preferences.category as Category]) : new Set()
  );
  const [selectedParish, setSelectedParish] = useState<Parish | 'all'>(
    user?.preferences?.parish ?? 'all'
  );
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  function toggleCategory(cat: Category) {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) { next.delete(cat); } else { next.add(cat); }
      if (!next.has('religious')) setSelectedParish('all');
      return next;
    });
  }

  function toggleDate(date: string) {
    setSelectedDates(prev => {
      const next = new Set(prev);
      if (next.has(date)) { next.delete(date); } else { next.add(date); }
      return next;
    });
  }

  const hasReligious = selectedCategories.has('religious');
  const activeCats = selectedCategories.size > 0 ? Array.from(selectedCategories) : undefined;
  const activeDates = selectedDates.size > 0 ? Array.from(selectedDates).sort() : undefined;
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [muniModalOpen, setMuniModalOpen] = useState(false);
  const { data: municipalities } = useMunicipalities();

  useEffect(() => {
    if (!municipalities) return;
    if (selectedMunicipality !== null) return;
    const prefId = user?.preferences?.municipalityId;
    if (prefId != null) {
      const match = municipalities.find(m => m.id === prefId);
      if (match) { setSelectedMunicipality(match); return; }
    }
    const marinilla = municipalities.find(m => m.slug === 'marinilla');
    if (marinilla) setSelectedMunicipality(marinilla);
  }, [municipalities]);

  const { data: rawEvents, isLoading } = useUpcomingEvents(
    activeCats,
    selectedMunicipality?.id,
    undefined,
    activeDates
  );

  const events = rawEvents && selectedParish !== 'all'
    ? rawEvents.filter(e => e.category !== 'religious' || e.parish === selectedParish)
    : rawEvents;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 14, bounciness: 4, useNativeDriver: true }),
    ]).start();
  }, []);

  const filteredEvents = events ?? [];
  const grouped = groupByDate(filteredEvents);
  const dates = Object.keys(grouped).sort();

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    animatedWrapper: { flex: 1 },
    header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    appTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
    appTitleText: { fontSize: 11, fontWeight: '700', color: '#7C3AED', letterSpacing: 1.4 },
    appTitleChevron: { fontSize: 9, color: '#7C3AED', marginTop: 1 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
    headerSub: { fontSize: 13, color: colors.textFaint, marginTop: 2 },
    filterWrap: { position: 'relative', marginBottom: 2 },
    filterContent: { paddingHorizontal: 16, paddingVertical: 5 },
    filterFadeWrap: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 48, flexDirection: 'row' as const },
    datePill: {
      paddingHorizontal: 13, paddingVertical: 6, borderRadius: 20,
      borderWidth: 1.5, borderColor: colors.borderMedium, backgroundColor: colors.surface, marginRight: 8,
    },
    datePillActive: { backgroundColor: colors.text, borderColor: colors.text },
    datePillText: { fontSize: 12, fontWeight: '600', color: colors.textMuted, textTransform: 'capitalize' },
    datePillTextActive: { color: colors.bg },
    centered: { paddingVertical: 60, alignItems: 'center' },
    empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textSub, marginBottom: 6 },
    emptyText: { fontSize: 14, color: colors.textFaint, textAlign: 'center', lineHeight: 20 },
    dateGroup: { marginBottom: 6 },
    dateLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, marginTop: 18, marginBottom: 10 },
    dateDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#C4B5FD' },
    dateLabel: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'capitalize', letterSpacing: 0.3, flex: 1 },
    countBadge: { backgroundColor: colors.surfacePrimary, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
    countBadgeText: { fontSize: 11, fontWeight: '700', color: '#7C3AED' },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    modalSheet: {
      backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
      paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36,
    },
    modalTitle: {
      fontSize: 13, fontWeight: '700', color: colors.textFaint,
      textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12,
    },
    modalOption: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.borderLight,
    },
    modalOptionText: { fontSize: 15, color: colors.textSub, fontWeight: '500' },
    modalOptionTextActive: { color: '#7C3AED', fontWeight: '700' },
    modalCheckmark: { fontSize: 16, color: '#7C3AED', fontWeight: '700' },
  }), [colors]);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.animatedWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMuniModalOpen(true)} activeOpacity={0.7} style={styles.appTitleRow}>
            <Text style={styles.appTitleText}>
              AGENDA
              {selectedMunicipality ? ` · ${selectedMunicipality.name.toUpperCase()}` : ''}
            </Text>
            <Text style={styles.appTitleChevron}>▾</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Explorar</Text>
          <Text style={styles.headerSub}>Próximos eventos</Text>
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

        {/* Category filter */}
        <View style={styles.filterWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
            <CategoryPill category="all" selected={selectedCategories.size === 0} onPress={() => { setSelectedCategories(new Set()); setSelectedParish('all'); }} />
            {ALL_CATEGORIES.map((cat) => (
              <CategoryPill key={cat.id} category={cat.id} selected={selectedCategories.has(cat.id)} onPress={() => toggleCategory(cat.id)} />
            ))}
          </ScrollView>
          <View pointerEvents="none" style={styles.filterFadeWrap}>
            <View style={{ flex: 1, backgroundColor: colors.bg, opacity: 0 }} />
            <View style={{ flex: 1, backgroundColor: colors.bg, opacity: 0.35 }} />
            <View style={{ flex: 1, backgroundColor: colors.bg, opacity: 0.65 }} />
            <View style={{ flex: 1, backgroundColor: colors.bg, opacity: 0.85 }} />
            <View style={{ flex: 1, backgroundColor: colors.bg, opacity: 1 }} />
          </View>
        </View>

        <ParishFilter
          visible={hasReligious}
          selectedParish={selectedParish}
          onSelect={setSelectedParish}
        />

        {/* Date filter */}
        <View style={styles.filterWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
            <TouchableOpacity
              style={[styles.datePill, selectedDates.size === 0 && styles.datePillActive]}
              onPress={() => setSelectedDates(new Set())}
              activeOpacity={0.75}
            >
              <Text style={[styles.datePillText, selectedDates.size === 0 && styles.datePillTextActive]}>Todos</Text>
            </TouchableOpacity>
            {DATE_PILLS.slice(1).map((pill) => (
              <TouchableOpacity
                key={pill.value}
                style={[styles.datePill, selectedDates.has(pill.value) && styles.datePillActive]}
                onPress={() => toggleDate(pill.value)}
                activeOpacity={0.75}
              >
                <Text style={[styles.datePillText, selectedDates.has(pill.value) && styles.datePillTextActive]}>
                  {pill.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View pointerEvents="none" style={styles.filterFadeWrap}>
            <View style={{ flex: 1, backgroundColor: colors.bg, opacity: 0 }} />
            <View style={{ flex: 1, backgroundColor: colors.bg, opacity: 0.35 }} />
            <View style={{ flex: 1, backgroundColor: colors.bg, opacity: 0.65 }} />
            <View style={{ flex: 1, backgroundColor: colors.bg, opacity: 0.85 }} />
            <View style={{ flex: 1, backgroundColor: colors.bg, opacity: 1 }} />
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#7C3AED" />
            </View>
          ) : dates.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🗓️</Text>
              <Text style={styles.emptyTitle}>Sin eventos</Text>
              <Text style={styles.emptyText}>No hay eventos programados para esta selección.</Text>
            </View>
          ) : (
            <>
              {dates.map((date) => (
                <View key={date} style={styles.dateGroup}>
                  <View style={styles.dateLabelRow}>
                    <View style={styles.dateDot} />
                    <Text style={styles.dateLabel}>{formatDate(date)}</Text>
                    <View style={styles.countBadge}>
                      <Text style={styles.countBadgeText}>{grouped[date].length}</Text>
                    </View>
                  </View>
                  {grouped[date].map((event) => (
                    <EventCard key={event.id} event={event} showDate />
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
