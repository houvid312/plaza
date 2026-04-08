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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const submitting = useRef(false);
  const { login } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  async function handleLogin() {
    if (submitting.current) return;
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Completá todos los campos.');
      return;
    }
    submitting.current = true;
    setErrorMsg('');
    setLoading(true);
    const result = await login(email.trim(), password.trim());
    setLoading(false);
    submitting.current = false;
    if (result.success) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } else {
      setErrorMsg(result.error ?? 'No se pudo iniciar sesión.');
    }
  }

  const styles = useMemo(() => StyleSheet.create({
    container: { flexGrow: 1, padding: 24, paddingTop: 40, backgroundColor: colors.bgAlt },
    iconContainer: { alignItems: 'center', marginBottom: 20 },
    icon: { fontSize: 48 },
    title: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 4 },
    subtitle: { fontSize: 14, color: colors.textFaint, textAlign: 'center', marginBottom: 32 },
    label: { fontSize: 13, fontWeight: '700', color: colors.textSub, marginBottom: 6, marginTop: 12 },
    input: {
      backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.inputBorder,
      borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: colors.text,
    },
    btn: {
      backgroundColor: '#B87333', borderRadius: 14, paddingVertical: 15,
      alignItems: 'center', marginTop: 24,
    },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    linkBtn: { alignItems: 'center', marginTop: 16 },
    linkText: { fontSize: 14, color: colors.textMuted },
    linkHighlight: { color: '#B87333', fontWeight: '700' },
    errorBox: { backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginTop: 12 },
    errorText: { color: '#DC2626', fontSize: 13, fontWeight: '600' },
    forgotBtn: { alignSelf: 'flex-end', marginTop: 8 },
    forgotText: { fontSize: 13, color: '#B87333', fontWeight: '600' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 4 },
    dividerLine: { flex: 1, height: 1, backgroundColor: colors.inputBorder },
    dividerText: { marginHorizontal: 12, fontSize: 13, color: colors.textFaint, fontWeight: '600' },
    googleBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.inputBorder,
      borderRadius: 14, paddingVertical: 14, marginTop: 12, gap: 10,
    },
    googleIcon: { fontSize: 18, fontWeight: '800', color: '#4285F4' },
    googleBtnText: { fontSize: 15, fontWeight: '600', color: colors.textSub },
  }), [colors]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bgAlt }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🧭</Text>
        </View>
        <Text style={styles.title}>¡Bienvenido de vuelta, expedicionario!</Text>
        <Text style={styles.subtitle}>Ingresá y seguí explorando las resonancias del territorio</Text>

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

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor="#D1D5DB"
          maxLength={128}
        />

        <TouchableOpacity
          onPress={() => router.push('/auth/forgot-password')}
          style={styles.forgotBtn}
        >
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.btn}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Iniciar sesión</Text>
          )}
        </TouchableOpacity>

        {/* GOOGLE AUTH — comentado hasta completar config en Supabase (ver CLAUDE.md) */}

        <TouchableOpacity
          onPress={() => router.replace('/auth/register')}
          style={styles.linkBtn}
        >
          <Text style={styles.linkText}>
            ¿No tenés cuenta?{' '}
            <Text style={styles.linkHighlight}>Crear una</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
