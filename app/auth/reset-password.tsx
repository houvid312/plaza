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
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function passwordStrength(v: string): { level: 0 | 1 | 2 | 3; label: string } {
  if (!v) return { level: 0, label: '' };
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  if (score <= 1) return { level: 1, label: 'Débil' };
  if (score === 2) return { level: 2, label: 'Media' };
  return { level: 3, label: 'Fuerte' };
}

function strengthBarColor(level: number) {
  if (level === 1) return { backgroundColor: '#EF4444' };
  if (level === 2) return { backgroundColor: '#F59E0B' };
  return { backgroundColor: '#10B981' };
}
function strengthTextColor(level: number) {
  if (level === 1) return { color: '#EF4444' };
  if (level === 2) return { color: '#F59E0B' };
  return { color: '#10B981' };
}

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const submitting = useRef(false);
  const { updatePassword } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();
  const strength = passwordStrength(password);

  async function handleUpdate() {
    if (submitting.current) return;
    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }
    submitting.current = true;
    setErrorMsg('');
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    submitting.current = false;
    if (result.success) {
      setDone(true);
    } else {
      setErrorMsg(result.error ?? 'No se pudo actualizar la contraseña.');
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
    inputError: { borderColor: '#EF4444', backgroundColor: '#FFF5F5' },
    inputValid: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
    strengthContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
    strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
    strengthBar: { flex: 1, height: 4, borderRadius: 4, backgroundColor: colors.inputBorder },
    strengthLabel: { fontSize: 12, fontWeight: '700', minWidth: 44, textAlign: 'right' },
    btn: { backgroundColor: '#7C3AED', borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 24 },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    errorBox: { backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginTop: 12 },
    errorText: { color: '#DC2626', fontSize: 13, fontWeight: '600' },
    confirmContainer: {
      flex: 1, backgroundColor: colors.bgAlt, alignItems: 'center',
      justifyContent: 'center', padding: 36, gap: 12,
    },
    confirmIconBox: {
      width: 80, height: 80, borderRadius: 28, backgroundColor: colors.surfacePrimary,
      alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    },
    confirmIcon: { fontSize: 36 },
    confirmTitle: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
    confirmText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  }), [colors]);

  if (done) {
    return (
      <View style={styles.confirmContainer}>
        <View style={styles.confirmIconBox}>
          <Text style={styles.confirmIcon}>✅</Text>
        </View>
        <Text style={styles.confirmTitle}>¡Contraseña actualizada!</Text>
        <Text style={styles.confirmText}>
          Tu contraseña fue cambiada correctamente. Ya podés iniciar sesión.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.replace('/auth/login')} activeOpacity={0.85}>
          <Text style={styles.btnText}>Ir a iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bgAlt }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Nueva contraseña</Text>
        <Text style={styles.subtitle}>
          Elegí una contraseña nueva y segura para tu cuenta.
        </Text>

        <Text style={styles.label}>Nueva contraseña</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor="#D1D5DB"
          maxLength={128}
        />
        {password.length > 0 && (
          <View style={styles.strengthContainer}>
            <View style={styles.strengthBars}>
              {[1, 2, 3].map(i => (
                <View key={i} style={[styles.strengthBar, strength.level >= i && strengthBarColor(strength.level)]} />
              ))}
            </View>
            <Text style={[styles.strengthLabel, strengthTextColor(strength.level)]}>
              {strength.label}
            </Text>
          </View>
        )}

        <Text style={[styles.label, { marginTop: 20 }]}>Confirmar contraseña</Text>
        <TextInput
          style={[
            styles.input,
            confirm.length > 0 && (confirm === password ? styles.inputValid : styles.inputError),
          ]}
          value={confirm}
          onChangeText={setConfirm}
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor="#D1D5DB"
          maxLength={128}
        />

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.btn} onPress={handleUpdate} disabled={loading} activeOpacity={0.85}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Guardar nueva contraseña</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
