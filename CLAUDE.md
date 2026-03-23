# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start dev server (choose platform interactively)
npx expo start

# Run directly on platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

There are no test or lint scripts configured.

## Architecture

**Municipalidad** — a civic event discovery and submission app (Spanish-Argentina UI) built with Expo Router (file-based routing), NativeWind (Tailwind for React Native), TanStack React Query, and expo-sqlite.

### Data flow

1. **Database** (`db/database.ts`) — SQLite singleton initialized at app startup. Two tables: `users` and `events`. `db/seed.ts` populates sample data on first launch.
2. **Hooks** (`hooks/useEvents.ts`) — All data access goes through TanStack Query hooks (`useTodayEvents`, `useUpcomingEvents`, `usePendingEvents`, `useEvent`, `useSubmitEvent`, `useReviewEvent`). Mutations invalidate relevant query keys.
3. **Auth** (`context/AuthContext.tsx`) — React Context wrapping the whole app. Persists user to `expo-secure-store` (native) / `localStorage` (web). Password hashing is a demo stub (`'hashed_' + password`) — not production-safe.

### Navigation

Root `Stack` in `app/_layout.tsx` wraps everything in `AuthProvider` + `QueryClientProvider`. Screens:

| Route | Purpose |
|---|---|
| `(tabs)/index` | "Hoy" — today's events, category filter |
| `(tabs)/explore` | "Explorar" — upcoming events grouped by date |
| `(tabs)/submit` | "Publicar" — event submission form (auth required) |
| `(tabs)/profile` | "Perfil" — user profile / auth prompts |
| `event/[id]` | Event detail |
| `auth/login`, `auth/register` | Auth modals |
| `admin/dashboard` | Pending events queue (admin only) |
| `admin/event/[id]` | Approve / reject event (admin only) |

### Event lifecycle

Submit (status: `pending`) → Admin reviews via `/admin/dashboard` → `approved` (public) or `rejected` (with reason).

### Key types

- `types/event.ts` — `Event` interface with all fields including `status`, `submitted_by`, `reviewed_by`
- `constants/categories.ts` — 5 categories (Cultural, Social, Artistic, Sport, Educational) each with color and emoji

### Styling

NativeWind v4 (Tailwind utility classes in JSX). Config targets `app/**` and `components/**`. Primary brand color is `#7C3AED` (purple). Metro config includes WASM support for expo-sqlite web compatibility.

### Seeded admin credentials

- Email: `admin@municipalidad.com`
- Password: `admin123`
