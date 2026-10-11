import React from 'react';
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  Activity,
  Banknote,
  BookOpen,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Dumbbell,
  GraduationCap,
  Home,
  Landmark,
  Languages,
  Lightbulb,
  LockOpen,
  Navigation,
  Sparkles,
  User,
  Video,
  Wallet,
  XCircle,
  Zap,
} from 'lucide-react';
import {CARD, FPS, Insert, OUTRO, TOTAL, chapterSpans, inserts, items, srcToTimeline} from './timeline';

const SRC = staticFile('source.mp4');
const FONT = 'Inter, "Inter Display", system-ui, -apple-system, sans-serif';
const GREEN = '#4cd964';
const LIME = '#c6f432';
const INK = '#0b1410';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/* ---------------- Vector Icon Dispatcher ---------------- */
const renderIcon = (name: string | undefined, size = 26, color = 'currentColor') => {
  switch (name) {
    case 'graduation':
    case '🎓':
      return <GraduationCap size={size} color={color} />;
    case 'bot':
    case '🤖':
      return <Bot size={size} color={color} />;
    case 'languages':
    case '🇬🇧':
      return <Languages size={size} color={color} />;
    case 'drone':
    case '🛸':
      return <Navigation size={size} color={color} />;
    case 'building':
    case '🏢':
      return <Building2 size={size} color={color} />;
    case 'key':
    case '🔑':
      return <LockOpen size={size} color={color} />;
    case 'dumbbell':
    case '🏋️':
      return <Dumbbell size={size} color={color} />;
    case 'briefcase':
    case '💼':
      return <Briefcase size={size} color={color} />;
    case 'wallet':
    case '💰':
    case '💸':
      return <Wallet size={size} color={color} />;
    case 'book':
    case '📚':
      return <BookOpen size={size} color={color} />;
    case 'home':
    case '🏠':
      return <Home size={size} color={color} />;
    case 'zap':
    case '⚡':
      return <Zap size={size} color={color} />;
    case 'clock':
    case '⏱️':
      return <Clock size={size} color={color} />;
    case 'user':
    case '👤':
      return <User size={size} color={color} />;
    case 'lightbulb':
    case '💡':
    default:
      return <Lightbulb size={size} color={color} />;
  }
};

