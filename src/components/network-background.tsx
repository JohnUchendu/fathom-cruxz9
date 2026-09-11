const PATHS = [
  "M -40 80 C 120 40, 220 160, 380 90 S 620 20, 840 110",
  "M -40 220 C 100 260, 200 140, 340 200 S 560 300, 840 210",
  "M -40 340 C 140 300, 260 380, 420 320 S 660 260, 840 330",
  "M -40 20 C 160 70, 240 -10, 400 40 S 700 110, 840 40",
];

const DOTS = [
  { x: 80, y: 62, d: "0s" },
  { x: 220, y: 118, d: "0.6s" },
  { x: 340, y: 78, d: "1.1s" },
  { x: 470, y: 180, d: "0.3s" },
  { x: 560, y: 250, d: "1.6s" },
  { x: 690, y: 96, d: "0.9s" },
  { x: 130, y: 260, d: "1.9s" },
  { x: 400, y: 300, d: "0.4s" },
  { x: 620, y: 330, d: "1.3s" },
  { x: 760, y: 200, d: "0.1s" },
];

export function NetworkBackground() {
  return (
    <div className="constellation" aria-hidden>
      <svg className="drift" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
        {PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--color-border-strong)"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        {DOTS.map((dot, i) => (
          <circle
            key={i}
            className="constellation-dot"
            cx={dot.x}
            cy={dot.y}
            r="2.5"
            fill="var(--color-teal)"
            style={{ animationDelay: dot.d }}
          />
        ))}
      </svg>
    </div>
  );
}
