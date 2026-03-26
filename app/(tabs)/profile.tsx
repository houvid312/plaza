import React, { useRef, useEffect } from 'react';
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
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(14)).current;

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

  return (
    <SafeAreaView style={styles.safe}>
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
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.menuItemEmoji}>🚪</Text>
            <Text style={[styles.menuItemText, { color: '#EF4444' }]}>
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FAFAF8' },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: 24,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  adminDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F59E0B',
    borderWidth: 2.5,
    borderColor: '#FAFAF8',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F0A2A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  email: { fontSize: 14, color: '#94A3B8', marginBottom: 16 },
  adminBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 28,
  },
  adminBadgeText: { color: '#7C3AED', fontWeight: '700', fontSize: 13 },
  menu: { width: '100%', gap: 10 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
    gap: 12,
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F0FD',
  },
  logoutItem: {},
  menuItemEmoji: { fontSize: 19 },
  menuItemText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#374151' },
  menuItemArrow: { fontSize: 20, color: '#C4B5FD', fontWeight: '300' },
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  guestIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  guestEmoji: { fontSize: 40 },
  guestEmojiAccent: { fontSize: 20, position: 'absolute', bottom: 6, right: 6 },
  guestTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F0A2A',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  guestText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },
  loginBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 5,
  },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  registerBtn: {
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
  },
  registerBtnText: { color: '#7C3AED', fontWeight: '700', fontSize: 16 },
});
