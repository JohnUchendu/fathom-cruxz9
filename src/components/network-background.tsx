const CX = 400;
const CY = 175;

// Deterministic (no Math.random) so server and client render identically.
const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2 + (i % 2 === 0 ? 0.12 : -0.1);
  const radius = 75 + ((i * 37) % 110); // 75–185
  const x = CX + Math.cos(angle) * radius;
  const y = CY + Math.sin(angle) * radius * 0.55; // flatten toward the disk plane
  const tx = (CX - x) * 0.88;
  const ty = (CY - y) * 0.88;
  const duration = 5 + (i % 5) * 0.9;
  const delay = (i % 8) * 0.7;
  return { x, y, tx, ty, duration, delay, r: i % 3 === 0 ? 2.2 : 1.4 };
});

// A sparse field of distant, unrelated background stars.
const STARS = [
  { x: 40, y: 40 }, { x: 130, y: 330 }, { x: 60, y: 210 }, { x: 720, y: 60 },
  { x: 760, y: 300 }, { x: 660, y: 350 }, { x: 30, y: 120 }, { x: 200, y: 30 },
  { x: 250, y: 370 }, { x: 780, y: 180 }, { x: 100, y: 380 },
].map((s, i) => ({ ...s, d: `${(i % 6) * 0.4}s` }));

export function NetworkBackground() {
  return (
    <div className="constellation" aria-hidden>
      <svg className="drift" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="bh-glow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-teal)" stopOpacity="0.55" />
            <stop offset="45%" stopColor="var(--color-teal)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--color-teal)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bh-horizon-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="1" />
            <stop offset="72%" stopColor="#000" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--color-teal)" stopOpacity="0.9" />
          </radialGradient>
        </defs>

        {STARS.map((s, i) => (
          <circle
            key={i}
            className="constellation-dot"
            cx={s.x}
            cy={s.y}
            r="1.4"
            fill="var(--color-text-soft)"
            style={{ animationDelay: s.d }}
          />
        ))}

        {/* outer glow */}
        <circle className="bh-glow" cx={CX} cy={CY} r="150" fill="url(#bh-glow-grad)" />

        {/* accretion rings */}
        <ellipse
          className="bh-ring bh-ring-3"
          cx={CX}
          cy={CY}
          rx="185"
          ry="48"
          fill="none"
          stroke="var(--color-teal)"
          strokeOpacity="0.18"
          strokeWidth="1"
          transform={`rotate(-8 ${CX} ${CY})`}
        />
        <ellipse
          className="bh-ring bh-ring-2"
          cx={CX}
          cy={CY}
          rx="150"
          ry="38"
          fill="none"
          stroke="var(--color-teal)"
          strokeOpacity="0.3"
          strokeWidth="1.5"
          transform={`rotate(6 ${CX} ${CY})`}
        />
        <ellipse
          className="bh-ring"
          cx={CX}
          cy={CY}
          rx="112"
          ry="27"
          fill="none"
          stroke="var(--color-teal)"
          strokeOpacity="0.5"
          strokeWidth="2"
          transform={`rotate(-4 ${CX} ${CY})`}
        />

        {/* infalling particles */}
        {PARTICLES.map((p, i) => (
          <circle
            key={i}
            className="bh-particle"
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="var(--color-teal)"
            style={{
              ["--bh-tx" as string]: `${p.tx}px`,
              ["--bh-ty" as string]: `${p.ty}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* photon ring + event horizon, drawn last so it sits above the disk */}
        <circle cx={CX} cy={CY} r="40" fill="none" stroke="var(--color-teal)" strokeOpacity="0.45" strokeWidth="1" />
        <circle className="bh-horizon" cx={CX} cy={CY} r="34" fill="url(#bh-horizon-grad)" />
      </svg>
    </div>
  );
}
