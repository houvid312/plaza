-- ============================================================
-- SEMANA SANTA 2026 — marinilla
-- Fuente: Programacion_General_Semana_Santa_2026.docx
-- ~290 eventos · 10 días · 6 parroquias
--
-- Duración estimada por tipo:
--   Eucaristía regular            → 1 h
--   Eucaristía solemne            → 1:30 h
--   Procesión sola                → 1:30 h
--   Bendición + procesión + misa  → 2 h
--   Cena del Señor (solemne)      → 2 h
--   Vigilia Pascual               → 2:30-3 h
--   Pascua Infantil/Juvenil       → 3 h
--   Viacrucis                     → 1:30 h
--   Hora Santa                    → 1:30 h
--   Procesión Prendimiento        → 1 h
--   Siete Palabras/Descendimiento → 2 h
--   Coronilla                     → 30 min
--   Laudes/Oficio                 → 45 min
--   Concierto                     → 2 h
--   Ejercicios Espirituales       → 1:30 h
--   Conferencia                   → 1:30 h
--
-- NOTA: En Viernes Santo (Sagrado Corazón), el documento
-- original dice "3:00 am" y "7:00 am" — se corrige a
-- 15:00 y 19:00 (pm), que es el horario litúrgico correcto.
-- ============================================================



-- Paso 2: Eventos
INSERT INTO events (
  title, description, category,
  event_date, event_time, event_time_end,
  location, address, parish,
  municipality_id, status, featured
) VALUES

-- ══════════════════════════════════════════════════════════════
-- VIERNES DE DOLORES — 27 DE MARZO
-- ══════════════════════════════════════════════════════════════

