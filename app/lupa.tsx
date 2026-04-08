import React, { useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';

// ── Dummy retos data ─────────────────────────────────────────────────────────

type RetoStatus = 'locked' | 'unlocked' | 'discovered';

interface Reto {
  id: number;
  title: string;
  acertijo: string;
  locationHint: string;
  category: string;
  categoryEmoji: string;
  status: RetoStatus;
  fragments: string;
  difficulty: 'Iniciado' | 'Explorador' | 'Maestro';
}

const RETOS: Reto[] = [
  {
    id: 1,
    title: 'La Flor Fálica del Obelisco',
    acertijo:
      'Fui esculpida por manos que conocieron la pólvora y la piedra. Corona un obelisco que mira al cielo desde la plaza donde el pueblo se reúne. Mi geometría esconde la sangre de Cascajo.',
    locationHint: 'Parque Principal — Obelisco',
    category: 'Monumento',
    categoryEmoji: '🗿',
    status: 'unlocked',
    fragments: '1/5',
    difficulty: 'Iniciado',
  },
  {
    id: 2,
    title: 'El Tiple del Maestro',
    acertijo:
      'Fui tallada en las montañas con cedro negro y nogal. Mis cuerdas cantaron antes que la pólvora. Búscame donde descansan los instrumentos que dieron alma a la Esparta colombiana.',
    locationHint: 'Casa de la Cultura Valerio Antonio Jiménez',
    category: 'Instrumento',
    categoryEmoji: '🎸',
    status: 'locked',
    fragments: '0/5',
    difficulty: 'Explorador',
  },
  {
    id: 3,
    title: 'La Memoria de Ramón Emilio',
    acertijo:
      'Mi nombre vive en el lugar donde hoy se corre y se salta. Fui voz del pueblo cuando el silencio era ley. Los paros cívicos del 80 resonaron con mi grito. Buscá mi rostro donde el deporte honra la resistencia.',
    locationHint: 'Unidad Deportiva',
    category: 'Personaje',
    categoryEmoji: '✊',
    status: 'locked',
    fragments: '0/5',
    difficulty: 'Maestro',
  },
  {
    id: 4,
    title: 'Las Campanas de la Asunción',
    acertijo:
      'Resueno cada hora desde hace más de dos siglos. Mi voz convocó ejércitos y procesiones. Fui forjada en bronce cuando la Esparta aún era un sueño de independencia. Levantá la mirada donde la fe se hizo piedra.',
    locationHint: 'Iglesia Nuestra Señora de la Asunción',
    category: 'Patrimonio',
    categoryEmoji: '🔔',
    status: 'locked',
    fragments: '0/5',
    difficulty: 'Explorador',
  },
  {
    id: 5,
    title: 'El Teatro de Simona',
    acertijo:
      'Llevo el nombre de una mujer que tejió cultura entre montañas. Mis paredes han escuchado tiples, poesía y aplausos durante generaciones. Soy el corazón escénico de la Esparta. Entrá donde el arte cobra vida.',
    locationHint: 'Teatro Simona Duque',
    category: 'Lugar',
    categoryEmoji: '🎭',
    status: 'locked',
    fragments: '0/5',
    difficulty: 'Iniciado',
  },
  {
    id: 6,
    title: 'El Cedro Negro del Bosque Montano',
    acertijo:
      'Mi madera dio cuerpo a guitarras y tiples que cantaron la libertad. Crezco en el bosque montano bajo del Oriente antioqueño, donde la niebla abraza las raíces. Buscá mi semilla donde lo verde se encuentra con la memoria.',
    locationHint: 'Sendero ecológico — Vereda',
    category: 'Naturaleza',
    categoryEmoji: '🌳',
    status: 'locked',
    fragments: '0/5',
    difficulty: 'Maestro',
  },
];

const PROGRESS = { discovered: 1, total: RETOS.length };

// ── Difficulty colors ────────────────────────────────────────────────────────

function difficultyColor(d: string) {
  if (d === 'Iniciado') return { bg: '#D1FAE5', text: '#065F46' };
  if (d === 'Explorador') return { bg: '#FEF3C7', text: '#92400E' };
  return { bg: '#FEE2E2', text: '#991B1B' };
}

// ── Component ────────────────────────────────────────────────────────────────

export default function LupaScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 14, bounciness: 4, useNativeDriver: true }),
    ]).start();
  }, []);

  const s = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 40 },

    // Header
    header: {
      paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16,
      backgroundColor: isDark ? '#252117' : '#FFFCF7',
      borderBottomWidth: 1, borderBottomColor: colors.border,
    },
    headerEyebrow: {
      fontSize: 11, fontWeight: '700', color: '#C9A96E',
      letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 4,
    },
    headerTitle: {
      fontSize: 28, fontWeight: '800', color: colors.text,
      letterSpacing: -0.5, lineHeight: 34,
    },
    headerSub: { fontSize: 14, color: colors.textMuted, marginTop: 4, lineHeight: 20 },

    // Progress
    progressWrap: {
      marginHorizontal: 20, marginTop: 16, marginBottom: 8,
      backgroundColor: isDark ? '#302A1E' : '#FFFFFF',
      borderRadius: 16, padding: 16,
      borderWidth: 1, borderColor: colors.border,
    },
    progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    progressLabel: { fontSize: 13, fontWeight: '700', color: colors.textSub },
    progressCount: { fontSize: 13, fontWeight: '800', color: '#B87333' },
    progressBarBg: {
      height: 8, borderRadius: 4,
      backgroundColor: isDark ? '#3D3425' : '#F0EBE0',
    },
    progressBarFill: {
      height: 8, borderRadius: 4, backgroundColor: '#B87333',
    },
    progressHint: { fontSize: 12, color: colors.textFaint, marginTop: 8, fontStyle: 'italic' },

    // Section
    sectionTitle: {
      fontSize: 13, fontWeight: '700', color: colors.textFaint,
      textTransform: 'uppercase', letterSpacing: 0.6,
      marginHorizontal: 20, marginTop: 20, marginBottom: 10,
    },

    // Reto card
    card: {
      marginHorizontal: 16, marginBottom: 12,
      backgroundColor: isDark ? '#252117' : '#FFFFFF',
      borderRadius: 18, overflow: 'hidden',
      borderWidth: 1, borderColor: colors.border,
      shadowColor: '#8B5E3C', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
    },
    cardUnlocked: { borderColor: '#B87333', borderWidth: 1.5 },
    cardLocked: { opacity: 0.7 },
    cardInner: { padding: 16 },
    cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    cardCategoryTag: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: isDark ? '#3A2E1A' : '#F5EDE0',
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
    },
    cardCategoryEmoji: { fontSize: 13 },
    cardCategoryText: { fontSize: 11, fontWeight: '700', color: '#B87333' },
    cardDiffBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    cardDiffText: { fontSize: 10, fontWeight: '700' },
    cardTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 8, lineHeight: 22 },
    cardTitleLocked: { color: colors.textMuted },
    cardAcertijo: {
      fontSize: 14, color: colors.textMuted, lineHeight: 22,
      fontStyle: 'italic', marginBottom: 12,
    },
    cardAcertijoLocked: { color: colors.textFaint },
    cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardLocation: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
    cardLocationDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#C9A96E' },
    cardLocationText: { fontSize: 12, color: colors.textFaint, flex: 1 },
    cardStatus: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
    },
    cardStatusUnlocked: { backgroundColor: isDark ? '#3A2E1A' : '#F5EDE0' },
    cardStatusLocked: { backgroundColor: isDark ? '#3D3425' : '#F0EBE0' },
    cardStatusIcon: { fontSize: 13 },
    cardStatusText: { fontSize: 11, fontWeight: '700' },
    cardStatusTextUnlocked: { color: '#B87333' },
    cardStatusTextLocked: { color: colors.textFaint },
    cardFragments: { fontSize: 11, fontWeight: '600', color: colors.textFaint, marginTop: 8 },

    // Locked overlay hint
    lockHint: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: isDark ? '#3D3425' : '#F5EDE0',
      marginTop: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    },
    lockHintIcon: { fontSize: 14 },
    lockHintText: { fontSize: 12, color: colors.textMuted, flex: 1, lineHeight: 17 },

    // CTA
    ctaWrap: { marginHorizontal: 20, marginTop: 20 },
    ctaCard: {
      backgroundColor: isDark ? '#302A1E' : '#FFFCF7',
      borderRadius: 16, padding: 20,
      borderWidth: 1.5, borderColor: '#C9A96E',
      alignItems: 'center',
    },
    ctaEmoji: { fontSize: 36, marginBottom: 10 },
    ctaTitle: { fontSize: 17, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 6 },
    ctaText: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  }), [colors, isDark]);

  return (
    <SafeAreaView style={s.safe}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerEyebrow}>El rompecabezas de la memoria</Text>
          <Text style={s.headerTitle}>La Lupa del Tiempo</Text>
          <Text style={s.headerSub}>
            Desenterrá los fragmentos ocultos del patrimonio de Marinilla.
            Cada reto te acerca a descifrar el alma del territorio.
          </Text>
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Progress */}
          <View style={s.progressWrap}>
            <View style={s.progressRow}>
              <Text style={s.progressLabel}>Fragmentos recuperados</Text>
              <Text style={s.progressCount}>{PROGRESS.discovered} / {PROGRESS.total}</Text>
            </View>
            <View style={s.progressBarBg}>
              <View style={[s.progressBarFill, { width: `${(PROGRESS.discovered / PROGRESS.total) * 100}%` }]} />
            </View>
            <Text style={s.progressHint}>
              "Has recuperado {PROGRESS.discovered} de {PROGRESS.total} fragmentos del alma musical de Marinilla"
            </Text>
          </View>

          {/* Unlocked section */}
          <Text style={s.sectionTitle}>Reto activo</Text>
          {RETOS.filter(r => r.status === 'unlocked').map(reto => {
            const dc = difficultyColor(reto.difficulty);
            return (
              <View key={reto.id} style={[s.card, s.cardUnlocked]}>
                <View style={s.cardInner}>
                  <View style={s.cardTopRow}>
                    <View style={s.cardCategoryTag}>
                      <Text style={s.cardCategoryEmoji}>{reto.categoryEmoji}</Text>
                      <Text style={s.cardCategoryText}>{reto.category}</Text>
                    </View>
                    <View style={[s.cardDiffBadge, { backgroundColor: dc.bg }]}>
                      <Text style={[s.cardDiffText, { color: dc.text }]}>{reto.difficulty}</Text>
                    </View>
                  </View>

                  <Text style={s.cardTitle}>{reto.title}</Text>
                  <Text style={s.cardAcertijo}>"{reto.acertijo}"</Text>

                  <View style={s.cardFooter}>
                    <View style={s.cardLocation}>
                      <View style={s.cardLocationDot} />
                      <Text style={s.cardLocationText}>{reto.locationHint}</Text>
                    </View>
                    <View style={[s.cardStatus, s.cardStatusUnlocked]}>
                      <Text style={s.cardStatusIcon}>🔓</Text>
                      <Text style={[s.cardStatusText, s.cardStatusTextUnlocked]}>Activo</Text>
                    </View>
                  </View>
                  <Text style={s.cardFragments}>Fragmentos: {reto.fragments}</Text>
                </View>
              </View>
            );
          })}

          {/* Locked section */}
          <Text style={s.sectionTitle}>Retos por descubrir</Text>
          {RETOS.filter(r => r.status === 'locked').map(reto => {
            const dc = difficultyColor(reto.difficulty);
            return (
              <View key={reto.id} style={[s.card, s.cardLocked]}>
                <View style={s.cardInner}>
                  <View style={s.cardTopRow}>
                    <View style={s.cardCategoryTag}>
                      <Text style={s.cardCategoryEmoji}>{reto.categoryEmoji}</Text>
                      <Text style={s.cardCategoryText}>{reto.category}</Text>
                    </View>
                    <View style={[s.cardDiffBadge, { backgroundColor: dc.bg }]}>
                      <Text style={[s.cardDiffText, { color: dc.text }]}>{reto.difficulty}</Text>
                    </View>
                  </View>

                  <Text style={[s.cardTitle, s.cardTitleLocked]}>{reto.title}</Text>
                  <Text style={[s.cardAcertijo, s.cardAcertijoLocked]}>"{reto.acertijo}"</Text>

                  <View style={s.cardFooter}>
                    <View style={s.cardLocation}>
                      <View style={[s.cardLocationDot, { backgroundColor: colors.textFaint }]} />
                      <Text style={s.cardLocationText}>{reto.locationHint}</Text>
                    </View>
                    <View style={[s.cardStatus, s.cardStatusLocked]}>
                      <Text style={s.cardStatusIcon}>🔒</Text>
                      <Text style={[s.cardStatusText, s.cardStatusTextLocked]}>Bloqueado</Text>
                    </View>
                  </View>

                  <View style={s.lockHint}>
                    <Text style={s.lockHintIcon}>📍</Text>
                    <Text style={s.lockHintText}>
                      Visitá el lugar y escaneá el anclaje QR para desbloquear este fragmento
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* CTA */}
          <View style={s.ctaWrap}>
            <View style={s.ctaCard}>
              <Text style={s.ctaEmoji}>🧭</Text>
              <Text style={s.ctaTitle}>La expedición apenas comienza</Text>
              <Text style={s.ctaText}>
                Recorré los escenarios de El Latido con los ojos abiertos.
                Cerca de cada evento hay un fragmento de la memoria esperando
                ser descubierto. Escaneá los anclajes QR para desbloquear
                los retos y recomponer la identidad del territorio.
              </Text>
            </View>
          </View>

        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
