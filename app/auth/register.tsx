import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Completá todos los campos.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    const result = await register(name.trim(), email.trim(), password.trim());
    setLoading(false);
    if (result.success) {
      setConfirmed(true);
    } else {
      setErrorMsg(result.error ?? 'No se pudo crear la cuenta.');
    }
  }

  if (confirmed) {
    return (
      <View style={styles.confirmContainer}>
        <View style={styles.confirmIconBox}>
          <Text style={styles.confirmIcon}>✉️</Text>
        </View>
        <Text style={styles.confirmTitle}>Revisá tu correo</Text>
        <Text style={styles.confirmText}>
          Te enviamos un email a{' '}
          <Text style={styles.confirmEmail}>{email}</Text>
          {' '}para confirmar tu cuenta. Una vez confirmado podés iniciar sesión.
        </Text>
        <TouchableOpacity
          style={[styles.btn, styles.confirmBtn]}
          onPress={() => router.replace('/auth/login')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Ir a iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Registrate para publicar eventos</Text>

        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Juan García"
          placeholderTextColor="#D1D5DB"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#D1D5DB"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor="#D1D5DB"
        />

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.btn}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Crear cuenta</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/auth/login')}
          style={styles.linkBtn}
        >
          <Text style={styles.linkText}>
            ¿Ya tenés cuenta?{' '}
            <Text style={styles.linkHighlight}>Iniciar sesión</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 40, backgroundColor: '#FAFAFA' },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#9CA3AF', marginBottom: 32 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111827',
  },
  btn: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  linkBtn: { alignItems: 'center', marginTop: 16 },
  linkText: { fontSize: 14, color: '#6B7280' },
  linkHighlight: { color: '#7C3AED', fontWeight: '700' },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  errorText: { color: '#DC2626', fontSize: 13, fontWeight: '600' },
  confirmContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36,
    gap: 12,
  },
  confirmIconBox: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  confirmIcon: { fontSize: 36 },
  confirmTitle: { fontSize: 24, fontWeight: '800', color: '#0F0A2A', textAlign: 'center' },
  confirmText: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  confirmEmail: { fontWeight: '700', color: '#7C3AED' },
  confirmBtn: { width: '100%', marginTop: 8 },
});
