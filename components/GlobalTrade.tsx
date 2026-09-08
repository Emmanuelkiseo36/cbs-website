'use client';

import { useReducedMotion } from 'framer-motion';
import { SectionHeading } from './ui/SectionHeading';

const ROUTES = [
  { d: 'M400,300 Q352,238 288,218', label: 'Regional Trade', x: 218, y: 196, dy: -10 },
  { d: 'M400,300 Q478,212 522,168', label: 'International Trade', x: 566, y: 150, dy: -10 },
  { d: 'M400,300 Q492,392 556,424', label: 'Global Markets', x: 602, y: 452, dy: 14 },
];

export default function GlobalTrade() {
  const reduce = useReducedMotion();

  return (
    <section
      id="global-trade"
      className="relative overflow-hidden bg-navy-900 py-28 lg:py-40"
    >
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="container-site relative">
        <div className="grid items-end gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <SectionHeading
              index="04"
              kicker="Global reach"
              title="Tanzania, Connected to Global Trade"
              tone="dark"
            />
            <p className="mt-8 max-w-xl text-base leading-relaxed text-slate-300">
              CBS sits at the gateway of East African commerce. From Dar es
              Salaam, we support cargo flowing between local, regional and
              international markets — handled with the discipline a global
              supply chain demands.
            </p>
            <p className="mt-6 text-xs uppercase tracking-hair text-slate-500">
              Illustrative trade corridors — represents international trade routes
              served from Tanzania
            </p>
          </div>

          <div className="relative" role="img" aria-label="Abstract map showing trade routes from Dar es Salaam, Tanzania to regional and international markets">
            <svg
              viewBox="0 0 760 560"
              className="w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="routeGold" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#c7a255" stopOpacity="0.15" />
                  <stop offset="1" stopColor="#e3c98b" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* grid */}
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={`v${i}`}
                  x1={i * 95}
                  y1={0}
                  x2={i * 95}
                  y2={560}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line
                  key={`h${i}`}
                  x1={0}
                  y1={i * 80}
                  x2={760}
                  y2={i * 80}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
              ))}

              {/* orbit rings */}
              {[
                [118, 72, 12000],
                [226, 140, 20000],
                [330, 200, 30000],
              ].map(([rx, ry, dur], i) => (
                <g key={i}>
                  <ellipse
                    cx="400"
                    cy="292"
                    rx={rx}
                    ry={ry}
                    fill="none"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="1"
                    strokeDasharray="3 7"
                    transform={`rotate(${i * 14} 400 292)`}
                    style={
                      reduce
                        ? undefined
                        : {
                            animation: `spin-slow ${dur}ms linear infinite`,
                            transformOrigin: '400px 292px',
                          }
                    }
                  />
                </g>
              ))}

              {/* routes */}
              {!reduce && (
                <>
                  {ROUTES.map((route) => (
                    <g key={route.label}>
                      <path
                        d={route.d}
                        fill="none"
                        stroke="url(#routeGold)"
                        strokeWidth="1.5"
                        strokeDasharray="7 9"
                        style={{
                          animation: 'dash-flow 1600ms linear infinite',
                        }}
                      />
                      <circle r="3" fill="#e3c98b">
                        <animateMotion
                          dur="2.6s"
                          repeatCount="indefinite"
                          path={route.d}
                        />
                      </circle>
                    </g>
                  ))}
                </>
              )}

              {/* labels */}
              {ROUTES.map((route) => (
                <g key={`${route.label}-label`}>
                  <circle cx={route.x} cy={route.y} r="4" fill="#c7a255" />
                  <text
                    x={route.x}
                    y={route.y + route.dy}
                    textAnchor="middle"
                    fill="#c3cfda"
                    fontSize="13"
                    letterSpacing="2"
                  >
                    {route.label.toUpperCase()}
                  </text>
                </g>
              ))}

              {/* center node */}
              <g>
                <circle cx="400" cy="292" r="26" fill="none" stroke="#c7a255" strokeWidth="1" strokeDasharray="4 4" style={reduce ? undefined : { animation: 'spin-slow 14000ms linear infinite', transformOrigin: '400px 292px' }} />
                <circle
                  cx="400"
                  cy="292"
                  r="14"
                  fill="rgba(199,162,85,0.15)"
                  stroke="#e3c98b"
                  strokeWidth="1.5"
                />
                <circle
                  cx="400"
                  cy="292"
                  r="5"
                  fill="#e3c98b"
                  style={reduce ? undefined : { animation: 'pulse-dot 2.2s ease-in-out infinite' }}
                />
                <text x="400" y="246" textAnchor="middle" fill="#e3c98b" fontSize="14" fontWeight="700" letterSpacing="3">
                  TANZANIA
                </text>
                <text x="400" y="266" textAnchor="middle" fill="#7a8b9c" fontSize="11" letterSpacing="1.5">
                  DAR ES SALAAM · 6.79°S 39.21°E
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}