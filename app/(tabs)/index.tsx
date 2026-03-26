import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CategoryPill } from '../../components/CategoryPill';
import { EventCard } from '../../components/EventCard';
import { EventHero } from '../../components/EventHero';
import { ALL_CATEGORIES, Category, PARISHES, Parish } from '../../constants/categories';
import { useTodayEvents, useUpcomingEvents, useMunicipalities, Municipality } from '../../hooks/useEvents';
import { useAuth } from '../../context/AuthContext';
import { getTimeStatus } from '../../types/event';

function ParishFilter({ visible, selectedParish, onSelect }: {
  visible: boolean;
  selectedParish: Parish | 'all';
  onSelect: (p: Parish | 'all') => void;
}) {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: visible ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: visible ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  }, [visible]);

  const maxHeight = heightAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 54] });

  return (
    <Animated.View style={{ height: maxHeight, opacity: opacityAnim, overflow: 'hidden' }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' }}
      >
        <TouchableOpacity
          style={[styles.parishPill, selectedParish === 'all' && styles.parishPillActive]}
          onPress={() => onSelect('all')}
          activeOpacity={0.75}
        >
          <Text style={[styles.parishPillText, selectedParish === 'all' && styles.parishPillTextActive]}>Todas</Text>
        </TouchableOpacity>
        {PARISHES.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.parishPill, selectedParish === p && styles.parishPillActive]}
            onPress={() => onSelect(p)}
            activeOpacity={0.75}
          >
            <Text style={[styles.parishPillText, selectedParish === p && styles.parishPillTextActive]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedParish, setSelectedParish] = useState<Parish | 'all'>('all');
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [muniModalOpen, setMuniModalOpen] = useState(false);
  const { data: municipalities } = useMunicipalities();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (municipalities && selectedMunicipality === null) {
      const marinilla = municipalities.find(m => m.slug === 'marinilla');
      if (marinilla) setSelectedMunicipality(marinilla);
    }
  }, [municipalities]);

  const { data: events, isLoading, refetch, isRefetching } = useTodayEvents(
    selectedCategory === 'all' ? undefined : selectedCategory,
    selectedMunicipality?.id,
    selectedCategory === 'religious' && selectedParish !== 'all' ? selectedParish : undefined
  );

  const { data: allUpcoming } = useUpcomingEvents(
    selectedCategory === 'all' ? undefined : selectedCategory,
    selectedMunicipality?.id,
    selectedCategory === 'religious' && selectedParish !== 'all' ? selectedParish : undefined
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 14, bounciness: 4, useNativeDriver: true }),
    ]).start();
  }, []);

  const today = new Date();
  const rawDate = today.toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
  const dateStr = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const featuredEvents = events?.filter(e => e.featured) ?? [];
  const nonFeatured = events?.filter(e => !e.featured) ?? [];

  const liveEvents = nonFeatured.filter(e => getTimeStatus(e.event_time, e.event_time_end) === 'live');
  const upcomingEvents = nonFeatured.filter(e => {
    const s = getTimeStatus(e.event_time, e.event_time_end);
    return s === 'upcoming' || s === 'unknown';
  });
  const endedEvents = nonFeatured.filter(e => getTimeStatus(e.event_time, e.event_time_end) === 'ended');

  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());
  const nothingLeft = !isLoading && liveEvents.length === 0 && upcomingEvents.length === 0;
  const nextDaysEvents = nothingLeft
    ? (allUpcoming ?? []).filter(e => e.event_date > todayStr).slice(0, 5)
    : [];

  const hasFeatured = featuredEvents.length > 0;
  const heroEvent = hasFeatured ? featuredEvents[0] : null;
  const extraFeatured = featuredEvents.slice(1);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.animatedWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Header fijo */}
        <View style={styles.header}>
          <View>
            <TouchableOpacity onPress={() => (municipalities ?? []).length > 0 && setMuniModalOpen(true)} activeOpacity={0.7} style={styles.eyebrowRow}>
              <Text style={styles.headerEyebrow}>{selectedMunicipality ? `Agenda · ${selectedMunicipality.name}` : 'Agenda'}</Text>
              {(municipalities ?? []).length > 0 && <Text style={styles.eyebrowChevron}>▾</Text>}
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Qué hacer hoy</Text>
            <Text style={styles.headerDate}>{dateStr}</Text>
          </View>
          <TouchableOpacity
            style={styles.headerAccent}
            onPress={() => router.push('/(tabs)/profile')}
            activeOpacity={0.75}
          >
            {user ? (
              <Text style={styles.headerAccentText}>
                {(user.full_name ?? user.email).charAt(0).toUpperCase()}
              </Text>
            ) : (
              <Text style={styles.headerAccentText}>👤</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Filtro categorías fijo */}
        <View style={styles.categoriesWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}
          >
            <CategoryPill category="all" selected={selectedCategory === 'all'} onPress={() => { setSelectedCategory('all'); setSelectedParish('all'); }} />
            {ALL_CATEGORIES.map((cat) => (
              <CategoryPill key={cat.id} category={cat.id} selected={selectedCategory === cat.id} onPress={() => { setSelectedCategory(cat.id); setSelectedParish('all'); }} />
            ))}
          </ScrollView>
          <View style={styles.categoriesFade} pointerEvents="none" />
        </View>

        {/* Filtro parroquias con animación de altura */}
        <ParishFilter
          visible={selectedCategory === 'religious'}
          selectedParish={selectedParish}
          onSelect={setSelectedParish}
        />

        {/* Lista de eventos scrollable */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#7C3AED" />}
        >
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#7C3AED" />
            </View>
          ) : events?.length === 0 ? (
            <>
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>📭</Text>
                <Text style={styles.emptyTitle}>Sin eventos hoy</Text>
                <Text style={styles.emptyText}>No hay eventos programados para hoy en esta categoría.</Text>
              </View>
              {nextDaysEvents.length > 0 && (
                <View style={styles.nextDaysSection}>
                  <View style={styles.nextDaysBanner}>
                    <Text style={styles.nextDaysBannerText}>✦ Lo que viene</Text>
                  </View>
                  {nextDaysEvents.map(e => <EventCard key={e.id} event={e} showDate />)}
                </View>
              )}
            </>
          ) : (
            <>
              {heroEvent && (
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <View style={[styles.sectionAccent, { backgroundColor: '#7C3AED' }]} />
                    <Text style={styles.sectionTitle}>Destacado</Text>
                  </View>
                  <EventHero event={heroEvent} isToday />
                  {extraFeatured.map(e => <EventCard key={e.id} event={e} isToday />)}
                </View>
              )}

              {liveEvents.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.liveDot} />
                    <Text style={[styles.sectionTitle, styles.sectionTitleLive]}>En curso ahora</Text>
                    <View style={styles.countBadge}><Text style={styles.countBadgeText}>{liveEvents.length}</Text></View>
                  </View>
                  {liveEvents.map(e => <EventCard key={e.id} event={e} isToday />)}
                </View>
              )}

              {upcomingEvents.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <View style={[styles.sectionAccent, { backgroundColor: '#A78BFA' }]} />
                    <Text style={styles.sectionTitle}>Próximamente</Text>
                    <View style={styles.countBadge}><Text style={styles.countBadgeText}>{upcomingEvents.length}</Text></View>
                  </View>
                  {upcomingEvents.map(e => <EventCard key={e.id} event={e} isToday />)}
                </View>
              )}

              {endedEvents.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <View style={[styles.sectionAccent, { backgroundColor: '#CBD5E1' }]} />
                    <Text style={[styles.sectionTitle, styles.sectionTitleEnded]}>Ya finalizaron</Text>
                  </View>
                  {endedEvents.map(e => <EventCard key={e.id} event={e} isToday />)}
                </View>
              )}

              {nextDaysEvents.length > 0 && (
                <View style={styles.nextDaysSection}>
                  <View style={styles.nextDaysBanner}>
                    <Text style={styles.nextDaysBannerText}>✦ Lo que viene</Text>
                  </View>
                  {nextDaysEvents.map(e => <EventCard key={e.id} event={e} showDate />)}
                </View>
              )}
            </>
          )}

          <View style={{ height: 90 }} />
        </ScrollView>

      </Animated.View>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAF8' },
  animatedWrapper: { flex: 1 },
  header: {
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  headerEyebrow: { fontSize: 11, color: '#A78BFA', fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#0F0A2A', lineHeight: 34, letterSpacing: -0.5 },
  headerDate: { fontSize: 13, color: '#94A3B8', marginTop: 3 },
  headerAccent: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EDE9FE', marginTop: 10, alignItems: 'center', justifyContent: 'center' },
  headerAccentText: { fontSize: 15, fontWeight: '800', color: '#7C3AED' },
  categoriesWrap: { position: 'relative', marginBottom: 4 },
  categoriesFade: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 36, backgroundColor: '#FAFAF8' },
  parishPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, borderColor: '#D97706', backgroundColor: '#fff', marginRight: 8 },
  parishPillActive: { backgroundColor: '#B45309', borderColor: '#B45309' },
  parishPillText: { fontSize: 12, fontWeight: '600', color: '#B45309' },
  parishPillTextActive: { color: '#fff' },
  section: { marginBottom: 4 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, marginBottom: 12, marginTop: 16 },
  sectionAccent: { width: 3, height: 16, borderRadius: 2 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#374151', letterSpacing: 0.1 },
  sectionTitleLive: { color: '#EF4444' },
  sectionTitleEnded: { color: '#94A3B8' },
  countBadge: { backgroundColor: '#EDE9FE', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  countBadgeText: { fontSize: 11, fontWeight: '700', color: '#7C3AED' },
  centered: { paddingVertical: 60, alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 6 },
  emptyText: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
  nextDaysSection: { marginTop: 12 },
  nextDaysBanner: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#EDE9FE',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextDaysBannerText: { fontSize: 13, fontWeight: '700', color: '#7C3AED', letterSpacing: 0.3 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  eyebrowChevron: { fontSize: 10, color: '#A78BFA', fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36 },
  modalTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalOptionText: { fontSize: 15, color: '#374151', fontWeight: '500' },
  modalOptionTextActive: { color: '#7C3AED', fontWeight: '700' },
  modalCheckmark: { fontSize: 16, color: '#7C3AED', fontWeight: '700' },
});
