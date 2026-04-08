import React, { useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useTodayEvents } from '../../hooks/useEvents';

export default function HomeHub() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { data: todayEvents } = useTodayEvents();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, speed: 12, bounciness: 4, useNativeDriver: true }),
      ]),
      Animated.stagger(150, [
        Animated.spring(card1Anim, { toValue: 1, speed: 14, bounciness: 6, useNativeDriver: true }),
        Animated.spring(card2Anim, { toValue: 1, speed: 14, bounciness: 6, useNativeDriver: true }),
      ]),
    ]).start();

    // Pulse animation for the live indicator (no infinite loop to avoid blocking screenshots)
    pulseAnim.setValue(1.1);
  }, []);

  const todayCount = todayEvents?.length ?? 0;
  const liveCount = todayEvents?.filter(e => {
    if (!e.event_time) return false;
    const now = new Date();
    const [h, m] = e.event_time.split(':').map(Number);
    const start = new Date(); start.setHours(h, m, 0);
    if (e.event_time_end) {
      const [eh, em] = e.event_time_end.split(':').map(Number);
      const end = new Date(); end.setHours(eh, em, 0);
      return now >= start && now <= end;
    }
    return now >= start;
  }).length ?? 0;

  const rawDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
  const dateStr = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  const s = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: isDark ? '#1A1710' : '#FAF8F3' },
    container: {
      flex: 1, justifyContent: 'center', alignItems: 'center',
      paddingHorizontal: 24, paddingBottom: 80,
    },
    headerSection: { alignItems: 'center', marginBottom: 40 },
    compass: { fontSize: 44, marginBottom: 16 },
    title: {
      fontSize: 28, fontWeight: '800', color: colors.text,
      textAlign: 'center', letterSpacing: -0.5, lineHeight: 34,
    },
    subtitle: {
      fontSize: 16, fontWeight: '600', color: '#C9A96E',
      fontStyle: 'italic', textAlign: 'center', marginTop: 4,
    },
    date: {
      fontSize: 13, color: colors.textFaint, marginTop: 10,
      textTransform: 'capitalize',
    },
    cardsWrap: { width: '100%', gap: 16 },
    card: {
      borderRadius: 22, overflow: 'hidden',
      shadowColor: '#8B5E3C', shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15, shadowRadius: 20, elevation: 8,
    },
    cardInner: {
      flexDirection: 'row', alignItems: 'center', padding: 22, gap: 16,
    },
    cardLatido: { backgroundColor: '#B87333' },
    cardLupa: {
      backgroundColor: isDark ? '#302A1E' : '#FFFFFF',
      borderWidth: 1.5, borderColor: isDark ? '#4A3F2E' : '#E8D5B7',
    },
    cardIconWrap: {
      width: 56, height: 56, borderRadius: 18,
      alignItems: 'center', justifyContent: 'center',
    },
    cardLatidoIcon: { backgroundColor: 'rgba(255,255,255,0.2)' },
    cardLupaIcon: { backgroundColor: isDark ? '#3A2E1A' : '#F5EDE0' },
    cardIconEmoji: { fontSize: 26 },
    cardTextWrap: { flex: 1 },
    cardTitle: { fontSize: 19, fontWeight: '800', letterSpacing: -0.3 },
    cardTitleLatido: { color: '#FFFFFF' },
    cardTitleLupa: { color: colors.text },
    cardDesc: { fontSize: 13, marginTop: 3, lineHeight: 18 },
    cardDescLatido: { color: 'rgba(255,255,255,0.8)' },
    cardDescLupa: { color: colors.textMuted },
    cardArrow: { fontSize: 22, fontWeight: '300' },
    cardArrowLatido: { color: 'rgba(255,255,255,0.6)' },
    cardArrowLupa: { color: '#C9A96E' },
    liveBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
      marginTop: 10, alignSelf: 'flex-start',
    },
    liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FCD34D' },
    liveBadgeText: { fontSize: 11, fontWeight: '700', color: '#FCD34D' },
    lupaTag: {
      marginTop: 10, alignSelf: 'flex-start',
      backgroundColor: isDark ? '#4A3F2E' : '#F5EDE0',
      paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    },
    lupaTagText: { fontSize: 11, fontWeight: '700', color: '#B87333', fontStyle: 'italic' },
    brujulaLink: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 8, marginTop: 24, paddingVertical: 14,
      borderRadius: 16, borderWidth: 1.5,
      borderColor: isDark ? '#4A3F2E' : '#E8D5B7',
      backgroundColor: isDark ? '#252117' : '#FFFFFF',
    },
    brujulaIcon: { color: '#C9A96E' },
    brujulaText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
    brujulaArrow: { fontSize: 13, color: '#C9A96E' },
    footer: {
      position: 'absolute', bottom: 86, left: 0, right: 0,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 11, color: colors.textFaint, letterSpacing: 1,
      textTransform: 'uppercase', fontWeight: '600',
    },
  }), [colors, isDark]);

  return (
    <SafeAreaView style={s.safe}>
      <Animated.View
        style={[
          s.container,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Header */}
        <View style={s.headerSection}>
          <Text style={s.compass}>🧭</Text>
          <Text style={s.title}>Resonancias{'\n'}de la Esparta</Text>
          <Text style={s.subtitle}>El Atlas Vivo de Marinilla</Text>
          <Text style={s.date}>{dateStr}</Text>
        </View>

        {/* Portal cards */}
        <View style={s.cardsWrap}>
          {/* El Latido */}
          <Animated.View
            style={[
              s.card,
              {
                opacity: card1Anim,
                transform: [{ translateY: card1Anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
              },
            ]}
          >
            <TouchableOpacity
              style={[s.cardInner, s.cardLatido]}
              onPress={() => router.push('/(tabs)/latido')}
              activeOpacity={0.85}
            >
              <View style={[s.cardIconWrap, s.cardLatidoIcon]}>
                <Text style={s.cardIconEmoji}>📡</Text>
              </View>
              <View style={s.cardTextWrap}>
                <Text style={[s.cardTitle, s.cardTitleLatido]}>El Latido</Text>
                <Text style={[s.cardDesc, s.cardDescLatido]}>
                  El pulso del presente — descubrí qué vibra hoy en el territorio
                </Text>
                {todayCount > 0 && (
                  <View style={s.liveBadge}>
                    {liveCount > 0 && (
                      <Animated.View style={[s.liveDot, { transform: [{ scale: pulseAnim }] }]} />
                    )}
                    <Text style={s.liveBadgeText}>
                      {liveCount > 0
                        ? `${liveCount} resonando ahora · ${todayCount} hoy`
                        : `${todayCount} evento${todayCount !== 1 ? 's' : ''} hoy`}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={[s.cardArrow, s.cardArrowLatido]}>›</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* La Lupa del Tiempo */}
          <Animated.View
            style={[
              s.card,
              {
                opacity: card2Anim,
                transform: [{ translateY: card2Anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
              },
            ]}
          >
            <TouchableOpacity
              style={[s.cardInner, s.cardLupa]}
              onPress={() => {}}
              activeOpacity={0.85}
            >
              <View style={[s.cardIconWrap, s.cardLupaIcon]}>
                <Text style={s.cardIconEmoji}>🔍</Text>
              </View>
              <View style={s.cardTextWrap}>
                <Text style={[s.cardTitle, s.cardTitleLupa]}>La Lupa del Tiempo</Text>
                <Text style={[s.cardDesc, s.cardDescLupa]}>
                  El rompecabezas de la memoria — desenterrá las huellas del pasado
                </Text>
                <View style={s.lupaTag}>
                  <Text style={s.lupaTagText}>Próximamente</Text>
                </View>
              </View>
              <Text style={[s.cardArrow, s.cardArrowLupa]}>›</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* La Brújula shortcut */}
        <TouchableOpacity
          style={s.brujulaLink}
          onPress={() => router.push('/(tabs)/explore')}
          activeOpacity={0.8}
        >
          <Ionicons name="compass-outline" size={18} style={s.brujulaIcon} />
          <Text style={s.brujulaText}>La Brújula — expediciones próximas</Text>
          <Text style={s.brujulaArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Footer */}
      <View style={s.footer}>
        <Text style={s.footerText}>Expedicionario de la memoria</Text>
      </View>
    </SafeAreaView>
  );
}
