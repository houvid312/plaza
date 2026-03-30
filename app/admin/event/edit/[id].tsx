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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEvent, useUpdateEvent } from '../../../../hooks/useEvents';
import { ALL_CATEGORIES, Category } from '../../../../constants/categories';
import { useTheme } from '../../../../context/ThemeContext';

const TITLE_MAX = 120;
const DESC_MAX = 500;
const FIELD_MAX = 200;

function timeToMinutes(hh: string, mm: string) {
  return parseInt(hh, 10) * 60 + parseInt(mm, 10);
}

function validateFields(params: {
  title: string;
  day: string; month: string; year: string;
  timeHH: string; timeMM: string;
  timeEndHH: string; timeEndMM: string;
  location: string; address: string; description: string;
}): string | null {
  const { title, day, month, year, timeHH, timeMM, timeEndHH, timeEndMM, location, address, description } = params;

  if (!title.trim()) return 'El título es obligatorio.';
  if (title.trim().length > TITLE_MAX) return `El título no puede superar ${TITLE_MAX} caracteres.`;
  if (description.length > DESC_MAX) return `La descripción no puede superar ${DESC_MAX} caracteres.`;
  if (location.trim().length > FIELD_MAX) return 'El campo Lugar es demasiado largo.';
  if (address.trim().length > FIELD_MAX) return 'El campo Dirección es demasiado largo.';

  // Date validation
  if (!day || !month || year.length !== 4) return 'La fecha es obligatoria (DD/MM/AAAA).';
  const d = parseInt(day, 10), m = parseInt(month, 10), y = parseInt(year, 10);
  if (isNaN(d) || d < 1 || d > 31) return 'El día debe estar entre 01 y 31.';
  if (isNaN(m) || m < 1 || m > 12) return 'El mes debe estar entre 01 y 12.';
  if (isNaN(y) || y < 2000 || y > 2100) return 'El año debe estar entre 2000 y 2100.';
  // Check coherent date (e.g. 31/02 is invalid)
  const dateObj = new Date(y, m - 1, d);
  if (dateObj.getFullYear() !== y || dateObj.getMonth() !== m - 1 || dateObj.getDate() !== d) {
    return `La fecha ${day}/${month}/${year} no es válida.`;
  }

  // Time validation
  const hasStart = timeHH !== '' || timeMM !== '';
  const hasEnd = timeEndHH !== '' || timeEndMM !== '';

  if (hasStart) {
    if (timeHH === '' || timeMM === '') return 'Completá la hora de inicio (HH y MM).';
    const hh = parseInt(timeHH, 10), mm = parseInt(timeMM, 10);
    if (isNaN(hh) || hh < 0 || hh > 23) return 'La hora de inicio debe estar entre 00 y 23.';
    if (isNaN(mm) || mm < 0 || mm > 59) return 'Los minutos de inicio deben estar entre 00 y 59.';
  }
  if (hasEnd) {
    if (timeEndHH === '' || timeEndMM === '') return 'Completá la hora de fin (HH y MM).';
    const hh = parseInt(timeEndHH, 10), mm = parseInt(timeEndMM, 10);
    if (isNaN(hh) || hh < 0 || hh > 23) return 'La hora de fin debe estar entre 00 y 23.';
    if (isNaN(mm) || mm < 0 || mm > 59) return 'Los minutos de fin deben estar entre 00 y 59.';
    if (hasStart) {
      if (timeToMinutes(timeEndHH, timeEndMM) <= timeToMinutes(timeHH, timeMM)) {
        return 'La hora de fin debe ser posterior a la hora de inicio.';
      }
    }
  }

  return null;
}

