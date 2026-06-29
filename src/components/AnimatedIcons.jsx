import { motion } from 'framer-motion';

export function CyberSecurityIcon({ className = "w-16 h-16" }) {
  return (
    <motion.svg className={className} viewBox="0 0 80 80" fill="none"
      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}>
      {/* Outer glow ring */}
      <motion.circle cx="40" cy="40" r="36" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.15"
        animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      {/* Shield body */}
      <motion.path
        d="M40 6L12 20v18c0 16.5 12 31.5 28 36 16-4.5 28-19.5 28-36V20L40 6z"
        stroke="#00f0ff" strokeWidth="1.5" fill="rgba(0,240,255,0.04)"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />
      {/* Inner shield */}
      <motion.path
        d="M40 16L20 27v13c0 10.5 7.7 20.3 20 23.5C52.3 60.3 60 50.5 60 40V27L40 16z"
        stroke="#00f0ff" strokeWidth="0.8" strokeOpacity="0.4" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.4, ease: "easeInOut" }}
      />
      {/* Lock body */}
      <motion.rect x="30" y="36" width="20" height="14" rx="2" stroke="#00f0ff" strokeWidth="1.5" fill="rgba(0,240,255,0.08)"
        initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }} style={{ transformOrigin: 'bottom' }}
      />
      {/* Lock shackle */}
      <motion.path d="M34 36V32a6 6 0 0 1 12 0v4" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 1.8, ease: "easeOut" }}
      />
      {/* Keyhole */}
      <motion.circle cx="40" cy="42" r="2" fill="#00f0ff"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.line x1="40" y1="44" x2="40" y2="47" stroke="#00f0ff" strokeWidth="1.5" strokeLinecap="round"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.3, delay: 2 }} />
      {/* Scanning line */}
      <motion.line x1="16" y1="40" x2="64" y2="40" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.5"
        animate={{ y: [-14, 14, -14] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ translateY: 0 }}
      />
      {/* Corner brackets */}
      <motion.path d="M15 25 L15 20 L20 20" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 1.2 }} />
      <motion.path d="M65 25 L65 20 L60 20" stroke="#00f0ff" strokeWidth="1" strokeOpacity="0.5" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 1.3 }} />
    </motion.svg>
  );
}

export function BioTechIcon({ className = "w-16 h-16" }) {
  return (
    <motion.svg className={className} viewBox="0 0 80 80" fill="none"
      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}>
      {/* Glow */}
      <motion.circle cx="40" cy="40" r="36" stroke="#39ff14" strokeWidth="0.5" strokeOpacity="0.1"
        animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 3.5, repeat: Infinity }} />
      {/* DNA left strand */}
      <motion.path
        d="M28 8 C28 20, 52 24, 52 36 C52 48, 28 52, 28 64"
        stroke="#39ff14" strokeWidth="2" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
      {/* DNA right strand */}
      <motion.path
        d="M52 8 C52 20, 28 24, 28 36 C28 48, 52 52, 52 64"
        stroke="#39ff14" strokeWidth="2" strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
      />
      {/* Rungs */}
      {[15, 24, 33, 42, 51, 60].map((y, i) => (
        <motion.line key={i} x1="28" y1={y} x2="52" y2={y}
          stroke="#39ff14" strokeWidth="1.2" strokeOpacity="0.6" strokeLinecap="round"
          initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 0.6 }}
          transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
          style={{ transformOrigin: 'center' }}
        />
      ))}
      {/* Node dots */}
      {[{ x: 28, y: 15 }, { x: 52, y: 24 }, { x: 28, y: 33 }, { x: 52, y: 42 }, { x: 28, y: 51 }, { x: 52, y: 60 }].map((pt, i) => (
        <motion.circle key={i} cx={pt.x} cy={pt.y} r="2.5" fill="#39ff14"
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}
    </motion.svg>
  );
}

