-- ============================================================
-- PROGRAMACIÓN CULTURAL SEMANA SANTA 2026
-- 49° Festival de Música Religiosa + Exposiciones y Talleres
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

INSERT INTO events (
  title, description, category,
  event_date, event_time, event_time_end,
  location, address, parish,
  image_uri,
  municipality_id, status, featured
) VALUES

-- ══════════════════════════════════════════════════════════════
-- 49° FESTIVAL DE MÚSICA RELIGIOSA
-- ══════════════════════════════════════════════════════════════

-- Sábado 28 de marzo
('Ensamble Poiesis — 49° Festival de Música Religiosa',
 'Concierto del Ensamble Poiesis en el marco del 49° Festival de Música Religiosa de Marinilla.',
 'artistic','2026-03-28','19:00','21:00',
 'Capilla Jesús Nazareno',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Domingo 29 de marzo
('Banda Sinfónica Municipio de Rionegro — 49° Festival de Música Religiosa',
 'Presentación de la Banda Sinfónica del Municipio de Rionegro en el barrio La Dalia.',
 'artistic','2026-03-29','14:00','16:00',
 'Parroquia Sagrado Corazón de Jesús','Barrio La Dalia',NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Orquesta Departamental de Antioquia (ODA) — 49° Festival de Música Religiosa',
 'Concierto de la Orquesta Departamental de Antioquia en el Teatro Regional.',
 'artistic','2026-03-29','19:00','21:00',
 'Teatro Regional Valerio Antonio Jiménez',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Lunes 30 de marzo
('Actividad académica: Monteverdi "Luz de una constelación"',
 'Contextualización del programa Monteverdi: "Luz de una constelación". Actividad académica en el marco del 49° Festival de Música Religiosa.',
 'cultural','2026-03-30','15:00','16:30',
 'Casa Cultural Valerio Antonio Jiménez',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Concento Antiguo Medellín - Octeto Vocal — 49° Festival de Música Religiosa',
 'Concierto del Concento Antiguo Medellín - Octeto Vocal.',
 'artistic','2026-03-30','19:00','21:00',
 'Capilla Jesús Nazareno',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Martes 31 de marzo
('Orquesta de Cámara Rezonanz — 49° Festival de Música Religiosa',
 'Concierto de la Orquesta de Cámara Rezonanz en la Capilla de Jesús Nazareno.',
 'artistic','2026-03-31','19:00','21:00',
 'Capilla de Jesús Nazareno',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Miércoles 1 de abril
('Actividad académica: "Encuentro Ceremonial para el Cuidado de la Vida"',
 'Actividad académica en el marco del 49° Festival de Música Religiosa.',
 'cultural','2026-04-01','15:00','16:30',
 'Casa Cultural Valerio Antonio Jiménez',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Tamsaianka — 49° Festival de Música Religiosa',
 'Concierto de Tamsaianka en el Teatro Regional Valerio Antonio Jiménez.',
 'artistic','2026-04-01','19:00','21:00',
 'Teatro Regional Valerio Antonio Jiménez',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Jueves 2 de abril
('Orquesta Regional de Cuerdas del Oriente — 49° Festival de Música Religiosa',
 'Concierto de la Orquesta Regional de Cuerdas del Oriente.',
 'artistic','2026-04-02','17:00','19:00',
 'Teatro Regional Valerio Antonio Jiménez',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Soul Gospel Medellín — 49° Festival de Música Religiosa',
 'Concierto de Soul Gospel Medellín.',
 'artistic','2026-04-02','21:00','23:00',
 'Teatro Regional Valerio Antonio Jiménez',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Viernes 3 de abril
('Ensamble Vocal Polimia Marinilla — 49° Festival de Música Religiosa',
 'Concierto del Ensamble Vocal Polimia Marinilla.',
 'artistic','2026-04-03','17:00','19:00',
 'Teatro Regional Valerio Antonio Jiménez',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Sábado 4 de abril
('Jonathan Gómez Galvis & Santiago Duque Ángel — 49° Festival de Música Religiosa',
 'Concierto de cierre del 49° Festival de Música Religiosa. Jonathan Gómez Galvis (flauta) y Santiago Duque Ángel (piano).',
 'artistic','2026-04-04','16:00','18:00',
 'Teatro Regional Valerio Antonio Jiménez',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- ══════════════════════════════════════════════════════════════
-- EXPOSICIONES — INAUGURACIONES Y TALLERES DE ARTE
-- ══════════════════════════════════════════════════════════════

-- Viernes 27 de marzo
('Inauguración Exposición Francisco García',
 'Inauguración de la exposición del artista Francisco García.',
 'artistic','2026-03-27','17:00','19:00',
 'Hostería El Camino Real',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- Sábado 28 de marzo
('Inauguración: "Arte Hecho Pasión" — Maestro Alberto Soto',
 'Inauguración de la exposición "Arte Hecho Pasión" del Maestro Alberto Soto.',
 'artistic','2026-03-28','17:00','19:00',
 'Casa Cultural Valerio Antonio Jiménez',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Inauguración: "Viacrucis de JALAR" — Maestro Jesús Alberto Arbeláez',
 'Inauguración de la exposición "Viacrucis de JALAR" del Maestro Jesús Alberto Arbeláez.',
 'artistic','2026-03-28','15:00','17:00',
 'Parque Principal',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Inauguración Exposición en el Asilo — CBA San José',
 'Inauguración de exposición artística en el CBA San José.',
 'artistic','2026-03-28',NULL,NULL,
 'CBA San José',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- Domingo 29 de marzo
('Apertura: Museo de Cristos, Cruces y Crucifijos Roberto Hoyos Castaño',
 'Apertura exposición parcial del Museo de Cristos, Cruces y Crucifijos Roberto Hoyos Castaño.',
 'cultural','2026-03-29','12:00','14:00',
 'Teatro Municipal Simona Duque',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- Lunes 30 de marzo
('Taller de Escultura — Maestro Alberto Soto',
 'Taller de escultura dictado por el Maestro Alberto Soto.',
 'artistic','2026-03-30','10:00','12:00',
 'Casa Cultural Valerio Antonio Jiménez',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Taller "La Palabra en Plástica" — Maestro JALAR',
 'Taller "La Palabra en Plástica" dictado por el Maestro Jesús Arbeláez (JALAR).',
 'artistic','2026-03-30','15:00','17:00',
 'Auditorio CBA San José',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- Martes 31 de marzo
('Taller de Escultura — Maestro Alberto Soto',
 'Taller de escultura dictado por el Maestro Alberto Soto.',
 'artistic','2026-03-31','10:00','12:00',
 'Casa Cultural Valerio Antonio Jiménez',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Taller "La Palabra en Plástica" — Maestro JALAR',
 'Taller "La Palabra en Plástica" dictado por el Maestro Jesús Arbeláez (JALAR).',
 'artistic','2026-03-31','15:00','17:00',
 'Auditorio CBA San José',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- Miércoles 1 de abril
('Taller de Escultura — Maestro Alberto Soto',
 'Taller de escultura dictado por el Maestro Alberto Soto.',
 'artistic','2026-04-01','10:00','12:00',
 'Casa Cultural Valerio Antonio Jiménez',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Taller "La Palabra en Plástica" — Maestro JALAR',
 'Taller "La Palabra en Plástica" dictado por el Maestro Jesús Arbeláez (JALAR).',
 'artistic','2026-04-01','15:00','17:00',
 'Parque Principal',NULL,NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Arte Calle Semana Santa',
 'Intervención artística en el espacio público. Arte Calle en el marco de la Semana Santa de Marinilla.',
 'artistic','2026-04-01','10:00','18:00',
 'Calle 30','A la altura del Teatro Valerio Antonio Jiménez',NULL,
 'festivaldefault.png',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true);
