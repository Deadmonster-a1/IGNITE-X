"use client"

import { useState, useCallback } from "react"

type BotVariant = "hero" | "courses" | "features" | "dsa" | "paths" | "testimonials" | "footer"

interface SectionBotProps {
  variant: BotVariant
  className?: string
}

/* ── Variant config ── */
const variantConfig: Record<BotVariant, { label: string; chestIcon: string }> = {
  hero:         { label: "GUIDE-BOT",  chestIcon: "wave" },
  courses:      { label: "STUDY-BOT",  chestIcon: "book" },
  features:     { label: "SCAN-BOT",   chestIcon: "lens" },
  dsa:          { label: "SORT-BOT",   chestIcon: "bolt" },
  paths:        { label: "NAV-BOT",    chestIcon: "compass" },
  testimonials: { label: "CHEER-BOT",  chestIcon: "star" },
  footer:       { label: "SLEEP-BOT",  chestIcon: "moon" },
}

/* ── Chest icon paths per variant ── */
function ChestIcon({ type, x, y }: { type: string; x: number; y: number }) {
  switch (type) {
    case "wave":
      return <path d={`M${x-4},${y} L${x},${y-5} L${x+4},${y} L${x},${y+5}Z`} fill="var(--accent)" opacity="0.8" />
    case "book":
      return <>
        <rect x={x-5} y={y-4} width="10" height="8" rx="1" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.7" />
        <line x1={x} y1={y-4} x2={x} y2={y+4} stroke="var(--accent)" strokeWidth="0.8" opacity="0.5" />
      </>
    case "lens":
      return <>
        <circle cx={x} cy={y-1} r="4" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.7" />
        <line x1={x+3} y1={y+2} x2={x+6} y2={y+5} stroke="var(--accent)" strokeWidth="1.2" opacity="0.7" />
      </>
    case "bolt":
      return <path d={`M${x-2},${y-5} L${x+3},${y-5} L${x},${y} L${x+3},${y} L${x-2},${y+5} L${x},${y} L${x-3},${y}Z`} fill="var(--accent)" opacity="0.8" />
    case "compass":
      return <>
        <circle cx={x} cy={y} r="5" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.6" />
        <path d={`M${x},${y-4} L${x+2},${y} L${x},${y+4} L${x-2},${y}Z`} fill="var(--accent)" opacity="0.7" />
      </>
    case "star":
      return <path d={`M${x},${y-5} L${x+1.5},${y-1.5} L${x+5},${y-1} L${x+2.5},${y+1.5} L${x+3},${y+5} L${x},${y+3} L${x-3},${y+5} L${x-2.5},${y+1.5} L${x-5},${y-1} L${x-1.5},${y-1.5}Z`} fill="var(--accent)" opacity="0.7" />
    case "moon":
      return <path d={`M${x+2},${y-5} A6,6,0,1,0,${x+2},${y+5} A4,4,0,1,1,${x+2},${y-5}`} fill="var(--accent)" opacity="0.5" />
    default:
      return null
  }
}

