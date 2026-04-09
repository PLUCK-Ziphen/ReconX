import React, { useEffect, useState } from 'react'

const TICKER_PHRASES = [
  'EVENT_RECEIVED', 'PARSING_PAYLOAD', 'RISK_ASSESSED', 'RECONCILED',
  'GATEWAY_MATCHED', 'BANK_VERIFIED', 'STORED_TO_DB', 'ALERT_CLEARED',
]

export default function Hero() {
  const [tickerIdx, setTickerIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setTickerIdx(i => (i + 1) % TICKER_PHRASES.length)
        setVisible(true)
      }, 200)
    }, 1800)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{ paddingTop: 72, paddingBottom: 64, position: 'relative' }}>
      {/* Decorative grid lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
        opacity: 0.03,
        backgroundImage: 'linear-gradient(var(--accent-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--accent-cyan) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--accent-cyan-dim)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: 20,
          padding: '5px 14px',
          marginBottom: 24,
          animation: 'fadeInUp 0.5s ease forwards',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--accent-cyan)',
            boxShadow: '0 0 8px var(--accent-cyan)',
            animation: 'pulse-dot 1.4s infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--accent-cyan)', letterSpacing: '1.5px',
          }}>SERVERLESS · EVENT-DRIVEN · REAL-TIME</span>
        </div>

        {/* Main title */}
        <h1 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(52px, 8vw, 96px)',
          fontWeight: 700,
          letterSpacing: '-3px',
          lineHeight: 0.95,
          marginBottom: 20,
          animation: 'fadeInUp 0.6s ease 0.1s both',
        }}>
          <span style={{ color: 'var(--text-primary)' }}>Recon</span>
          <span style={{
            background: 'linear-gradient(135deg, var(--accent-cyan), #0088ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>X</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          fontWeight: 300,
          color: 'var(--text-secondary)',
          maxWidth: 680,
          marginBottom: 16,
          animation: 'fadeInUp 0.6s ease 0.2s both',
          letterSpacing: '-0.2px',
          lineHeight: 1.4,
        }}>
          Serverless Event-Driven Payment Reconciliation Engine
        </p>

        <p style={{
          fontSize: 15,
          color: 'var(--text-muted)',
          maxWidth: 560,
          marginBottom: 36,
          animation: 'fadeInUp 0.6s ease 0.3s both',
          lineHeight: 1.7,
        }}>
          Processes financial transactions in real-time using event-driven architecture
          and intelligent reconciliation logic.
        </p>

        {/* Live ticker */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          animation: 'fadeInUp 0.6s ease 0.4s both',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-muted)', letterSpacing: '1px',
          }}>PROCESSING →</span>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--accent-cyan)',
            background: 'var(--accent-cyan-dim)',
            padding: '4px 12px',
            borderRadius: 4,
            border: '1px solid rgba(0,212,255,0.15)',
            transition: 'opacity 0.2s',
            opacity: visible ? 1 : 0,
            minWidth: 160,
            textAlign: 'center',
          }}>
            {TICKER_PHRASES[tickerIdx]}
          </div>
        </div>
      </div>
    </section>
  )
}
