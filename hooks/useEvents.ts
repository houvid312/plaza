import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Event } from '../types/event';
import { supabase } from '../db/supabase';

export interface Municipality {
  id: number;
  name: string;
  slug: string;
}

export function useMunicipalities() {
  return useQuery({
    queryKey: ['municipalities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('municipalities')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return (data ?? []) as Municipality[];
    },
    staleTime: Infinity,
  });
}

export function useTodayEvents(categories?: string[], municipalityId?: number, parish?: string) {
  return useQuery({
    queryKey: ['events', 'today', categories, municipalityId, parish],
    queryFn: async () => {
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .eq('event_date', today)
        .order('event_time', { ascending: true });
      if (categories && categories.length > 0) query = query.in('category', categories);
      if (municipalityId) query = query.eq('municipality_id', municipalityId);
      if (parish) query = query.eq('parish', parish);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Event[];
    },
  });
}

export function useUpcomingEvents(categories?: string[], municipalityId?: number, parish?: string, dates?: string[]) {
  return useQuery({
    queryKey: ['events', 'upcoming', categories, municipalityId, parish, dates],
    queryFn: async () => {
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });
      if (dates && dates.length === 1) {
        query = query.eq('event_date', dates[0]);
      } else if (dates && dates.length > 1) {
        query = query.in('event_date', dates);
      } else {
        query = query.gte('event_date', today).limit(600);
      }
      if (categories && categories.length > 0) query = query.in('category', categories);
      if (municipalityId) query = query.eq('municipality_id', municipalityId);
      if (parish) query = query.eq('parish', parish);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Event[];
    },
  });
}

export function useAdminApprovedEvents() {
  return useQuery({
    queryKey: ['events', 'admin-approved'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Event[];
    },
  });
}

export function usePendingEvents() {
  return useQuery({
    queryKey: ['events', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as Event[];
    },
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      if (error) return null;
      return data as Event;
    },
  });
}

export function useSubmitEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      category: string;
      event_date: string;
      event_time: string;
      event_time_end?: string;
      location: string;
      address: string;
      price?: string;
      municipality_id?: number;
      parish?: string;
      submitted_by?: string;
    }) => {
      if (data.submitted_by) {
        const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());
        const { count, error: countError } = await supabase
          .from('events')
          .select('id', { count: 'exact' })
          .eq('submitted_by', data.submitted_by)
          .gte('created_at', `${today}T00:00:00`);
        if (countError) throw countError;
        if (count !== null && count >= 3) {
          throw new Error('Alcanzaste el límite de 3 publicaciones por día');
        }
      }
      const { error } = await supabase.from('events').insert({
        title: data.title,
        description: data.description || null,
        category: data.category,
        event_date: data.event_date,
        event_time: data.event_time || null,
        event_time_end: data.event_time_end || null,
        location: data.location || null,
        address: data.address || null,
        price: data.price || 'Entrada libre',
        municipality_id: data.municipality_id ?? null,
        parish: data.parish ?? null,
        submitted_by: data.submitted_by ?? null,
        status: 'pending',
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const { data, error } = await supabase
        .from('events')
        .update({ featured, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Sin permiso para actualizar este evento');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}

export function useUnpublishEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data, error } = await supabase
        .from('events')
        .update({ status: 'pending', reviewed_by: null, rejection_reason: null, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Sin permiso para actualizar este evento');
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: number;
      title: string;
      description: string | null;
      category: string;
      event_date: string;
      event_time: string | null;
      event_time_end: string | null;
      location: string | null;
      address: string | null;
    }) => {
      const { id, ...fields } = data;
      const { data: result, error } = await supabase
        .from('events')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      if (error) throw error;
      if (!result || result.length === 0) throw new Error('Sin permiso para editar este evento');
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useReviewEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      rejection_reason,
      reviewed_by,
    }: {
      id: number;
      status: 'approved' | 'rejected';
      rejection_reason?: string;
      reviewed_by: string;
    }) => {
      const { error } = await supabase
        .from('events')
        .update({
          status,
          rejection_reason: rejection_reason ?? null,
          reviewed_by,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] }),
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data, error } = await supabase
        .from('favorites')
        .select('event_id, created_at, events(*)')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return ((data ?? []).map((f: any) => f.events).filter(Boolean)) as Event[];
    },
  });
}

export function useIsFavorite(eventId: number) {
  return useQuery({
    queryKey: ['favorites', 'check', eventId],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('event_id', eventId)
        .maybeSingle();
      return !!data;
    },
  });
}

export function useMyEvents(userId: string | undefined) {
  return useQuery({
    queryKey: ['events', 'mine', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('submitted_by', userId)
        .order('created_at', { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []) as Event[];
    },
    enabled: !!userId,
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, isFav }: { eventId: number; isFav: boolean }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No autenticado');
      if (isFav) {
        await supabase.from('favorites').delete()
          .eq('user_id', session.user.id).eq('event_id', eventId);
      } else {
        await supabase.from('favorites').insert({ user_id: session.user.id, event_id: eventId });
      }
    },
    onSuccess: (_data, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['favorites', 'check', eventId] });
    },
  });
}
