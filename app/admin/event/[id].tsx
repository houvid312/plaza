import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEvent, useReviewEvent, useMunicipalities } from '../../../hooks/useEvents';
import { useAuth } from '../../../context/AuthContext';
import { CATEGORIES, Category } from '../../../constants/categories';
import { useTheme } from '../../../context/ThemeContext';

export default function AdminEventReview() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();
  const { data: event, isLoading } = useEvent(Number(id));
  const { mutateAsync: reviewEvent, isPending } = useReviewEvent();
  const { data: municipalities } = useMunicipalities();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    header: {
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
      backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingRight: 12, width: 80 },
    backArrow: { fontSize: 18, color: '#B87333', fontWeight: '600' },
    backLabel: { fontSize: 13, color: '#B87333', fontWeight: '600' },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { fontSize: 16, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
    container: { flex: 1, backgroundColor: colors.bg },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
    heroBanner: { padding: 24, paddingTop: 32 },
    heroEmoji: { fontSize: 36, marginBottom: 10 },
    catTag: {
      alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.25)',
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10,
    },
    catTagText: { color: '#fff', fontWeight: '700', fontSize: 11 },
    heroTitle: { fontSize: 22, fontWeight: '800', color: '#fff', lineHeight: 28 },
    body: { padding: 20 },
    infoCard: {
      backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden', marginBottom: 16,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    infoRow: {
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
      borderBottomWidth: 1, borderBottomColor: colors.borderLight, gap: 12,
    },
    infoEmoji: { fontSize: 18, width: 24, textAlign: 'center' },
    infoLabel: { fontSize: 11, color: colors.textFaint, fontWeight: '600', marginBottom: 1 },
    infoValue: { fontSize: 14, color: colors.textSub, fontWeight: '600' },
    descSection: { marginBottom: 20 },
    descTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 },
    descText: { fontSize: 14, color: colors.textMuted, lineHeight: 22 },
    actions: { gap: 10 },
    approveBtn: { backgroundColor: '#10B981', borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
    approveBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    rejectBtn: { backgroundColor: '#FEE2E2', borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
    rejectBtnText: { color: '#EF4444', fontWeight: '700', fontSize: 15 },
    rejectForm: { backgroundColor: '#FEF2F2', borderRadius: 14, padding: 14, gap: 10 },
    rejectLabel: { fontSize: 13, fontWeight: '700', color: '#991B1B' },
    rejectInput: {
      backgroundColor: colors.surface, borderRadius: 10, padding: 12,
      fontSize: 14, color: colors.text, minHeight: 80, borderWidth: 1, borderColor: '#FCA5A5',
    },
    confirmRejectBtn: { backgroundColor: '#EF4444', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
    statusBanner: { borderRadius: 14, padding: 16 },
  }), [colors]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#B87333" />
      </View>
    );
  }
  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.textMuted }}>Evento no encontrado</Text>
      </View>
    );
  }

  const cat = CATEGORIES[event.category as Category] ?? {
    label: event.category, color: '#6B7280', bgColor: '#F3F4F6', emoji: '📌',
  };

  async function handleApprove() {
    try {
      await reviewEvent({ id: event!.id, status: 'approved', reviewed_by: user!.id });
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo aprobar el evento. Intentá de nuevo.');
    }
  }

  async function handleReject() {
    if (!rejectionReason.trim()) {
      Alert.alert('Motivo requerido', 'Indicá el motivo del rechazo.');
      return;
    }
    try {
      await reviewEvent({
        id: event!.id, status: 'rejected',
        rejection_reason: rejectionReason, reviewed_by: user!.id,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo rechazar el evento. Intentá de nuevo.');
    }
  }

  const muniName = event.municipality_id
    ? (municipalities ?? []).find(m => m.id === event.municipality_id)?.name ?? null
    : null;

  const infoRows = [
    { emoji: '📅', label: 'Fecha', value: event.event_date },
    { emoji: '🕐', label: 'Hora', value: event.event_time ?? '—' },
    { emoji: '📍', label: 'Lugar', value: event.location ?? '—' },
    { emoji: '🗺️', label: 'Dirección', value: event.address ?? '—' },
    { emoji: '🏛️', label: 'Municipalidad', value: muniName ?? '—' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/admin/dashboard')} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Panel Admin</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Revisar Evento</Text>
        </View>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroBanner, { backgroundColor: cat.color }]}>
          <Text style={styles.heroEmoji}>{cat.emoji}</Text>
          <View style={styles.catTag}>
            <Text style={styles.catTagText}>{cat.label.toUpperCase()}</Text>
          </View>
          <Text style={styles.heroTitle}>{event.title}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.infoCard}>
            {infoRows.map((row, i) => (
              <View key={row.label} style={[styles.infoRow, i === infoRows.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={styles.infoEmoji}>{row.emoji}</Text>
                <View>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value}</Text>
                </View>
              </View>
            ))}
          </View>

          {event.description && (
            <View style={styles.descSection}>
              <Text style={styles.descTitle}>Descripción</Text>
              <Text style={styles.descText}>{event.description}</Text>
            </View>
          )}

          {event.status === 'pending' && (
            <View style={styles.actions}>
              <TouchableOpacity style={styles.approveBtn} onPress={handleApprove} disabled={isPending} activeOpacity={0.85}>
                {isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.approveBtnText}>✅ Aprobar evento</Text>
                )}
              </TouchableOpacity>

              {!showRejectInput ? (
                <TouchableOpacity style={styles.rejectBtn} onPress={() => setShowRejectInput(true)} activeOpacity={0.85}>
                  <Text style={styles.rejectBtnText}>❌ Rechazar evento</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.rejectForm}>
                  <Text style={styles.rejectLabel}>Motivo del rechazo</Text>
                  <TextInput
                    style={styles.rejectInput}
                    value={rejectionReason}
                    onChangeText={setRejectionReason}
                    placeholder="Indicá por qué se rechaza..."
                    multiline numberOfLines={3} textAlignVertical="top"
                    placeholderTextColor="#D1D5DB"
                  />
                  <TouchableOpacity style={styles.confirmRejectBtn} onPress={handleReject} disabled={isPending} activeOpacity={0.85}>
                    <Text style={styles.rejectBtnText}>Confirmar rechazo</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {event.status !== 'pending' && (
            <View style={[styles.statusBanner, { backgroundColor: event.status === 'approved' ? '#D1FAE5' : '#FEE2E2' }]}>
              <Text style={{ color: event.status === 'approved' ? '#065F46' : '#991B1B', fontWeight: '700', fontSize: 15 }}>
                {event.status === 'approved' ? '✅ Este evento fue aprobado' : '❌ Este evento fue rechazado'}
              </Text>
              {event.rejection_reason && (
                <Text style={{ color: '#991B1B', marginTop: 4, fontSize: 13 }}>
                  {event.rejection_reason}
                </Text>
              )}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