-- Parroquia Nuestra Señora de la Asunción
('Eucaristía — Capilla de Jesús Nazareno',
 'Eucaristía en la Capilla de Jesús Nazareno.',
 'religious','2026-03-27','10:00','11:00',
 'Capilla de Jesús Nazareno',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Coronilla a la Virgen de los Dolores',
 'Rezo solemne de la Coronilla a la Virgen de los Dolores.',
 'religious','2026-03-27','14:30','15:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión y Salve',
 'Procesión en honor a la Virgen de los Dolores y canto solemne de Salve.',
 'religious','2026-03-27','15:00','16:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- ══════════════════════════════════════════════════════════════
-- SÁBADO DE DOLORES — 28 DE MARZO
-- ══════════════════════════════════════════════════════════════

-- Parroquia Nuestra Señora de la Asunción
('Pascua Juvenil',
 'Encuentro de Pascua Juvenil para jóvenes de la parroquia.',
 'religious','2026-03-28','09:00','13:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- ══════════════════════════════════════════════════════════════
-- DOMINGO DE RAMOS — 29 DE MARZO
-- ══════════════════════════════════════════════════════════════

-- · San Juan Pablo II ·
('Santa Misa',
 'Santa Misa dominical.',
 'religious','2026-03-29','08:00','09:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa de Ramos y Procesión con los Niños',
 'Santa Misa de Ramos seguida de procesión con los niños de la parroquia.',
 'religious','2026-03-29','10:00','11:30',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Santa Misa — Sector Los Sauces',
 'Santa Misa en el sector Los Sauces.',
 'religious','2026-03-29','11:00','12:00',
 'Sector Los Sauces',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Bendición de Ramos, Procesión y Eucaristía Solemne — Villas del Sol',
 'Bendición de ramos en Villas del Sol, procesión solemne y Celebración Eucarística con lectura de la Pasión del Señor.',
 'religious','2026-03-29','11:15','13:30',
 'Villas del Sol',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Santa Misa',
 'Santa Misa vespertina.',
 'religious','2026-03-29','16:00','17:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa',
 'Santa Misa vespertina.',
 'religious','2026-03-29','18:00','19:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrada Familia ·
('Eucaristía — Templo Parroquial',
 'Eucaristía en el Templo Parroquial de la Sagrada Familia.',
 'religious','2026-03-29','08:00','09:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía, Bendición de Ramos y Procesión',
 'Eucaristía con bendición de ramos y procesión desde la Capilla San José Obrero hacia el Templo Parroquial.',
 'religious','2026-03-29','10:00','11:30',
 'Capilla San José Obrero',NULL,'Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Eucaristía — Templo Parroquial',
 'Eucaristía en el Templo Parroquial de la Sagrada Familia.',
 'religious','2026-03-29','12:00','13:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Bendición de Ramos y Procesión — Vereda Cascajo Abajo',
 'Bendición de ramos y procesión desde el callejón de la paz hacia la Capilla de la Divina Misericordia.',
 'religious','2026-03-29','14:30','15:00',
 'Callejón de la Paz','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía — Capilla Divina Misericordia',
 'Eucaristía en la Capilla de la Divina Misericordia.',
 'religious','2026-03-29','15:00','16:00',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía — Templo Parroquial',
 'Eucaristía en el Templo Parroquial.',
 'religious','2026-03-29','17:00','18:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía — Capilla San José Obrero',
 'Eucaristía en la Capilla San José Obrero.',
 'religious','2026-03-29','18:30','19:30',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrado Corazón ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-29','07:00','08:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','10:00','11:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Misa en la Vereda La Esmeralda',
 'Santa Misa en la vereda La Esmeralda.',
 'religious','2026-03-29','11:00','12:00',
 'Vereda La Esmeralda',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Bendición y Procesión de Ramos',
 'Bendición de ramos y procesión. Salida frente a Bomberos. Se puede portar plantas, ramas de árboles (no palma de cera), banderas y pañuelos blancos.',
 'religious','2026-03-29','11:00','12:30',
 'Frente a Bomberos',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','12:00','13:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión y Eucaristía — Vereda Las Mercedes',
 'Procesión y Eucaristía en la vereda Las Mercedes.',
 'religious','2026-03-29','14:00','16:00',
 'Vereda Las Mercedes',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Concierto Banda Sinfónica y Coro — 49° Festival de Música Religiosa',
 'Concierto de la Banda Sinfónica y Coro del Municipio de marinilla en el marco del 49° Festival de Música Religiosa.',
 'religious','2026-03-29','14:00','16:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Viacrucis','Viacrucis comunitario.',
 'religious','2026-03-29','15:00','16:30',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','16:00','17:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','17:00','18:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','18:00','19:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','19:00','20:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Nuestra Señora de la Asunción ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-29','06:00','07:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-29','07:00','08:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-29','08:00','09:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Bendición de Ramos, Procesión y Eucaristía Solemne',
 'Bendición de ramos, procesión y Eucaristía solemne del Domingo de Ramos.',
 'religious','2026-03-29','10:00','12:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','15:00','16:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','16:00','17:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión del Buen Pastor',
 'Procesión del Buen Pastor.',
 'religious','2026-03-29','17:00','18:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía Solemne y Predicación',
 'Eucaristía solemne con predicación.',
 'religious','2026-03-29','18:00','19:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía y Pascua Juvenil',
 'Eucaristía y encuentro de Pascua Juvenil.',
 'religious','2026-03-29','19:00','21:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Santa Laura Montoya ·
('Santa Misa','Santa Misa matutina.',
 'religious','2026-03-29','08:00','09:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa Solemne y Bendición de Ramos',
 'Santa Misa Solemne con bendición de ramos.',
 'religious','2026-03-29','11:00','12:30',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Santa Misa','Santa Misa.',
 'religious','2026-03-29','15:00','16:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa','Santa Misa vespertina.',
 'religious','2026-03-29','17:00','18:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · María Auxiliadora ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-29','08:00','09:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','10:00','11:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Bendición de Ramos y Procesión',
 'Bendición de los Ramos y procesión. Punto de encuentro: I.E. Román Gómez; sube por Carrera 38 hasta Calle 30 y termina en el Templo.',
 'religious','2026-03-29','11:00','12:30',
 'I.E. Román Gómez',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','12:00','13:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía — Vereda La Asunción',
 'Eucaristía en la vereda La Asunción.',
 'religious','2026-03-29','15:30','16:30',
 'Vereda La Asunción',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','16:00','17:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','18:00','19:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-29','20:00','21:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- ══════════════════════════════════════════════════════════════
-- LUNES SANTO — 30 DE MARZO
-- ══════════════════════════════════════════════════════════════

-- · San Juan Pablo II ·
('Santa Misa','Santa Misa matutina.',
 'religious','2026-03-30','07:00','08:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Infantil',
 'Encuentro de Pascua Infantil para los niños de la parroquia.',
 'religious','2026-03-30','10:00','13:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Coronilla y Misa — Señor de la Divina Misericordia',
 'Coronilla y Santa Misa en honor al Señor de la Divina Misericordia.',
 'religious','2026-03-30','14:30','15:30',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis — Templete',
 'Ejercicio del Santo Viacrucis en el templete.',
 'religious','2026-03-30','17:00','18:30',
 'Templete',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa y Confesiones',
 'Santa Misa con disponibilidad para el sacramento de la confesión.',
 'religious','2026-03-30','18:00','19:30',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrada Familia ·
('Eucaristía — Templo Parroquial',
 'Eucaristía matutina.',
 'religious','2026-03-30','07:00','08:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis y Eucaristía — Capilla Divina Misericordia',
 'Santo Viacrucis seguido de Eucaristía en la Capilla de la Divina Misericordia.',
 'religious','2026-03-30','14:00','16:00',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis y Eucaristía — Templo Parroquial',
 'Santo Viacrucis seguido de Eucaristía en el Templo Parroquial.',
 'religious','2026-03-30','16:00','18:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis y Eucaristía — Capilla San José Obrero',
 'Santo Viacrucis y Eucaristía en la Capilla San José Obrero.',
 'religious','2026-03-30','17:30','19:30',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrado Corazón ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-30','07:00','08:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Infantil',
 'Encuentro de Pascua Infantil.',
 'religious','2026-03-30','10:00','13:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-30','12:00','13:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Viacrucis','Viacrucis comunitario.',
 'religious','2026-03-30','15:00','16:30',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-30','16:00','17:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesiones — Sector La Amistad',
 'Procesiones en el sector La Amistad.',
 'religious','2026-03-30','17:30','19:00',
 'Sector La Amistad',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-30','18:00','19:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Juvenil',
 'Encuentro de Pascua Juvenil.',
 'religious','2026-03-30','19:00','22:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Conferencia Penitencial para Toda la Familia',
 'Conferencia penitencial dirigida a toda la familia.',
 'religious','2026-03-30','19:00','21:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Nuestra Señora de la Asunción ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-30','07:00','08:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-30','08:00','09:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Ejercicios Espirituales para las Familias',
 'Ejercicios Espirituales para las familias.',
 'religious','2026-03-30','09:00','10:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Infantil',
 'Encuentro de Pascua Infantil.',
 'religious','2026-03-30','09:30','12:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-30','12:00','13:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Ejercicios Espirituales para las Familias',
 'Ejercicios Espirituales para las familias — sesión de tarde.',
 'religious','2026-03-30','14:00','15:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Vía Crucis',
 'Vía Crucis en el Templo Parroquial.',
 'religious','2026-03-30','15:00','16:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión','Procesión sale del templo.',
 'religious','2026-03-30','17:00','18:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía Solemne y Predicación',
 'Eucaristía solemne con predicación.',
 'religious','2026-03-30','18:00','19:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Juvenil',
 'Encuentro de Pascua Juvenil.',
 'religious','2026-03-30','19:00','22:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Santa Laura Montoya ·
('Santa Misa','Santa Misa matutina.',
 'religious','2026-03-30','07:00','08:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa y Santo Viacrucis',
 'Santa Misa seguida del Santo Viacrucis.',
 'religious','2026-03-30','17:00','18:30',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · María Auxiliadora ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-30','08:00','09:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Infantil',
 'Encuentro de Pascua Infantil.',
 'religious','2026-03-30','10:00','13:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Viacrucis','Viacrucis comunitario.',
 'religious','2026-03-30','17:00','18:30',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-30','18:00','19:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- ══════════════════════════════════════════════════════════════
-- MARTES SANTO — 31 DE MARZO
-- ══════════════════════════════════════════════════════════════

-- · San Juan Pablo II ·
('Santa Misa','Santa Misa matutina.',
 'religious','2026-03-31','07:00','08:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis — Templete',
 'Ejercicio del Santo Viacrucis en el templete.',
 'religious','2026-03-31','17:00','18:30',
 'Templete',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa y Confesiones',
 'Santa Misa con disponibilidad para confesiones.',
 'religious','2026-03-31','18:00','19:30',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Encuentro con Parejas',
 'Encuentro pastoral para parejas.',
 'religious','2026-03-31','19:00','21:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrada Familia ·
('Eucaristía — Templo Parroquial','Eucaristía matutina.',
 'religious','2026-03-31','07:00','08:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis y Eucaristía — Capilla Divina Misericordia',
 'Santo Viacrucis y Eucaristía.',
 'religious','2026-03-31','14:00','16:00',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis y Eucaristía — Templo Parroquial',
 'Santo Viacrucis y Eucaristía.',
 'religious','2026-03-31','16:00','18:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis y Eucaristía — Capilla San José Obrero',
 'Santo Viacrucis y Eucaristía.',
 'religious','2026-03-31','17:30','19:30',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrado Corazón ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-31','07:00','08:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Infantil','Encuentro de Pascua Infantil.',
 'religious','2026-03-31','10:00','13:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-31','12:00','13:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Viacrucis','Viacrucis comunitario.',
 'religious','2026-03-31','15:00','16:30',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-31','16:00','17:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesiones — Sector San Juan de Dios',
 'Procesiones en el sector San Juan de Dios.',
 'religious','2026-03-31','17:30','19:00',
 'Sector San Juan de Dios',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-31','18:00','19:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Juvenil','Encuentro de Pascua Juvenil.',
 'religious','2026-03-31','19:00','22:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Actividad para la Familia — Pastoral Familiar',
 'Actividad para la familia organizada por la Pastoral Familiar.',
 'religious','2026-03-31','19:00','21:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Nuestra Señora de la Asunción ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-31','07:00','08:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-31','08:00','09:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Ejercicios Espirituales para las Familias',
 'Ejercicios Espirituales para las familias — mañana.',
 'religious','2026-03-31','09:00','10:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Infantil','Encuentro de Pascua Infantil.',
 'religious','2026-03-31','09:30','12:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-31','12:00','13:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Ejercicios Espirituales para las Familias',
 'Ejercicios Espirituales para las familias — tarde.',
 'religious','2026-03-31','14:00','15:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Vía Crucis','Vía Crucis en el Templo Parroquial.',
 'religious','2026-03-31','15:00','16:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía de Clausura — Ejercicios Espirituales',
 'Eucaristía de clausura de los ejercicios espirituales para las familias.',
 'religious','2026-03-31','16:00','17:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión','Procesión sale del templo.',
 'religious','2026-03-31','17:00','18:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía Solemne y Predicación',
 'Eucaristía solemne con predicación.',
 'religious','2026-03-31','18:00','19:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Juvenil','Encuentro de Pascua Juvenil.',
 'religious','2026-03-31','19:00','22:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Santa Laura Montoya ·
('Santa Misa','Santa Misa matutina.',
 'religious','2026-03-31','07:00','08:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Infantil y Juvenil — Mañana',
 'Pascua infantil y juvenil, sesión de mañana.',
 'religious','2026-03-31','09:00','12:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Infantil y Juvenil — Tarde',
 'Pascua infantil y juvenil, sesión de tarde.',
 'religious','2026-03-31','14:00','17:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa y Santo Viacrucis',
 'Santa Misa seguida del Santo Viacrucis.',
 'religious','2026-03-31','17:00','18:30',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · María Auxiliadora ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-03-31','08:00','09:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-31','10:00','11:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Infantil','Encuentro de Pascua Infantil.',
 'religious','2026-03-31','10:00','13:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-31','15:00','16:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-03-31','18:00','19:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Conferencia: Sentido del Triduo Pascual',
 'Conferencia sobre el sentido del Triduo Pascual.',
 'religious','2026-03-31','19:00','21:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- ══════════════════════════════════════════════════════════════
-- MIÉRCOLES SANTO — 1 DE ABRIL
-- ══════════════════════════════════════════════════════════════

-- · San Juan Pablo II ·
('Santa Misa','Santa Misa matutina.',
 'religious','2026-04-01','07:00','08:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis — Templete',
 'Ejercicio del Santo Viacrucis en el templete.',
 'religious','2026-04-01','17:00','18:30',
 'Templete',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa y Confesiones',
 'Santa Misa con disponibilidad para confesiones.',
 'religious','2026-04-01','18:00','19:30',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Juvenil','Encuentro de Pascua Juvenil.',
 'religious','2026-04-01','19:00','22:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrada Familia ·
('Eucaristía — Templo Parroquial','Eucaristía matutina.',
 'religious','2026-04-01','07:00','08:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis y Eucaristía — Capilla Divina Misericordia',
 'Santo Viacrucis y Eucaristía.',
 'religious','2026-04-01','14:00','16:00',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis y Eucaristía — Templo Parroquial',
 'Santo Viacrucis y Eucaristía.',
 'religious','2026-04-01','16:00','18:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis y Eucaristía — Capilla San José Obrero',
 'Santo Viacrucis y Eucaristía.',
 'religious','2026-04-01','17:30','19:30',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrado Corazón ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-04-01','07:00','08:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Infantil','Encuentro de Pascua Infantil.',
 'religious','2026-04-01','10:00','13:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-01','12:00','13:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Viacrucis','Viacrucis comunitario.',
 'religious','2026-04-01','15:00','16:30',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Cena del Señor con los Niños',
 'Celebración de la Cena del Señor para los niños.',
 'religious','2026-04-01','16:00','17:30',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-01','16:00','17:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-01','18:00','19:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Juvenil','Encuentro de Pascua Juvenil.',
 'religious','2026-04-01','19:00','22:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión Penitencial en Silencio',
 'Procesión penitencial en silencio que inicia y culmina en el templo con celebración comunitaria de la penitencia. Llevar una luz.',
 'religious','2026-04-01','19:00','21:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- · Nuestra Señora de la Asunción ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-04-01','07:00','08:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía matutina.',
 'religious','2026-04-01','08:00','09:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Comunión de los Enfermos',
 'Comunión llevada a los enfermos.',
 'religious','2026-04-01','07:30','08:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Infantil','Encuentro de Pascua Infantil.',
 'religious','2026-04-01','09:30','12:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-01','12:00','13:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Vía Crucis','Vía Crucis en el Templo Parroquial.',
 'religious','2026-04-01','15:00','16:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión','Procesión sale del templo.',
 'religious','2026-04-01','17:00','18:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía Solemne y Predicación',
 'Eucaristía solemne con predicación.',
 'religious','2026-04-01','18:00','19:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Santa Laura Montoya ·
('Santa Misa','Santa Misa matutina.',
 'religious','2026-04-01','07:00','08:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('"Hacia el Camino de la Cruz"',
 'Actividad penitencial para niños y jóvenes.',
 'religious','2026-04-01','09:00','12:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Sacramento de la Reconciliación',
 'Celebración del Sacramento de la Reconciliación.',
 'religious','2026-04-01','14:00','16:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa y Santo Viacrucis',
 'Santa Misa seguida del Santo Viacrucis.',
 'religious','2026-04-01','17:00','18:30',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · María Auxiliadora ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-04-01','08:00','09:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-01','10:00','11:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Pascua Infantil','Encuentro de Pascua Infantil.',
 'religious','2026-04-01','10:00','13:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Viacrucis','Viacrucis comunitario.',
 'religious','2026-04-01','17:00','18:30',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-01','18:00','19:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- ══════════════════════════════════════════════════════════════
-- JUEVES SANTO — 2 DE ABRIL
-- ══════════════════════════════════════════════════════════════

-- · San Juan Pablo II ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-04-02','08:00','09:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía por los Enfermos y Santos Óleos',
 'Eucaristía de oración por los enfermos y entronización de los Santos Óleos en el templete.',
 'religious','2026-04-02','10:00','11:30',
 'Templete',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Cena del Señor para los Niños',
 'Eucaristía y celebración de la Cena del Señor para los niños.',
 'religious','2026-04-02','12:00','13:30',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa — Sector Los Sauces',
 'Santa Misa en el sector Los Sauces.',
 'religious','2026-04-02','14:00','15:00',
 'Sector Los Sauces',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Cena del Señor — Lavatorio de los Pies',
 'Solemne Celebración En la Cena del Señor: lavatorio de los pies, memorial del Sacramento del Orden Sacerdotal y del Mandato del Amor. Procesión al Monumento.',
 'religious','2026-04-02','16:00','18:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Procesión del Prendimiento',
 'Procesión del Prendimiento sale de la cancha de Incoomar. Invitación especial a todos los hombres portando cirios.',
 'religious','2026-04-02','19:00','20:00',
 'Cancha de Incoomar',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Solemne Hora Santa',
 'Solemne Hora Santa.',
 'religious','2026-04-02','20:00','21:30',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrada Familia ·
('Eucaristía — Templo Parroquial','Eucaristía matutina.',
 'religious','2026-04-02','07:00','08:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía con y por los Enfermos — Templo Parroquial',
 'Eucaristía con y por los enfermos.',
 'religious','2026-04-02','10:00','11:30',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía con y por los Enfermos — Capilla San José Obrero',
 'Eucaristía con y por los enfermos.',
 'religious','2026-04-02','10:00','11:30',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía con y por los Enfermos — Capilla Divina Misericordia',
 'Eucaristía con y por los enfermos.',
 'religious','2026-04-02','10:00','11:30',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Cena del Señor y Visita al Monumento — Templo Parroquial',
 'Eucaristía en la Cena del Señor y visita al monumento.',
 'religious','2026-04-02','15:00','17:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Cena del Señor y Visita al Monumento — Capilla San José Obrero',
 'Eucaristía en la Cena del Señor y visita al monumento.',
 'religious','2026-04-02','15:00','17:00',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Cena del Señor y Visita al Monumento — Capilla Divina Misericordia',
 'Eucaristía en la Cena del Señor y visita al monumento.',
 'religious','2026-04-02','15:00','17:00',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión del Prendimiento y Hora Santa — Templo Parroquial',
 'Procesión de prendimiento y Hora Santa. Sale desde la tienda Juanita en el sector Belén Corazonistas.',
 'religious','2026-04-02','19:00','21:00',
 'Sector Belén Corazonistas','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Procesión del Prendimiento — Capilla San José Obrero',
 'Procesión de prendimiento. Sale desde la plazoleta de la capilla.',
 'religious','2026-04-02','19:00','20:30',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión del Prendimiento — Capilla Divina Misericordia',
 'Procesión de prendimiento. Sale desde el callejón de la Virgen del Perpetuo Socorro.',
 'religious','2026-04-02','19:00','20:30',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrado Corazón ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-04-02','07:00','08:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía por los Enfermos y Santos Óleos',
 'Eucaristía por los enfermos y recepción de los santos Óleos.',
 'religious','2026-04-02','10:00','11:30',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristías en Veredas La Esmeralda y Las Mercedes',
 'Eucaristías simultáneas en las veredas La Esmeralda y Las Mercedes.',
 'religious','2026-04-02','11:00','12:00',
 'Veredas La Esmeralda y Las Mercedes',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Cena del Señor — Lavatorio y Procesión al Monumento',
 'Misa en la Cena del Señor: rito de reconciliación, lavatorio de los pies, procesión al monumento, ofrenda del cirio ante el Santísimo Sacramento. Adoración hasta la medianoche.',
 'religious','2026-04-02','16:00','18:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Procesión del Prendimiento',
 'Procesión del Prendimiento: salida desde la Bomba y llegada al templo.',
 'religious','2026-04-02','20:00','21:00',
 'La Bomba',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Hora Santa ante el Monumento',
 'Hora Santa ante el monumento del Santísimo Sacramento.',
 'religious','2026-04-02','21:00','22:30',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Nuestra Señora de la Asunción ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-04-02','07:00','08:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía matutina.',
 'religious','2026-04-02','08:00','09:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía por los Enfermos y Santos Óleos',
 'Eucaristía por los enfermos y recepción de los santos óleos.',
 'religious','2026-04-02','10:00','11:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Cena del Señor y Procesión al Monumento',
 'Eucaristía de la Cena del Señor y procesión al monumento.',
 'religious','2026-04-02','15:00','17:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Cena de la Caridad — C.B.A. San José',
 'Cena de la caridad organizada por C.B.A. San José.',
 'religious','2026-04-02','18:00','20:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión del Prendimiento',
 'Procesión del prendimiento. Sale del sector Tinajas.',
 'religious','2026-04-02','20:00','21:00',
 'Sector Tinajas',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Solemne Hora Santa',
 'Solemne hora santa.',
 'religious','2026-04-02','21:00','22:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Santa Laura Montoya ·
('Santa Misa','Santa Misa matutina.',
 'religious','2026-04-02','08:00','09:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa, Oración por los Enfermos y Santos Óleos',
 'Santa Misa con oración especial por los enfermos y recepción de los santos óleos.',
 'religious','2026-04-02','11:00','12:30',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa en la Cena del Señor y Lavatorio de los Pies',
 'Santa Misa en la Cena del Señor, lavatorio de los pies y procesión al Monumento.',
 'religious','2026-04-02','16:00','18:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Procesión del Prendimiento',
 'Procesión del Prendimiento. Sale del sector El Plan.',
 'religious','2026-04-02','20:00','21:00',
 'Sector El Plan',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Hora Santa — Visita al Monumento',
 'Hora Santa con visita al Monumento hasta la medianoche.',
 'religious','2026-04-02','21:00','23:59',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · María Auxiliadora ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-04-02','08:00','09:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía y Presentación de los Santos Óleos',
 'Eucaristía con presentación de los santos Óleos consagrados por el Obispo en la Misa Crismal. Se invita a traer los enfermos al Templo.',
 'religious','2026-04-02','10:00','11:30',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Cena del Señor y Lavatorio de los Pies',
 'Solemne eucaristía en la Cena del Señor y lavatorio de los pies. Procesión al monumento.',
 'religious','2026-04-02','15:00','17:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Procesión del Prendimiento',
 'Procesión del prendimiento. Punto de encuentro: cancha de Villas. Baja por Carrera 37, toma la Calle 30 y termina en el Templo.',
 'religious','2026-04-02','20:00','21:00',
 'Cancha de Villas','Carrera 37 — Calle 30','María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Hora Santa',
 'Hora Santa.',
 'religious','2026-04-02','21:00','22:30',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- ══════════════════════════════════════════════════════════════
-- VIERNES SANTO — 3 DE ABRIL
-- ══════════════════════════════════════════════════════════════
-- NOTA: Los horarios "3:00 am" y "7:00 am" del documento
-- original para Sagrado Corazón son errores tipográficos;
-- se corrigen a 15:00 y 19:00 (pm) según el rito litúrgico.

-- · San Juan Pablo II ·
('Sermón de Sentencia y Santo Viacrucis',
 'Sermón de sentencia y Santo Viacrucis. Inicia en el parqueadero del Mirador del Hato.',
 'religious','2026-04-03','10:00','12:00',
 'Parqueadero del Mirador del Hato',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Solemne Acción Litúrgica en la Muerte del Señor',
 'Solemne acción litúrgica: adoración de la Santa Cruz, oración universal y distribución de la Sagrada Comunión. Ofrenda para los Santos Lugares.',
 'religious','2026-04-03','15:00','16:30',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Siete Palabras, Descendimiento y Procesión al Santo Sepulcro',
 'Sermón de las Siete Palabras del Señor en la Cruz, sermón del descendimiento y procesión al Santo Sepulcro.',
 'religious','2026-04-03','19:00','21:30',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- · Sagrada Familia ·
('Sentencia y Santo Viacrucis — Templo Parroquial',
 'Sentencia y Santo Viacrucis. Sale desde la escalinata de Belencito.',
 'religious','2026-04-03','10:00','12:00',
 'Escalinata de Belencito','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Sentencia y Santo Viacrucis — Capilla San José Obrero',
 'Sentencia y Santo Viacrucis. Sale desde la plazoleta de la capilla.',
 'religious','2026-04-03','10:00','12:00',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Sentencia y Santo Viacrucis — Capilla Divina Misericordia',
 'Sentencia y Santo Viacrucis. Sale desde el callejón de la última copa.',
 'religious','2026-04-03','10:00','12:00',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Acción Litúrgica de la Pasión — Templo Parroquial',
 'Solemne Acción Litúrgica de la Pasión del Señor.',
 'religious','2026-04-03','15:00','16:30',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Solemne Acción Litúrgica de la Pasión — Capilla San José Obrero',
 'Solemne Acción Litúrgica de la Pasión del Señor.',
 'religious','2026-04-03','15:00','16:30',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Acción Litúrgica de la Pasión — Capilla Divina Misericordia',
 'Solemne Acción Litúrgica de la Pasión del Señor.',
 'religious','2026-04-03','15:00','16:30',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Siete Palabras y Descendimiento — Capilla Divina Misericordia',
 'Siete palabras de Jesús en la Cruz y descendimiento.',
 'religious','2026-04-03','18:00','20:00',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Siete Palabras y Descendimiento — Templo Parroquial',
 'Siete palabras de Jesús en la Cruz y descendimiento.',
 'religious','2026-04-03','19:00','21:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Siete Palabras y Descendimiento — Capilla San José Obrero',
 'Siete palabras de Jesús en la Cruz y descendimiento.',
 'religious','2026-04-03','19:00','21:00',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrado Corazón ·
('Laudes junto al Monumento',
 'Celebración de Laudes junto al monumento del Santísimo Sacramento.',
 'religious','2026-04-03','09:00','09:45',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Sermón de Sentencia y Viacrucis (11 Estaciones)',
 'Sermón de sentencia y Procesión del Viacrucis con 11 estaciones.',
 'religious','2026-04-03','10:00','12:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Solemne Celebración de la Pasión del Señor',
 'Solemne celebración de la Pasión del Señor: Liturgia de la Palabra, distribución de la Comunión, Adoración de la Cruz y ejercicio de la Lanzada.',
 'religious','2026-04-03','15:00','16:30',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Celebración de la Pasión — Vereda La Esmeralda',
 'Celebración de la Pasión del Señor en la vereda La Esmeralda.',
 'religious','2026-04-03','15:00','16:30',
 'Vereda La Esmeralda',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Celebración de la Pasión — Vereda Las Mercedes',
 'Celebración de la Pasión del Señor en la vereda Las Mercedes.',
 'religious','2026-04-03','15:00','16:30',
 'Vereda Las Mercedes',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Siete Palabras, Descendimiento y Oración ante el Sepulcro',
 'Sermón de las 7 Palabras y Descendimiento. Oración ante el Sepulcro hasta la medianoche.',
 'religious','2026-04-03','19:00','23:59',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- · Nuestra Señora de la Asunción ·
('Sermón de Sentencia y Santo Vía Crucis',
 'Sermón de sentencia y Santo Vía Crucis. Sale de la Capilla Jesús Nazareno.',
 'religious','2026-04-03','10:00','12:00',
 'Capilla de Jesús Nazareno',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Solemne Acción Litúrgica en la Pasión del Señor',
 'Solemne acción litúrgica en la Pasión del Señor.',
 'religious','2026-04-03','15:00','16:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Siete Palabras, Descendimiento y Procesión con el Santo Sepulcro',
 'Siete palabras de Cristo en la Cruz, sermón de descendimiento y procesión con el Santo Sepulcro.',
 'religious','2026-04-03','19:00','21:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- · Santa Laura Montoya ·
('Sermón de Sentencia',
 'Sermón de sentencia del Viernes Santo.',
 'religious','2026-04-03','10:30','11:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santo Viacrucis — Sale del Seminario',
 'Ejercicio del Santo Viacrucis. Sale del Seminario.',
 'religious','2026-04-03','11:00','12:30',
 'Seminario',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Solemne Acción Litúrgica y Adoración de la Cruz',
 'Solemne Acción Litúrgica, Adoración de la Cruz y distribución de la Sagrada Comunión.',
 'religious','2026-04-03','15:00','16:30',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Siete Palabras, Descendimiento y Procesión',
 'Proclamación de las Siete Palabras, Descendimiento, procesión y visita hasta la medianoche.',
 'religious','2026-04-03','19:00','23:59',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- · María Auxiliadora ·
('Apertura del Templo — Viernes Santo',
 'Apertura del Templo.',
 'religious','2026-04-03','08:00','08:30',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Sermón de Sentencia y Viacrucis',
 'Sermón de Sentencia y ejercicio piadoso del Viacrucis del Señor. Punto de encuentro: la Escuela Azul. Recorrido por la Calle 30.',
 'religious','2026-04-03','09:30','11:30',
 'Escuela Azul','Calle 30','María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Viacrucis — Vereda El Socorro',
 'Viacrucis en la vereda El Socorro.',
 'religious','2026-04-03','10:00','11:30',
 'Vereda El Socorro',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Celebración Litúrgica y Procesión del Santo Sepulcro',
 'Solemne celebración litúrgica en la muerte del Señor, lectura de la pasión, adoración de la Santa Cruz. Procesión del Santo Sepulcro: sale del Templo por Calle 30 → Cra 38 → Calle 31 → Cra 41 → Templo.',
 'religious','2026-04-03','15:00','17:00',
 'Parroquia María Auxiliadora','Calle 30 — Cra. 38 — Calle 31 — Cra. 41','María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- ══════════════════════════════════════════════════════════════
-- SÁBADO SANTO — 4 DE ABRIL
-- ══════════════════════════════════════════════════════════════

-- · San Juan Pablo II ·
('Laudes ante el Santo Sepulcro',
 'Oficio de lectura y oración de Laudes con la comunidad ante el Santo Sepulcro.',
 'religious','2026-04-04','09:00','09:45',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Ejercicio de los Siete Dolores de la Virgen',
 'Ejercicio de los Siete Dolores de la Santísima Virgen.',
 'religious','2026-04-04','16:00','17:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión con la Virgen de los Dolores',
 'Procesión con la Virgen de los Dolores. Sale del templo. Invitación especial a todas las mujeres portando cirios.',
 'religious','2026-04-04','17:00','18:30',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Vigilia Pascual — Sector Los Sauces',
 'Vigilia Pascual en el sector Los Sauces.',
 'religious','2026-04-04','19:00','21:30',
 'Sector Los Sauces',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Vigilia Pascual',
 'Solemne Vigilia Pascual: bendición del fuego, Pregón Pascual y renovación de las Promesas Bautismales.',
 'religious','2026-04-04','20:00','23:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- · Sagrada Familia ·
('Procesión de Soledad y Siete Dolores — Desde Capilla San José Obrero',
 'Procesión de soledad y siete dolores de la Santísima Virgen María. Sale desde la Capilla San José Obrero hacia el Templo Parroquial.',
 'religious','2026-04-04','15:00','16:30',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Procesión de Soledad y Siete Dolores — Capilla Divina Misericordia',
 'Procesión de soledad y siete dolores de la Santísima Virgen María.',
 'religious','2026-04-04','15:00','16:30',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Vigilia Pascual — Capilla Divina Misericordia',
 'Vigilia Pascual y Eucaristía en la Capilla de la Divina Misericordia.',
 'religious','2026-04-04','18:00','20:30',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Vigilia Pascual — Templo Parroquial',
 'Vigilia Pascual y Eucaristía en el Templo Parroquial.',
 'religious','2026-04-04','19:00','21:30',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Vigilia Pascual — Capilla San José Obrero',
 'Vigilia Pascual y Eucaristía en la Capilla San José Obrero.',
 'religious','2026-04-04','19:00','21:30',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrado Corazón ·
('Laudes junto al Sepulcro',
 'Oficio y oración de Laudes junto al Sepulcro.',
 'religious','2026-04-04','09:00','09:45',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión de Soledad y Siete Dolores',
 'Procesión de Soledad, ejercicio de los Siete Dolores y predicación.',
 'religious','2026-04-04','16:00','18:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Vigilia Pascual — Vereda La Esmeralda',
 'Vigilia Pascual en la vereda La Esmeralda.',
 'religious','2026-04-04','18:00','20:30',
 'Vereda La Esmeralda',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Vigilia Pascual — Vereda Las Mercedes',
 'Vigilia Pascual en la vereda Las Mercedes.',
 'religious','2026-04-04','18:00','20:30',
 'Vereda Las Mercedes',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Vigilia Pascual — Bautismos de Adultos',
 'Solemne Vigilia Pascual con bautismos de adultos.',
 'religious','2026-04-04','21:00','23:30',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- · Nuestra Señora de la Asunción ·
('Ejercicio de los Siete Dolores',
 'Ejercicio de los siete dolores de la Santísima Virgen.',
 'religious','2026-04-04','15:00','16:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión con la Virgen en su Soledad',
 'Procesión con la Virgen en su soledad y predicación.',
 'religious','2026-04-04','18:00','19:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Solemne Vigilia Pascual',
 'Solemne Vigilia Pascual.',
 'religious','2026-04-04','21:00','23:30',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- · Santa Laura Montoya ·
('Celebración Mariana — Meditación de los Siete Dolores',
 'Celebración Mariana con meditación de los Siete Dolores. Sale del Seminario.',
 'religious','2026-04-04','15:00','16:30',
 'Seminario',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Vigilia Pascual',
 'Solemne Vigilia Pascual. Bendición del fuego nuevo, Pregón Pascual y renovación de las promesas bautismales.',
 'religious','2026-04-04','20:00','22:30',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- · María Auxiliadora ·
('Apertura del Templo — Oficio Divino y Laudes',
 'Apertura del Templo. Rezo del Oficio Divino y Laudes con la comunidad.',
 'religious','2026-04-04','08:00','08:45',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Siete Dolores de la Virgen y Procesión de Soledad',
 'Ejercicio piadoso de los Siete Dolores de la Santísima Virgen María y procesión de Soledad con Sermón de Soledad. Recorrido: Templo → Cra. 41 → Calle 31 → Cra. 38 → Calle 30 → Templo.',
 'religious','2026-04-04','15:00','17:00',
 'Parroquia María Auxiliadora','Cra. 41 — Calle 31 — Cra. 38 — Calle 30','María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Vigilia Pascual — Vereda La Asunción',
 'Vigilia Pascual en la vereda La Asunción.',
 'religious','2026-04-04','18:00','20:30',
 'Vereda La Asunción',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Vigilia Pascual',
 'Solemne Vigilia Pascual.',
 'religious','2026-04-04','20:00','23:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- ══════════════════════════════════════════════════════════════
-- DOMINGO DE RESURRECCIÓN — 5 DE ABRIL
-- ══════════════════════════════════════════════════════════════

-- · San Juan Pablo II ·
('Santa Misa de Resurrección','Santa Misa de Pascua.',
 'religious','2026-04-05','08:00','09:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión de Resurrección',
 'Procesión de Resurrección con salida desde D1 Bariloche.',
 'religious','2026-04-05','09:00','10:00',
 'D1 Bariloche',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Solemne Celebración Eucarística de Pascua',
 'Solemne Celebración Eucarística de Pascua de Resurrección.',
 'religious','2026-04-05','10:00','11:30',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Santa Misa','Santa Misa.',
 'religious','2026-04-05','12:00','13:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa','Santa Misa.',
 'religious','2026-04-05','16:00','17:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa','Santa Misa.',
 'religious','2026-04-05','18:00','19:00',
 'Parroquia San Juan Pablo II',NULL,'San Juan Pablo II',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrada Familia ·
('Eucaristía — Templo Parroquial',
 'Eucaristía de Resurrección.',
 'religious','2026-04-05','08:00','09:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía de Resurrección y Procesión',
 'Eucaristía de Resurrección con procesión desde la Capilla San José Obrero hacia el Templo Parroquial.',
 'religious','2026-04-05','10:00','11:30',
 'Capilla San José Obrero',NULL,'Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Eucaristía — Templo Parroquial',
 'Eucaristía.',
 'religious','2026-04-05','12:00','13:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión de Resurrección — Vereda Cascajo Abajo',
 'Procesión desde el cruce de cimarronas hacia la Capilla de la Divina Misericordia.',
 'religious','2026-04-05','14:30','15:00',
 'Cruce de Cimarronas','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía — Capilla Divina Misericordia',
 'Eucaristía de Resurrección.',
 'religious','2026-04-05','15:00','16:00',
 'Capilla Divina Misericordia','Vereda Cascajo Abajo','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía — Templo Parroquial',
 'Eucaristía.',
 'religious','2026-04-05','17:00','18:00',
 'Templo Parroquial Sagrada Familia','Belén','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía — Capilla San José Obrero',
 'Eucaristía.',
 'religious','2026-04-05','18:30','19:30',
 'Capilla San José Obrero','Ciudadela','Sagrada Familia',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Sagrado Corazón ·
('Eucaristía','Eucaristía matutina de Pascua.',
 'religious','2026-04-05','07:00','08:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','10:00','11:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía en la Vereda La Esmeralda',
 'Eucaristía de Resurrección en la vereda La Esmeralda.',
 'religious','2026-04-05','11:00','12:00',
 'Vereda La Esmeralda',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión de Resurrección — Sector Polideportivo',
 'Procesión de Resurrección. Salida del sector Polideportivo. Se invita a portar prenda blanca y pañuelos o banderas blancas como símbolo de unidad.',
 'religious','2026-04-05','11:00','12:30',
 'Sector Polideportivo',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','12:00','13:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía en la Vereda Las Mercedes',
 'Eucaristía de Resurrección en la vereda Las Mercedes.',
 'religious','2026-04-05','14:00','15:00',
 'Vereda Las Mercedes',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','16:00','17:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','17:00','18:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','18:00','19:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','19:00','20:00',
 'Parroquia Sagrado Corazón',NULL,'Sagrado Corazón',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Nuestra Señora de la Asunción ·
('Eucaristía','Eucaristía matutina.',
 'religious','2026-04-05','07:00','08:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía matutina.',
 'religious','2026-04-05','08:00','09:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Solemne Procesión de Resurrección y Eucaristía de Pascua',
 'Solemne procesión de Resurrección con salida desde la Capilla de Jesús Nazareno, seguida de Eucaristía de Pascua.',
 'religious','2026-04-05','10:00','12:00',
 'Capilla de Jesús Nazareno',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','15:00','16:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','16:00','17:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','18:00','19:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','19:00','20:00',
 'Parroquia Nuestra Señora de la Asunción',NULL,'Nuestra Señora de la Asunción',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · Santa Laura Montoya ·
('Santa Misa','Santa Misa matutina de Resurrección.',
 'religious','2026-04-05','08:00','09:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa Solemne de Resurrección',
 'Santa Misa Solemne de Pascua de Resurrección.',
 'religious','2026-04-05','11:00','12:30',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Santa Misa','Santa Misa.',
 'religious','2026-04-05','15:00','16:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Santa Misa','Santa Misa vespertina.',
 'religious','2026-04-05','17:00','18:00',
 'Parroquia Santa Laura Montoya',NULL,'Santa Laura Montoya',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- · María Auxiliadora ·
('Eucaristía','Eucaristía de Resurrección.',
 'religious','2026-04-05','08:00','09:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','10:00','11:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Procesión de Resurrección — Las Acacias',
 'Procesión de Resurrección. Punto de encuentro: Las Acacias. Recorrido: Calle 31 → Carrera 40 → Calle 30 → Templo.',
 'religious','2026-04-05','11:00','12:30',
 'Las Acacias','Calle 31 — Carrera 40 — Calle 30','María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','12:00','13:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','16:00','17:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','18:00','19:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Eucaristía','Eucaristía.',
 'religious','2026-04-05','20:00','21:00',
 'Parroquia María Auxiliadora',NULL,'María Auxiliadora',
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false);


-- ============================================================
-- PROGRAMACIÓN CULTURAL SEMANA SANTA 2026
-- 49° Festival de Música Religiosa + Exposiciones y Talleres
-- ============================================================

INSERT INTO events (
  title, description, category,
  event_date, event_time, event_time_end,
  location, address, parish,
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
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Domingo 29 de marzo
('Banda Sinfónica Municipio de Rionegro — 49° Festival de Música Religiosa',
 'Presentación de la Banda Sinfónica del Municipio de Rionegro en el barrio La Dalia.',
 'artistic','2026-03-29','14:00','16:00',
 'Parroquia Sagrado Corazón de Jesús','Barrio La Dalia',NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Orquesta Departamental de Antioquia (ODA) — 49° Festival de Música Religiosa',
 'Concierto de la Orquesta Departamental de Antioquia en el Teatro Regional.',
 'artistic','2026-03-29','19:00','21:00',
 'Teatro Regional Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Lunes 30 de marzo
('Actividad académica: Monteverdi "Luz de una constelación"',
 'Contextualización del programa Monteverdi: "Luz de una constelación". Actividad académica en el marco del 49° Festival de Música Religiosa.',
 'cultural','2026-03-30','15:00','16:30',
 'Casa Cultural Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Concento Antiguo Medellín - Octeto Vocal — 49° Festival de Música Religiosa',
 'Concierto del Concento Antiguo Medellín - Octeto Vocal.',
 'artistic','2026-03-30','19:00','21:00',
 'Capilla Jesús Nazareno',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Martes 31 de marzo
('Orquesta de Cámara Rezonanz — 49° Festival de Música Religiosa',
 'Concierto de la Orquesta de Cámara Rezonanz en la Capilla de Jesús Nazareno.',
 'artistic','2026-03-31','19:00','21:00',
 'Capilla de Jesús Nazareno',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Miércoles 1 de abril
('Actividad académica: "Encuentro Ceremonial para el Cuidado de la Vida"',
 'Actividad académica en el marco del 49° Festival de Música Religiosa.',
 'cultural','2026-04-01','15:00','16:30',
 'Casa Cultural Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Tamsaianka — 49° Festival de Música Religiosa',
 'Concierto de Tamsaianka en el Teatro Regional Valerio Antonio Jiménez.',
 'artistic','2026-04-01','19:00','21:00',
 'Teatro Regional Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Jueves 2 de abril
('Orquesta Regional de Cuerdas del Oriente — 49° Festival de Música Religiosa',
 'Concierto de la Orquesta Regional de Cuerdas del Oriente.',
 'artistic','2026-04-02','17:00','19:00',
 'Teatro Regional Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('Soul Gospel Medellín — 49° Festival de Música Religiosa',
 'Concierto de Soul Gospel Medellín.',
 'artistic','2026-04-02','21:00','23:00',
 'Teatro Regional Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Viernes 3 de abril
('Ensamble Vocal Polimia Marinilla — 49° Festival de Música Religiosa',
 'Concierto del Ensamble Vocal Polimia Marinilla.',
 'artistic','2026-04-03','17:00','19:00',
 'Teatro Regional Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- Sábado 4 de abril
('Jonathan Gómez Galvis & Santiago Duque Ángel — 49° Festival de Música Religiosa',
 'Concierto de cierre del 49° Festival de Música Religiosa. Jonathan Gómez Galvis (flauta) y Santiago Duque Ángel (piano).',
 'artistic','2026-04-04','16:00','18:00',
 'Teatro Regional Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- ══════════════════════════════════════════════════════════════
-- EXPOSICIONES — INAUGURACIONES Y TALLERES DE ARTE
-- ══════════════════════════════════════════════════════════════

-- Viernes 27 de marzo
('Inauguración Exposición Francisco García',
 'Inauguración de la exposición del artista Francisco García.',
 'artistic','2026-03-27','17:00','19:00',
 'Hostería El Camino Real',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- Sábado 28 de marzo
('Inauguración: "Arte Hecho Pasión" — Maestro Alberto Soto',
 'Inauguración de la exposición "Arte Hecho Pasión" del Maestro Alberto Soto.',
 'artistic','2026-03-28','17:00','19:00',
 'Casa Cultural Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Inauguración: "Viacrucis de JALAR" — Maestro Jesús Alberto Arbeláez',
 'Inauguración de la exposición "Viacrucis de JALAR" del Maestro Jesús Alberto Arbeláez.',
 'artistic','2026-03-28','15:00','17:00',
 'Parque Principal',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Inauguración Exposición en el Asilo — CBA San José',
 'Inauguración de exposición artística en el CBA San José.',
 'artistic','2026-03-28',NULL,NULL,
 'CBA San José',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- Domingo 29 de marzo
('Apertura: Museo de Cristos, Cruces y Crucifijos Roberto Hoyos Castaño',
 'Apertura exposición parcial del Museo de Cristos, Cruces y Crucifijos Roberto Hoyos Castaño.',
 'cultural','2026-03-29','12:00','14:00',
 'Teatro Municipal Simona Duque',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- Lunes 30 de marzo
('Taller de Escultura — Maestro Alberto Soto',
 'Taller de escultura dictado por el Maestro Alberto Soto.',
 'artistic','2026-03-30','10:00','12:00',
 'Casa Cultural Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Taller "La Palabra en Plástica" — Maestro JALAR',
 'Taller "La Palabra en Plástica" dictado por el Maestro Jesús Arbeláez (JALAR).',
 'artistic','2026-03-30','15:00','17:00',
 'Auditorio CBA San José',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- Martes 31 de marzo
('Taller de Escultura — Maestro Alberto Soto',
 'Taller de escultura dictado por el Maestro Alberto Soto.',
 'artistic','2026-03-31','10:00','12:00',
 'Casa Cultural Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Taller "La Palabra en Plástica" — Maestro JALAR',
 'Taller "La Palabra en Plástica" dictado por el Maestro Jesús Arbeláez (JALAR).',
 'artistic','2026-03-31','15:00','17:00',
 'Auditorio CBA San José',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- Miércoles 1 de abril
('Taller de Escultura — Maestro Alberto Soto',
 'Taller de escultura dictado por el Maestro Alberto Soto.',
 'artistic','2026-04-01','10:00','12:00',
 'Casa Cultural Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Taller "La Palabra en Plástica" — Maestro JALAR',
 'Taller "La Palabra en Plástica" dictado por el Maestro Jesús Arbeláez (JALAR).',
 'artistic','2026-04-01','15:00','17:00',
 'Parque Principal',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('Arte Calle Semana Santa',
 'Intervención artística en el espacio público. Arte Calle en el marco de la Semana Santa de Marinilla.',
 'artistic','2026-04-01','10:00','18:00',
 'Calle 30','A la altura del Teatro Valerio Antonio Jiménez',NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true);
