import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { usePendingEvents, useAdminApprovedEvents, useUnpublishEvent, useToggleFeatured } from '../../hooks/useEvents';
import { CATEGORIES, Category } from '../../constants/categories';
import { useRouter } from 'expo-router';
import { Event } from '../../types/event';

function PendingEventItem({ event }: { event: Event }) {
  const router = useRouter();
  const cat = CATEGORIES[event.category as Category] ?? {
    label: event.category,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    emoji: '📌',
  };

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={() => router.push(`/admin/event/${event.id}`)}
      activeOpacity={0.85}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={[styles.catBadge, { backgroundColor: cat.bgColor }]}>
            <Text style={[styles.catText, { color: cat.color }]}>
              {cat.emoji} {cat.label}
            </Text>
          </View>
          <Text style={styles.date}>{event.event_date}</Text>
        </View>
        <Text style={styles.itemTitle} numberOfLines={2}>{event.title}</Text>
        <Text style={[styles.reviewBtn, { color: cat.color }]}>Revisar →</Text>
      </View>
      <View style={[styles.itemEdge, { backgroundColor: cat.color }]} />
    </TouchableOpacity>
  );
}

function ApprovedEventItem({ event }: { event: Event }) {
  const { mutateAsync: unpublish, isPending: isUnpublishing } = useUnpublishEvent();
  const { mutateAsync: toggleFeatured, isPending: isTogglingFeatured } = useToggleFeatured();
  const [confirming, setConfirming] = useState(false);
  const cat = CATEGORIES[event.category as Category] ?? {
    label: event.category,
    color: '#6B7280',
    bgColor: '#F3F4F6',
    emoji: '📌',
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
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={[styles.catBadge, { backgroundColor: cat.bgColor }]}>
            <Text style={[styles.catText, { color: cat.color }]}>
              {cat.emoji} {cat.label}
            </Text>
          </View>
          <Text style={styles.date}>{event.event_date}</Text>
        </View>
        <Text style={styles.itemTitle} numberOfLines={2}>{event.title}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.featuredBtn, event.featured && styles.featuredBtnActive]}
            onPress={handleToggleFeatured}
            disabled={isTogglingFeatured}
            activeOpacity={0.8}
          >
            {isTogglingFeatured ? (
              <ActivityIndicator size="small" color={event.featured ? '#fff' : '#F59E0B'} />
            ) : (
              <Text style={[styles.featuredBtnText, event.featured && styles.featuredBtnTextActive]}>
                {event.featured ? '⭐ Destacado' : '☆ Destacar'}
              </Text>
            )}
          </TouchableOpacity>
          {!confirming ? (
            <TouchableOpacity
              style={styles.unpublishBtn}
              onPress={() => setConfirming(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.unpublishBtnText}>Quitar</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.confirmRow}>
              <Text style={styles.confirmText}>¿Confirmar?</Text>
              <TouchableOpacity
                style={styles.confirmYes}
                onPress={handleUnpublish}
                disabled={isUnpublishing}
                activeOpacity={0.8}
              >
                {isUnpublishing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.confirmYesText}>Sí</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmNo}
                onPress={() => setConfirming(false)}
                disabled={isUnpublishing}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmNoText}>No</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View style={[styles.itemEdge, { backgroundColor: event.featured ? '#F59E0B' : '#10B981' }]} />
    </View>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const { data: pendingEvents, isLoading: loadingPending, refetch: refetchPending } = usePendingEvents();
  const { data: approvedEvents, isLoading: loadingApproved, refetch: refetchApproved } = useAdminApprovedEvents();
  const router = useRouter();

  const isLoading = tab === 'pending' ? loadingPending : loadingApproved;
  const events = tab === 'pending' ? pendingEvents : approvedEvents;
  const refetch = tab === 'pending' ? refetchPending : refetchApproved;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push('/(tabs)/profile')}
          activeOpacity={0.7}
        >
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
        <TouchableOpacity
          style={[styles.tab, tab === 'pending' && styles.tabActive]}
          onPress={() => setTab('pending')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, tab === 'pending' && styles.tabTextActive]}>
            Pendientes {pendingEvents?.length ? `(${pendingEvents.length})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'approved' && styles.tabActive]}
          onPress={() => setTab('approved')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, tab === 'approved' && styles.tabTextActive]}>
            Aprobados {approvedEvents?.length ? `(${approvedEvents.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : events?.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>{tab === 'pending' ? '✅' : '📭'}</Text>
          <Text style={styles.emptyTitle}>
            {tab === 'pending' ? 'Todo al día' : 'Sin eventos aprobados'}
          </Text>
          <Text style={styles.emptyText}>
            {tab === 'pending'
              ? 'No hay eventos pendientes de revisión.'
              : 'Aún no hay eventos aprobados.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) =>
            tab === 'pending'
              ? <PendingEventItem event={item} />
              : <ApprovedEventItem event={item} />
          }
          onRefresh={refetch}
          refreshing={false}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAF8' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingRight: 12,
  },
  backArrow: { fontSize: 18, color: '#7C3AED', fontWeight: '600' },
  backLabel: { fontSize: 14, color: '#7C3AED', fontWeight: '600' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#0F0A2A', letterSpacing: -0.3 },
  countBadge: {
    backgroundColor: '#FEF3C7',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgePlaceholder: { width: 28 },
  countText: { color: '#F59E0B', fontWeight: '800', fontSize: 13 },

  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#F0EDFD',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: { backgroundColor: '#fff', shadowColor: '#6D28D9', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: '#94A3B8' },
  tabTextActive: { color: '#7C3AED' },

  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 6 },
  emptyText: { fontSize: 14, color: '#94A3B8', textAlign: 'center' },

  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F0FD',
  },
  itemContent: { flex: 1, padding: 16 },
  itemEdge: { width: 4 },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  catText: { fontSize: 11, fontWeight: '700' },
  date: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F0A2A',
    marginBottom: 8,
    lineHeight: 21,
  },
  reviewBtn: { fontSize: 13, fontWeight: '700' },
  itemFeatured: { borderColor: '#FDE68A', borderWidth: 1.5 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  featuredBtn: {
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    minWidth: 36,
  },
  featuredBtnActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  featuredBtnText: { fontSize: 12, fontWeight: '700', color: '#F59E0B' },
  featuredBtnTextActive: { color: '#fff' },
  unpublishBtn: {
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },
  unpublishBtnText: { fontSize: 12, fontWeight: '700', color: '#EF4444' },
  confirmRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  confirmText: { fontSize: 12, fontWeight: '600', color: '#374151' },
  confirmYes: { backgroundColor: '#EF4444', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5, minWidth: 36, alignItems: 'center' },
  confirmYesText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  confirmNo: { borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  confirmNoText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },

});