/* ---------------- Animated Vector Icon Component ---------------- */
const AnimatedIcon: React.FC<{
  name?: string;
  size?: number;
  color?: string;
  delay?: number;
}> = ({name, size = 28, color = LIME, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: {damping: 10, stiffness: 400, mass: 0.6},
  });

  const float = Math.sin((frame + delay * 5) / 8) * 3;
  const pulseGlow = 0.5 + 0.5 * Math.sin((frame + delay * 3) / 6);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${scale}) translateY(${float}px)`,
        filter: `drop-shadow(0 0 ${8 * pulseGlow}px ${color})`,
      }}
    >
      {renderIcon(name, size, color)}
    </div>
  );
};

/* ---------------- Particle & Sparkle Systems ---------------- */
const ParticleField: React.FC<{count?: number; color?: string; speed?: number}> = ({
  count = 24,
  color = LIME,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(() => {
    return Array.from({length: count}).map((_, i) => ({
      x: (Math.sin(i * 99 + 12) * 0.5 + 0.5) * 1280,
      baseY: (Math.cos(i * 33 + 7) * 0.5 + 0.5) * 720,
      size: 3 + (i % 5) * 2,
      speedY: 0.6 + (i % 3) * 0.5,
      opacity: 0.25 + (i % 4) * 0.2,
      seed: i,
    }));
  }, [count]);

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {particles.map((p) => {
        const y = (p.baseY - frame * p.speedY * speed + 720) % 720;
        const x = p.x + Math.sin((frame + p.seed * 10) / 14) * 14;
        const pulse = 0.5 + 0.5 * Math.sin(frame / 6 + p.seed);
        return (
          <div
            key={p.seed}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: p.opacity * pulse,
              boxShadow: `0 0 ${p.size * 2.5}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const BurstParticles: React.FC<{frame: number; color?: string; count?: number}> = ({
  frame,
  color = LIME,
  count = 18,
}) => {
  if (frame > 25) return null;
  const progress = frame / 20;
  const opacity = interpolate(frame, [0, 15, 25], [1, 0.8, 0], clamp);

  return (
    <AbsoluteFill style={{pointerEvents: 'none', justifyContent: 'center', alignItems: 'center'}}>
      {Array.from({length: count}).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const dist = progress * (120 + (i % 4) * 40);
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        const size = Math.max(0, (1 - progress) * (8 + (i % 3) * 4));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              transform: `translate(${x}px, ${y}px)`,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity,
              boxShadow: `0 0 10px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ---------------- Cinematic Vignette & Overlay ---------------- */
const CinematicOverlay: React.FC = () => {
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.45) 100%)',
        }}
      />
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'rgba(0,0,0,0.4)'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(0,0,0,0.4)'}} />
    </AbsoluteFill>
  );
};

const TRANSITION_FRAMES = 8;

/* ---------------- Smooth Seamless Clip Footage with Overlaps & Dissolves ---------------- */
const SeamlessClip: React.FC<{
  srcFrom: number;
  dur: number;
  fadeIn: number;
  fadeOut: number;
}> = ({srcFrom, dur, fadeIn, fadeOut}) => {
  const frame = useCurrentFrame();

  const opacityIn =
    fadeIn > 0
      ? interpolate(frame, [0, fadeIn], [0, 1], {
          ...clamp,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      : 1;

  const opacityOut =
    fadeOut > 0
      ? interpolate(frame, [dur - fadeOut, dur], [1, 0], {
          ...clamp,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        })
      : 1;

  const opacity = opacityIn * opacityOut;

  // Smooth motion blur + micro zoom during crossfade
  const blurIn = fadeIn > 0 ? interpolate(frame, [0, fadeIn], [8, 0], clamp) : 0;
  const blurOut = fadeOut > 0 ? interpolate(frame, [dur - fadeOut, dur], [0, 8], clamp) : 0;
  const blur = Math.max(blurIn, blurOut);

  const zoomIn = fadeIn > 0 ? interpolate(frame, [0, fadeIn], [1.05, 1.0], clamp) : 1;
  const zoomOut = fadeOut > 0 ? interpolate(frame, [dur - fadeOut, dur], [1.0, 1.05], clamp) : 1;

  const kenBurns = interpolate(frame, [0, dur], [1.0, 1.03], clamp);
  const totalScale = kenBurns * Math.max(zoomIn, zoomOut);

  const vol = (f: number) => {
    const vIn =
      fadeIn > 0
        ? interpolate(f, [0, fadeIn], [0, 1], {
            ...clamp,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          })
        : 1;
    const vOut =
      fadeOut > 0
        ? interpolate(f, [dur - fadeOut, dur], [1, 0], {
            ...clamp,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          })
        : 1;
    return vIn * vOut;
  };

  return (
    <AbsoluteFill style={{opacity}}>
      <OffthreadVideo
        src={SRC}
        startFrom={srcFrom}
        endAt={srcFrom + dur}
        volume={vol}
        style={{
          transform: `scale(${totalScale})`,
          filter: `blur(${blur}px) contrast(1.06) saturate(1.1) brightness(1.02)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------- Cut Transition Overlay (Light Sweep across Cuts) ---------------- */
const CutTransitionOverlay: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const relFrame = frame - at;
  if (relFrame < -4 || relFrame > 5) return null;

  const opacity = interpolate(relFrame, [-4, 0, 5], [0, 0.35, 0], clamp);
  const blur = interpolate(relFrame, [-4, 0, 5], [0, 10, 0], clamp);
  const sweepX = interpolate(relFrame, [-4, 5], [-200, 1400], clamp);

  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(198,244,50,0.18), rgba(255,255,255,0.25), transparent)',
          backdropFilter: `blur(${blur}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: sweepX,
          top: -200,
          width: 250,
          height: 1200,
          background: 'linear-gradient(90deg, transparent, rgba(198,244,50,0.4), transparent)',
          transform: 'rotate(20deg)',
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------- Smooth Motion Blur Transition Layer ---------------- */
const ChapterTransitionOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 3, 7], [0.85, 0.4, 0], clamp);
  const blur = interpolate(frame, [0, 7], [16, 0], clamp);
  const zoom = interpolate(frame, [0, 7], [1.05, 1.0], clamp);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, rgba(198,244,50,0.25), rgba(11,20,16,0.95))',
        opacity,
        backdropFilter: `blur(${blur}px)`,
        transform: `scale(${zoom})`,
        pointerEvents: 'none',
      }}
    />
  );
};

/* ---------------- Smooth Chapter Card ---------------- */
const ChapterCard: React.FC<{n: number; title: string}> = ({n, title}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Smooth wipe with cubic bezier curve
  const wipe = interpolate(frame, [0, 10], [0, 100], {...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1)});
  const outWipe = interpolate(frame, [CARD - 8, CARD], [0, 100], {...clamp, easing: Easing.bezier(0.7, 0, 0.84, 0)});

  // Motion blur transition into the card
  const cardBlur = interpolate(frame, [0, 8, CARD - 8, CARD], [12, 0, 0, 12], clamp);
  const cardZoom = interpolate(frame, [0, CARD], [1.12, 1.02], clamp);

  const numIn = spring({frame: frame - 2, fps, config: {damping: 10, mass: 1.1}});
  const titleIn = spring({frame: frame - 6, fps, config: {damping: 12, mass: 0.9}});
  const badgeIn = spring({frame: frame - 10, fps, config: {damping: 14}});

  const brollFrom = Math.round((12 + (n - 1) * 1.6) * FPS);
  const vol = (f: number) =>
    interpolate(f, [0, 6, CARD - 6, CARD], [0, 0.8, 0.8, 0], {
      ...clamp,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

  const lightPos = interpolate(frame, [0, CARD], [-200, 1400], clamp);

  return (
    <AbsoluteFill
      style={{
        clipPath: `polygon(${outWipe}% 0, ${wipe}% 0, ${wipe}% 100%, ${outWipe}% 100%)`,
        filter: `blur(${cardBlur}px)`,
      }}
    >
      <OffthreadVideo
        src={SRC}
        startFrom={brollFrom}
        endAt={brollFrom + CARD}
        volume={vol}
        style={{filter: 'blur(8px) brightness(0.35) saturate(1.3)', transform: `scale(${cardZoom})`}}
      />
      <AbsoluteFill style={{background: `linear-gradient(120deg, ${INK}f2 20%, ${INK}88 80%, rgba(198,244,50,0.12) 100%)`}} />

      {/* Light streak */}
      <div
        style={{
          position: 'absolute',
          left: lightPos,
          top: -200,
          width: 220,
          height: 1200,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
          transform: 'rotate(25deg)',
          pointerEvents: 'none',
        }}
      />

      <ParticleField count={25} speed={1.2} />

      <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 110, fontFamily: FONT}}>
        {/* Chapter pill badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            alignSelf: 'flex-start',
            background: 'rgba(198,244,50,0.15)',
            border: `1px solid ${LIME}`,
            color: LIME,
            fontWeight: 800,
            fontSize: 18,
            letterSpacing: 2,
            padding: '8px 20px',
            borderRadius: 999,
            transform: `translateY(${(1 - badgeIn) * -20}px)`,
            opacity: badgeIn,
            backdropFilter: 'blur(10px)',
          }}
        >
          <AnimatedIcon name="zap" size={18} color={LIME} />
          <span>ГЛАВА {String(n).padStart(2, '0')} ИЗ 06</span>
        </div>

        {/* Big chapter number */}
        <div
          style={{
            fontSize: 160,
            fontWeight: 900,
            lineHeight: 0.95,
            marginTop: 10,
            color: 'transparent',
            WebkitTextStroke: `3px ${LIME}`,
            filter: `drop-shadow(0 0 25px rgba(198,244,50,0.4))`,
            transform: `translateX(${(1 - numIn) * -80}px) scale(${0.8 + 0.2 * numIn})`,
            opacity: numIn,
          }}
        >
          {String(n).padStart(2, '0')}
        </div>

        {/* Chapter title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: 'white',
            marginTop: 4,
            background: 'linear-gradient(90deg, #ffffff 0%, #e0e0e0 60%, #c6f432 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: `translateY(${(1 - titleIn) * 35}px)`,
            opacity: titleIn,
            letterSpacing: '-1px',
          }}
        >
          {title}
        </div>

        {/* Accent Bar */}
        <div
          style={{
            width: 140 * titleIn,
            height: 6,
            background: `linear-gradient(90deg, ${GREEN}, ${LIME})`,
            borderRadius: 3,
            marginTop: 20,
            boxShadow: `0 0 12px ${GREEN}`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- Intro Title ---------------- */
const IntroTitle: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = ['ЖИЗНЬ', 'СТУДЕНТОВ', 'ИННОПОЛИСА'];
  const fade = interpolate(frame, [dur - 12, dur], [1, 0], clamp);
  const badgeIn = spring({frame: frame - 4, fps, config: {damping: 12}});
  const sub = spring({frame: frame - 36, fps, config: {damping: 14}});

  return (
    <AbsoluteFill style={{fontFamily: FONT, opacity: fade}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 30% 50%, ${INK}dd, ${INK}44 80%)`}} />
      <ParticleField count={30} speed={0.8} />

      <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 100}}>
        {/* Top category badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            alignSelf: 'flex-start',
            background: 'rgba(255,255,255,0.12)',
            border: `1px solid rgba(255,255,255,0.3)`,
            color: LIME,
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: 2,
            padding: '8px 22px',
            borderRadius: 999,
            marginBottom: 20,
            opacity: badgeIn,
            transform: `translateY(${(1 - badgeIn) * -20}px)`,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <AnimatedIcon name="zap" size={20} color={LIME} />
          <span>СПЕЦИАЛЬНЫЙ ВЫПУСК</span>
        </div>

        {/* Kinetic Words */}
        {words.map((w, i) => {
          const s = spring({frame: frame - 10 - i * 7, fps, config: {damping: 11, mass: 1.1}});
          const ls = interpolate(s, [0, 1], [22, 0], clamp);
          const rotX = interpolate(s, [0, 1], [40, 0], clamp);
          return (
            <div key={w} style={{overflow: 'hidden', height: 112, perspective: 800}}>
              <div
                style={{
                  fontSize: 104,
                  fontWeight: 900,
                  lineHeight: 1.05,
                  color: i === 2 ? LIME : 'white',
                  textShadow: i === 2 ? `0 0 30px rgba(198,244,50,0.5)` : '0 4px 20px rgba(0,0,0,0.6)',
                  transform: `translateY(${(1 - s) * 120}px) rotateX(${rotX}deg)`,
                  letterSpacing: ls,
                }}
              >
                {w}
              </div>
            </div>
          );
        })}

        {/* Subtitle Badge */}
        <div
          style={{
            marginTop: 28,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            alignSelf: 'flex-start',
            background: `linear-gradient(90deg, ${GREEN}, ${LIME})`,
            color: INK,
            fontWeight: 900,
            fontSize: 30,
            padding: '12px 28px',
            borderRadius: 999,
            opacity: sub,
            transform: `scale(${0.6 + 0.4 * sub})`,
            transformOrigin: 'left center',
            boxShadow: `0 8px 30px rgba(76,217,100,0.4)`,
          }}
        >
          <AnimatedIcon name="clock" size={26} color={INK} />
          <span>главное за 6 минут</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- Outro ---------------- */
