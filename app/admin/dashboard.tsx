import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { usePendingEvents, useAdminApprovedEvents, useUnpublishEvent, useToggleFeatured } from '../../hooks/useEvents';
import { CATEGORIES, ALL_CATEGORIES, Category } from '../../constants/categories';
import { useRouter } from 'expo-router';
import { Event } from '../../types/event';
import { useTheme } from '../../context/ThemeContext';
import { ThemeColors } from '../../context/ThemeContext';

const MONTHS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

function formatDate(dateStr: string): string {
  const [yyyy, mm, dd] = dateStr.split('-');
  return `${parseInt(dd)} ${MONTHS[parseInt(mm) - 1]} ${yyyy}`;
}

function formatDateHeader(dateStr: string, today: string): string {
  if (dateStr === today) return `Hoy · ${formatDate(dateStr)}`;
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  if (dateStr === tomorrowStr) return `Mañana · ${formatDate(dateStr)}`;
  return formatDate(dateStr);
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingRight: 12 },
    backArrow: { fontSize: 18, color: '#7C3AED', fontWeight: '600' },
    backLabel: { fontSize: 14, color: '#7C3AED', fontWeight: '600' },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
    countBadge: {
      backgroundColor: '#FEF3C7', minWidth: 28, height: 28, paddingHorizontal: 8,
      borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    },
    countBadgePlaceholder: { width: 28 },
    countText: { color: '#F59E0B', fontWeight: '800', fontSize: 13 },
    tabs: {
      flexDirection: 'row', marginHorizontal: 16, marginBottom: 8,
      backgroundColor: colors.surfacePrimary, borderRadius: 12, padding: 4,
    },
    tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10, paddingHorizontal: 4 },
    tabActive: {
      backgroundColor: colors.surface,
      shadowColor: '#6D28D9', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2,
    },
    tabText: { fontSize: 11, fontWeight: '600', color: colors.textFaint },
    tabTextActive: { color: '#7C3AED' },
    searchContainer: { paddingHorizontal: 16, marginBottom: 8 },
    searchBox: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
      borderWidth: 1.5, borderColor: colors.borderPrimary, borderRadius: 12,
      paddingHorizontal: 12, paddingVertical: 10, gap: 8,
    },
    searchIcon: { fontSize: 14 },
    searchInput: { flex: 1, fontSize: 14, color: colors.text, padding: 0 },
    filtersSection: { marginBottom: 4 },
    quickFilterRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 6, marginBottom: 8 },
    categoryScrollContent: { paddingHorizontal: 16, paddingBottom: 2, flexDirection: 'row', alignItems: 'center' },
    chip: {
      paddingHorizontal: 11, paddingVertical: 6, borderRadius: 20,
      borderWidth: 1.5, borderColor: colors.borderPrimary, backgroundColor: colors.surface,
      marginRight: 6, marginBottom: 2,
    },
    chipTextActive: { color: '#fff' },
    chipText: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
    statsRow: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
      paddingHorizontal: 16, paddingTop: 6, paddingBottom: 2,
    },
    statsText: { fontSize: 12, color: colors.textFaint, fontWeight: '500' },
    clearText: { fontSize: 12, color: '#7C3AED', fontWeight: '700' },
    sectionHeader: {
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
      paddingTop: 14, paddingBottom: 6, gap: 8,
    },
    sectionHeaderText: { fontSize: 13, fontWeight: '700', color: colors.textSub },
    sectionCount: { backgroundColor: colors.surfacePrimary, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2 },
    sectionCountText: { fontSize: 11, fontWeight: '700', color: '#7C3AED' },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textSub, marginBottom: 6 },
    emptyText: { fontSize: 14, color: colors.textFaint, textAlign: 'center', marginBottom: 16 },
    clearFiltersBtn: { backgroundColor: '#7C3AED', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20 },
    clearFiltersBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    item: {
      flexDirection: 'row', backgroundColor: colors.surface, marginHorizontal: 16, marginBottom: 8,
      borderRadius: 16, overflow: 'hidden',
      shadowColor: '#6D28D9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
      borderWidth: 1, borderColor: colors.border,
    },
    itemContent: { flex: 1, padding: 14 },
    itemEdge: { width: 4 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    catText: { fontSize: 11, fontWeight: '700' },
    date: { fontSize: 11, color: colors.textFaint, fontWeight: '500' },
    itemTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 8, lineHeight: 20 },
    itemFeatured: { borderColor: '#FDE68A', borderWidth: 1.5 },
    pendingFooter: { flexDirection: 'row', alignItems: 'center' },
    actionRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    editBtn: { flex: 1, borderWidth: 1.5, borderColor: '#7C3AED', borderRadius: 10, paddingVertical: 7, alignItems: 'center' },
    editBtnText: { fontSize: 12, fontWeight: '700', color: '#7C3AED' },
    featuredBtn: { flex: 1.4, borderWidth: 1.5, borderColor: '#FCD34D', borderRadius: 10, paddingVertical: 7, alignItems: 'center', minWidth: 36 },
    featuredBtnActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
    featuredBtnText: { fontSize: 12, fontWeight: '700', color: '#F59E0B' },
    featuredBtnTextActive: { color: '#fff' },
    unpublishBtn: { borderWidth: 1.5, borderColor: '#FCA5A5', borderRadius: 10, paddingVertical: 7, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
    unpublishBtnText: { fontSize: 14 },
    confirmBox: { gap: 6 },
    confirmText: { fontSize: 12, fontWeight: '600', color: colors.textSub },
    confirmRow: { flexDirection: 'row', gap: 6 },
    confirmYes: { flex: 1, backgroundColor: '#EF4444', borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
    confirmYesText: { fontSize: 13, fontWeight: '700', color: '#fff' },
    confirmNo: { flex: 1, borderWidth: 1.5, borderColor: colors.borderMedium, borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
    confirmNoText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  });
}

