import { useRouter } from 'expo-router';
import React, { useRef, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const submitting = useRef(false);
  const { resetPassword } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  async function handleReset() {
    if (submitting.current) return;
    if (!email.trim()) {
      setErrorMsg('Ingresá tu email.');
      return;
    }
    submitting.current = true;
    setErrorMsg('');
    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);
    submitting.current = false;
    if (result.success) {
      setSent(true);
    } else {
      setErrorMsg(result.error ?? 'No se pudo enviar el email.');
    }
  }

  const styles = useMemo(() => StyleSheet.create({
    container: { flexGrow: 1, padding: 24, paddingTop: 40, backgroundColor: colors.bgAlt },
    title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 8 },
    subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 32, lineHeight: 21 },
    label: { fontSize: 13, fontWeight: '700', color: colors.textSub, marginBottom: 6 },
    input: {
      backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.inputBorder,
      borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: colors.text,
    },
    btn: {
      backgroundColor: '#7C3AED', borderRadius: 14, paddingVertical: 15,
      alignItems: 'center', marginTop: 24,
    },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    errorBox: { backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginTop: 12 },
    errorText: { color: '#DC2626', fontSize: 13, fontWeight: '600' },
    confirmContainer: {
      flex: 1, backgroundColor: colors.bgAlt,
      alignItems: 'center', justifyContent: 'center', padding: 36, gap: 12,
    },
    confirmIconBox: {
      width: 80, height: 80, borderRadius: 28, backgroundColor: colors.surfacePrimary,
      alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    },
    confirmIcon: { fontSize: 36 },
    confirmTitle: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
    confirmText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 8 },
    confirmEmail: { fontWeight: '700', color: '#7C3AED' },
  }), [colors]);

  if (sent) {
    return (
      <View style={styles.confirmContainer}>
        <View style={styles.confirmIconBox}>
          <Text style={styles.confirmIcon}>✉️</Text>
        </View>
        <Text style={styles.confirmTitle}>Revisá tu correo</Text>
        <Text style={styles.confirmText}>
          Si existe una cuenta para{' '}
          <Text style={styles.confirmEmail}>{email}</Text>
          , vas a recibir un link para restablecer tu contraseña.
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace('/auth/login')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Volver a iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bgAlt }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Recuperar contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresá tu email y te enviamos un link para crear una nueva contraseña.
        </Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={v => setEmail(v.trim())}
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#D1D5DB"
          maxLength={254}
        />

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.btn}
          onPress={handleReset}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Enviar link de recuperación</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
