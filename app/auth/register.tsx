import React, { useRef, useState, useMemo } from 'react';
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
  Modal,
  FlatList,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

// ── Country codes ──────────────────────────────────────────────────────────────

const COUNTRY_CODES = [
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+52', flag: '🇲🇽', name: 'México' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: '+34', flag: '🇪🇸', name: 'España' },
  { code: '+1',  flag: '🇺🇸', name: 'Estados Unidos' },
];

const DEFAULT_COUNTRY = COUNTRY_CODES[0]; // +57 Colombia

// ── Validators ────────────────────────────────────────────────────────────────

function validateEmail(v: string) {
  if (!v.trim()) return 'El email es requerido.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Ingresá un email válido.';
  return '';
}

function validatePhone(v: string) {
  if (!v.trim()) return 'El número de celular es requerido.';
  const digits = v.replace(/\D/g, '');
  if (digits.length !== 10) return 'El número debe tener exactamente 10 dígitos.';
  return '';
}

function sanitizeName(v: string) {
  // Allow letters (including accented), spaces, hyphens, apostrophes — strip the rest
  return v.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ '\-]/g, '');
}

function validatePassword(v: string) {
  if (!v) return 'La contraseña es requerida.';
  if (v.length < 6) return 'Mínimo 6 caracteres.';
  return '';
}

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

// ── Component ─────────────────────────────────────────────────────────────────

