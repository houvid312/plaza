export type Category = 'cultural' | 'social' | 'artistic' | 'sport' | 'educational' | 'religious';

export const CATEGORIES: Record<Category, { label: string; color: string; bgColor: string; emoji: string }> = {
  religious:   { label: 'Religioso',  color: '#B45309', bgColor: '#FEF3C7', emoji: '⛪' },
  cultural:    { label: 'Cultural',   color: '#7C3AED', bgColor: '#EDE9FE', emoji: '🏛️' },
  social:      { label: 'Social',     color: '#F59E0B', bgColor: '#FEF3C7', emoji: '🤝' },
  artistic:    { label: 'Artístico',  color: '#EC4899', bgColor: '#FCE7F3', emoji: '🎨' },
  sport:       { label: 'Deportivo',  color: '#10B981', bgColor: '#D1FAE5', emoji: '⚽' },
  educational: { label: 'Educativo',  color: '#3B82F6', bgColor: '#DBEAFE', emoji: '📚' },
};

export const ALL_CATEGORIES = Object.entries(CATEGORIES).map(([key, val]) => ({
  id: key as Category,
  ...val,
}));

export const PARISHES = [
  'Nuestra Señora de la Asunción',
  'San Juan Pablo II',
  'Sagrada Familia',
  'Sagrado Corazón',
  'Santa Laura Montoya',
  'María Auxiliadora',
] as const;
export type Parish = typeof PARISHES[number];
