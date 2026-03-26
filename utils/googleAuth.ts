import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../db/supabase';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = Linking.createURL('auth/callback');

export async function signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate PKCE verifier & challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Get the OAuth URL from Supabase (don't open browser automatically)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
        queryParams: {
          code_challenge: codeChallenge,
          code_challenge_method: 'S256',
        },
      },
    });

    if (error || !data.url) {
      return { success: false, error: error?.message ?? 'No se pudo iniciar sesión con Google.' };
    }

    // Open browser for OAuth
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

    if (result.type !== 'success' || !result.url) {
      return { success: false, error: 'Inicio de sesión cancelado.' };
    }

    // Extract the authorization code from the callback URL
    const url = new URL(result.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return { success: false, error: 'No se recibió el código de autorización.' };
    }

    // Exchange the code for a session using the PKCE verifier
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code, {
      codeVerifier,
    } as any);

    if (exchangeError) {
      return { success: false, error: exchangeError.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message ?? 'Error inesperado al iniciar sesión con Google.' };
  }
}

// ── PKCE helpers ──────────────────────────────────────────────────────────────

function generateCodeVerifier(): string {
  const bytes = Crypto.getRandomBytes(32);
  return base64UrlEncode(bytes);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier,
    { encoding: Crypto.CryptoEncoding.BASE64 },
  );
  // Convert standard base64 to base64url
  return digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlEncode(bytes: Uint8Array): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < bytes.length; i++) {
    result += chars[bytes[i] % 64];
  }
  return result;
}
