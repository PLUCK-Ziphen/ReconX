import React, { useState } from 'react'
import { Zap, CheckCircle, AlertCircle } from 'lucide-react'

const STEPS = [
  'Initializing event payload...',
  'Connecting to Lambda handler...',
  'Posting to /create endpoint...',
  'Event processed ✓',
]

export default function EventSimulator({ isGenerating, onGenerate, lastEvent }) {
  const [hovered, setHovered] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)

  React.useEffect(() => {
    if (!isGenerating) { setStepIdx(0); return }
    const id = setInterval(() => setStepIdx(i => Math.min(i + 1, STEPS.length - 1)), 600)
    return () => clearInterval(id)
  }, [isGenerating])

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Zap size={16} color="var(--accent-cyan)" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', letterSpacing: '1px' }}>
            EVENT SIMULATOR
          </span>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
          Generate Transaction Event
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
          Fires a POST to <code style={codeStyle}>/create</code> and triggers the reconciliation pipeline
        </p>
      </div>

      {/* Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          padding: '14px 24px',
          background: isGenerating
            ? 'rgba(0,212,255,0.06)'
            : hovered
              ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,102,255,0.2))'
              : 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,102,255,0.12))',
          border: `1px solid ${isGenerating ? 'rgba(0,212,255,0.15)' : 'rgba(0,212,255,0.35)'}`,
          borderRadius: 10,
          color: 'var(--accent-cyan)',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '1px',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          transition: 'all 0.2s',
          boxShadow: hovered && !isGenerating ? '0 0 24px rgba(0,212,255,0.12)' : 'none',
        }}
      >
        {isGenerating ? (
          <>
            <div style={{
              width: 14, height: 14,
              border: '2px solid rgba(0,212,255,0.3)',
              borderTopColor: 'var(--accent-cyan)',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }} />
            PROCESSING EVENT...
          </>
        ) : (
          <>
            <Zap size={14} />
            GENERATE TRANSACTION EVENT
          </>
        )}
      </button>

      {/* Processing steps */}
      {isGenerating && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, border: '1px solid var(--border)' }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '4px 0',
              opacity: i <= stepIdx ? 1 : 0.2,
              transition: 'opacity 0.3s',
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i < stepIdx ? 'var(--accent-green)' : i === stepIdx ? 'var(--accent-cyan)' : 'var(--text-muted)',
                boxShadow: i === stepIdx ? '0 0 6px var(--accent-cyan)' : 'none',
                transition: 'all 0.3s',
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: i < stepIdx ? 'var(--accent-green)' : i === stepIdx ? 'var(--accent-cyan)' : 'var(--text-muted)',
              }}>{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Last event result */}
      {lastEvent && !isGenerating && (
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: 'var(--accent-green-dim)',
          border: '1px solid rgba(0,255,136,0.2)',
          borderRadius: 8,
          animation: 'fadeInUp 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <CheckCircle size={12} color="var(--accent-green)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-green)', letterSpacing: '0.5px' }}>EVENT ACCEPTED</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {Object.entries(lastEvent).slice(0, 4).map(([k, v]) => (
              <div key={k}>
                <span style={{ color: 'var(--text-muted)' }}>{k}: </span>
                <span style={{ color: 'var(--text-primary)' }}>{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
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

const codeStyle = {
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  color: 'var(--accent-cyan)',
  background: 'var(--accent-cyan-dim)',
  padding: '1px 6px',
  borderRadius: 4,
}
