import React from 'react'

const STEPS = [
  { label: 'Event Generated', sub: 'POST /create', icon: '⚡' },
  { label: 'Processing',      sub: 'FastAPI Backend', icon: '⚙' },
  { label: 'Reconciled',      sub: 'Logic Engine', icon: '✓' },
  { label: 'Stored',          sub: 'Firebase Firestore', icon: '◈' },
]

export default function EventFlowIndicator({ activeStep }) {
  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', letterSpacing: '1px' }}>
            ◈ EVENT PIPELINE
          </span>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
          Event Flow
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Real-time pipeline state — trigger an event to animate
        </p>
      </div>

      {/* Pipeline steps */}
      <div style={{ position: 'relative' }}>
        {/* Connector line */}
        <div style={{
          position: 'absolute',
          top: 28,
          left: 28,
          right: 28,
          height: 2,
          background: 'var(--border)',
          zIndex: 0,
        }} />
        {/* Active connector */}
        {activeStep !== null && (
          <div style={{
            position: 'absolute',
            top: 28,
            left: 28,
            height: 2,
            background: 'linear-gradient(90deg, var(--accent-cyan), rgba(0,212,255,0.3))',
            width: `${(activeStep / (STEPS.length - 1)) * (100 - 56 / 4)}%`,
            zIndex: 0,
            transition: 'width 0.5s ease',
            boxShadow: '0 0 10px rgba(0,212,255,0.4)',
          }} />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          {STEPS.map((step, i) => {
            const isActive = activeStep !== null && i <= activeStep
            const isCurrent = activeStep === i

            return (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 10, flex: 1,
              }}>
                {/* Icon circle */}
                <div style={{
                  width: 52, height: 52,
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,102,255,0.15))'
                    : 'var(--bg-surface)',
                  border: `2px solid ${isActive ? 'var(--accent-cyan)' : 'var(--border)'}`,
                  transition: 'all 0.4s ease',
                  boxShadow: isCurrent ? '0 0 0 6px rgba(0,212,255,0.1), 0 0 20px rgba(0,212,255,0.2)' : 'none',
                  animation: isCurrent ? 'flow-step 1s ease infinite' : 'none',
                  fontSize: 20,
                }}>
                  {step.icon}
                </div>

                {/* Label */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: 12, fontWeight: 600,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                    transition: 'color 0.3s',
                    marginBottom: 2,
                  }}>
                    {step.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10,
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    transition: 'color 0.3s',
                  }}>
                    {step.sub}
                  </div>
                </div>

                {/* Step number */}
                <div style={{
                  width: 18, height: 18,
                  borderRadius: '50%',
                  background: isActive ? 'var(--accent-cyan)' : 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  color: isActive ? '#000' : 'var(--text-muted)',
                  fontWeight: 700,
                  transition: 'all 0.3s',
                }}>
                  {i + 1}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status row */}
      <div style={{
        marginTop: 24,
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: activeStep !== null ? 'var(--accent-cyan)' : 'var(--text-muted)',
          boxShadow: activeStep !== null ? '0 0 8px var(--accent-cyan)' : 'none',
          animation: activeStep !== null ? 'pulse-dot 0.8s infinite' : 'none',
        }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: activeStep !== null ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
          {activeStep !== null ? `STEP ${activeStep + 1}/4 — ${STEPS[activeStep].label.toUpperCase()}` : 'IDLE — AWAITING EVENT'}
        </span>
      </div>
    </div>
  )
}

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: 24,
  backdropFilter: 'blur(10px)',
  boxShadow: 'var(--shadow-card)',
}
