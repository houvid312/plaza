import React, { useRef } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);


/* ─── Inline SVG components ─── */

function NoteDouble({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="8" cy="50" rx="8" ry="6" fill="currentColor" />
      <ellipse cx="32" cy="44" rx="8" ry="6" fill="currentColor" />
      <rect x="14" y="4" width="3" height="46" fill="currentColor" />
      <rect x="38" y="4" width="3" height="40" fill="currentColor" />
      <rect x="14" y="4" width="27" height="4" rx="2" fill="currentColor" />
      <rect x="14" y="12" width="27" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function NoteSingle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 28 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="9" cy="49" rx="9" ry="7" fill="currentColor" />
      <rect x="16" y="4" width="3" height="46" fill="currentColor" />
      <path d="M19 4C19 4 28 10 28 20C28 28 22 30 19 28" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function Guitar({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 60 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Neck */}
      <rect x="27" y="0" width="6" height="60" rx="3" fill="currentColor" opacity="0.7" />
      {/* Tuning pegs */}
      <circle cx="24" cy="6" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="36" cy="6" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="24" cy="16" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="36" cy="16" r="3" fill="currentColor" opacity="0.5" />
      {/* Body - figure 8 */}
      <ellipse cx="30" cy="80" rx="22" ry="20" fill="currentColor" opacity="0.3" />
      <ellipse cx="30" cy="115" rx="28" ry="24" fill="currentColor" opacity="0.3" />
      {/* Sound hole */}
      <circle cx="30" cy="90" r="8" fill="currentColor" opacity="0.15" />
      {/* Strings */}
      <line x1="28" y1="25" x2="28" y2="125" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="30" y1="25" x2="30" y2="125" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="32" y1="25" x2="32" y2="125" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

function SoundWave({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20C4 20 10 4 16 4C22 4 22 36 28 36C34 36 34 8 40 8C46 8 46 32 52 32C58 32 58 4 64 4C70 4 76 20 76 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function Tiple({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 50 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Neck */}
      <rect x="22" y="0" width="6" height="50" rx="3" fill="currentColor" opacity="0.7" />
      {/* Head */}
      <rect x="18" y="0" width="14" height="8" rx="3" fill="currentColor" opacity="0.5" />
      {/* Body - rounder, smaller than guitar */}
      <ellipse cx="25" cy="70" rx="18" ry="16" fill="currentColor" opacity="0.3" />
      <ellipse cx="25" cy="98" rx="24" ry="20" fill="currentColor" opacity="0.3" />
      {/* Sound hole */}
      <circle cx="25" cy="78" r="6" fill="currentColor" opacity="0.15" />
      {/* Strings (12 strings grouped in 4 courses) */}
      <line x1="23" y1="15" x2="23" y2="108" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
      <line x1="24.3" y1="15" x2="24.3" y2="108" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
      <line x1="25.7" y1="15" x2="25.7" y2="108" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
      <line x1="27" y1="15" x2="27" y2="108" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
    </svg>
  );
}

function Compass({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="30" cy="30" r="22" stroke="currentColor" strokeWidth="0.8" opacity="0.2" />
      {/* Cardinal marks */}
      <line x1="30" y1="4" x2="30" y2="12" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="30" y1="48" x2="30" y2="56" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="4" y1="30" x2="12" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="48" y1="30" x2="56" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Needle */}
      <polygon points="30,10 26,32 30,28 34,32" fill="currentColor" opacity="0.6" />
      <polygon points="30,50 26,32 30,36 34,32" fill="currentColor" opacity="0.25" />
      <circle cx="30" cy="30" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

/* ─── Main component ─── */

export default function IntroScreen() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scroller = containerRef.current!;

    // ── Hero entrance timeline ──
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
      .fromTo('.intro-glow',
        { scale: 0.5, autoAlpha: 0 },
        { scale: 1, autoAlpha: 0.15, duration: 1.2, ease: 'power2.out' }
      )
      .from('.intro-welcome', {
        autoAlpha: 0, y: 30, duration: 0.8, ease: 'power3.out',
      }, '-=0.6')
      .from('.intro-title', {
        autoAlpha: 0, y: 40, scale: 0.92, duration: 0.9, ease: 'back.out(1.4)',
      }, '-=0.3')
      .from('.intro-subtitle', {
        autoAlpha: 0, y: 25, duration: 0.7, ease: 'power2.out',
      }, '-=0.3')
      .from('.intro-scroll-hint', {
        autoAlpha: 0, y: 10, duration: 0.6, ease: 'power2.out',
      }, '-=0.1');

    // ── Zoom-through cycle builder (reused for hero loops & narrative scroll) ──
    // Single continuous zoom from tiny→huge. Opacity fades out faster than scale grows.
    function addZoomCycle(tl: gsap.core.Timeline, el: HTMLElement, dir: number, dur: number) {
      // Continuous scale: 0.05 → 20 over full duration, one single ease
      tl.fromTo(el,
        { scale: 0.05, rotation: dir * 15 },
        { scale: 20, rotation: dir * -10, duration: dur, ease: 'power1.in' },
        0
      );
      // Opacity: fade in fast (first 25%), then fade out (25%-60%), gone for the rest
      tl.fromTo(el,
        { autoAlpha: 0 },
        { autoAlpha: 0.35, duration: dur * 0.25, ease: 'sine.out' },
        0
      );
      tl.to(el, {
        autoAlpha: 0, duration: dur * 0.35, ease: 'power2.in',
      }, dur * 0.25);
    }

    // ── Hero icons: automatic zoom-through loops ──
    const heroFloats = gsap.utils.toArray<HTMLElement>('.hero-float');
    const heroIconTls: gsap.core.Timeline[] = [];

    function createHeroLoops(withDelay: boolean) {
      heroFloats.forEach((el, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const cycleDuration = 10 + i * 1.5; // very slow: 10-16s per cycle
        const delay = withDelay ? 2 + i * 2.5 : 0; // stagger after text entrance

        const loop = gsap.timeline({ repeat: -1, delay });
        addZoomCycle(loop, el, dir, cycleDuration);
        // Pause while invisible before repeating
        loop.set(el, { scale: 0.05, rotation: dir * 20 });
        loop.to(el, { duration: cycleDuration * 0.15 });

        heroIconTls.push(loop);
      });
    }
    createHeroLoops(true);

    // Scroll hint bounce
    gsap.to('.intro-scroll-hint', {
      y: 8, duration: 1.2, ease: 'sine.inOut',
      yoyo: true, repeat: -1, delay: 1.5,
    });

    // Glow pulse
    gsap.to('.intro-glow', {
      autoAlpha: 0.22,
      duration: 3, ease: 'sine.inOut',
      yoyo: true, repeat: -1, delay: 1.8,
    });

    // ── On scroll: kill hero loops, hide icons ──
    ScrollTrigger.create({
      trigger: '.intro-narrative',
      scroller,
      start: 'top 90%',
      onEnter: () => {
        heroIconTls.forEach(tl => tl.kill());
        gsap.to(heroFloats, { autoAlpha: 0, duration: 0.5, ease: 'power2.in' });
      },
      onLeaveBack: () => {
        heroIconTls.length = 0;
        createHeroLoops(false);
      },
    });

    // ── Narrative icons: same zoom-through scrubbed to scroll ──
    gsap.utils.toArray<HTMLElement>('.narrative-float').forEach((el, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      const iconTl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top 100%',
          end: 'bottom -20%',
          scrub: 1.2,
        },
      });
      addZoomCycle(iconTl, el, dir, 1); // duration=1 since scrub controls pace
    });

    // ── Text reveals on scroll ──
    gsap.utils.toArray<HTMLElement>('.intro-reveal').forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0, y: 40, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: el, scroller,
          start: 'top 85%', end: 'top 50%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    // Accent line
    gsap.from('.intro-accent', {
      autoAlpha: 0, y: 30, scale: 0.96, duration: 1, ease: 'power3.out',
      scrollTrigger: {
        trigger: '.intro-accent', scroller,
        start: 'top 85%', end: 'top 50%',
        toggleActions: 'play none none reverse',
      },
    });

    // Question
    gsap.from('.intro-question', {
      autoAlpha: 0, y: 50, duration: 1.2, ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.intro-question', scroller,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    // Buttons
    gsap.from('.intro-btn', {
      autoAlpha: 0, y: 40, duration: 0.8, ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.intro-buttons', scroller,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });
  }, { scope: containerRef });

  function handleNavigate(route: '/(tabs)' | '/lupa') {
    router.push(route);
  }

  return (
    <div ref={containerRef} style={styles.container}>
      {/* Glow orb */}
      <div style={styles.glowWrap}>
        <div className="intro-glow" style={styles.glowOrb} />
      </div>

      {/* ── Hero ── */}
      <section style={styles.heroSection}>
        {/* Floating decorative icons in hero */}
        <NoteDouble className="hero-float float-icon" style={{ ...styles.floatIcon, top: '12%', right: '8%', width: 32, color: '#B87333' }} />
        <NoteSingle className="hero-float float-icon" data-speed="0.2" style={{ ...styles.floatIcon, top: '22%', left: '6%', width: 22, color: '#C9A96E' }} />
        <Guitar className="hero-float float-icon" data-speed="0.4" style={{ ...styles.floatIcon, bottom: '18%', right: '5%', width: 38, color: '#8B5E3C', opacity: 0.2 }} />
        <SoundWave className="hero-float float-icon" data-speed="0.15" style={{ ...styles.floatIcon, top: '60%', left: '3%', width: 50, color: '#A67C52', opacity: 0.15 }} />

        <p className="intro-welcome" style={styles.welcomeLabel}>Bienvenido a</p>
        <h1 className="intro-title" style={styles.title}>Resonancias de la Esparta</h1>
        <p className="intro-subtitle" style={styles.subtitle}>El Atlas Vivo de Marinilla</p>
        <div className="intro-scroll-hint" style={styles.scrollHint}>
          <span style={styles.scrollHintArrow}>&#8595;</span>
          <span style={styles.scrollHintText}>Desliza para descubrir</span>
        </div>
      </section>

      {/* ── Narrative ── */}
      <section className="intro-narrative" style={styles.narrativeSection}>
        {/* Floating icons between paragraphs */}
        <NoteSingle className="narrative-float" style={{ ...styles.floatIcon, top: -20, right: '2%', width: 34, color: '#B87333' }} />

        <p className="intro-reveal" style={styles.body}>
          Marinilla no es un simple accidente en la cartografía antioqueña; es una
          voluntad de afirmación que resuena a través del tiempo.
        </p>

        <SoundWave className="narrative-float" style={{ ...styles.floatIcon, left: '-4%', top: 160, width: 70, color: '#C9A96E' }} />

        <p className="intro-reveal" style={styles.body}>
          Eres habitante de la Esparta colombiana, un territorio erigido como
          Patrimonio Inmaterial de la Nación, donde el espíritu de la libertad y la
          resistencia no se firmó en papel, sino que se forjó a golpe de tiple,
          guitarra y madera.
        </p>

        <Tiple className="narrative-float" style={{ ...styles.floatIcon, right: '-2%', top: 280, width: 46, color: '#A67C52' }} />

        <p className="intro-accent" style={styles.accent}>
          Hoy, la ciudad sigue vibrando bajo el peso de su propia historia, pero su
          memoria se encuentra fragmentada, dispersa en el ruido de la hiperconexión.
        </p>

        <NoteDouble className="narrative-float" style={{ ...styles.floatIcon, left: '0%', top: 420, width: 36, color: '#B87333' }} />

        <p className="intro-reveal" style={styles.body}>
          Te invitamos a iniciar un viaje para escapar a la amnesia colectiva. En tus
          manos sostienes el artefacto para descifrar nuestra identidad.
        </p>

        <Compass className="narrative-float" style={{ ...styles.floatIcon, right: '0%', top: 540, width: 52, color: '#C9A96E' }} />

        <p className="intro-reveal" style={styles.body}>
          Escucha el latido de lo que ocurre hoy en nuestras calles y acompáñanos a
          desenterrar las huellas del pasado, los vestigios más lejanos de nuestra
          cultura.
        </p>

        <Guitar className="narrative-float" style={{ ...styles.floatIcon, left: '-3%', top: 650, width: 50, color: '#8B5E3C' }} />
      </section>

      {/* ── CTA ── */}
      <section style={styles.ctaSection}>
        <p className="intro-question" style={styles.question}>
          ¿Por dónde decides comenzar la exploración?
        </p>

        <div className="intro-buttons" style={styles.buttonsWrap}>
          <button
            className="intro-btn"
            style={styles.btnPrimary}
            onClick={() => handleNavigate('/(tabs)')}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.03, duration: 0.2 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
          >
            <span style={styles.btnIcon}>📡</span>
            <span style={styles.btnTextWrap}>
              <span style={styles.btnPrimaryText}>El Latido</span>
              <span style={styles.btnPrimaryHint}>El pulso del presente</span>
            </span>
          </button>

          <button
            className="intro-btn"
            style={styles.btnSecondary}
            onClick={() => handleNavigate('/lupa')}
            onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.03, duration: 0.2 })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })}
          >
            <span style={styles.btnIcon}>🔍</span>
            <span style={styles.btnTextWrap}>
              <span style={styles.btnSecondaryText}>La Lupa del Tiempo</span>
              <span style={styles.btnSecondaryHint}>El rompecabezas de la memoria</span>
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    backgroundColor: '#1A1710',
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  glowWrap: {
    position: 'sticky',
    top: 0,
    height: 0,
    overflow: 'visible',
    zIndex: 0,
    pointerEvents: 'none',
  },
  glowOrb: {
    position: 'absolute',
    top: -120,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 450,
    height: 450,
    borderRadius: '50%',
    background: 'radial-gradient(circle, #B87333 0%, transparent 70%)',
    opacity: 0,
  },

  // Floating icon base
  floatIcon: {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 0,
  },

  // Hero
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    padding: '60px 32px 40px',
    maxWidth: 680,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  welcomeLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#C9A96E',
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    margin: '0 0 12px',
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    color: '#FFFFFF',
    lineHeight: 1.12,
    letterSpacing: -0.5,
    margin: '0 0 6px',
    position: 'relative',
    zIndex: 1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#D4B483',
    lineHeight: 1.35,
    fontStyle: 'italic',
    margin: '0 0 0',
    position: 'relative',
    zIndex: 1,
  },
  scrollHint: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 60,
    gap: 6,
    position: 'relative',
    zIndex: 1,
  },
  scrollHintArrow: {
    fontSize: 22,
    color: '#B87333',
  },
  scrollHintText: {
    fontSize: 12,
    fontWeight: 500,
    color: '#8A8070',
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },

  // Narrative
  narrativeSection: {
    padding: '80px 32px',
    maxWidth: 680,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 80,
    position: 'relative',
    zIndex: 1,
  },
  body: {
    fontSize: 18,
    fontWeight: 400,
    color: '#CBD5E1',
    lineHeight: 1.7,
    margin: 0,
    position: 'relative',
    zIndex: 1,
  },
  accent: {
    fontSize: 20,
    fontWeight: 700,
    color: '#F0DFC0',
    lineHeight: 1.5,
    margin: 0,
    paddingLeft: 20,
    borderLeft: '3px solid #B87333',
    position: 'relative',
    zIndex: 1,
  },

  // CTA
  ctaSection: {
    padding: '80px 32px 100px',
    maxWidth: 680,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },
  question: {
    fontSize: 22,
    fontWeight: 700,
    color: '#FFFFFF',
    lineHeight: 1.4,
    textAlign: 'center',
    margin: '0 0 36px',
  },
  buttonsWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  btnPrimary: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#B87333',
    padding: '18px 22px',
    borderRadius: 16,
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  btnSecondary: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'transparent',
    padding: '18px 22px',
    borderRadius: 16,
    border: '1.5px solid #B87333',
    cursor: 'pointer',
    textAlign: 'left',
  },
  btnIcon: {
    fontSize: 26,
    flexShrink: 0,
  },
  btnTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  btnPrimaryText: {
    fontSize: 17,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  btnPrimaryHint: {
    fontSize: 12,
    fontWeight: 500,
    color: '#E8D5B7',
    marginTop: 3,
  },
  btnSecondaryText: {
    fontSize: 17,
    fontWeight: 700,
    color: '#D4B483',
  },
  btnSecondaryHint: {
    fontSize: 12,
    fontWeight: 500,
    color: '#A67C52',
    marginTop: 3,
  },
};