const Outro: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame: frame - 6, fps, config: {damping: 14}});
  const b = spring({frame: frame - 22, fps, config: {damping: 14}});
  const fadeOut = interpolate(frame, [dur - 20, dur], [1, 0], clamp);
  const vol = (f: number) => interpolate(f, [0, 6, dur - 30, dur], [0, 0.9, 0.9, 0], clamp);
  const from = Math.round(912 * FPS);

  const shimmerPos = interpolate(frame % 70, [0, 40], [-100, 300], clamp);

  return (
    <AbsoluteFill style={{opacity: fadeOut, fontFamily: FONT}}>
      <OffthreadVideo
        src={SRC}
        startFrom={from}
        endAt={from + dur}
        volume={vol}
        style={{filter: 'brightness(0.45) saturate(1.2) blur(3px)', transform: 'scale(1.05)'}}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 30%, rgba(11,20,16,0.85) 100%)'}} />
      <ParticleField count={35} speed={1} />

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: 'white',
            transform: `translateY(${(1 - a) * 50}px)`,
            opacity: a,
            textShadow: '0 8px 30px rgba(0,0,0,0.7)',
            letterSpacing: '-1px',
          }}
        >
          Не бойся. <span style={{color: LIME, textShadow: `0 0 35px ${LIME}`}}>Поступай.</span>
        </div>

        {/* CTA Button */}
        <div
          style={{
            position: 'relative',
            marginTop: 32,
            fontSize: 32,
            fontWeight: 900,
            color: INK,
            background: `linear-gradient(90deg, ${GREEN}, ${LIME})`,
            padding: '14px 36px',
            borderRadius: 999,
            opacity: b,
            transform: `scale(${0.7 + 0.3 * b})`,
            boxShadow: `0 10px 40px rgba(198,244,50,0.5)`,
            overflow: 'hidden',
          }}
        >
          <span style={{position: 'relative', zIndex: 2}}>apply.innopolis.ru</span>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: shimmerPos,
              width: 60,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
              transform: 'skewX(-20deg)',
              zIndex: 3,
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: 'rgba(255,255,255,0.8)',
            opacity: b,
            background: 'rgba(11,20,16,0.6)',
            padding: '8px 24px',
            borderRadius: 999,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
            <Video size={18} color={LIME} /> Монтаж и графика: React + Remotion
          </span>
          <span>·</span>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 6}}>
            <Landmark size={18} color={LIME} /> Исходное видео: Университет Иннополис
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- Shared In/Out Helper ---------------- */
const useInOut = (dur: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inn = spring({frame, fps, config: {damping: 14, mass: 0.7}});
  const out = interpolate(frame, [dur - 8, dur], [1, 0], clamp);
  return {frame, fps, p: inn * out, inn, out};
};

