import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Animated,
  Linking,
  Modal,
  Platform,
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
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';

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

  const pillStyle = useMemo(() => ({
    base: {
      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
      borderWidth: 1.5, borderColor: '#D97706', backgroundColor: colors.surface, marginRight: 8,
    } as const,
    active: { backgroundColor: '#B45309', borderColor: '#B45309' } as const,
  }), [colors]);

  return (
    <Animated.View style={{ height: maxHeight, opacity: opacityAnim, overflow: 'hidden' }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' }}
      >
        <TouchableOpacity
          style={[pillStyle.base, selectedParish === 'all' && pillStyle.active]}
          onPress={() => onSelect('all')}
          activeOpacity={0.75}
        >
          <Text style={{ fontSize: 12, fontWeight: '600', color: selectedParish === 'all' ? '#fff' : '#B45309' }}>Todas</Text>
        </TouchableOpacity>
        {PARISHES.map((p) => (
          <TouchableOpacity
            key={p}
            style={[pillStyle.base, selectedParish === p && pillStyle.active]}
            onPress={() => onSelect(p)}
            activeOpacity={0.75}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: selectedParish === p ? '#fff' : '#B45309' }}>{p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const { isPlaying, toggle: toggleAudio } = useAudio();
  const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(
    user?.preferences?.category ? new Set([user.preferences.category as Category]) : new Set()
  );
  const [selectedParish, setSelectedParish] = useState<Parish | 'all'>(
    user?.preferences?.parish ?? 'all'
  );

  function toggleCategory(cat: Category) {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) { next.delete(cat); } else { next.add(cat); }
      if (!next.has('religious')) setSelectedParish('all');
      return next;
    });
  }

  function clearCategories() {
    setSelectedCategories(new Set());
    setSelectedParish('all');
  }
  const [showEnded, setShowEnded] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [muniModalOpen, setMuniModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const { data: municipalities } = useMunicipalities();
  const router = useRouter();

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

  const activeCats = selectedCategories.size > 0 ? Array.from(selectedCategories) : undefined;
  const hasReligious = selectedCategories.has('religious');

  const { data: rawEvents, isLoading, refetch, isRefetching } = useTodayEvents(
    activeCats,
    selectedMunicipality?.id,
  );

  const { data: allUpcoming } = useUpcomingEvents(
    activeCats,
    selectedMunicipality?.id,
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

  const thumbAnim = useRef(new Animated.Value(isDark ? 14 : 0)).current;
  useEffect(() => {
    Animated.spring(thumbAnim, {
      toValue: isDark ? 14 : 0,
      useNativeDriver: true,
      speed: 22,
      bounciness: 5,
    }).start();
  }, [isDark]);

  const today = new Date();
  const rawDate = today.toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
  const dateStr = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const featuredEvents = events?.filter(e => {
    if (!e.featured) return false;
    return getTimeStatus(e.event_time, e.event_time_end, e.event_date) !== 'ended';
  }) ?? [];

  const nonFeaturedPool = events?.filter(e => {
    if (!e.featured) return true;
    return getTimeStatus(e.event_time, e.event_time_end, e.event_date) === 'ended';
  }) ?? [];

  const liveEvents = nonFeaturedPool.filter(e => getTimeStatus(e.event_time, e.event_time_end, e.event_date) === 'live');
  const upcomingEvents = nonFeaturedPool.filter(e => {
    const s = getTimeStatus(e.event_time, e.event_time_end, e.event_date);
    return s === 'upcoming' || s === 'unknown';
  });
  const endedEvents = nonFeaturedPool.filter(e => getTimeStatus(e.event_time, e.event_time_end, e.event_date) === 'ended');

  const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());
  const nothingLeft = !isLoading && liveEvents.length === 0 && upcomingEvents.length === 0;
  const nextDaysEvents = nothingLeft
    ? (allUpcoming ?? []).filter(e => e.event_date > todayStr).slice(0, 5)
    : [];

  const hasFeatured = featuredEvents.length > 0;
  const heroEvent = hasFeatured ? featuredEvents[0] : null;
  const extraFeatured = featuredEvents.slice(1);

  const fewEvents = !isLoading && events && events.length > 0 && (liveEvents.length + upcomingEvents.length) <= 3;
  const isNonMarinilla = selectedMunicipality !== null && selectedMunicipality.slug !== 'marinilla';

  function handleContact() {
    setContactModalOpen(true);
  }

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    animatedWrapper: { flex: 1 },
    header: {
      paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    },
    headerEyebrow: { fontSize: 11, color: '#C9A96E', fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' },
    headerTitle: { fontSize: 28, fontWeight: '800', color: colors.text, lineHeight: 34, letterSpacing: -0.5 },
    headerDate: { fontSize: 13, color: colors.textFaint, marginTop: 3 },
    headerRight: { alignItems: 'flex-end', gap: 7, paddingLeft: 10 },
    headerRightRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    contactBtn: {
      paddingHorizontal: 12, paddingVertical: 7, borderRadius: 19,
      backgroundColor: colors.surfacePrimaryLight,
      borderWidth: 1.5, borderColor: colors.borderPrimary,
    },
    contactBtnText: { fontSize: 12, fontWeight: '700', color: '#B87333', letterSpacing: 0.2 },
    headerIconBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.surfacePrimary, alignItems: 'center', justifyContent: 'center',
    },
    headerAccentText: { fontSize: 14, fontWeight: '800', color: '#B87333' },
    themeSwitch: {
      backgroundColor: colors.surfacePrimary,
      borderRadius: 18,
      paddingHorizontal: 10, paddingVertical: 7,
      borderWidth: 1, borderColor: colors.borderPrimary,
      alignItems: 'center', justifyContent: 'center',
    },
    themeSwitchTrack: {
      width: 34, height: 20, borderRadius: 10,
      backgroundColor: colors.borderMedium,
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    themeSwitchTrackOn: { backgroundColor: '#B87333' },
    themeSwitchThumb: {
      width: 16, height: 16, borderRadius: 8,
      backgroundColor: '#fff',
      alignItems: 'center', justifyContent: 'center',
      alignSelf: 'flex-start',
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15, shadowRadius: 2, elevation: 2,
    },
    contactSheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24, borderTopRightRadius: 24,
      paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36,
    },
    contactHandle: {
      width: 36, height: 4, borderRadius: 2,
      backgroundColor: colors.borderMedium,
      alignSelf: 'center', marginBottom: 20,
    },
    contactSheetTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 4 },
    contactSheetSubtitle: { fontSize: 13, color: colors.textFaint, marginBottom: 20 },
    contactCard: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.bg, borderRadius: 16, padding: 14, marginBottom: 10,
      borderWidth: 1, borderColor: colors.borderLight, gap: 12,
    },
    contactCardIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    contactCardEmoji: { fontSize: 22 },
    contactCardBody: { flex: 1 },
    contactCardLabel: { fontSize: 11, fontWeight: '600', color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
    contactCardValue: { fontSize: 14, fontWeight: '700', color: colors.text },
    contactCardArrow: { fontSize: 22, color: '#D4B483', fontWeight: '300' },
    contactCloseBtn: {
      marginTop: 16, paddingVertical: 14, borderRadius: 14,
      backgroundColor: colors.surfacePrimaryLight, alignItems: 'center',
      borderWidth: 1.5, borderColor: colors.borderPrimary,
    },
    contactCloseBtnText: { fontSize: 15, fontWeight: '700', color: '#B87333' },
    categoriesWrap: { position: 'relative', marginBottom: 4 },
    categoriesFadeWrap: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 48, flexDirection: 'row' as const },
    endedToggleText: { fontSize: 12, color: colors.textFaint, fontWeight: '600' as const },
    section: { marginBottom: 4 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, marginBottom: 12, marginTop: 16 },
    sectionAccent: { width: 3, height: 16, borderRadius: 2 },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textSub, letterSpacing: 0.1 },
    sectionTitleLive: { color: '#EF4444' },
    sectionTitleEnded: { color: colors.textFaint },
    countBadge: { backgroundColor: colors.surfacePrimary, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
    countBadgeText: { fontSize: 11, fontWeight: '700', color: '#B87333' },
    centered: { paddingVertical: 60, alignItems: 'center' },
    empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textSub, marginBottom: 6 },
    emptyText: { fontSize: 14, color: colors.textFaint, textAlign: 'center', lineHeight: 20 },
    nextDaysSection: { marginTop: 12 },
    nextDaysBanner: {
      marginHorizontal: 16, marginBottom: 12, paddingHorizontal: 14, paddingVertical: 10,
      backgroundColor: colors.surfacePrimary, borderRadius: 12,
      flexDirection: 'row', alignItems: 'center',
    },
    nextDaysBannerText: { fontSize: 13, fontWeight: '700', color: '#B87333', letterSpacing: 0.3 },
    eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
    eyebrowChevron: { fontSize: 10, color: '#C9A96E', fontWeight: '700' },
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
    modalOptionTextActive: { color: '#B87333', fontWeight: '700' },
    modalCheckmark: { fontSize: 16, color: '#B87333', fontWeight: '700' },
    exploreBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      marginHorizontal: 20, marginTop: 24, paddingVertical: 14, borderRadius: 14,
      borderWidth: 1.5, borderColor: colors.borderPrimary, backgroundColor: colors.bg,
    },
    exploreBtnText: { fontSize: 14, fontWeight: '600', color: '#B87333', letterSpacing: 0.2 },
    exploreBtnArrow: { fontSize: 14, color: '#C9A96E' },
    comingSoonWrap: { alignItems: 'center', paddingHorizontal: 36, paddingVertical: 72 },
    comingSoonEmoji: { fontSize: 52, marginBottom: 16 },
    comingSoonTitle: { fontSize: 18, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 10, lineHeight: 24 },
    comingSoonText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
    comingSoonBtn: {
      paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14,
      backgroundColor: colors.surfacePrimaryLight, borderWidth: 1.5, borderColor: colors.borderPrimary,
    },
    comingSoonBtnText: { fontSize: 14, fontWeight: '700', color: '#B87333' },
  }), [colors]);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.animatedWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Header fijo */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => (municipalities ?? []).length > 0 && setMuniModalOpen(true)} activeOpacity={0.7} style={styles.eyebrowRow}>
              <Text style={styles.headerEyebrow}>{selectedMunicipality ? `El pulso · ${selectedMunicipality.name}` : 'El pulso del presente'}</Text>
              {(municipalities ?? []).length > 0 && <Text style={styles.eyebrowChevron}>▾</Text>}
            </TouchableOpacity>
            <Text style={styles.headerTitle}>El Latido</Text>
            <Text style={styles.headerDate}>{dateStr}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.themeSwitch} onPress={toggleTheme} activeOpacity={0.85}>
              <View style={[styles.themeSwitchTrack, isDark && styles.themeSwitchTrackOn]}>
                <Animated.View style={[styles.themeSwitchThumb, { transform: [{ translateX: thumbAnim }] }]}>
                  <Text style={{ fontSize: 10 }}>{isDark ? '🌙' : '☀️'}</Text>
                </Animated.View>
              </View>
            </TouchableOpacity>
            <View style={styles.headerRightRow}>
              <TouchableOpacity style={styles.headerIconBtn} onPress={toggleAudio} activeOpacity={0.75}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 1.5 }}>
                  <View style={{ width: 2.5, height: isPlaying ? 12 : 4, borderRadius: 1, backgroundColor: '#B87333' }} />
                  <View style={{ width: 2.5, height: isPlaying ? 7 : 4, borderRadius: 1, backgroundColor: '#B87333' }} />
                  <View style={{ width: 2.5, height: isPlaying ? 16 : 4, borderRadius: 1, backgroundColor: '#B87333' }} />
                  <View style={{ width: 2.5, height: isPlaying ? 9 : 4, borderRadius: 1, backgroundColor: '#B87333' }} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.push('/intro')} activeOpacity={0.75}>
                <Text style={{ fontSize: 18 }}>🧭</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactBtn} onPress={handleContact} activeOpacity={0.75}>
                <Text style={styles.contactBtnText}>Contacto</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.push('/(tabs)/profile')} activeOpacity={0.75}>
                <Text style={styles.headerAccentText}>
                  {user ? (user.full_name ?? user.email).charAt(0).toUpperCase() : '👤'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Filtro categorías fijo */}
        <View style={styles.categoriesWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}
          >
            <CategoryPill category="all" selected={selectedCategories.size === 0} onPress={clearCategories} />
            {ALL_CATEGORIES.map((cat) => (
              <CategoryPill key={cat.id} category={cat.id} selected={selectedCategories.has(cat.id)} onPress={() => toggleCategory(cat.id)} />
            ))}
          </ScrollView>
          <View pointerEvents="none" style={styles.categoriesFadeWrap}>
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

        {/* Lista de eventos scrollable */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#B87333" />}
        >
          {isNonMarinilla ? (
            <View style={styles.comingSoonWrap}>
              <Text style={styles.comingSoonEmoji}>🗺️</Text>
              <Text style={styles.comingSoonTitle}>
                Por ahora no hemos llegado a {selectedMunicipality!.name}
              </Text>
              <Text style={styles.comingSoonText}>
                Si querés sumar eventos de tu municipio, escribime y lo armamos juntos.
              </Text>
              <TouchableOpacity style={styles.comingSoonBtn} onPress={handleContact} activeOpacity={0.75}>
                <Text style={styles.comingSoonBtnText}>✉️  davidgg312@gmail.com</Text>
              </TouchableOpacity>
            </View>
          ) : isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#B87333" />
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
                    <Text style={styles.nextDaysBannerText}>✦ Próximas frecuencias</Text>
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
                    <View style={[styles.sectionAccent, { backgroundColor: '#B87333' }]} />
                    <Text style={styles.sectionTitle}>Resonancia destacada</Text>
                  </View>
                  <EventHero event={heroEvent} isToday />
                  {extraFeatured.map(e => <EventCard key={e.id} event={e} isToday />)}
                </View>
              )}

              {liveEvents.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.liveDot} />
                    <Text style={[styles.sectionTitle, styles.sectionTitleLive]}>Resonando ahora</Text>
                    <View style={styles.countBadge}><Text style={styles.countBadgeText}>{liveEvents.length}</Text></View>
                  </View>
                  {liveEvents.map(e => <EventCard key={e.id} event={e} isToday />)}
                </View>
              )}

              {upcomingEvents.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionTitleRow}>
                    <View style={[styles.sectionAccent, { backgroundColor: '#C9A96E' }]} />
                    <Text style={styles.sectionTitle}>Próximas vibraciones</Text>
                    <View style={styles.countBadge}><Text style={styles.countBadgeText}>{upcomingEvents.length}</Text></View>
                  </View>
                  {upcomingEvents.map(e => <EventCard key={e.id} event={e} isToday />)}
                </View>
              )}

              {endedEvents.length > 0 && (
                <View style={styles.section}>
                  <TouchableOpacity style={styles.sectionTitleRow} onPress={() => setShowEnded(v => !v)} activeOpacity={0.7}>
                    <View style={[styles.sectionAccent, { backgroundColor: '#CBD5E1' }]} />
                    <Text style={[styles.sectionTitle, styles.sectionTitleEnded]}>Ecos del día</Text>
                    <View style={styles.countBadge}><Text style={styles.countBadgeText}>{endedEvents.length}</Text></View>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.endedToggleText}>{showEnded ? '▲ Ocultar' : '▼ Ver'}</Text>
                  </TouchableOpacity>
                  {showEnded && endedEvents.map(e => <EventCard key={e.id} event={e} isToday />)}
                </View>
              )}

              {nextDaysEvents.length > 0 && (
                <View style={styles.nextDaysSection}>
                  <View style={styles.nextDaysBanner}>
                    <Text style={styles.nextDaysBannerText}>✦ Próximas frecuencias</Text>
                  </View>
                  {nextDaysEvents.map(e => <EventCard key={e.id} event={e} showDate />)}
                </View>
              )}
            </>
          )}

          {fewEvents && !isNonMarinilla && (
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => router.push('/(tabs)/explore')}
              activeOpacity={0.75}
            >
              <Text style={styles.exploreBtnText}>Ver más eventos</Text>
              <Text style={styles.exploreBtnArrow}>→</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 90 }} />
        </ScrollView>

      </Animated.View>

      {/* Modal de contacto */}
      <Modal visible={contactModalOpen} transparent animationType="slide" onRequestClose={() => setContactModalOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setContactModalOpen(false)}>
          <Pressable style={styles.contactSheet} onPress={() => {}}>
            <View style={styles.contactHandle} />
            <Text style={styles.contactSheetTitle}>Contáctame</Text>
            <Text style={styles.contactSheetSubtitle}>Elegí cómo querés escribirme</Text>

            <TouchableOpacity
              style={styles.contactCard}
              onPress={() => { setContactModalOpen(false); Linking.openURL('mailto:davidgg312@gmail.com'); }}
              activeOpacity={0.75}
            >
              <View style={[styles.contactCardIcon, { backgroundColor: '#F5EDE0' }]}>
                <Text style={styles.contactCardEmoji}>✉️</Text>
              </View>
              <View style={styles.contactCardBody}>
                <Text style={styles.contactCardLabel}>Correo electrónico</Text>
                <Text style={styles.contactCardValue}>davidgg312@gmail.com</Text>
              </View>
              <Text style={styles.contactCardArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactCard, { marginBottom: 0 }]}
              onPress={() => { setContactModalOpen(false); Linking.openURL('https://wa.me/573013483381'); }}
              activeOpacity={0.75}
            >
              <View style={[styles.contactCardIcon, { backgroundColor: '#DCFCE7' }]}>
                <Text style={styles.contactCardEmoji}>💬</Text>
              </View>
              <View style={styles.contactCardBody}>
                <Text style={styles.contactCardLabel}>WhatsApp</Text>
                <Text style={styles.contactCardValue}>+57 301 348 3381</Text>
              </View>
              <Text style={styles.contactCardArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCloseBtn} onPress={() => setContactModalOpen(false)} activeOpacity={0.75}>
              <Text style={styles.contactCloseBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

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
