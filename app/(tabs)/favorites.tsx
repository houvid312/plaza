import React, { useRef, useEffect, useState, useMemo } from 'react';
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
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useFavorites, useMunicipalities, Municipality } from '../../hooks/useEvents';
import { EventCard } from '../../components/EventCard';
import { CategoryPill } from '../../components/CategoryPill';
import { ALL_CATEGORIES, Category, PARISHES, Parish } from '../../constants/categories';
import { Event } from '../../types/event';
import { useTheme } from '../../context/ThemeContext';

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

export default function FavoritesScreen() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: events, isLoading: eventsLoading } = useFavorites();
  const { data: municipalities } = useMunicipalities();
  const router = useRouter();
  const { colors } = useTheme();

  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedParish, setSelectedParish] = useState<Parish | 'all'>('all');
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [muniModalOpen, setMuniModalOpen] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 14, bounciness: 4, useNativeDriver: true }),
    ]).start();
  }, []);

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    animatedWrapper: { flex: 1 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
    headerEyebrow: { fontSize: 11, fontWeight: '700', color: '#F43F5E', letterSpacing: 1.4 },
    eyebrowChevron: { fontSize: 10, color: '#F43F5E', fontWeight: '700' },
    headerTitle: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
    headerSub: { fontSize: 13, color: colors.textFaint, marginTop: 2 },
    filterWrap: { position: 'relative', marginBottom: 2 },
    filterContent: { paddingHorizontal: 16, paddingVertical: 5 },
    filterFade: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 32, backgroundColor: colors.bg },
    parishPill: {
      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
      borderWidth: 1.5, borderColor: '#D97706', backgroundColor: colors.surface, marginRight: 8,
    },
    parishPillActive: { backgroundColor: '#B45309', borderColor: '#B45309' },
    parishPillText: { fontSize: 12, fontWeight: '600', color: '#B45309' },
    parishPillTextActive: { color: '#fff' },
    empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
    emptyEmoji: { fontSize: 52, marginBottom: 12, color: '#F43F5E' },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textSub, marginBottom: 6 },
    emptyText: { fontSize: 14, color: colors.textFaint, textAlign: 'center', lineHeight: 20 },
    dateGroup: { marginBottom: 6 },
    dateLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, marginTop: 18, marginBottom: 10 },
    dateDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#FDA4AF' },
    dateLabel: { fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'capitalize', letterSpacing: 0.3, flex: 1 },
    countBadge: { backgroundColor: '#FFF1F2', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
    countBadgeText: { fontSize: 11, fontWeight: '700', color: '#F43F5E' },
    guestContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    guestIconWrap: {
      width: 90, height: 90, borderRadius: 28, backgroundColor: '#FFF1F2',
      alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    },
    guestEmoji: { fontSize: 44, color: '#F43F5E' },
    guestTitle: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 8, letterSpacing: -0.3 },
    guestText: { fontSize: 15, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 36 },
    loginBtn: {
      backgroundColor: '#7C3AED', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40,
      width: '100%', alignItems: 'center', marginBottom: 10,
      shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 5,
    },
    loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    registerBtn: {
      backgroundColor: colors.surfacePrimaryLight, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40,
      width: '100%', alignItems: 'center', borderWidth: 1.5, borderColor: colors.borderPrimary,
    },
    registerBtnText: { color: '#7C3AED', fontWeight: '700', fontSize: 16 },
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

  if (authLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[styles.guestContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.guestIconWrap}>
            <Text style={styles.guestEmoji}>♡</Text>
          </View>
          <Text style={styles.guestTitle}>Guardá tus favoritos</Text>
          <Text style={styles.guestText}>
            Iniciá sesión para guardar los eventos que te interesan y hacerles seguimiento fácilmente.
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.loginBtnText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => router.push('/auth/register')}
            activeOpacity={0.85}
          >
            <Text style={styles.registerBtnText}>Crear cuenta</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (eventsLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>MIS GUARDADOS</Text>
          <Text style={styles.headerTitle}>Favoritos</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      </SafeAreaView>
    );
  }

  const allEvents = events ?? [];

  const filtered = allEvents.filter(e => {
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (selectedMunicipality && e.municipality_id !== selectedMunicipality.id) return false;
    if (selectedCategory === 'religious' && selectedParish !== 'all' && e.parish !== selectedParish) return false;
    return true;
  });

  const grouped = groupByDate(filtered);
  const dates = Object.keys(grouped).sort();
  const isFiltered = selectedCategory !== 'all' || selectedMunicipality !== null || selectedParish !== 'all';

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.animatedWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => (municipalities ?? []).length > 0 && setMuniModalOpen(true)}
            activeOpacity={0.7}
            style={styles.eyebrowRow}
          >
            <Text style={styles.headerEyebrow}>
              {selectedMunicipality ? `FAVORITOS · ${selectedMunicipality.name.toUpperCase()}` : 'MIS GUARDADOS'}
            </Text>
            {(municipalities ?? []).length > 0 && <Text style={styles.eyebrowChevron}>▾</Text>}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Favoritos</Text>
          {allEvents.length > 0 && (
            <Text style={styles.headerSub}>
              {isFiltered
                ? `${filtered.length} de ${allEvents.length} guardado${allEvents.length !== 1 ? 's' : ''}`
                : `${allEvents.length} evento${allEvents.length !== 1 ? 's' : ''} guardado${allEvents.length !== 1 ? 's' : ''}`}
            </Text>
          )}
        </View>

        {allEvents.length > 0 && (
          <View style={styles.filterWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
              <CategoryPill
                category="all"
                selected={selectedCategory === 'all'}
                onPress={() => { setSelectedCategory('all'); setSelectedParish('all'); }}
              />
              {ALL_CATEGORIES.map(cat => (
                <CategoryPill
                  key={cat.id}
                  category={cat.id}
                  selected={selectedCategory === cat.id}
                  onPress={() => { setSelectedCategory(cat.id); setSelectedParish('all'); }}
                />
              ))}
            </ScrollView>
            <View style={styles.filterFade} pointerEvents="none" />
          </View>
        )}

        {selectedCategory === 'religious' && allEvents.length > 0 && (
          <View style={styles.filterWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.filterContent, { alignItems: 'center' }]}
            >
              <TouchableOpacity
                style={[styles.parishPill, selectedParish === 'all' && styles.parishPillActive]}
                onPress={() => setSelectedParish('all')}
                activeOpacity={0.75}
              >
                <Text style={[styles.parishPillText, selectedParish === 'all' && styles.parishPillTextActive]}>Todas</Text>
              </TouchableOpacity>
              {PARISHES.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.parishPill, selectedParish === p && styles.parishPillActive]}
                  onPress={() => setSelectedParish(p)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.parishPillText, selectedParish === p && styles.parishPillTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.filterFade} pointerEvents="none" />
          </View>
        )}

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {allEvents.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>♡</Text>
              <Text style={styles.emptyTitle}>Aún no guardaste eventos</Text>
              <Text style={styles.emptyText}>
                Explorá la agenda y tocá ♡ en los eventos que te interesen para verlos acá.
              </Text>
            </View>
          ) : dates.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptyText}>
                No tenés favoritos en esta categoría. Probá con otro filtro.
              </Text>
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

      <Modal visible={muniModalOpen} transparent animationType="fade" onRequestClose={() => setMuniModalOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setMuniModalOpen(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.modalTitle}>Municipalidad</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => { setSelectedMunicipality(null); setMuniModalOpen(false); }}
              activeOpacity={0.75}
            >
              <Text style={[styles.modalOptionText, selectedMunicipality === null && styles.modalOptionTextActive]}>Todas</Text>
              {selectedMunicipality === null && <Text style={styles.modalCheckmark}>✓</Text>}
            </TouchableOpacity>
            {(municipalities ?? []).map(m => (
              <TouchableOpacity
                key={m.id}
                style={styles.modalOption}
                onPress={() => { setSelectedMunicipality(m); setMuniModalOpen(false); }}
                activeOpacity={0.75}
              >
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
