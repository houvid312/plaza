import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* SEO primario */}
        <title>Agenda Marinilla — Eventos culturales, religiosos y sociales</title>
        <meta name="description" content="Descubrí todos los eventos de Marinilla y el Oriente Antioqueño: festivales, actividades culturales, sociales, deportivas y religiosas. Enterate de lo que pasa en tu municipio." />
        <meta name="keywords" content="agenda marinilla, eventos marinilla, oriente antioqueño, que hacer en marinilla, festivales, cultura, marinilla antioquia" />
        <link rel="canonical" href="https://agendamarinilla.com" />
        <link rel="sitemap" type="application/xml" href="https://agendamarinilla.com/sitemap.xml" />

        {/* Open Graph (Facebook, WhatsApp, etc.) */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://agendamarinilla.com" />
        <meta property="og:title" content="Agenda Marinilla — Eventos culturales, religiosos y sociales" />
        <meta property="og:description" content="Descubrí todos los eventos de Marinilla y el Oriente Antioqueño: festivales, actividades culturales, sociales, deportivas y religiosas." />
        <meta property="og:locale" content="es_CO" />
        <meta property="og:site_name" content="Agenda Marinilla" />

        {/* Twitter / X */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Agenda Marinilla — Eventos culturales, religiosos y sociales" />
        <meta name="twitter:description" content="Descubrí todos los eventos de Marinilla y el Oriente Antioqueño." />

        {/* Datos estructurados para Google */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Agenda Marinilla",
          "url": "https://agendamarinilla.com",
          "description": "Eventos culturales, religiosos, sociales y deportivos de Marinilla y el Oriente Antioqueño",
          "inLanguage": "es-CO",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://agendamarinilla.com",
            "query-input": "required name=search_term_string"
          }
        })}} />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
html {
  height: 100%;
}
body {
  height: 100%;
  background-color: #fff;
  overflow: hidden;
}
#root {
  height: 100%;
  display: flex;
  flex-direction: column;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;