type TouchedFields = { name: boolean; email: boolean; phone: boolean; password: boolean };

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({
    name: false, email: false, phone: false, password: false,
  });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const submitting = useRef(false);
  const { register } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  function touch(field: keyof TouchedFields) {
    setTouched(prev => ({ ...prev, [field]: true }));
  }

  const emailError    = touched.email    ? validateEmail(email)       : '';
  const phoneError    = touched.phone    ? validatePhone(phone)        : '';
  const passwordError = touched.password ? validatePassword(password)  : '';
  const nameError     = touched.name && !name.trim() ? 'El nombre es requerido.' : '';
  const strength      = passwordStrength(password);

  const styles = useMemo(() => StyleSheet.create({
    container: { flexGrow: 1, padding: 24, paddingTop: 40, backgroundColor: colors.bgAlt },
    title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 4 },
    subtitle: { fontSize: 14, color: colors.textFaint, marginBottom: 32 },
    label: { fontSize: 13, fontWeight: '700', color: colors.textSub, marginBottom: 6, marginTop: 16 },
    input: {
      backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.inputBorder,
      borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: colors.text,
    },
    inputError: { borderColor: '#EF4444', backgroundColor: '#FFF5F5' },
    inputValid: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
    fieldError: { fontSize: 12, color: '#EF4444', marginTop: 4, marginLeft: 2 },
    fieldValid: { fontSize: 12, color: '#10B981', marginTop: 4, marginLeft: 2, fontWeight: '600' },
    phoneRow: { flexDirection: 'row', gap: 8 },
    countryBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.inputBorder,
      borderRadius: 12, paddingHorizontal: 12, paddingVertical: 13,
    },
    countryBtnValid: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
    countryBtnError: { borderColor: '#EF4444', backgroundColor: '#FFF5F5' },
    countryFlag: { fontSize: 18 },
    countryCode: { fontSize: 14, fontWeight: '700', color: colors.textSub },
    countryChevron: { fontSize: 10, color: colors.textFaint, marginLeft: 2 },
    phoneInput: {
      flex: 1, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.inputBorder,
      borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: colors.text,
    },
    strengthContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
    strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
    strengthBar: { flex: 1, height: 4, borderRadius: 4, backgroundColor: colors.inputBorder },
    strengthLabel: { fontSize: 12, fontWeight: '700', minWidth: 44, textAlign: 'right' },
    passwordHint: { backgroundColor: colors.surfacePrimaryLight, borderRadius: 10, padding: 10, marginTop: 10 },
    passwordHintText: { fontSize: 12, color: '#8B5E3C', lineHeight: 18 },
    btn: { backgroundColor: '#B87333', borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 24 },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    linkBtn: { alignItems: 'center', marginTop: 16 },
    linkText: { fontSize: 14, color: colors.textMuted },
    linkHighlight: { color: '#B87333', fontWeight: '700' },
    errorBox: { backgroundColor: '#FEF2F2', borderRadius: 10, padding: 12, marginTop: 12 },
    errorText: { color: '#DC2626', fontSize: 13, fontWeight: '600' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    modalSheet: {
      backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
      paddingTop: 12, paddingBottom: 32, maxHeight: '70%',
    },
    modalHandle: {
      width: 40, height: 4, backgroundColor: colors.borderMedium, borderRadius: 4,
      alignSelf: 'center', marginBottom: 16,
    },
    modalTitle: { fontSize: 16, fontWeight: '800', color: colors.text, paddingHorizontal: 20, marginBottom: 8 },
    countryItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 12 },
    countryItemSelected: { backgroundColor: colors.surfacePrimaryLight },
    countryItemFlag: { fontSize: 22 },
    countryItemName: { flex: 1, fontSize: 15, color: colors.text },
    countryItemCode: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
    countryItemCheck: { fontSize: 15, color: '#B87333', fontWeight: '800' },
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

  function inputStyle(error: string, value: string, isTouched: boolean) {
    if (!isTouched || !value.trim()) return styles.input;
    if (error) return [styles.input, styles.inputError];
    return [styles.input, styles.inputValid];
  }

  async function handleRegister() {
    if (submitting.current) return;

    setTouched({ name: true, email: true, phone: true, password: true });

    const eEmail    = validateEmail(email);
    const ePhone    = validatePhone(phone);
    const ePassword = validatePassword(password);
    const eName     = !name.trim() ? 'requerido' : '';

    if (eName || eEmail || ePhone || ePassword) return;

    submitting.current = true;
    setSubmitError('');
    setLoading(true);
    const fullPhone = `${country.code} ${phone.trim()}`;
    const result = await register(name.trim(), email.trim(), password.trim(), fullPhone);
    setLoading(false);
    submitting.current = false;
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setSubmitError(result.error ?? 'No se pudo crear la cuenta.');
    }
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bgAlt }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Uníte a la expedición</Text>
        <Text style={styles.subtitle}>Creá tu cuenta para resonar y descubrir el atlas vivo</Text>

        {/* ── Nombre ── */}
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={inputStyle(nameError, name, touched.name)}
          value={name}
          onChangeText={v => setName(sanitizeName(v))}
          onBlur={() => touch('name')}
          placeholder="Juan García"
          placeholderTextColor="#D1D5DB"
          maxLength={80}
          autoCorrect={false}
        />
        {nameError ? <Text style={styles.fieldError}>{nameError}</Text> : null}

        {/* ── Email ── */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={inputStyle(emailError, email, touched.email)}
          value={email}
          onChangeText={v => setEmail(v.trim())}
          onBlur={() => touch('email')}
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#D1D5DB"
          maxLength={254}
        />
        {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
        {touched.email && !emailError && email ? (
          <Text style={styles.fieldValid}>✓ Email válido</Text>
        ) : null}

        {/* ── Celular ── */}
        <Text style={styles.label}>Número de celular</Text>
        <View style={styles.phoneRow}>
          <TouchableOpacity
            style={[
              styles.countryBtn,
              touched.phone && phone && !phoneError && styles.countryBtnValid,
              touched.phone && phoneError ? styles.countryBtnError : null,
            ]}
            onPress={() => setShowCountryPicker(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.countryFlag}>{country.flag}</Text>
            <Text style={styles.countryCode}>{country.code}</Text>
            <Text style={styles.countryChevron}>▾</Text>
          </TouchableOpacity>
          <TextInput
            style={[
              styles.phoneInput,
              touched.phone && phone && !phoneError && styles.inputValid,
              touched.phone && phoneError ? styles.inputError : null,
            ]}
            value={phone}
            onChangeText={v => setPhone(v.replace(/\D/g, '').slice(0, 10))}
            onBlur={() => touch('phone')}
            placeholder="3001234567"
            keyboardType="phone-pad"
            placeholderTextColor="#D1D5DB"
            maxLength={10}
          />
        </View>
        {phoneError ? <Text style={styles.fieldError}>{phoneError}</Text> : null}
        {touched.phone && !phoneError && phone ? (
          <Text style={styles.fieldValid}>✓ Número válido</Text>
        ) : null}

        {/* ── Contraseña ── */}
        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={inputStyle(passwordError, password, touched.password)}
          value={password}
          onChangeText={setPassword}
          onBlur={() => touch('password')}
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor="#D1D5DB"
          maxLength={128}
        />
        {password.length > 0 && (
          <View style={styles.strengthContainer}>
            <View style={styles.strengthBars}>
              {[1, 2, 3].map(i => (
                <View
                  key={i}
                  style={[styles.strengthBar, strength.level >= i && strengthBarColor(strength.level)]}
                />
              ))}
            </View>
            <Text style={[styles.strengthLabel, strengthTextColor(strength.level)]}>
              {strength.label}
            </Text>
          </View>
        )}
        {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}

        <View style={styles.passwordHint}>
          <Text style={styles.passwordHintText}>
            🔑 Esta contraseña la vas a usar cada vez que inicies sesión. Guardala en un lugar seguro.
          </Text>
        </View>

        {submitError ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{submitError}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.btn}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Crear cuenta</Text>}
        </TouchableOpacity>

        {/* GOOGLE AUTH — comentado hasta completar config en Supabase (ver CLAUDE.md) */}
        {/* <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={async () => {
            setGoogleLoading(true);
            setSubmitError('');
            const result = await loginWithGoogle();
            setGoogleLoading(false);
            if (result.success) {
              router.replace('/(tabs)');
            } else if (result.error && result.error !== 'Inicio de sesión cancelado.') {
              setSubmitError(result.error);
            }
          }}
          disabled={googleLoading || loading}
          activeOpacity={0.85}
        >
          {googleLoading ? (
            <ActivityIndicator color="#374151" />
          ) : (
            <>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleBtnText}>Continuar con Google</Text>
            </>
          )}
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => router.replace('/auth/login')} style={styles.linkBtn}>
          <Text style={styles.linkText}>
            ¿Ya tenés cuenta?{' '}
            <Text style={styles.linkHighlight}>Iniciar sesión</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Country Picker Modal ── */}
      <Modal
        visible={showCountryPicker}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCountryPicker(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Seleccioná tu país</Text>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={item => item.code + item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.countryItem, item.code === country.code && styles.countryItemSelected]}
                  onPress={() => { setCountry(item); setShowCountryPicker(false); }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.countryItemFlag}>{item.flag}</Text>
                  <Text style={styles.countryItemName}>{item.name}</Text>
                  <Text style={styles.countryItemCode}>{item.code}</Text>
                  {item.code === country.code && (
                    <Text style={styles.countryItemCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
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