export default function AdminEventEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { data: event, isLoading } = useEvent(Number(id));
  const { mutateAsync: updateEvent, isPending } = useUpdateEvent();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('cultural');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  // Start time segments
  const [timeHH, setTimeHH] = useState('');
  const [timeMM, setTimeMM] = useState('');
  // End time segments
  const [timeEndHH, setTimeEndHH] = useState('');
  const [timeEndMM, setTimeEndMM] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [initialized, setInitialized] = useState(false);

  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  const timeMMRef = useRef<TextInput>(null);
  const timeEndMMRef = useRef<TextInput>(null);

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: {
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
      backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingRight: 12, width: 80 },
    backArrow: { fontSize: 18, color: '#7C3AED', fontWeight: '600' },
    backLabel: { fontSize: 13, color: '#7C3AED', fontWeight: '600' },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { fontSize: 16, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
    form: { paddingHorizontal: 20, paddingTop: 8 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7, marginTop: 16 },
    label: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginBottom: 7, marginTop: 16 },
    counter: { fontSize: 11, color: colors.textFaint, fontWeight: '500' },
    counterOver: { color: '#EF4444', fontWeight: '700' },
    input: {
      backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderPrimary,
      borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: colors.text,
    },
    inputError: { borderColor: '#FCA5A5' },
    textarea: { minHeight: 100, paddingTop: 13 },
    categoryRow: { marginBottom: 4 },
    catOption: {
      flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8,
      borderRadius: 20, borderWidth: 1.5, borderColor: colors.borderPrimaryLight, backgroundColor: colors.surface, marginRight: 8,
    },
    catEmoji: { fontSize: 13 },
    catLabel: { fontSize: 12, fontWeight: '600' },
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dateSegment: { alignItems: 'center', flex: 1 },
    dateSegmentWide: { alignItems: 'center', flex: 1.6 },
    dateInput: {
      backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderPrimary,
      borderRadius: 14, paddingVertical: 13, paddingHorizontal: 8, fontSize: 17, fontWeight: '700', color: colors.text, width: '100%',
    },
    dateInputFilled: { borderColor: '#7C3AED', color: '#7C3AED' },
    dateSegLabel: { fontSize: 10, color: colors.textFaint, fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
    dateSep: { fontSize: 20, color: '#C4B5FD', fontWeight: '300', marginBottom: 18 },
    timesRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 0 },
    timeBlock: { flex: 1 },
    timeDivider: { width: 16 },
    timeSegRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    timeSegment: { alignItems: 'center', flex: 1 },
    timeInput: {
      backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderPrimary,
      borderRadius: 14, paddingVertical: 13, paddingHorizontal: 4, fontSize: 17, fontWeight: '700', color: colors.text, width: '100%', textAlign: 'center',
    },
    timeInputFilled: { borderColor: '#7C3AED', color: '#7C3AED' },
    timeSegLabel: { fontSize: 10, color: colors.textFaint, fontWeight: '600', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.4 },
    timeSep: { fontSize: 20, color: '#C4B5FD', fontWeight: '300', marginBottom: 18 },
    errorBox: { backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, marginTop: 16 },
    errorText: { color: '#DC2626', fontSize: 13, fontWeight: '600' },
    saveBtn: {
      backgroundColor: '#7C3AED', borderRadius: 16, paddingVertical: 17, alignItems: 'center',
      marginTop: 28, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
    },
    saveBtnDisabled: { opacity: 0.7 },
    saveText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
  }), [colors]);

  useEffect(() => {
    if (!event || initialized) return;
    setTitle(event.title);
    setDescription(event.description ?? '');
    setCategory(event.category as Category);
    const [yyyy, mm, dd] = event.event_date.split('-');
    setYear(yyyy);
    setMonth(mm);
    setDay(dd);
    if (event.event_time) {
      const [hh, mins] = event.event_time.split(':');
      setTimeHH(hh ?? '');
      setTimeMM(mins ?? '');
    }
    if (event.event_time_end) {
      const [hh, mins] = event.event_time_end.split(':');
      setTimeEndHH(hh ?? '');
      setTimeEndMM(mins ?? '');
    }
    setLocation(event.location ?? '');
    setAddress(event.address ?? '');
    setInitialized(true);
  }, [event]);

  if (isLoading || !initialized) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text>Evento no encontrado</Text>
      </View>
    );
  }

  async function handleSave() {
    const error = validateFields({ title, day, month, year, timeHH, timeMM, timeEndHH, timeEndMM, location, address, description });
    if (error) { setErrorMsg(error); return; }
    setErrorMsg('');

    const startTime = timeHH && timeMM ? `${timeHH.padStart(2,'0')}:${timeMM.padStart(2,'0')}` : null;
    const endTime = timeEndHH && timeEndMM ? `${timeEndHH.padStart(2,'0')}:${timeEndMM.padStart(2,'0')}` : null;

    try {
      await updateEvent({
        id: event!.id,
        title: title.trim(),
        description: description.trim() || null,
        category,
        event_date: `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`,
        event_time: startTime,
        event_time_end: endTime,
        location: location.trim() || null,
        address: address.trim() || null,
      });
      router.back();
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'No se pudo guardar el evento.');
    }
  }

  const titleOver = title.length > TITLE_MAX;
  const descOver = description.length > DESC_MAX;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Panel Admin</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Editar Evento</Text>
        </View>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>

          {/* Category */}
          <Text style={styles.label}>Categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow} contentContainerStyle={{ paddingRight: 16 }}>
            {ALL_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[styles.catOption, category === cat.id && { backgroundColor: cat.color, borderColor: cat.color }]}
                activeOpacity={0.75}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text style={[styles.catLabel, { color: category === cat.id ? '#fff' : '#4B5563' }]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Title */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Título del evento *</Text>
            <Text style={[styles.counter, titleOver && styles.counterOver]}>{title.length}/{TITLE_MAX}</Text>
          </View>
          <TextInput
            style={[styles.input, titleOver && styles.inputError]}
            value={title}
            onChangeText={setTitle}
            placeholder="Ej: Feria de Artesanías"
            placeholderTextColor="#C4B5FD"
            maxLength={TITLE_MAX + 10}
          />

          {/* Description */}
          <View style={styles.labelRow}>
            <Text style={styles.label}>Descripción</Text>
            <Text style={[styles.counter, descOver && styles.counterOver]}>{description.length}/{DESC_MAX}</Text>
          </View>
          <TextInput
            style={[styles.input, styles.textarea, descOver && styles.inputError]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe el evento..."
            placeholderTextColor="#C4B5FD"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {/* Date */}
          <Text style={styles.label}>Fecha *</Text>
          <View style={styles.dateRow}>
            <View style={styles.dateSegment}>
              <TextInput
                style={[styles.dateInput, day && styles.dateInputFilled]}
                value={day}
                onChangeText={v => {
                  const n = v.replace(/\D/g, '').slice(0, 2);
                  setDay(n);
                  if (n.length === 2) monthRef.current?.focus();
                }}
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
                onChangeText={v => {
                  const n = v.replace(/\D/g, '').slice(0, 2);
                  setMonth(n);
                  if (n.length === 2) yearRef.current?.focus();
                }}
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
            {/* Start time */}
            <View style={styles.timeBlock}>
              <Text style={styles.label}>Hora inicio</Text>
              <View style={styles.timeSegRow}>
                <View style={styles.timeSegment}>
                  <TextInput
                    style={[styles.timeInput, timeHH && styles.timeInputFilled]}
                    value={timeHH}
                    onChangeText={v => {
                      const n = v.replace(/\D/g, '').slice(0, 2);
                      const val = n.length === 2 ? String(Math.min(parseInt(n, 10), 23)).padStart(2, '0') : n;
                      setTimeHH(val);
                      if (val.length === 2) timeMMRef.current?.focus();
                    }}
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
                    onChangeText={v => {
                      const n = v.replace(/\D/g, '').slice(0, 2);
                      setTimeMM(n.length === 2 ? String(Math.min(parseInt(n, 10), 59)).padStart(2, '0') : n);
                    }}
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

            {/* End time */}
            <View style={styles.timeBlock}>
              <Text style={styles.label}>Hora fin</Text>
              <View style={styles.timeSegRow}>
                <View style={styles.timeSegment}>
                  <TextInput
                    style={[styles.timeInput, timeEndHH && styles.timeInputFilled]}
                    value={timeEndHH}
                    onChangeText={v => {
                      const n = v.replace(/\D/g, '').slice(0, 2);
                      const val = n.length === 2 ? String(Math.min(parseInt(n, 10), 23)).padStart(2, '0') : n;
                      setTimeEndHH(val);
                      if (val.length === 2) timeEndMMRef.current?.focus();
                    }}
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
                    onChangeText={v => {
                      const n = v.replace(/\D/g, '').slice(0, 2);
                      setTimeEndMM(n.length === 2 ? String(Math.min(parseInt(n, 10), 59)).padStart(2, '0') : n);
                    }}
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
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Ej: Plaza Central"
            placeholderTextColor="#C4B5FD"
            maxLength={FIELD_MAX}
          />

          {/* Address */}
          <Text style={styles.label}>Dirección</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Ej: Av. Principal 100"
            placeholderTextColor="#C4B5FD"
            maxLength={FIELD_MAX}
          />

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.saveBtn, isPending && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={isPending}
            activeOpacity={0.85}
          >
            {isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Guardar cambios</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

