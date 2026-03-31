import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
  ActivityIndicator,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useMunicipalities } from '../../hooks/useEvents';
import { ALL_CATEGORIES, Category, PARISHES, Parish } from '../../constants/categories';
import { CategoryPill } from '../../components/CategoryPill';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileScreen() {
  const { user, logout, isLoading, updatePreferences } = useAuth();
  const { data: municipalities } = useMunicipalities();
  const router = useRouter();
  const { isDark, toggleTheme, colors } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(14)).current;

  const [prefCategory, setPrefCategory] = useState<Category | 'all'>(
    user?.preferences?.category ?? 'all'
  );
  const [prefParish, setPrefParish] = useState<Parish | 'all'>(
    user?.preferences?.parish ?? 'all'
  );
  const [prefMunicipality, setPrefMunicipality] = useState<number | null>(
    user?.preferences?.municipalityId ?? null
  );
  const [prefMuniModalOpen, setPrefMuniModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const toastAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        speed: 14,
        bounciness: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  function handleLogout() {
    if (Platform.OS === 'web') {
      if (window.confirm('¿Cerrar sesión?')) logout();
      return;
    }
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  }

  async function handleSavePreferences() {
    setIsSaving(true);
    const result = await updatePreferences({
      category: prefCategory,
      municipalityId: prefMunicipality,
      parish: prefParish,
    });
    setIsSaving(false);
    if (!result.success) {
      Alert.alert('Error', 'No se pudieron guardar las preferencias.');
    } else {
      setSavedOk(true);
      toastAnim.setValue(0);
      Animated.timing(toastAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
      setTimeout(() => {
        Animated.timing(toastAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(
          () => setSavedOk(false)
        );
      }, 2200);
    }
  }

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.bg },
    scrollContent: { flexGrow: 1 },
    container: {
      alignItems: 'center',
      paddingTop: 52,
      paddingHorizontal: 24,
    },
    avatarWrap: { position: 'relative', marginBottom: 14 },
    avatar: {
      width: 80, height: 80, borderRadius: 40,
      backgroundColor: '#7C3AED',
      alignItems: 'center', justifyContent: 'center',
      shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
    },
    avatarImage: { width: 80, height: 80, borderRadius: 40 },
    avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
    adminDot: {
      position: 'absolute', bottom: 2, right: 2,
      width: 16, height: 16, borderRadius: 8,
      backgroundColor: '#F59E0B',
      borderWidth: 2.5, borderColor: colors.bg,
    },
    name: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 4, letterSpacing: -0.3 },
    email: { fontSize: 14, color: colors.textFaint, marginBottom: 16 },
    adminBadge: {
      backgroundColor: colors.surfacePrimary,
      paddingHorizontal: 14, paddingVertical: 6,
      borderRadius: 20, marginBottom: 20,
    },
    adminBadgeText: { color: '#7C3AED', fontWeight: '700', fontSize: 13 },
    prefsCard: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: 16, padding: 16, marginBottom: 16,
      borderWidth: 1, borderColor: colors.border,
      shadowColor: '#6D28D9', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    },
    prefsTitle: {
      fontSize: 13, fontWeight: '700', color: '#7C3AED',
      textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12,
    },
    prefsLabel: {
      fontSize: 12, fontWeight: '600', color: colors.textFaint,
      marginBottom: 6, marginTop: 8,
    },
    prefsRow: { paddingBottom: 4, gap: 6 },
    parishPill: {
      paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
      borderWidth: 1.5, borderColor: '#D97706', backgroundColor: colors.surface, marginRight: 8,
    },
    parishPillActive: { backgroundColor: '#B45309', borderColor: '#B45309' },
    parishPillText: { fontSize: 12, fontWeight: '600', color: '#B45309' },
    parishPillTextActive: { color: '#fff' },
    prefsMuniRow: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      borderWidth: 1.5, borderColor: colors.borderPrimary, borderRadius: 10,
      paddingHorizontal: 12, paddingVertical: 10, marginTop: 2,
    },
    prefsMuniText: { fontSize: 14, fontWeight: '600', color: colors.textSub },
    prefsMuniChevron: { fontSize: 11, color: '#A78BFA' },
    saveBtn: {
      marginTop: 16, backgroundColor: '#7C3AED',
      borderRadius: 12, paddingVertical: 13, alignItems: 'center',
    },
    saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    saveToast: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 6, marginTop: 10, paddingVertical: 9, paddingHorizontal: 14,
      backgroundColor: '#D1FAE5', borderRadius: 10,
      borderWidth: 1, borderColor: '#6EE7B7',
    },
    saveToastText: { fontSize: 13, fontWeight: '700', color: '#065F46' },
    menu: { width: '100%', gap: 10 },
    menuItem: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: colors.surface, borderRadius: 16,
      paddingHorizontal: 16, paddingVertical: 16, width: '100%', gap: 12,
      shadowColor: '#6D28D9', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
      borderWidth: 1, borderColor: colors.border,
    },
    menuItemEmoji: { fontSize: 19 },
    menuItemText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.textSub },
    menuItemArrow: { fontSize: 20, color: '#C4B5FD', fontWeight: '300' },
    guestContainer: {
      flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40,
    },
    guestIconWrap: {
      width: 90, height: 90, borderRadius: 28, backgroundColor: colors.surfacePrimary,
      alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative',
    },
    guestEmoji: { fontSize: 40 },
    guestEmojiAccent: { fontSize: 20, position: 'absolute', bottom: 6, right: 6 },
    guestTitle: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 8, letterSpacing: -0.3 },
    guestText: { fontSize: 15, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 36 },
    loginBtn: {
      backgroundColor: '#7C3AED', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 40,
      width: '100%', alignItems: 'center', marginBottom: 10,
      shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.28, shadowRadius: 12, elevation: 5,
    },
    loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    registerBtn: {
      backgroundColor: colors.surfacePrimaryLight, borderRadius: 16, paddingVertical: 16,
      paddingHorizontal: 40, width: '100%', alignItems: 'center',
      borderWidth: 1.5, borderColor: colors.borderPrimary,
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
    themeToggle: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: colors.surface, borderRadius: 14,
      paddingHorizontal: 16, paddingVertical: 13,
      width: '100%', marginBottom: 16,
      borderWidth: 1, borderColor: colors.border,
    },
    themeToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    themeToggleEmoji: { fontSize: 18 },
    themeToggleLabel: { fontSize: 14, fontWeight: '600', color: colors.textSub },
    themeTogglePill: {
      backgroundColor: colors.surfacePrimary, borderRadius: 20,
      paddingHorizontal: 10, paddingVertical: 4,
      borderWidth: 1, borderColor: colors.borderPrimary,
    },
    themeTogglePillOn: {
      backgroundColor: '#7C3AED', borderColor: '#7C3AED',
    },
    themeTogglePillText: { fontSize: 11, fontWeight: '700', color: '#7C3AED' },
    themeTogglePillTextOn: { color: '#fff' },
  }), [colors]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.guestContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[
            styles.guestContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.guestIconWrap}>
            <Text style={styles.guestEmoji}>🤝</Text>
            <Text style={styles.guestEmojiAccent}>✨</Text>
          </View>
          <Text style={styles.guestTitle}>¡Bienvenido!</Text>
          <Text style={styles.guestText}>
            Uníte a la comunidad y estate al tanto de todo lo que mueve el pueblo. ¡Acá te esperamos!
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

  const displayName =
    user.full_name && user.full_name !== user.email
      ? user.full_name
      : user.email
          .split('@')[0]
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

  const prefMuniName = prefMunicipality
    ? (municipalities?.find(m => m.id === prefMunicipality)?.name ?? 'Cargando…')
    : 'Todas';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.container,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            {user.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            {user.role === 'admin' && (
              <View style={styles.adminDot} />
            )}
          </View>

          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{user.email}</Text>

          {user.role === 'admin' && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>⚡ Administrador</Text>
            </View>
          )}

          {/* Modo oscuro */}
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme} activeOpacity={0.8}>
            <View style={styles.themeToggleLeft}>
              <Text style={styles.themeToggleEmoji}>🌙</Text>
              <Text style={styles.themeToggleLabel}>Modo oscuro</Text>
            </View>
            <View style={[styles.themeTogglePill, isDark && styles.themeTogglePillOn]}>
              <Text style={[styles.themeTogglePillText, isDark && styles.themeTogglePillTextOn]}>
                {isDark ? 'Activado' : 'Apagado'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Mis preferencias */}
          <View style={styles.prefsCard}>
            <Text style={styles.prefsTitle}>Mis preferencias</Text>

            <Text style={styles.prefsLabel}>Categoría por defecto</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.prefsRow}
            >
              <CategoryPill
                category="all"
                selected={prefCategory === 'all'}
                onPress={() => { setPrefCategory('all'); setPrefParish('all'); }}
              />
              {ALL_CATEGORIES.map(cat => (
                <CategoryPill
                  key={cat.id}
                  category={cat.id}
                  selected={prefCategory === cat.id}
                  onPress={() => { setPrefCategory(cat.id); setPrefParish('all'); }}
                />
              ))}
            </ScrollView>

            {prefCategory === 'religious' && (
              <>
                <Text style={styles.prefsLabel}>Parroquia</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.prefsRow}
                >
                  <TouchableOpacity
                    style={[styles.parishPill, prefParish === 'all' && styles.parishPillActive]}
                    onPress={() => setPrefParish('all')}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.parishPillText, prefParish === 'all' && styles.parishPillTextActive]}>Todas</Text>
                  </TouchableOpacity>
                  {PARISHES.map(p => (
                    <TouchableOpacity
                      key={p}
                      style={[styles.parishPill, prefParish === p && styles.parishPillActive]}
                      onPress={() => setPrefParish(p)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.parishPillText, prefParish === p && styles.parishPillTextActive]}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <Text style={styles.prefsLabel}>Municipalidad por defecto</Text>
            <TouchableOpacity
              style={styles.prefsMuniRow}
              onPress={() => setPrefMuniModalOpen(true)}
              activeOpacity={0.75}
            >
              <Text style={styles.prefsMuniText}>{prefMuniName}</Text>
              <Text style={styles.prefsMuniChevron}>▾</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveBtn, isSaving && { opacity: 0.6 }]}
              onPress={handleSavePreferences}
              activeOpacity={0.8}
              disabled={isSaving}
            >
              <Text style={styles.saveBtnText}>{isSaving ? 'Guardando…' : 'Guardar preferencias'}</Text>
            </TouchableOpacity>

            {savedOk && (
              <Animated.View style={[styles.saveToast, { opacity: toastAnim }]}>
                <Text style={styles.saveToastText}>✓ Preferencias guardadas</Text>
              </Animated.View>
            )}
          </View>

          <View style={styles.menu}>
            {user.role === 'admin' && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => router.push('/admin/dashboard')}
                activeOpacity={0.8}
              >
                <Text style={styles.menuItemEmoji}>📋</Text>
                <Text style={styles.menuItemText}>Panel de administración</Text>
                <Text style={styles.menuItemArrow}>›</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.menuItemEmoji}>🚪</Text>
              <Text style={[styles.menuItemText, { color: '#EF4444' }]}>
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 90 }} />
        </Animated.View>
      </ScrollView>

      {/* Modal municipalidad preferencias */}
      <Modal
        visible={prefMuniModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPrefMuniModalOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setPrefMuniModalOpen(false)}>
          <Pressable style={styles.modalSheet} onPress={() => {}}>
            <Text style={styles.modalTitle}>Municipalidad por defecto</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => { setPrefMunicipality(null); setPrefMuniModalOpen(false); }}
              activeOpacity={0.75}
            >
              <Text style={[styles.modalOptionText, prefMunicipality === null && styles.modalOptionTextActive]}>Todas</Text>
              {prefMunicipality === null && <Text style={styles.modalCheckmark}>✓</Text>}
            </TouchableOpacity>
            {(municipalities ?? []).map(m => (
              <TouchableOpacity
                key={m.id}
                style={styles.modalOption}
                onPress={() => { setPrefMunicipality(m.id); setPrefMuniModalOpen(false); }}
                activeOpacity={0.75}
              >
                <Text style={[styles.modalOptionText, prefMunicipality === m.id && styles.modalOptionTextActive]}>{m.name}</Text>
                {prefMunicipality === m.id && <Text style={styles.modalCheckmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