// ─── Pending Item ─────────────────────────────────────────────────────────────
function PendingEventItem({ event }: { event: Event }) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const cat = CATEGORIES[event.category as Category] ?? {
    label: event.category, color: '#6B7280', bgColor: '#F3F4F6', emoji: '📌',
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/admin/event/${event.id}`)}
      activeOpacity={0.85}
    >
      <View style={[styles.itemEdge, { backgroundColor: cat.color }]} />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={[styles.catBadge, { backgroundColor: cat.bgColor }]}>
            <Text style={[styles.catText, { color: cat.color }]}>{cat.emoji} {cat.label}</Text>
          </View>
          <Text style={styles.date}>
            {formatDate(event.event_date)}{event.event_time ? ` · ${event.event_time.slice(0, 5)}` : ''}
          </Text>
        </View>
        <Text style={styles.itemTitle} numberOfLines={2}>{event.title}</Text>
        <View style={styles.pendingFooter}>
          <Text style={[{ fontSize: 13, fontWeight: '700' }, { color: cat.color }]}>Revisar →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Approved Item ────────────────────────────────────────────────────────────
function ApprovedEventItem({ event }: { event: Event }) {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { mutateAsync: unpublish, isPending: isUnpublishing } = useUnpublishEvent();
  const { mutateAsync: toggleFeatured, isPending: isTogglingFeatured } = useToggleFeatured();
  const [confirming, setConfirming] = useState(false);
  const cat = CATEGORIES[event.category as Category] ?? {
    label: event.category, color: '#6B7280', bgColor: '#F3F4F6', emoji: '📌',
  };

  async function handleUnpublish() {
    try {
      await unpublish(event.id);
    } catch {
      Alert.alert('Error', 'No se pudo quitar el evento.');
    } finally {
      setConfirming(false);
    }
  }

  async function handleToggleFeatured() {
    try {
      await toggleFeatured({ id: event.id, featured: !event.featured });
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el evento.');
    }
  }

  return (
    <View style={[styles.item, event.featured && styles.itemFeatured]}>
      <View style={[styles.itemEdge, { backgroundColor: event.featured ? '#F59E0B' : '#10B981' }]} />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={[styles.catBadge, { backgroundColor: cat.bgColor }]}>
            <Text style={[styles.catText, { color: cat.color }]}>{cat.emoji} {cat.label}</Text>
          </View>
          <Text style={styles.date}>
            {formatDate(event.event_date)}{event.event_time ? ` · ${event.event_time.slice(0, 5)}` : ''}
          </Text>
        </View>
        <Text style={styles.itemTitle} numberOfLines={2}>{event.title}</Text>

        {!confirming ? (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editBtn} onPress={() => router.push(`/admin/event/edit/${event.id}`)} activeOpacity={0.8}>
              <Text style={styles.editBtnText}>✏️ Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.featuredBtn, event.featured && styles.featuredBtnActive]}
              onPress={handleToggleFeatured} disabled={isTogglingFeatured} activeOpacity={0.8}
            >
              {isTogglingFeatured ? (
                <ActivityIndicator size="small" color={event.featured ? '#fff' : '#F59E0B'} />
              ) : (
                <Text style={[styles.featuredBtnText, event.featured && styles.featuredBtnTextActive]}>
                  {event.featured ? '⭐ Destacado' : '☆ Destacar'}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.unpublishBtn} onPress={() => setConfirming(true)} activeOpacity={0.8}>
              <Text style={styles.unpublishBtnText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>¿Quitar este evento?</Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity style={styles.confirmYes} onPress={handleUnpublish} disabled={isUnpublishing} activeOpacity={0.8}>
                {isUnpublishing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmYesText}>Sí, quitar</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmNo} onPress={() => setConfirming(false)} disabled={isUnpublishing} activeOpacity={0.8}>
                <Text style={styles.confirmNoText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Date Section Header ──────────────────────────────────────────────────────
function DateHeader({ date, count, today }: { date: string; count: number; today: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{formatDateHeader(date, today)}</Text>
      <View style={styles.sectionCount}>
        <Text style={styles.sectionCountText}>{count}</Text>
      </View>
    </View>
  );
}

// ─── Filter Chip ──────────────────────────────────────────────────────────────
type ChipProps = { label: string; active: boolean; onPress: () => void; activeColor?: string; };
function FilterChip({ label, active, onPress, activeColor = '#7C3AED' }: ChipProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <TouchableOpacity
      style={[styles.chip, active && { backgroundColor: activeColor, borderColor: activeColor }]}
      onPress={onPress} activeOpacity={0.8}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
type DateFilter = 'all' | 'today' | 'tomorrow' | 'this-week';
type ListItem = | { type: 'header'; date: string; count: number } | { type: 'event'; event: Event };

export default function AdminDashboard() {
  const [tab, setTab] = useState<'pending' | 'vigentes' | 'pasados'>('pending');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { data: pendingEvents, isLoading: loadingPending, refetch: refetchPending } = usePendingEvents();
  const { data: approvedEvents, isLoading: loadingApproved, refetch: refetchApproved } = useAdminApprovedEvents();
  const router = useRouter();

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = addDays(today, 1);
  const weekEnd = addDays(today, 7);

  const vigentesEvents = useMemo(() => (approvedEvents ?? []).filter(e => e.event_date >= today), [approvedEvents, today]);
  const pasadosEvents  = useMemo(() => (approvedEvents ?? []).filter(e => e.event_date < today), [approvedEvents, today]);

  const isLoading = tab === 'pending' ? loadingPending : loadingApproved;
  const refetch   = tab === 'pending' ? refetchPending : refetchApproved;
  const rawEvents = tab === 'pending' ? (pendingEvents ?? []) : tab === 'vigentes' ? vigentesEvents : pasadosEvents;

  const filteredEvents = useMemo(() => {
    return rawEvents.filter(e => {
      if (search.trim() && !e.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      if (featuredOnly && !e.featured) return false;
      if (dateFilter === 'today' && e.event_date !== today) return false;
      if (dateFilter === 'tomorrow' && e.event_date !== tomorrow) return false;
      if (dateFilter === 'this-week' && (e.event_date < today || e.event_date > weekEnd)) return false;
      return true;
    });
  }, [rawEvents, search, categoryFilter, featuredOnly, dateFilter, today, tomorrow, weekEnd]);

  const listData = useMemo<ListItem[]>(() => {
    if (tab === 'pending') {
      return filteredEvents.map(e => ({ type: 'event', event: e }));
    }
    const grouped: Record<string, Event[]> = {};
    for (const e of filteredEvents) {
      if (!grouped[e.event_date]) grouped[e.event_date] = [];
      grouped[e.event_date].push(e);
    }
    const result: ListItem[] = [];
    const sortedDates = Object.keys(grouped).sort(
      tab === 'pasados' ? (a, b) => b.localeCompare(a) : (a, b) => a.localeCompare(b)
    );
    for (const date of sortedDates) {
      result.push({ type: 'header', date, count: grouped[date].length });
      for (const e of grouped[date]) result.push({ type: 'event', event: e });
    }
    return result;
  }, [filteredEvents, tab]);

  const featuredCount = useMemo(() => (approvedEvents ?? []).filter(e => e.featured).length, [approvedEvents]);
  const hasActiveFilters = search.trim() !== '' || categoryFilter !== 'all' || dateFilter !== 'all' || featuredOnly;

  function resetFilters() {
    setSearch(''); setCategoryFilter('all'); setDateFilter('all'); setFeaturedOnly(false);
  }

  function switchTab(t: typeof tab) {
    setTab(t);
    resetFilters();
  }

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'header') return <DateHeader date={item.date} count={item.count} today={today} />;
    if (tab === 'pending') return <PendingEventItem event={item.event} />;
    return <ApprovedEventItem event={item.event} />;
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(tabs)/profile')} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Perfil</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Panel Admin</Text>
        </View>
        {pendingEvents && pendingEvents.length > 0 ? (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{pendingEvents.length}</Text>
          </View>
        ) : (
          <View style={styles.countBadgePlaceholder} />
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['pending', 'vigentes', 'pasados'] as const).map(t => {
          const label = t === 'pending'
            ? `Pendientes${pendingEvents?.length ? ` (${pendingEvents.length})` : ''}`
            : t === 'vigentes' ? `Vigentes (${vigentesEvents.length})` : `Pasados (${pasadosEvents.length})`;
          return (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => switchTab(t)} activeOpacity={0.8}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]} numberOfLines={1}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search bar */}
      {!isLoading && (rawEvents.length > 0 || search !== '') && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar evento..."
              placeholderTextColor="#C4B5FD"
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
        </View>
      )}

      {/* Compact filters */}
      {!isLoading && rawEvents.length > 0 && (
        <View style={styles.filtersSection}>
          {tab !== 'pending' && (
            <View style={styles.quickFilterRow}>
              <FilterChip
                label={`⭐ Destacados${featuredCount > 0 ? ` (${featuredCount})` : ''}`}
                active={featuredOnly}
                onPress={() => setFeaturedOnly(!featuredOnly)}
                activeColor="#F59E0B"
              />
              {tab === 'vigentes' && (
                <>
                  <FilterChip label="📅 Hoy" active={dateFilter === 'today'} onPress={() => setDateFilter(dateFilter === 'today' ? 'all' : 'today')} />
                  <FilterChip label="📅 Mañana" active={dateFilter === 'tomorrow'} onPress={() => setDateFilter(dateFilter === 'tomorrow' ? 'all' : 'tomorrow')} />
                  <FilterChip label="📅 7 días" active={dateFilter === 'this-week'} onPress={() => setDateFilter(dateFilter === 'this-week' ? 'all' : 'this-week')} />
                </>
              )}
              {tab === 'pasados' && (
                <FilterChip label="📅 Esta semana" active={dateFilter === 'this-week'} onPress={() => setDateFilter(dateFilter === 'this-week' ? 'all' : 'this-week')} />
              )}
            </View>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScrollContent}>
            <FilterChip label="Todos" active={categoryFilter === 'all'} onPress={() => setCategoryFilter('all')} />
            {ALL_CATEGORIES.map(cat => (
              <FilterChip
                key={cat.id}
                label={`${cat.emoji} ${cat.label}`}
                active={categoryFilter === cat.id}
                onPress={() => setCategoryFilter(categoryFilter === cat.id ? 'all' : cat.id)}
                activeColor={cat.color}
              />
            ))}
          </ScrollView>

          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              {filteredEvents.length !== rawEvents.length
                ? `${filteredEvents.length} de ${rawEvents.length} eventos`
                : `${rawEvents.length} eventos`}
            </Text>
            {hasActiveFilters && (
              <TouchableOpacity onPress={resetFilters} activeOpacity={0.7}>
                <Text style={styles.clearText}>Limpiar filtros ×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Content */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : listData.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>
            {hasActiveFilters ? '🔍' : tab === 'pending' ? '✅' : tab === 'vigentes' ? '📭' : '🗂️'}
          </Text>
          <Text style={styles.emptyTitle}>
            {hasActiveFilters ? 'Sin resultados' : tab === 'pending' ? 'Todo al día' : tab === 'vigentes' ? 'Sin eventos vigentes' : 'Sin eventos pasados'}
          </Text>
          <Text style={styles.emptyText}>
            {hasActiveFilters
              ? 'Probá con otra búsqueda o filtros.'
              : tab === 'pending' ? 'No hay eventos pendientes.' : tab === 'vigentes' ? 'No hay eventos aprobados activos.' : 'No hay eventos anteriores.'}
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearFiltersBtn} onPress={resetFilters}>
              <Text style={styles.clearFiltersBtnText}>Limpiar filtros</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item, idx) =>
            item.type === 'header' ? `header-${item.date}` : `event-${item.event.id}-${idx}`
          }
          renderItem={renderItem}
          onRefresh={refetch}
          refreshing={false}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