export function SectionBot({ variant, className = "" }: SectionBotProps) {
  const [clicked, setClicked] = useState(false)
  const [hovered, setHovered] = useState(false)
  const config = variantConfig[variant]
  const isSleepy = variant === "footer"

  const handleClick = useCallback(() => {
    setClicked(true)
    setTimeout(() => setClicked(false), 1200)
  }, [])

  /* Eye state */
  const eyeScaleY = clicked ? 0.15 : 1  /* clicked = ^ ^ happy squint */
  const eyeWidth = hovered ? 5 : 4
  const eyeHeight = hovered ? 5 : 4
  const eyeOpacity = isSleepy ? 0.4 : 1

  return (
    <div
      className={`section-bot group/bot pointer-events-auto inline-flex flex-col items-center gap-1 ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      role="img"
      aria-label={`${config.label} robot companion`}
      style={{ cursor: "pointer" }}
    >
      <svg
        width="80"
        height="90"
        viewBox="0 0 80 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover/bot:scale-105"
      >
        {/* ── Antenna ── */}
        <line
          x1="40" y1="5" x2="40" y2="16"
          stroke="var(--accent)"
          strokeWidth="1.5"
          opacity="0.6"
        />
        {/* Antenna tip glow */}
        <circle
          cx="40" cy="4"
          r={hovered ? 3.5 : 2.5}
          fill="var(--accent)"
          className="bot-antenna"
          style={{ transition: "r 0.3s ease" }}
        />
        {/* Antenna ring (hover) */}
        {hovered && (
          <circle
            cx="40" cy="4" r="6"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.5"
            opacity="0.3"
            className="bot-antenna-ring"
          />
        )}

        {/* ── Head ── */}
        {/* Angular/chamfered head shape */}
        <path
          d="M20,18 L60,18 L64,24 L64,44 L58,50 L22,50 L16,44 L16,24 Z"
          fill="var(--secondary)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        {/* Head inner frame */}
        <path
          d="M23,21 L57,21 L60,25 L60,42 L56,47 L24,47 L20,42 L20,25 Z"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.4"
          opacity="0.25"
        />

        {/* ── Eyes ── */}
        <g style={{ transform: `scaleY(${eyeScaleY})`, transformOrigin: "40px 33px", transition: "transform 0.15s ease" }}>
          {/* Left eye */}
          <rect
            x={30 - eyeWidth / 2}
            y={33 - eyeHeight / 2}
            width={eyeWidth}
            height={eyeHeight}
            rx="1"
            fill="var(--accent)"
            opacity={eyeOpacity}
            className={isSleepy ? "" : "bot-blink"}
          />
          {/* Right eye */}
          <rect
            x={50 - eyeWidth / 2}
            y={33 - eyeHeight / 2}
            width={eyeWidth}
            height={eyeHeight}
            rx="1"
            fill="var(--accent)"
            opacity={eyeOpacity}
            className={isSleepy ? "" : "bot-blink"}
          />
          {/* Eye highlights */}
          {!clicked && (
            <>
              <rect x={31 - eyeWidth / 2} y={31.5 - eyeHeight / 2} width="1.5" height="1.5" fill="var(--accent-foreground)" opacity="0.5" />
              <rect x={51 - eyeWidth / 2} y={31.5 - eyeHeight / 2} width="1.5" height="1.5" fill="var(--accent-foreground)" opacity="0.5" />
            </>
          )}
        </g>

        {/* Mouth — simple line, curves up when clicked */}
        {clicked ? (
          <path d="M34,41 Q40,45 46,41" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />
        ) : (
          <line x1="34" y1="42" x2="46" y2="42" stroke="var(--accent)" strokeWidth="1" opacity="0.35" strokeLinecap="round" />
        )}

        {/* ── Neck ── */}
        <rect x="36" y="50" width="8" height="4" fill="var(--secondary)" stroke="var(--border)" strokeWidth="0.5" />

        {/* ── Body (torso) ── */}
        <path
          d="M18,56 L62,56 L66,62 L66,82 L60,88 L20,88 L14,82 L14,62 Z"
          fill="var(--secondary)"
          stroke="var(--border)"
          strokeWidth="1"
        />
        {/* Body inner accent lines */}
        <line x1="18" y1="60" x2="62" y2="60" stroke="var(--accent)" strokeWidth="0.4" opacity="0.2" />
        <line x1="18" y1="64" x2="62" y2="64" stroke="var(--border)" strokeWidth="0.3" opacity="0.4" />

        {/* ── Chest icon (variant-specific) ── */}
        <ChestIcon type={config.chestIcon} x={40} y={74} />

        {/* ── Shoulder joints ── */}
        <circle cx="16" cy="58" r="3" fill="var(--secondary)" stroke="var(--border)" strokeWidth="0.8" />
        <circle cx="64" cy="58" r="3" fill="var(--secondary)" stroke="var(--border)" strokeWidth="0.8" />

        {/* ── Arm stubs ── */}
        <rect x="6" y="58" width="7" height="16" rx="2" fill="var(--secondary)" stroke="var(--border)" strokeWidth="0.6" />
        <rect x="67" y="58" width="7" height="16" rx="2" fill="var(--secondary)" stroke="var(--border)" strokeWidth="0.6" />

        {/* ── Small HUD detail on forehead ── */}
        <rect x="35" y="22" width="10" height="3" rx="0.5" fill="var(--accent)" opacity="0.15" />
        <rect x="37" y="23" width="6" height="1" rx="0.5" fill="var(--accent)" opacity="0.35" />

        {/* ── Side head vents ── */}
        {[27, 30, 33].map((ly) => (
          <line key={`lv-${ly}`} x1="17" y1={ly} x2="20" y2={ly} stroke="var(--accent)" strokeWidth="0.5" opacity="0.2" />
        ))}
        {[27, 30, 33].map((ry) => (
          <line key={`rv-${ry}`} x1="60" y1={ry} x2="63" y2={ry} stroke="var(--accent)" strokeWidth="0.5" opacity="0.2" />
        ))}

        {/* Hover glow overlay */}
        {hovered && (
          <rect
            x="14" y="56" width="52" height="32" rx="0"
            fill="var(--accent)"
            opacity="0.03"
            style={{ transition: "opacity 0.3s ease" }}
          />
        )}
      </svg>

      {/* ── HUD label ── */}
      <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-accent/50 transition-colors duration-300 group-hover/bot:text-accent/80">
        {config.label}
      </span>
    </div>
  )
}
