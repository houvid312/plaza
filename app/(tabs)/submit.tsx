import React, { useState, useRef, useEffect } from 'react';
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
import { useSubmitEvent, useMunicipalities } from '../../hooks/useEvents';
import { useAuth } from '../../context/AuthContext';
import { ALL_CATEGORIES, Category, PARISHES } from '../../constants/categories';
import { useRouter } from 'expo-router';

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
  const { mutateAsync: submitEvent, isPending } = useSubmitEvent();
  const { data: municipalities } = useMunicipalities();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('cultural');
  const [selectedParish, setSelectedParish] = useState<string | null>(null);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(String(now.getFullYear()));
  const [timeHH, setTimeHH] = useState('');
  const [timeMM, setTimeMM] = useState('');
  const [timeEndHH, setTimeEndHH] = useState('');
  const [timeEndMM, setTimeEndMM] = useState('');
  const [municipalityId, setMunicipalityId] = useState<number | null>(null);
  const [muniModalOpen, setMuniModalOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

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
    setYear(String(now.getFullYear())); setTimeHH(''); setTimeMM(''); setTimeEndHH(''); setTimeEndMM('');
    setMunicipalityId(null); setSelectedParish(null); setLocation(''); setAddress(''); setErrorMsg('');
  }

  async function handleSubmit() {
    if (!title.trim()) { setErrorMsg('El título es obligatorio.'); return; }
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
        municipality_id: municipalityId ?? undefined,
        parish: category === 'religious' && selectedParish ? selectedParish : undefined,
        location, address,
        submitted_by: user!.id,
      });
      setSubmitted(true);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'No se pudo enviar el evento.');
    }
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.animatedWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.authWall}>
            <View style={styles.authIconBox}>
              <Text style={styles.authIcon}>📋</Text>
            </View>
            <Text style={styles.authTitle}>Publicar evento</Text>
            <Text style={styles.authSubtitle}>
              Necesitás una cuenta para proponer eventos en Agenda.
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

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.animatedWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.authWall}>
            <View style={styles.authIconBox}>
              <Text style={styles.authIcon}>🎉</Text>
            </View>
            <Text style={styles.authTitle}>¡Enviado!</Text>
            <Text style={styles.authSubtitle}>
              Tu evento fue enviado y está pendiente de aprobación por el equipo municipal.
            </Text>
            <TouchableOpacity style={styles.authPrimaryBtn} onPress={() => { setSubmitted(false); resetForm(); }} activeOpacity={0.85}>
              <Text style={styles.authPrimaryText}>Publicar otro evento</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.animatedWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Publicar evento</Text>
            <Text style={styles.headerSub}>Tu evento será revisado por el equipo municipal</Text>
          </View>

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
                  <Text style={[styles.catLabel, { color: category === cat.id ? '#fff' : '#4B5563' }]}>{cat.label}</Text>
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
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ej: Feria de Artesanías" placeholderTextColor="#C4B5FD" />

            {/* Description */}
            <Text style={styles.label}>Descripción</Text>
            <TextInput style={[styles.input, styles.textarea]} value={description} onChangeText={setDescription} placeholder="Describe el evento..." placeholderTextColor="#C4B5FD" multiline numberOfLines={4} textAlignVertical="top" />

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
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="DD"
                  placeholderTextColor="#C4B5FD"
                  textAlign="center"
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
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="MM"
                  placeholderTextColor="#C4B5FD"
                  textAlign="center"
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
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="AAAA"
                  placeholderTextColor="#C4B5FD"
                  textAlign="center"
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
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="HH"
                      placeholderTextColor="#C4B5FD"
                      textAlign="center"
                      autoCorrect={false}
                      autoComplete="off"
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
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="MM"
                      placeholderTextColor="#C4B5FD"
                      textAlign="center"
                      autoCorrect={false}
                      autoComplete="off"
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
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="HH"
                      placeholderTextColor="#C4B5FD"
                      textAlign="center"
                      autoCorrect={false}
                      autoComplete="off"
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
                      keyboardType="number-pad"
                      maxLength={2}
                      placeholder="MM"
                      placeholderTextColor="#C4B5FD"
                      textAlign="center"
                      autoCorrect={false}
                      autoComplete="off"
                    />
                    <Text style={styles.timeSegLabel}>Min</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Location */}
            <Text style={styles.label}>Lugar</Text>
            <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Ej: Plaza Central" placeholderTextColor="#C4B5FD" />

            {/* Address */}
            <Text style={styles.label}>Dirección</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Ej: Av. Principal 100" placeholderTextColor="#C4B5FD" />

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
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAF8' },
  animatedWrapper: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#0F0A2A', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: '#94A3B8', marginTop: 4, lineHeight: 18 },
  form: { paddingHorizontal: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 7, marginTop: 16 },
  input: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#EDE9FE', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: '#0F0A2A' },
  textarea: { minHeight: 100, paddingTop: 13 },
  row: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  categoryRow: { marginBottom: 4 },
  catOption: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#EEEBF8', backgroundColor: '#fff', marginRight: 8 },
  catEmoji: { fontSize: 13 },
  catLabel: { fontSize: 12, fontWeight: '600' },
  parishOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#D97706', backgroundColor: '#fff', marginRight: 8 },
  parishOptionActive: { backgroundColor: '#B45309', borderColor: '#B45309' },
  parishOptionText: { fontSize: 12, fontWeight: '600', color: '#B45309' },
  parishOptionTextActive: { color: '#fff' },

  // Municipality dropdown
  dropdownTrigger: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#EDE9FE', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dropdownPlaceholder: { fontSize: 15, color: '#C4B5FD' },
  dropdownValueText: { fontSize: 15, color: '#0F0A2A', fontWeight: '500' },
  dropdownChevron: { fontSize: 14, color: '#A78BFA' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 36 },
  modalTitle: { fontSize: 13, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalOptionText: { fontSize: 15, color: '#374151', fontWeight: '500' },
  modalOptionTextActive: { color: '#7C3AED', fontWeight: '700' },
  modalCheckmark: { fontSize: 16, color: '#7C3AED', fontWeight: '700' },

  // Date picker
  quickDates: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  quickBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5, borderColor: '#EDE9FE', backgroundColor: '#fff' },
  quickBtnActive: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  quickBtnText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  quickBtnTextActive: { color: '#fff' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateSegment: { alignItems: 'center', flex: 1 },
  dateSegmentWide: { alignItems: 'center', flex: 1.6 },
  dateInput: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#EDE9FE', borderRadius: 14, paddingVertical: 13, paddingHorizontal: 8, fontSize: 17, fontWeight: '700', color: '#0F0A2A', width: '100%' },
  dateInputFilled: { borderColor: '#7C3AED', color: '#7C3AED' },
  dateSegLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  dateSep: { fontSize: 20, color: '#C4B5FD', fontWeight: '300', marginBottom: 18 },

  // Time segments
  timesRow: { flexDirection: 'row', alignItems: 'flex-start' },
  timeBlock: { flex: 1 },
  timeDivider: { width: 16 },
  timeSegRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timeSegment: { alignItems: 'center', flex: 1 },
  timeInput: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#EDE9FE', borderRadius: 14, paddingVertical: 13, paddingHorizontal: 4, fontSize: 17, fontWeight: '700', color: '#0F0A2A', width: '100%', textAlign: 'center' },
  timeInputFilled: { borderColor: '#7C3AED', color: '#7C3AED' },
  timeSegLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
  timeSep: { fontSize: 20, color: '#C4B5FD', fontWeight: '300', marginBottom: 18 },

  errorBox: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, marginTop: 16 },
  errorText: { color: '#DC2626', fontSize: 13, fontWeight: '600' },
  submitBtn: { backgroundColor: '#7C3AED', borderRadius: 16, paddingVertical: 17, alignItems: 'center', marginTop: 28, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  submitBtnDisabled: { opacity: 0.7 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },

  // Auth wall
  authWall: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36, gap: 12 },
  authIconBox: { width: 72, height: 72, borderRadius: 24, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  authIcon: { fontSize: 32 },
  authTitle: { fontSize: 24, fontWeight: '800', color: '#0F0A2A', letterSpacing: -0.4, textAlign: 'center' },
  authSubtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 21, marginBottom: 8 },
  authPrimaryBtn: { width: '100%', backgroundColor: '#7C3AED', borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  authPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  authSecondaryBtn: { width: '100%', borderWidth: 1.5, borderColor: '#EDE9FE', borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  authSecondaryText: { color: '#7C3AED', fontWeight: '700', fontSize: 15 },
});