/* ---------------- Lower Third ---------------- */
const LowerThird: React.FC<{dur: number; name: string; role: string; icon?: string}> = ({
  dur,
  name,
  role,
  icon = 'user',
}) => {
  const {p, frame} = useInOut(dur);
  const bar = interpolate(frame, [0, 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        bottom: 120,
        fontFamily: FONT,
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(11,20,16,0.85)',
          backdropFilter: 'blur(16px)',
          border: `1.5px solid rgba(198,244,50,0.4)`,
          borderRadius: 18,
          padding: '14px 24px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.5), 0 0 15px rgba(198,244,50,0.15)',
        }}
      >
        <div style={{width: 6, height: 50, background: LIME, borderRadius: 3, marginRight: 16, transform: `scaleY(${bar})`}} />

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(198,244,50,0.2)',
            border: `1px solid ${LIME}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
            flexShrink: 0,
          }}
        >
          <AnimatedIcon name={icon} size={24} color={LIME} />
        </div>

        <div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-0.5px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: LIME,
              marginTop: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{width: 6, height: 6, borderRadius: '50%', backgroundColor: GREEN}} />
            {role}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Fact Card ---------------- */
const FactCard: React.FC<{dur: number; label: string; value: React.ReactNode; icon?: string}> = ({
  dur,
  label,
  value,
  icon = 'lightbulb',
}) => {
  const {p} = useInOut(dur);

  return (
    <div
      style={{
        position: 'absolute',
        right: 50,
        top: 70,
        fontFamily: FONT,
        background: 'rgba(11,20,16,0.88)',
        backdropFilter: 'blur(16px)',
        border: `2px solid ${GREEN}`,
        borderRadius: 20,
        padding: '18px 26px 20px',
        minWidth: 300,
        transform: `translateX(${(1 - p) * 450}px)`,
        boxShadow: '0 16px 45px rgba(0,0,0,0.5), 0 0 20px rgba(76,217,100,0.25)',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <AnimatedIcon name={icon} size={22} color={GREEN} />
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: GREEN,
            textTransform: 'uppercase',
            letterSpacing: 1.8,
          }}
        >
          {label}
        </div>
      </div>
      <div
        style={{
          fontSize: 38,
          fontWeight: 900,
          color: 'white',
          marginTop: 6,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.5px',
        }}
      >
        {value}
      </div>
    </div>
  );
};

/* ---------------- Animated Counter ---------------- */
const Counter: React.FC<{dur: number; label: string; from: number; to: number; suffix: string}> = (props) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const progress = interpolate(frame, [8, 45], [0, 1], {...clamp, easing: Easing.out(Easing.exp)});
  const v = props.from + (props.to - props.from) * progress;
  const fmt = (n: number) => Math.round(n / 100) * 100;

  const landed = frame > 46;
  const pop = landed ? spring({frame: frame - 46, fps, config: {damping: 6, stiffness: 500, mass: 0.5}}) : 0;
  const valueScale = 1 + pop * 0.18 * Math.exp(-(frame - 46) * 0.12);

  const str = `${props.from.toLocaleString('ru-RU')} – ${fmt(v).toLocaleString('ru-RU')}${props.suffix}`;

  return (
    <React.Fragment>
      <FactCard
        dur={props.dur}
        label={props.label}
        icon="wallet"
        value={
          <span style={{display: 'inline-block', transform: `scale(${valueScale})`, transformOrigin: 'left center', color: landed ? LIME : 'white'}}>
            {str.replace(/ /g, '\u202f')}
          </span>
        }
      />
      {landed ? <BurstParticles frame={frame - 46} color={LIME} count={20} /> : null}
    </React.Fragment>
  );
};

/* ---------------- Sticker ---------------- */
const Sticker: React.FC<{dur: number; text: string; tilt: number}> = ({dur, text, tilt}) => {
  const {frame, fps, out} = useInOut(dur);
  const pop = spring({frame, fps, config: {damping: 6, stiffness: 600, mass: 0.5}});
  const wobble = Math.sin(frame / 3.5) * 2.5 * Math.min(1, frame / 6);
  const glowA = 0.7 + 0.3 * Math.sin(frame / 5);

  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 90}}>
      <BurstParticles frame={frame} color={LIME} count={18} />
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: FONT,
          fontSize: 42,
          fontWeight: 900,
          color: INK,
          background: `linear-gradient(135deg, ${LIME}, #a8e020)`,
          padding: '14px 30px',
          borderRadius: 16,
          border: `4px solid ${INK}`,
          boxShadow: `10px 10px 0 ${INK}, 0 0 35px rgba(198,244,50,${glowA})`,
          transform: `rotate(${tilt + wobble}deg) scale(${pop * out})`,
          letterSpacing: '-0.5px',
        }}
      >
        <Sparkles size={32} color={INK} />
        <span>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Vector Icon Popups ---------------- */
