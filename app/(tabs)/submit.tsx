import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import { useSubmitEvent, useMunicipalities, useMyEvents } from '../../hooks/useEvents';
import { useAuth } from '../../context/AuthContext';
import { ALL_CATEGORIES, CATEGORIES, Category, PARISHES } from '../../constants/categories';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

function pad(n: number) { return String(n).padStart(2, '0'); }
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

const now = new Date();
const QUICK_DATES = [
  { label: 'Hoy', d: now },
  { label: 'Mañana', d: addDays(now, 1) },
  { label: `${addDays(now, 2).getDate()}/${pad(addDays(now, 2).getMonth() + 1)}`, d: addDays(now, 2) },
  { label: `${addDays(now, 3).getDate()}/${pad(addDays(now, 3).getMonth() + 1)}`, d: addDays(now, 3) },
  { label: `${addDays(now, 7).getDate()}/${pad(addDays(now, 7).getMonth() + 1)}`, d: addDays(now, 7) },
].map(q => ({
  label: q.label,
  dd: pad(q.d.getDate()),
  mm: pad(q.d.getMonth() + 1),
  yyyy: String(q.d.getFullYear()),
}));

export default function SubmitScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();
  const { mutateAsync: submitEvent, isPending } = useSubmitEvent();
  const { data: municipalities } = useMunicipalities();
  const { data: myEvents } = useMyEvents(user?.id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('cultural');
  const [selectedParish, setSelectedParish] = useState<string | null>(null);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [timeHH, setTimeHH] = useState('');
  const [timeMM, setTimeMM] = useState('');
  const [timeEndHH, setTimeEndHH] = useState('');
  const [timeEndMM, setTimeEndMM] = useState('');
  const [municipalityId, setMunicipalityId] = useState<number | null>(null);
  const [muniModalOpen, setMuniModalOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'publish' | 'mine'>('publish');

  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  const timeMMRef = useRef<TextInput>(null);
  const timeEndMMRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 14, bounciness: 4, useNativeDriver: true }),
    ]).start();
  }, []);

  const date = day && month && year.length === 4
    ? `${year}-${month}-${day}`
    : '';

  const selectedQuick = QUICK_DATES.find(q => q.dd === day && q.mm === month && q.yyyy === year)?.label ?? null;

  function pickQuickDate(q: typeof QUICK_DATES[0]) {
    setDay(q.dd);
    setMonth(q.mm);
    setYear(q.yyyy);
  }

  function resetForm() {
    setTitle(''); setDescription(''); setDay(''); setMonth('');
    setYear(''); setTimeHH(''); setTimeMM(''); setTimeEndHH(''); setTimeEndMM('');
    setMunicipalityId(null); setSelectedParish(null); setLocation(''); setAddress(''); setPrice(''); setErrorMsg('');
  }

  async function handleSubmit() {
    if (!title.trim()) { setErrorMsg('El título es obligatorio.'); return; }
    if (!description.trim()) { setErrorMsg('La descripción es obligatoria.'); return; }
    if (!date) { setErrorMsg('La fecha es obligatoria.'); return; }
    const hasStart = timeHH !== '' || timeMM !== '';
    const hasEnd = timeEndHH !== '' || timeEndMM !== '';
    if (hasStart && (timeHH === '' || timeMM === '')) { setErrorMsg('Completá la hora de inicio (HH y MM).'); return; }
    if (hasEnd && (timeEndHH === '' || timeEndMM === '')) { setErrorMsg('Completá la hora de fin (HH y MM).'); return; }
    if (hasStart) {
      if (parseInt(timeHH, 10) > 23) { setErrorMsg('La hora de inicio debe estar entre 00 y 23.'); return; }
      if (parseInt(timeMM, 10) > 59) { setErrorMsg('Los minutos de inicio deben estar entre 00 y 59.'); return; }
    }
    if (hasEnd) {
      if (parseInt(timeEndHH, 10) > 23) { setErrorMsg('La hora de fin debe estar entre 00 y 23.'); return; }
      if (parseInt(timeEndMM, 10) > 59) { setErrorMsg('Los minutos de fin deben estar entre 00 y 59.'); return; }
    }
    if (hasStart && hasEnd) {
      const startMins = parseInt(timeHH, 10) * 60 + parseInt(timeMM, 10);
      const endMins = parseInt(timeEndHH, 10) * 60 + parseInt(timeEndMM, 10);
      if (endMins <= startMins) { setErrorMsg('La hora de fin debe ser posterior a la de inicio.'); return; }
    }
    const event_time = hasStart ? `${timeHH.padStart(2,'0')}:${timeMM.padStart(2,'0')}` : '';
    const event_time_end = hasEnd ? `${timeEndHH.padStart(2,'0')}:${timeEndMM.padStart(2,'0')}` : undefined;
    setErrorMsg('');
    try {
      await submitEvent({
        title, description, category,
        event_date: date,
        event_time,
        event_time_end,
        price: price.trim() || undefined,
        municipality_id: municipalityId ?? undefined,
        parish: category === 'religious' && selectedParish ? selectedParish : undefined,
        location, address,
        submitted_by: user!.id,
      });
      resetForm();
      setActiveTab('mine');
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'No se pudo enviar el evento.');
    }
  }

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    animatedWrapper: { flex: 1 },
    header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
    headerSub: { fontSize: 13, color: colors.textFaint, marginTop: 4, lineHeight: 18 },
    form: { paddingHorizontal: 20 },
    label: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginBottom: 7, marginTop: 16 },
    input: {
      backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderPrimary,
      borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: colors.text,
    },
    textarea: { minHeight: 100, paddingTop: 13 },
    categoryRow: { marginBottom: 4 },
    catOption: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
      borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, marginRight: 8,
    },
    catEmoji: { fontSize: 13 },
    catLabel: { fontSize: 12, fontWeight: '600' },
    parishOption: {
      paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
      borderWidth: 1.5, borderColor: '#D97706', backgroundColor: colors.surface, marginRight: 8,
    },
    parishOptionActive: { backgroundColor: '#B45309', borderColor: '#B45309' },
    parishOptionText: { fontSize: 12, fontWeight: '600', color: '#B45309' },
    parishOptionTextActive: { color: '#fff' },
    dropdownTrigger: {
      backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderPrimary,
      borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    dropdownPlaceholder: { fontSize: 15, color: '#D4B483' },
    dropdownValueText: { fontSize: 15, color: colors.text, fontWeight: '500' },
    dropdownChevron: { fontSize: 14, color: '#C9A96E' },
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
    quickDates: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
    quickBtn: {
      paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
      borderWidth: 1.5, borderColor: colors.borderPrimary, backgroundColor: colors.surface,
    },
    quickBtnActive: { backgroundColor: '#B87333', borderColor: '#B87333' },
    quickBtnText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
    quickBtnTextActive: { color: '#fff' },
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dateSegment: { alignItems: 'center', flex: 1 },
    dateSegmentWide: { alignItems: 'center', flex: 1.6 },
    dateInput: {
      backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderPrimary,
      borderRadius: 14, paddingVertical: 13, paddingHorizontal: 8,
      fontSize: 17, fontWeight: '700', color: colors.text, width: '100%',
    },
    dateInputFilled: { borderColor: '#B87333', color: '#B87333' },
    dateSegLabel: {
      fontSize: 10, color: colors.textFaint, fontWeight: '600', marginTop: 4,
      textTransform: 'uppercase', letterSpacing: 0.4,
    },
    dateSep: { fontSize: 20, color: '#D4B483', fontWeight: '300', marginBottom: 18 },
    timesRow: { flexDirection: 'row', alignItems: 'flex-start' },
    timeBlock: { flex: 1 },
    timeDivider: { width: 16 },
    timeSegRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    timeSegment: { alignItems: 'center', flex: 1 },
    timeInput: {
      backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderPrimary,
      borderRadius: 14, paddingVertical: 13, paddingHorizontal: 4,
      fontSize: 17, fontWeight: '700', color: colors.text, width: '100%', textAlign: 'center',
    },
    timeInputFilled: { borderColor: '#B87333', color: '#B87333' },
    timeSegLabel: {
      fontSize: 10, color: colors.textFaint, fontWeight: '600', marginTop: 4,
      textTransform: 'uppercase', letterSpacing: 0.4,
    },
    timeSep: { fontSize: 20, color: '#D4B483', fontWeight: '300', marginBottom: 18 },
    errorBox: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, marginTop: 16 },
    errorText: { color: '#DC2626', fontSize: 13, fontWeight: '600' },
    submitBtn: {
      backgroundColor: '#B87333', borderRadius: 16, paddingVertical: 17, alignItems: 'center',
      marginTop: 28, shadowColor: '#B87333', shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
    },
    submitBtnDisabled: { opacity: 0.7 },
    submitText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
    authWall: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, gap: 12 },
    authIconBox: {
      width: 90, height: 90, borderRadius: 28, backgroundColor: colors.surfacePrimary,
      alignItems: 'center', justifyContent: 'center', marginBottom: 8, position: 'relative',
    },
    authIconBig: { fontSize: 40 },
    authIconAccent: { fontSize: 22, position: 'absolute', bottom: 6, right: 6 },
    authIcon: { fontSize: 32 },
    authTitle: { fontSize: 24, fontWeight: '800', color: colors.text, letterSpacing: -0.4, textAlign: 'center' },
    authSubtitle: { fontSize: 14, color: colors.textFaint, textAlign: 'center', lineHeight: 21, marginBottom: 8 },
    authPrimaryBtn: {
      width: '100%', backgroundColor: '#B87333', borderRadius: 16, paddingVertical: 16, alignItems: 'center',
      shadowColor: '#B87333', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
    },
    authPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    authSecondaryBtn: {
      width: '100%', borderWidth: 1.5, borderColor: colors.borderPrimary,
      borderRadius: 16, paddingVertical: 15, alignItems: 'center',
    },
    authSecondaryText: { color: '#B87333', fontWeight: '700', fontSize: 15 },
    tabRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
    tabBtn: {
      paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
      borderWidth: 1.5, borderColor: colors.borderPrimary, backgroundColor: colors.surface,
    },
    tabBtnActive: { backgroundColor: '#B87333', borderColor: '#B87333' },
    tabBtnText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
    tabBtnTextActive: { color: '#fff' },
    emptyState: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyStateIcon: { fontSize: 40 },
    emptyStateText: { fontSize: 15, color: colors.textFaint, textAlign: 'center' },
    myEventsSection: { paddingHorizontal: 20, paddingTop: 16 },
    myEventCard: {
      backgroundColor: colors.surface, borderRadius: 14, padding: 14,
      marginBottom: 10, borderWidth: 1.5, borderColor: colors.borderLight,
    },
    myEventTitle: { fontSize: 15, fontWeight: '700', color: colors.text, lineHeight: 20, marginBottom: 8 },
    myEventFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, flexShrink: 0 },
    statusBadgePending: { backgroundColor: '#FEF3C7' },
    statusBadgeApproved: { backgroundColor: '#D1FAE5' },
    statusBadgeRejected: { backgroundColor: '#FEE2E2' },
    statusText: { fontSize: 11, fontWeight: '700' },
    statusTextPending: { color: '#92400E' },
    statusTextApproved: { color: '#065F46' },
    statusTextRejected: { color: '#991B1B' },
    myEventDate: { fontSize: 12, color: colors.textFaint, flex: 1 },
    myEventRejection: {
      marginTop: 8, backgroundColor: '#FEF2F2', borderRadius: 8,
      paddingHorizontal: 10, paddingVertical: 7,
    },
    myEventRejectionText: { fontSize: 12, color: '#DC2626', lineHeight: 17 },
    myEventsEmpty: { fontSize: 13, color: colors.textFaint, textAlign: 'center', paddingVertical: 16 },
  }), [colors]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.animatedWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.authWall}>
            <View style={styles.authIconBox}>
              <Text style={styles.authIconBig}>🎵</Text>
              <Text style={styles.authIconAccent}>📣</Text>
            </View>
            <Text style={styles.authTitle}>Hacé resonar tu voz</Text>
            <Text style={styles.authSubtitle}>
              Abrí tu cuenta y sumá tu vibración al atlas. Contale al territorio lo que está pasando.
            </Text>
            <TouchableOpacity style={styles.authPrimaryBtn} onPress={() => router.push('/auth/register')} activeOpacity={0.85}>
              <Text style={styles.authPrimaryText}>Crear cuenta</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.authSecondaryBtn} onPress={() => router.push('/auth/login')} activeOpacity={0.85}>
              <Text style={styles.authSecondaryText}>Ya tengo cuenta</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.animatedWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Resonar</Text>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'publish' && styles.tabBtnActive]}
              onPress={() => { setActiveTab('publish'); resetForm(); }}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabBtnText, activeTab === 'publish' && styles.tabBtnTextActive]}>Nueva resonancia</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'mine' && styles.tabBtnActive]}
              onPress={() => setActiveTab('mine')}
              activeOpacity={0.75}
            >
              <Text style={[styles.tabBtnText, activeTab === 'mine' && styles.tabBtnTextActive]}>
                Mis resonancias{myEvents && myEvents.length > 0 ? ` (${myEvents.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeTab === 'mine' ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {!myEvents || myEvents.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📭</Text>
                <Text style={styles.emptyStateText}>Todavía no hiciste resonar ningún evento</Text>
              </View>
            ) : (
              <View style={styles.myEventsSection}>
                {myEvents.map(ev => {
                  const [yyyy, mm, dd] = ev.event_date.split('-');
                  const dateLabel = `${dd}/${mm}/${yyyy}`;
                  const catInfo = CATEGORIES[ev.category as keyof typeof CATEGORIES];
                  return (
                    <View key={ev.id} style={styles.myEventCard}>
                      <Text style={styles.myEventTitle} numberOfLines={2}>{ev.title}</Text>
                      <View style={styles.myEventFooter}>
                        <Text style={styles.myEventDate}>
                          {catInfo ? `${catInfo.emoji} ${catInfo.label}` : ev.category} · {dateLabel}
                        </Text>
                        <View style={[
                          styles.statusBadge,
                          ev.status === 'pending' && styles.statusBadgePending,
                          ev.status === 'approved' && styles.statusBadgeApproved,
                          ev.status === 'rejected' && styles.statusBadgeRejected,
                        ]}>
                          <Text style={[
                            styles.statusText,
                            ev.status === 'pending' && styles.statusTextPending,
                            ev.status === 'approved' && styles.statusTextApproved,
                            ev.status === 'rejected' && styles.statusTextRejected,
                          ]}>
                            {ev.status === 'pending' ? '⏳ Pendiente' : ev.status === 'approved' ? '✅ Aprobado' : '❌ Rechazado'}
                          </Text>
                        </View>
                      </View>
                      {ev.status === 'rejected' && ev.rejection_reason && (
                        <View style={styles.myEventRejection}>
                          <Text style={styles.myEventRejectionText}>Motivo: {ev.rejection_reason}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
                <View style={{ height: 90 }} />
              </View>
            )}
          </ScrollView>
        ) : (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <View style={styles.form}>
            {/* Category */}
            <Text style={styles.label}>Categoría</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow} contentContainerStyle={{ paddingRight: 16 }}>
              {ALL_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => { setCategory(cat.id); setSelectedParish(null); }}
                  style={[styles.catOption, category === cat.id && { backgroundColor: cat.color, borderColor: cat.color }]}
                  activeOpacity={0.75}
                >
                  <Text style={styles.catEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.catLabel, { color: category === cat.id ? '#fff' : colors.textMuted }]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Parish (only for religious) */}
            {category === 'religious' && (
              <>
                <Text style={styles.label}>Parroquia</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow} contentContainerStyle={{ paddingRight: 16 }}>
                  {PARISHES.map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setSelectedParish(selectedParish === p ? null : p)}
                      style={[styles.parishOption, selectedParish === p && styles.parishOptionActive]}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.parishOptionText, selectedParish === p && styles.parishOptionTextActive]}>⛪ {p}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            {/* Municipality */}
            <Text style={styles.label}>Municipalidad</Text>
            <TouchableOpacity style={styles.dropdownTrigger} onPress={() => setMuniModalOpen(true)} activeOpacity={0.8}>
              <Text style={municipalityId ? styles.dropdownValueText : styles.dropdownPlaceholder}>
                {municipalityId ? (municipalities ?? []).find(m => m.id === municipalityId)?.name ?? 'Seleccioná una municipalidad' : 'Seleccioná una municipalidad'}
              </Text>
              <Text style={styles.dropdownChevron}>▾</Text>
            </TouchableOpacity>

            <Modal visible={muniModalOpen} transparent animationType="fade" onRequestClose={() => setMuniModalOpen(false)}>
              <Pressable style={styles.modalBackdrop} onPress={() => setMuniModalOpen(false)}>
                <Pressable style={styles.modalSheet} onPress={() => {}}>
                  <Text style={styles.modalTitle}>Municipalidad</Text>
                  {(municipalities ?? []).map(m => (
                    <TouchableOpacity
                      key={m.id}
                      style={styles.modalOption}
                      onPress={() => { setMunicipalityId(m.id); setMuniModalOpen(false); }}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.modalOptionText, municipalityId === m.id && styles.modalOptionTextActive]}>{m.name}</Text>
                      {municipalityId === m.id && <Text style={styles.modalCheckmark}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => { setMunicipalityId(null); setMuniModalOpen(false); }}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.modalOptionText, municipalityId === null && styles.modalOptionTextActive]}>Sin especificar</Text>
                    {municipalityId === null && <Text style={styles.modalCheckmark}>✓</Text>}
                  </TouchableOpacity>
                </Pressable>
              </Pressable>
            </Modal>

            {/* Title */}
            <Text style={styles.label}>Título del evento *</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ej: Feria de Artesanías" placeholderTextColor="#D4B483" />

            {/* Description */}
            <Text style={styles.label}>Descripción *</Text>
            <TextInput style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription} placeholder="Describe el evento..." placeholderTextColor="#D4B483" multiline numberOfLines={4} textAlignVertical="top" />

            {/* Price */}
            {category !== 'religious' && (
              <>
                <Text style={styles.label}>Valor / Entrada</Text>
                <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="Entrada libre" placeholderTextColor="#D4B483" />
              </>
            )}

            {/* Date picker */}
            <Text style={styles.label}>Fecha *</Text>
            <View style={styles.quickDates}>
              {QUICK_DATES.map(q => (
                <TouchableOpacity
                  key={q.label}
                  style={[styles.quickBtn, selectedQuick === q.label && styles.quickBtnActive]}
                  onPress={() => pickQuickDate(q)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.quickBtnText, selectedQuick === q.label && styles.quickBtnTextActive]}>
                    {q.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.dateRow}>
              <View style={styles.dateSegment}>
                <TextInput
                  style={[styles.dateInput, day && styles.dateInputFilled]}
                  value={day}
                  onChangeText={v => { const n = v.replace(/\D/g, '').slice(0, 2); setDay(n); if (n.length === 2) monthRef.current?.focus(); }}
                  keyboardType="number-pad" maxLength={2} placeholder="DD" placeholderTextColor="#D4B483" textAlign="center"
                />
                <Text style={styles.dateSegLabel}>Día</Text>
              </View>
              <Text style={styles.dateSep}>/</Text>
              <View style={styles.dateSegment}>
                <TextInput
                  ref={monthRef}
                  style={[styles.dateInput, month && styles.dateInputFilled]}
                  value={month}
                  onChangeText={v => { const n = v.replace(/\D/g, '').slice(0, 2); setMonth(n); if (n.length === 2) yearRef.current?.focus(); }}
                  keyboardType="number-pad" maxLength={2} placeholder="MM" placeholderTextColor="#D4B483" textAlign="center"
                />
                <Text style={styles.dateSegLabel}>Mes</Text>
              </View>
              <Text style={styles.dateSep}>/</Text>
              <View style={styles.dateSegmentWide}>
                <TextInput
                  ref={yearRef}
                  style={[styles.dateInput, year.length === 4 && styles.dateInputFilled]}
                  value={year}
                  onChangeText={v => setYear(v.replace(/\D/g, '').slice(0, 4))}
                  keyboardType="number-pad" maxLength={4} placeholder="AAAA" placeholderTextColor="#D4B483" textAlign="center"
                />
                <Text style={styles.dateSegLabel}>Año</Text>
              </View>
            </View>

            {/* Times */}
            <View style={styles.timesRow}>
              <View style={styles.timeBlock}>
                <Text style={styles.label}>Hora inicio</Text>
                <View style={styles.timeSegRow}>
                  <View style={styles.timeSegment}>
                    <TextInput
                      style={[styles.timeInput, timeHH && styles.timeInputFilled]}
                      value={timeHH}
                      onChangeText={v => { const n = v.replace(/\D/g, '').slice(0, 2); const val = n.length === 2 ? String(Math.min(parseInt(n, 10), 23)).padStart(2, '0') : n; setTimeHH(val); if (val.length === 2) timeMMRef.current?.focus(); }}
                      keyboardType="number-pad" maxLength={2} placeholder="HH" placeholderTextColor="#D4B483" textAlign="center" autoCorrect={false} autoComplete="off"
                    />
                    <Text style={styles.timeSegLabel}>Hora</Text>
                  </View>
                  <Text style={styles.timeSep}>:</Text>
                  <View style={styles.timeSegment}>
                    <TextInput
                      ref={timeMMRef}
                      style={[styles.timeInput, timeMM && styles.timeInputFilled]}
                      value={timeMM}
                      onChangeText={v => { const n = v.replace(/\D/g, '').slice(0, 2); setTimeMM(n.length === 2 ? String(Math.min(parseInt(n, 10), 59)).padStart(2, '0') : n); }}
                      keyboardType="number-pad" maxLength={2} placeholder="MM" placeholderTextColor="#D4B483" textAlign="center" autoCorrect={false} autoComplete="off"
                    />
                    <Text style={styles.timeSegLabel}>Min</Text>
                  </View>
                </View>
              </View>

              <View style={styles.timeDivider} />

              <View style={styles.timeBlock}>
                <Text style={styles.label}>Hora fin</Text>
                <View style={styles.timeSegRow}>
                  <View style={styles.timeSegment}>
                    <TextInput
                      style={[styles.timeInput, timeEndHH && styles.timeInputFilled]}
                      value={timeEndHH}
                      onChangeText={v => { const n = v.replace(/\D/g, '').slice(0, 2); const val = n.length === 2 ? String(Math.min(parseInt(n, 10), 23)).padStart(2, '0') : n; setTimeEndHH(val); if (val.length === 2) timeEndMMRef.current?.focus(); }}
                      keyboardType="number-pad" maxLength={2} placeholder="HH" placeholderTextColor="#D4B483" textAlign="center" autoCorrect={false} autoComplete="off"
                    />
                    <Text style={styles.timeSegLabel}>Hora</Text>
                  </View>
                  <Text style={styles.timeSep}>:</Text>
                  <View style={styles.timeSegment}>
                    <TextInput
                      ref={timeEndMMRef}
                      style={[styles.timeInput, timeEndMM && styles.timeInputFilled]}
                      value={timeEndMM}
                      onChangeText={v => { const n = v.replace(/\D/g, '').slice(0, 2); setTimeEndMM(n.length === 2 ? String(Math.min(parseInt(n, 10), 59)).padStart(2, '0') : n); }}
                      keyboardType="number-pad" maxLength={2} placeholder="MM" placeholderTextColor="#D4B483" textAlign="center" autoCorrect={false} autoComplete="off"
                    />
                    <Text style={styles.timeSegLabel}>Min</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Location */}
            <Text style={styles.label}>Lugar</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Ej: Plaza Central" placeholderTextColor="#D4B483" />

            {/* Address */}
            <Text style={styles.label}>Dirección</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Ej: Av. Principal 100" placeholderTextColor="#D4B483" />

            {errorMsg ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <TouchableOpacity style={[styles.submitBtn, isPending && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={isPending} activeOpacity={0.85}>
              {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Enviar para revisión</Text>}
            </TouchableOpacity>
          </View>

          <View style={{ height: 90 }} />
        </ScrollView>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}
