export interface Event {
  id: number;
  title: string;
  description: string | null;
  category: string;
  event_date: string;
  event_time: string | null;
  event_time_end: string | null;
  location: string | null;
  address: string | null;
  image_uri: string | null;
  price: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  municipality_id: number | null;
  parish: string | null;
  submitted_by: string | null;
  reviewed_by: string | null;
  featured: boolean;
  created_at: string;
}

export type TimeStatus = 'live' | 'upcoming' | 'ended' | 'unknown';

export function getTimeStatus(event_time: string | null, event_time_end: string | null, event_date?: string | null): TimeStatus {
  if (!event_time) return 'unknown';
  const colombiaTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
  if (event_date) {
    const today = colombiaTime.toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }); // YYYY-MM-DD
    if (event_date > today) return 'upcoming';
    if (event_date < today) return 'ended';
  }
  const current = colombiaTime.getHours() * 60 + colombiaTime.getMinutes();
  const [sh, sm] = event_time.split(':').map(Number);
  const start = sh * 60 + sm;
  if (current < start) return 'upcoming';
  if (event_time_end) {
    const [eh, em] = event_time_end.split(':').map(Number);
    return current < eh * 60 + em ? 'live' : 'ended';
  }
  return current < start + 60 ? 'live' : 'ended';
}

export function formatTimeRange(event_time: string | null, event_time_end: string | null): string {
  if (!event_time) return '';
  return event_time_end ? `${event_time} — ${event_time_end}` : event_time;
}
