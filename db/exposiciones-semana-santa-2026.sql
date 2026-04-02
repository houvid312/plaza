-- ============================================================
-- EXPOSICIONES SEMANA SANTA 2026 — Marinilla
-- Fechas:
--   Martes Santo          → 2026-03-31
--   Miércoles Santo       → 2026-04-01
--   Jueves Santo          → 2026-04-02
--   Viernes Santo         → 2026-04-03
--   Sábado Santo          → 2026-04-04
--   Domingo de Resurrección → 2026-04-05
-- Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

INSERT INTO events (
  title, description, category,
  event_date, event_time, event_time_end,
  location, address, parish,
  municipality_id, status, featured
) VALUES

-- ══════════════════════════════════════════════════════════════
-- CASA CULTURA VALERIO ANTONIO JIMÉNEZ
-- "Arte Hecho Pasión" — Maestro Alberto Soto
-- ══════════════════════════════════════════════════════════════

('"Arte Hecho Pasión" — Maestro Alberto Soto',
 'Exposición de artes plásticas del Maestro Alberto Soto. Martes Santo.',
 'artistic','2026-03-31','10:00','20:00',
 'Casa Cultura Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Arte Hecho Pasión" — Maestro Alberto Soto',
 'Exposición de artes plásticas del Maestro Alberto Soto. Miércoles Santo.',
 'artistic','2026-04-01','10:00','20:00',
 'Casa Cultura Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Arte Hecho Pasión" — Maestro Alberto Soto',
 'Exposición de artes plásticas del Maestro Alberto Soto. Jueves Santo — horario extendido hasta las 10:00 p.m.',
 'artistic','2026-04-02','10:00','22:00',
 'Casa Cultura Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Arte Hecho Pasión" — Maestro Alberto Soto',
 'Exposición de artes plásticas del Maestro Alberto Soto. Viernes Santo — horario extendido hasta las 10:00 p.m.',
 'artistic','2026-04-03','10:00','22:00',
 'Casa Cultura Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Arte Hecho Pasión" — Maestro Alberto Soto',
 'Exposición de artes plásticas del Maestro Alberto Soto. Sábado Santo.',
 'artistic','2026-04-04','10:00','20:00',
 'Casa Cultura Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Arte Hecho Pasión" — Maestro Alberto Soto',
 'Exposición de artes plásticas del Maestro Alberto Soto. Domingo de Resurrección.',
 'artistic','2026-04-05','10:00','17:00',
 'Casa Cultura Valerio Antonio Jiménez',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- ══════════════════════════════════════════════════════════════
-- SEDE ADMINISTRATIVA 3 — HOSTERÍA DEL CAMINO REAL
-- "Apasionarte" — Maestro Francisco García
-- ══════════════════════════════════════════════════════════════

('"Apasionarte" — Maestro Francisco García',
 'Exposición de artes plásticas del Maestro Francisco García. Martes Santo.',
 'artistic','2026-03-31','10:00','20:00',
 'Hostería El Camino Real — Sede Administrativa 3',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Apasionarte" — Maestro Francisco García',
 'Exposición de artes plásticas del Maestro Francisco García. Miércoles Santo.',
 'artistic','2026-04-01','10:00','20:00',
 'Hostería El Camino Real — Sede Administrativa 3',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Apasionarte" — Maestro Francisco García',
 'Exposición de artes plásticas del Maestro Francisco García. Jueves Santo — horario extendido hasta las 10:00 p.m.',
 'artistic','2026-04-02','10:00','22:00',
 'Hostería El Camino Real — Sede Administrativa 3',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Apasionarte" — Maestro Francisco García',
 'Exposición de artes plásticas del Maestro Francisco García. Viernes Santo — horario extendido hasta las 10:00 p.m.',
 'artistic','2026-04-03','10:00','22:00',
 'Hostería El Camino Real — Sede Administrativa 3',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Apasionarte" — Maestro Francisco García',
 'Exposición de artes plásticas del Maestro Francisco García. Sábado Santo.',
 'artistic','2026-04-04','10:00','20:00',
 'Hostería El Camino Real — Sede Administrativa 3',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Apasionarte" — Maestro Francisco García',
 'Exposición de artes plásticas del Maestro Francisco García. Domingo de Resurrección.',
 'artistic','2026-04-05','10:00','17:00',
 'Hostería El Camino Real — Sede Administrativa 3',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- ══════════════════════════════════════════════════════════════
-- AUDITORIO CBA — SAN JOSÉ
-- "Perspectivoas" — Exposición colectiva
-- Martes a Domingo de Resurrección: 12:00 m. - 8:00 p.m.
-- ══════════════════════════════════════════════════════════════

('"Perspectivoas" — Exposición colectiva',
 'Exposición colectiva de artes plásticas en el Auditorio CBA San José. Martes Santo.',
 'artistic','2026-03-31','12:00','20:00',
 'Auditorio CBA — San José',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Perspectivoas" — Exposición colectiva',
 'Exposición colectiva de artes plásticas en el Auditorio CBA San José. Miércoles Santo.',
 'artistic','2026-04-01','12:00','20:00',
 'Auditorio CBA — San José',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Perspectivoas" — Exposición colectiva',
 'Exposición colectiva de artes plásticas en el Auditorio CBA San José. Jueves Santo.',
 'artistic','2026-04-02','12:00','20:00',
 'Auditorio CBA — San José',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Perspectivoas" — Exposición colectiva',
 'Exposición colectiva de artes plásticas en el Auditorio CBA San José. Viernes Santo.',
 'artistic','2026-04-03','12:00','20:00',
 'Auditorio CBA — San José',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Perspectivoas" — Exposición colectiva',
 'Exposición colectiva de artes plásticas en el Auditorio CBA San José. Sábado Santo.',
 'artistic','2026-04-04','12:00','20:00',
 'Auditorio CBA — San José',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Perspectivoas" — Exposición colectiva',
 'Exposición colectiva de artes plásticas en el Auditorio CBA San José. Domingo de Resurrección.',
 'artistic','2026-04-05','12:00','20:00',
 'Auditorio CBA — San José',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- ══════════════════════════════════════════════════════════════
-- TEATRO SIMONA DUQUE
-- "Museo de Cristos, cruces y crucifijos" — Exposición temporal
-- ══════════════════════════════════════════════════════════════

('"Museo de Cristos, cruces y crucifijos" — Exposición temporal',
 'Exposición temporal del Museo de Cristos, cruces y crucifijos en el Teatro Simona Duque. Martes Santo.',
 'cultural','2026-03-31','10:00','20:00',
 'Teatro Simona Duque',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Museo de Cristos, cruces y crucifijos" — Exposición temporal',
 'Exposición temporal del Museo de Cristos, cruces y crucifijos en el Teatro Simona Duque. Miércoles Santo.',
 'cultural','2026-04-01','10:00','20:00',
 'Teatro Simona Duque',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Museo de Cristos, cruces y crucifijos" — Exposición temporal',
 'Exposición temporal del Museo de Cristos, cruces y crucifijos en el Teatro Simona Duque. Jueves Santo — horario extendido hasta las 10:00 p.m.',
 'cultural','2026-04-02','10:00','22:00',
 'Teatro Simona Duque',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Museo de Cristos, cruces y crucifijos" — Exposición temporal',
 'Exposición temporal del Museo de Cristos, cruces y crucifijos en el Teatro Simona Duque. Viernes Santo — horario extendido hasta las 10:00 p.m.',
 'cultural','2026-04-03','10:00','22:00',
 'Teatro Simona Duque',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Museo de Cristos, cruces y crucifijos" — Exposición temporal',
 'Exposición temporal del Museo de Cristos, cruces y crucifijos en el Teatro Simona Duque. Sábado Santo.',
 'cultural','2026-04-04','10:00','20:00',
 'Teatro Simona Duque',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

('"Museo de Cristos, cruces y crucifijos" — Exposición temporal',
 'Exposición temporal del Museo de Cristos, cruces y crucifijos en el Teatro Simona Duque. Domingo de Resurrección.',
 'cultural','2026-04-05','10:00','17:00',
 'Teatro Simona Duque',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',true),

-- ══════════════════════════════════════════════════════════════
-- RECINTO DEL CONCEJO MUNICIPAL — ALCALDÍA
-- "Pinacoteca del Concejo Municipal" — Artistas varias
-- Martes a Domingo de Resurrección: 10:00 m. - 4:00 p.m.
-- ══════════════════════════════════════════════════════════════

('"Pinacoteca del Concejo Municipal"',
 'Exposición de la Pinacoteca del Concejo Municipal con obras de artistas varias. Martes Santo.',
 'artistic','2026-03-31','10:00','16:00',
 'Recinto del Concejo Municipal — Alcaldía',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('"Pinacoteca del Concejo Municipal"',
 'Exposición de la Pinacoteca del Concejo Municipal con obras de artistas varias. Miércoles Santo.',
 'artistic','2026-04-01','10:00','16:00',
 'Recinto del Concejo Municipal — Alcaldía',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('"Pinacoteca del Concejo Municipal"',
 'Exposición de la Pinacoteca del Concejo Municipal con obras de artistas varias. Jueves Santo.',
 'artistic','2026-04-02','10:00','16:00',
 'Recinto del Concejo Municipal — Alcaldía',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('"Pinacoteca del Concejo Municipal"',
 'Exposición de la Pinacoteca del Concejo Municipal con obras de artistas varias. Viernes Santo.',
 'artistic','2026-04-03','10:00','16:00',
 'Recinto del Concejo Municipal — Alcaldía',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('"Pinacoteca del Concejo Municipal"',
 'Exposición de la Pinacoteca del Concejo Municipal con obras de artistas varias. Sábado Santo.',
 'artistic','2026-04-04','10:00','16:00',
 'Recinto del Concejo Municipal — Alcaldía',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('"Pinacoteca del Concejo Municipal"',
 'Exposición de la Pinacoteca del Concejo Municipal con obras de artistas varias. Domingo de Resurrección.',
 'artistic','2026-04-05','10:00','16:00',
 'Recinto del Concejo Municipal — Alcaldía',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

-- ══════════════════════════════════════════════════════════════
-- PARQUE PRINCIPAL
-- "Viacrucis" — Maestro Jesús Alberto Arbeláez "Jalar"
-- Exposición al aire libre — Martes a Domingo de Resurrección
-- ══════════════════════════════════════════════════════════════

('"Viacrucis" de JALAR — Maestro Jesús Alberto Arbeláez',
 'Exposición escultórica al aire libre "Viacrucis" del Maestro Jesús Alberto Arbeláez "Jalar" en el Parque Principal. Martes Santo.',
 'artistic','2026-03-31',NULL,NULL,
 'Parque Principal',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('"Viacrucis" de JALAR — Maestro Jesús Alberto Arbeláez',
 'Exposición escultórica al aire libre "Viacrucis" del Maestro Jesús Alberto Arbeláez "Jalar" en el Parque Principal. Miércoles Santo.',
 'artistic','2026-04-01',NULL,NULL,
 'Parque Principal',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('"Viacrucis" de JALAR — Maestro Jesús Alberto Arbeláez',
 'Exposición escultórica al aire libre "Viacrucis" del Maestro Jesús Alberto Arbeláez "Jalar" en el Parque Principal. Jueves Santo.',
 'artistic','2026-04-02',NULL,NULL,
 'Parque Principal',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('"Viacrucis" de JALAR — Maestro Jesús Alberto Arbeláez',
 'Exposición escultórica al aire libre "Viacrucis" del Maestro Jesús Alberto Arbeláez "Jalar" en el Parque Principal. Viernes Santo.',
 'artistic','2026-04-03',NULL,NULL,
 'Parque Principal',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('"Viacrucis" de JALAR — Maestro Jesús Alberto Arbeláez',
 'Exposición escultórica al aire libre "Viacrucis" del Maestro Jesús Alberto Arbeláez "Jalar" en el Parque Principal. Sábado Santo.',
 'artistic','2026-04-04',NULL,NULL,
 'Parque Principal',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false),

('"Viacrucis" de JALAR — Maestro Jesús Alberto Arbeláez',
 'Exposición escultórica al aire libre "Viacrucis" del Maestro Jesús Alberto Arbeláez "Jalar" en el Parque Principal. Domingo de Resurrección.',
 'artistic','2026-04-05',NULL,NULL,
 'Parque Principal',NULL,NULL,
 (SELECT id FROM municipalities WHERE slug='marinilla'),'approved',false);