const IconPop: React.FC<{dur: number; icon: string; label?: string}> = ({dur, icon, label}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 8, stiffness: 500, mass: 0.6}});
  const out = interpolate(frame, [dur - 8, dur], [1, 0], clamp);
  const rot = interpolate(frame, [0, 8], [-15, 0], {...clamp, easing: Easing.out(Easing.back(2))});
  const ringRot = (frame * 3) % 360;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-start', padding: '75px 60px 0 0'}}>
      <BurstParticles frame={frame} color={LIME} count={14} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(11,20,16,0.85)',
          backdropFilter: 'blur(16px)',
          border: `2px solid ${LIME}`,
          borderRadius: 999,
          padding: '12px 24px',
          boxShadow: `0 12px 35px rgba(0,0,0,0.6), 0 0 25px rgba(198,244,50,0.35)`,
          transform: `scale(${pop * out}) rotate(${rot}deg)`,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(198,244,50,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: -3,
              borderRadius: '50%',
              border: '2px dashed rgba(198,244,50,0.6)',
              transform: `rotate(${ringRot}deg)`,
            }}
          />
          <AnimatedIcon name={icon} size={26} color={LIME} />
        </div>
        {label ? (
          <span style={{fontSize: 22, fontWeight: 900, color: 'white', letterSpacing: 1, textTransform: 'uppercase'}}>
            {label}
          </span>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Myth / Reality ---------------- */
const MythReality: React.FC<{dur: number}> = ({dur}) => {
  const {frame, fps, out} = useInOut(dur);
  const flip = spring({frame: frame - 110, fps, config: {damping: 14}});
  const enter = spring({frame, fps, config: {damping: 14}});

  const box = (
    title: string,
    lines: string[],
    color: string,
    strike: boolean,
    p: number,
    iconComp: React.ReactNode,
  ) => (
    <div
      style={{
        background: 'rgba(11,20,16,0.88)',
        backdropFilter: 'blur(16px)',
        borderRadius: 20,
        padding: '18px 24px',
        width: 300,
        borderTop: `6px solid ${color}`,
        borderLeft: `1px solid rgba(255,255,255,0.1)`,
        borderRight: `1px solid rgba(255,255,255,0.1)`,
        borderBottom: `1px solid rgba(255,255,255,0.1)`,
        opacity: p,
        transform: `translateY(${(1 - p) * 35}px)`,
        boxShadow: `0 12px 35px rgba(0,0,0,0.5), 0 0 15px ${color}33`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{color, fontWeight: 900, fontSize: 26, letterSpacing: 1}}>{title}</div>
        {iconComp}
      </div>
      {lines.map((l) => (
        <div
          key={l}
          style={{
            color: 'white',
            fontSize: 23,
            fontWeight: 700,
            marginTop: 8,
            textDecoration: strike ? 'line-through' : 'none',
            textDecorationColor: '#ff5a5a',
            textDecorationThickness: 3,
            opacity: strike ? 0.65 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{fontSize: 14, color}}>{strike ? '✕' : '✓'}</span>
          {l}
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        position: 'absolute',
        right: 40,
        top: 60,
        display: 'flex',
        gap: 16,
        fontFamily: FONT,
        opacity: out,
      }}
    >
      {box(
        'МИФ',
        ['холодно и мрачно', 'люди хмурые', 'грязно, невкусно'],
        '#ff5a5a',
        flip > 0.5,
        enter,
        <XCircle size={28} color="#ff5a5a" />,
      )}
      {box(
        'РЕАЛЬНОСТЬ',
        ['люди открытые', 'всё очень чисто', 'вкусная еда'],
        GREEN,
        false,
        flip,
        <CheckCircle2 size={28} color={GREEN} />,
      )}
    </div>
  );
};

const renderInsert = (ins: Insert, durF: number) => {
  switch (ins.type) {
    case 'lower':
      return <LowerThird dur={durF} name={ins.name} role={ins.role} icon={ins.icon} />;
    case 'fact':
      return <FactCard dur={durF} label={ins.label} value={ins.value} icon={ins.icon} />;
    case 'counter':
      return <Counter dur={durF} label={ins.label} from={ins.from} to={ins.to} suffix={ins.suffix} />;
    case 'sticker':
      return <Sticker dur={durF} text={ins.text} tilt={ins.tilt} />;
    case 'myth':
      return <MythReality dur={durF} />;
  }
};

/* ---------------- Pro Chapter Progress HUD ---------------- */
const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const current = chapterSpans.find((c) => frame >= c.start && frame < c.end);
  const firstStart = chapterSpans[0].start;
  const lastEnd = chapterSpans[chapterSpans.length - 1].end;
  const visible = interpolate(frame, [firstStart, firstStart + 15, lastEnd - 10, lastEnd], [0, 1, 1, 0], clamp);

  const totalFrames = TOTAL - OUTRO;
  const progressPercent = Math.min(100, Math.round((frame / totalFrames) * 100));

  const elapsedSec = Math.floor(frame / FPS);
  const totalSec = Math.floor(totalFrames / FPS);
  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const hudFrame = frame - firstStart;
  const pulse = 1 + 0.12 * Math.max(0, Math.exp(-((hudFrame % 40) / 3)) - 0.05);

  return (
    <AbsoluteFill style={{opacity: visible, fontFamily: FONT, pointerEvents: 'none'}}>
      {/* Top progress segment bar */}
      <div style={{position: 'absolute', top: 22, left: 60, right: 60, display: 'flex', gap: 6}}>
        {chapterSpans.map((c) => {
          const p = interpolate(frame, [c.start, c.end], [0, 1], clamp);
          const isActive = current?.title === c.title;
          return (
            <div
              key={c.title}
              style={{
                flex: c.end - c.start,
                height: isActive ? 8 : 5,
                borderRadius: 4,
                background: 'rgba(255,255,255,0.22)',
                overflow: 'hidden',
                backdropFilter: 'blur(4px)',
                boxShadow: isActive ? `0 0 10px rgba(198,244,50,0.5)` : 'none',
              }}
            >
              <div
                style={{
                  width: `${p * 100}%`,
                  height: '100%',
                  background: isActive ? `linear-gradient(90deg, ${GREEN}, ${LIME})` : GREEN,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Chapter Title & Time Badge */}
      {current ? (
        <div style={{position: 'absolute', top: 38, left: 60, display: 'flex', alignItems: 'center', gap: 12}}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: 'white',
              background: 'rgba(11,20,16,0.75)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              padding: '6px 16px',
              borderRadius: 999,
              filter: `brightness(${pulse})`,
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{color: LIME}}>{String(chapterSpans.indexOf(current) + 1).padStart(2, '0')}</span>
            <span style={{color: 'rgba(255,255,255,0.4)'}}>|</span>
            <span>{current.title}</span>
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: LIME,
              background: 'rgba(11,20,16,0.75)',
              backdropFilter: 'blur(10px)',
              border: `1px solid rgba(198,244,50,0.3)`,
              padding: '6px 12px',
              borderRadius: 999,
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Clock size={14} color={LIME} />
            <span>{formatTime(elapsedSec)} / {formatTime(totalSec)} ({progressPercent}%)</span>
          </div>
        </div>
      ) : null}

      {/* Mini Sound Wave Visualizer */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 14px',
          background: 'rgba(11,20,16,0.75)',
          backdropFilter: 'blur(10px)',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        }}
      >
        <Activity size={16} color={LIME} style={{marginRight: 2}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 3, height: 16}}>
          {Array.from({length: 5}).map((_, i) => {
            const barH = 4 + Math.abs(Math.sin(frame / 3 + i * 1.5)) * 10;
            return (
              <div
                key={i}
                style={{
                  width: 3,
                  height: barH,
                  borderRadius: 2,
                  backgroundColor: LIME,
                }}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Smooth Punch Zoom & Bounce ---------------- */
const usePunch = () => {
  const frame = useCurrentFrame();
  let s = 1;
  let dx = 0;
  let dy = 0;
  for (const ins of inserts) {
    if (ins.type !== 'sticker') continue;
    const at = srcToTimeline(ins.at);
    if (at === null) continue;
    const dur = Math.round(ins.dur * FPS);
    const end = at + dur;
    s = Math.max(
      s,
      interpolate(frame, [at, at + 8, end - 8, end], [1, 1.1, 1.1, 1], {
        ...clamp,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    );
    if (frame >= at && frame < at + 8) {
      const shakeT = frame - at;
      dx += Math.sin(shakeT * 3.2) * interpolate(shakeT, [0, 8], [10, 0], clamp);
      dy += Math.cos(shakeT * 2.8) * interpolate(shakeT, [0, 8], [4, 0], clamp);
    }
  }
  return {s, dx, dy};
};

/* ---------------- Vector Icon Popups ---------------- */
type IconInsert = {at: number; dur: number; icon: string; label?: string};
const iconInserts: IconInsert[] = [
  {at: 190.0, dur: 2.5, icon: 'book', label: 'English'},
  {at: 435.6, dur: 2.5, icon: 'wallet', label: 'Grant'},
  {at: 481.2, dur: 2.5, icon: 'building', label: 'Hostel'},
  {at: 705.7, dur: 2.5, icon: 'dumbbell', label: 'Sport'},
  {at: 834.0, dur: 2.5, icon: 'graduation', label: 'Career'},
];

export const Edit: React.FC = () => {
  const {s, dx, dy} = usePunch();
  const introClip = items.find((i) => i.kind === 'clip');

  // Cut transition timestamps for light sweep overlay
  const cutPoints = React.useMemo(() => {
    const points: number[] = [];
    for (let i = 0; i < items.length - 1; i++) {
      points.push(items[i].start + items[i].dur);
    }
    return points;
  }, []);

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {/* Footage clips with smooth overlaps, crossfades & camera motion */}
      <AbsoluteFill
        style={{
          transform: `scale(${s}) translate(${dx}px, ${dy}px)`,
        }}
      >
        {items.map((it, i) => {
          if (it.kind !== 'clip') return null;

          const prevIt = i > 0 ? items[i - 1] : null;
          const nextIt = i < items.length - 1 ? items[i + 1] : null;

          const hasPrevOverlap = prevIt !== null;
          const hasNextOverlap = nextIt !== null;

          const extraStart = hasPrevOverlap ? TRANSITION_FRAMES / 2 : 0;
          const extraEnd = hasNextOverlap ? TRANSITION_FRAMES / 2 : 0;

          const actualStart = it.start - extraStart;
          const actualDur = it.dur + extraStart + extraEnd;
          const actualSrcFrom = Math.max(0, it.srcFrom - extraStart);

          const fadeIn = hasPrevOverlap ? TRANSITION_FRAMES : 0;
          const fadeOut = hasNextOverlap ? TRANSITION_FRAMES : 0;

          return (
            <Sequence key={`clip_${i}`} from={actualStart} durationInFrames={actualDur} layout="none">
              <SeamlessClip
                srcFrom={actualSrcFrom}
                dur={actualDur}
                fadeIn={fadeIn}
                fadeOut={fadeOut}
              />
            </Sequence>
          );
        })}
      </AbsoluteFill>

      {/* Cinematic vignette & overlay */}
      <CinematicOverlay />

      {/* Intro title */}
      {introClip ? (
        <Sequence from={introClip.start} durationInFrames={introClip.dur}>
          <IntroTitle dur={introClip.dur} />
        </Sequence>
      ) : null}

      {/* Progress HUD */}
      <Hud />

      {/* Info inserts */}
      {inserts.map((ins, i) => {
        const at = srcToTimeline(ins.at);
        if (at === null) return null;
        const d = Math.round(ins.dur * FPS);
        return (
          <Sequence key={`ins${i}`} from={at} durationInFrames={d}>
            {renderInsert(ins, d)}
          </Sequence>
        );
      })}

      {/* Vector Icon Popups */}
      {iconInserts.map((ei, i) => {
        const at = srcToTimeline(ei.at);
        if (at === null) return null;
        const d = Math.round(ei.dur * FPS);
        return (
          <Sequence key={`em${i}`} from={at} durationInFrames={d}>
            <IconPop dur={d} icon={ei.icon} label={ei.label} />
          </Sequence>
        );
      })}

      {/* Chapter cards + Outro */}
      {items.map((it, i) => {
        if (it.kind === 'card') {
          return (
            <React.Fragment key={`c${i}`}>
              <Sequence from={it.start} durationInFrames={8}>
                <ChapterTransitionOverlay />
              </Sequence>
              <Sequence from={it.start} durationInFrames={it.dur}>
                <ChapterCard n={it.chapter} title={it.title} />
              </Sequence>
            </React.Fragment>
          );
        }
        if (it.kind === 'outro') {
          return (
            <Sequence key={`o${i}`} from={it.start} durationInFrames={it.dur}>
              <Outro dur={it.dur} />
            </Sequence>
          );
        }
        return null;
      })}

      {/* Light Sweep Cut Transitions between ALL cuts */}
      {cutPoints.map((at, i) => (
        <Sequence key={`cut_${i}`} from={at - 4} durationInFrames={9} layout="none">
          <CutTransitionOverlay at={at} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
