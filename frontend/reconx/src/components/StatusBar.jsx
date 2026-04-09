import React from 'react'
import { Activity, Wifi, WifiOff, Zap } from 'lucide-react'

export default function StatusBar({ txCount, fetchError, isLive, onToggleLive }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8, 12, 20, 0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 32px',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30,
            background: 'linear-gradient(135deg, var(--accent-cyan), #0066ff)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Zap size={16} color="#fff" />
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: '-0.5px',
            color: 'var(--text-primary)',
          }}>ReconX</span>
          <span style={{
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-cyan)',
            background: 'var(--accent-cyan-dim)',
            padding: '2px 8px',
            borderRadius: 4,
            border: '1px solid rgba(0, 212, 255, 0.2)',
          }}>v2.4.1</span>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Transaction counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={14} color="var(--text-secondary)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{txCount}</span> transactions
            </span>
          </div>

          {/* Status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {fetchError ? (
              <>
                <WifiOff size={14} color="var(--accent-red)" />
                <span style={{ fontSize: 12, color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}>DISCONNECTED</span>
              </>
            ) : (
              <>
                <div style={{
                  width: 7, height: 7,
                  borderRadius: '50%',
                  background: isLive ? 'var(--accent-green)' : 'var(--accent-yellow)',
                  animation: isLive ? 'pulse-dot 1.6s ease-in-out infinite' : 'none',
                  boxShadow: isLive ? '0 0 8px var(--accent-green)' : '0 0 8px var(--accent-yellow)',
                }} />
                <span style={{ fontSize: 12, color: isLive ? 'var(--accent-green)' : 'var(--accent-yellow)', fontFamily: 'var(--font-mono)' }}>
                  {isLive ? 'LIVE' : 'PAUSED'}
                </span>
              </>
            )}
          </div>

          {/* Toggle live */}
          <button
            onClick={onToggleLive}
            style={{
              background: isLive ? 'rgba(0,255,136,0.08)' : 'rgba(255,204,0,0.08)',
              border: `1px solid ${isLive ? 'rgba(0,255,136,0.25)' : 'rgba(255,204,0,0.25)'}`,
              color: isLive ? 'var(--accent-green)' : 'var(--accent-yellow)',
              padding: '5px 14px',
              borderRadius: 6,
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              cursor: 'pointer',
              letterSpacing: '0.5px',
              transition: 'all 0.2s',
            }}
          >
            {isLive ? 'PAUSE FEED' : 'RESUME FEED'}
          </button>
        </div>
      </div>
    </header>
  )
}