export function FinanceIcon({ className = "w-16 h-16" }) {
  return (
    <motion.svg className={className} viewBox="0 0 80 80" fill="none"
      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}>
      {/* Glow */}
      <motion.circle cx="40" cy="40" r="36" stroke="#ffd700" strokeWidth="0.5" strokeOpacity="0.1"
        animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 4, repeat: Infinity }} />
      {/* Grid lines */}
      {[20, 35, 50, 65].map((y, i) => (
        <motion.line key={i} x1="10" y1={y} x2="70" y2={y}
          stroke="#ffd700" strokeWidth="0.4" strokeOpacity="0.15"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
          style={{ transformOrigin: 'left' }}
        />
      ))}
      {/* Axes */}
      <motion.line x1="10" y1="10" x2="10" y2="68" stroke="#ffd700" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />
      <motion.line x1="10" y1="68" x2="70" y2="68" stroke="#ffd700" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} />
      {/* Chart area fill */}
      <motion.path
        d="M10 58 L22 52 L30 42 L40 30 L50 22 L62 14 L62 68 L10 68 Z"
        fill="rgba(255,215,0,0.06)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.6 }}
      />
      {/* Main line */}
      <motion.polyline
        points="10,58 22,52 30,42 40,30 50,22 62,14"
        stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.7, ease: "easeInOut" }}
      />
      {/* Data points */}
      {[[10,58],[22,52],[30,42],[40,30],[50,22],[62,14]].map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="2.5" fill="#ffd700"
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.8 + i * 0.15 }}
        />
      ))}
      {/* Arrow tip */}
      <motion.path d="M58 10 L62 14 L66 10" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 1.7 }} />
      {/* Pulse at peak */}
      <motion.circle cx="62" cy="14" r="5" stroke="#ffd700" strokeWidth="1" strokeOpacity="0.4" fill="none"
        animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: 2 }} />
    </motion.svg>
  );
}

export function DataScienceIcon({ className = "w-16 h-16" }) {
  return (
    <motion.svg className={className} viewBox="0 0 80 80" fill="none"
      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}>
      {/* Outer orbit */}
      <motion.ellipse cx="40" cy="40" rx="34" ry="12" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.4" fill="none"
        animate={{ rotateZ: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: '40px 40px' }}
      />
      {/* Mid orbit */}
      <motion.ellipse cx="40" cy="40" rx="12" ry="34" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.3" fill="none"
        animate={{ rotateZ: [0, -360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: '40px 40px' }}
      />
      {/* Diagonal orbit */}
      <motion.ellipse cx="40" cy="40" rx="28" ry="28" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.2" fill="none"
        strokeDasharray="4 4"
        animate={{ rotateZ: [0, 360] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: '40px 40px' }}
      />
      {/* Core */}
      <motion.circle cx="40" cy="40" r="7" fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="1.5"
        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
      />
      <motion.circle cx="40" cy="40" r="3" fill="#a855f7"
        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />
      {/* Orbiting electron dots */}
      <motion.circle cx="74" cy="40" r="3" fill="#a855f7"
        animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: '40px 40px' }}
      />
      <motion.circle cx="40" cy="6" r="3" fill="#c084fc"
        animate={{ rotate: [0, -360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: '40px 40px' }}
      />
      {/* Constellation dots */}
      {[[16,16],[64,16],[16,64],[64,64]].map(([x,y], i) => (
        <motion.circle key={i} cx={x} cy={y} r="1.5" fill="#a855f7" fillOpacity="0.5"
          animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
      ))}
      <motion.line x1="16" y1="16" x2="40" y2="40" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1 }} />
      <motion.line x1="64" y1="16" x2="40" y2="40" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.2 }} />
      <motion.line x1="16" y1="64" x2="40" y2="40" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.4 }} />
      <motion.line x1="64" y1="64" x2="40" y2="40" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.6 }} />
    </motion.svg>
  );
}

// Hero central SVG — large animated network brain
export function HeroBrainIcon() {
  const nodes = [
    { cx: 160, cy: 80 }, { cx: 260, cy: 60 }, { cx: 340, cy: 100 },
    { cx: 80, cy: 160 }, { cx: 200, cy: 150 }, { cx: 300, cy: 160 }, { cx: 400, cy: 140 },
    { cx: 120, cy: 240 }, { cx: 220, cy: 250 }, { cx: 320, cy: 240 }, { cx: 440, cy: 200 },
    { cx: 160, cy: 320 }, { cx: 280, cy: 330 }, { cx: 380, cy: 300 },
    { cx: 100, cy: 380 }, { cx: 240, cy: 400 }, { cx: 360, cy: 380 },
  ];
  const edges = [
    [0,1],[1,2],[0,4],[1,4],[2,5],[2,6],[3,4],[3,7],[4,5],[4,8],[5,6],[5,9],[6,10],
    [7,8],[7,11],[8,9],[8,12],[9,10],[9,13],[10,13],[11,12],[11,14],[12,13],[12,15],[13,16],[14,15],[15,16],
  ];
  return (
    <motion.svg viewBox="0 0 520 440" fill="none" className="w-full h-full opacity-30"
      initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ duration: 2 }}>
      {edges.map(([a, b], i) => (
        <motion.line key={i}
          x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="#00f0ff" strokeWidth="0.8" strokeOpacity="0.4"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: i * 0.04, ease: "easeInOut" }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle key={i} cx={n.cx} cy={n.cy} r="4" fill="#00f0ff"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.06 }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle key={`pulse-${i}`} cx={n.cx} cy={n.cy} r="8" stroke="#00f0ff" strokeWidth="0.5" fill="none"
          animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </motion.svg>
  );
}