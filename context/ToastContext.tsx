import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from './ThemeContext';

interface ToastAction {
  label: string;
  onPress: () => void;
}

interface ToastOptions {
  message: string;
  sub?: string;
  actions?: ToastAction[];
  duration?: number;
}

interface ToastContextType {
  showToast: (opts: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastOptions | null>(null);
  const { colors } = useTheme();
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 100, duration: 220, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, []);

  const showToast = useCallback((opts: ToastOptions) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast(opts);
    translateY.setValue(100);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, speed: 20, bounciness: 6, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    timerRef.current = setTimeout(hide, opts.duration ?? 4000);
  }, [hide]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          style={[styles.container, { transform: [{ translateY }], opacity }]}
          pointerEvents="box-none"
        >
          <View style={[styles.toast, { backgroundColor: colors.surface }]}>
            <View style={styles.accent} />
            <View style={styles.body}>
              <View style={styles.topRow}>
                <View style={[styles.iconWrap, { backgroundColor: colors.surfacePrimaryLight }]}>
                  <Text style={styles.iconText}>💜</Text>
                </View>
                <View style={styles.textBlock}>
                  <Text style={[styles.message, { color: colors.text }]}>{toast.message}</Text>
                  {toast.sub && <Text style={[styles.sub, { color: colors.textFaint }]}>{toast.sub}</Text>}
                </View>
              </View>
              {toast.actions && toast.actions.length > 0 && (
                <View style={styles.actions}>
                  {toast.actions.map((action, i) => (
                    <TouchableOpacity
                      key={action.label}
                      onPress={() => {
                        if (timerRef.current) clearTimeout(timerRef.current);
                        hide();
                        action.onPress();
                      }}
                      activeOpacity={0.8}
                      style={i === 0 ? styles.actionBtnPrimary : [styles.actionBtnSecondary, { backgroundColor: colors.surfacePrimaryLight, borderColor: colors.borderPrimary }]}
                    >
                      <Text style={i === 0 ? styles.actionTextPrimary : styles.actionTextSecondary}>
                        {action.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    left: 16,
    right: 16,
    zIndex: 999,
  },
  toast: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  accent: {
    height: 4,
    backgroundColor: '#7C3AED',
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 17,
  },
  textBlock: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
  sub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: '#7C3AED',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionBtnSecondary: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  actionTextPrimary: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  actionTextSecondary: {
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: '700',
  },
});
