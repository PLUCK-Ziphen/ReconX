import React, { useState, useRef, useEffect } from 'react'
import { RefreshCw, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react'

const STATUS_META = {
  matched:       { color: 'var(--accent-green)',  bg: 'var(--accent-green-dim)',  border: 'rgba(0,255,136,0.25)', label: 'MATCHED' },
  minor_mismatch:{ color: 'var(--accent-yellow)', bg: 'var(--accent-yellow-dim)', border: 'rgba(255,204,0,0.25)',  label: 'MINOR MISMATCH' },
  mismatch:      { color: 'var(--accent-red)',    bg: 'var(--accent-red-dim)',    border: 'rgba(255,68,102,0.25)', label: 'MISMATCH' },
  pending:       { color: 'var(--accent-gray)',   bg: 'var(--accent-gray-dim)',   border: 'rgba(90,106,130,0.25)', label: 'PENDING' },
}

const RISK_META = {
  low:    { color: 'var(--accent-green)',  label: 'LOW' },
  medium: { color: 'var(--accent-yellow)', label: 'MED' },
  high:   { color: 'var(--accent-red)',    label: 'HIGH' },
}

function StatusBadge({ status }) {
  const s = (status || 'pending').toLowerCase().replace(' ', '_')
  const meta = STATUS_META[s] || STATUS_META.pending
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px',
      color: meta.color, background: meta.bg,
      border: `1px solid ${meta.border}`,
      padding: '3px 8px', borderRadius: 4,
      whiteSpace: 'nowrap',
    }}>{meta.label}</span>
  )
}

function RiskBadge({ risk }) {
  const r = (risk || 'low').toLowerCase()
  const meta = RISK_META[r] || RISK_META.low
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: meta.color, fontWeight: 700 }}>
      {meta.label}
    </span>
  )
}

function formatTs(ts) {
  if (!ts) return '—'
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch { return ts }
}

function formatAmount(val) {
  if (val === undefined || val === null) return '—'
  return `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const COLUMNS = [
  { key: 'transaction_id', label: 'TRANSACTION ID', mono: true },
  { key: 'gateway_amount', label: 'GATEWAY', align: 'right' },
  { key: 'bank_amount',    label: 'BANK', align: 'right' },
  { key: 'status',         label: 'STATUS', align: 'center' },
  { key: 'risk',           label: 'RISK', align: 'center' },
  { key: 'timestamp',      label: 'TIMESTAMP', mono: true },
]

export default function TransactionFeed({ transactions, fetchError, onRefresh }) {
  const [sortKey, setSortKey] = useState('timestamp')
  const [sortDir, setSortDir] = useState('desc')
  const [filter, setFilter] = useState('all')
  const prevIds = useRef(new Set())
  const [newIds, setNewIds] = useState(new Set())

  useEffect(() => {
    const current = new Set(transactions.map(t => t.transaction_id))
    const fresh = new Set([...current].filter(id => !prevIds.current.has(id)))
    if (fresh.size > 0) {
      setNewIds(fresh)
      setTimeout(() => setNewIds(new Set()), 2000)
    }
    prevIds.current = current
  }, [transactions])

  const sorted = [...transactions]
    .filter(t => filter === 'all' || (t.status || '').toLowerCase() === filter)
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (sortKey === 'gateway_amount' || sortKey === 'bank_amount') {
        av = Number(av); bv = Number(bv)
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  return (
    <section style={{ marginBottom: 24 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--accent-cyan)',
              boxShadow: '0 0 8px var(--accent-cyan)',
              animation: 'pulse-dot 1.6s infinite',
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', letterSpacing: '1px' }}>
              LIVE TRANSACTION FEED
            </span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600 }}>
            Reconciled Transactions
            <span style={{
              marginLeft: 10, fontFamily: 'var(--font-mono)', fontSize: 13,
              color: 'var(--text-muted)', fontWeight: 400,
            }}>
              ({sorted.length})
            </span>
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Filter pills */}
          {['all', 'matched', 'mismatch', 'pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.5px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: filter === f ? 'var(--accent-cyan-dim)' : 'transparent',
              border: `1px solid ${filter === f ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
              color: filter === f ? 'var(--accent-cyan)' : 'var(--text-muted)',
            }}>
              {f.toUpperCase()}
            </button>
          ))}
          <button onClick={onRefresh} style={{
            padding: '6px 12px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.2s',
          }}>
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}>
        {fetchError && (
          <div style={{
            padding: '12px 20px',
            background: 'var(--accent-red-dim)',
            border: '1px solid rgba(255,68,102,0.2)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <AlertTriangle size={14} color="var(--accent-red)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent-red)' }}>
              BACKEND UNREACHABLE — Is the server running at http://127.0.0.1:8000?
            </span>
          </div>
        )}

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {COLUMNS.map(col => (
                  <th key={col.key} onClick={() => toggleSort(col.key)} style={{
                    padding: '12px 16px',
                    textAlign: col.align || 'left',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10, letterSpacing: '1px',
                    color: sortKey === col.key ? 'var(--accent-cyan)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: 'rgba(0,0,0,0.2)',
                    userSelect: 'none',
                    transition: 'color 0.2s',
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {col.label}
                      {sortKey === col.key && (
                        sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{
                    padding: '48px 20px', textAlign: 'center',
                    color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13,
                  }}>
                    {fetchError ? 'UNABLE TO FETCH DATA' : 'NO TRANSACTIONS YET — GENERATE AN EVENT TO BEGIN'}
                  </td>
                </tr>
              ) : (
                sorted.map((tx, i) => {
                  const isNew = newIds.has(tx.transaction_id)
                  return (
                    <tr key={tx.transaction_id || i} style={{
                      borderBottom: '1px solid var(--border)',
                      animation: isNew ? 'row-enter 0.5s ease' : 'none',
                      transition: 'background 0.2s',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={cellStyle}>
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 12,
                          color: isNew ? 'var(--accent-cyan)' : 'var(--text-primary)',
                          transition: 'color 1s',
                        }}>
                          {tx.transaction_id || '—'}
                        </span>
                        {isNew && <span style={{
                          marginLeft: 6, fontFamily: 'var(--font-mono)', fontSize: 9,
                          color: 'var(--accent-cyan)', background: 'var(--accent-cyan-dim)',
                          padding: '1px 5px', borderRadius: 3,
                        }}>NEW</span>}
                      </td>
                      <td style={{ ...cellStyle, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)' }}>
                        {formatAmount(tx.gateway_amount)}
                      </td>
                      <td style={{ ...cellStyle, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
                        {formatAmount(tx.bank_amount)}
                      </td>
                      <td style={{ ...cellStyle, textAlign: 'center' }}>
                        <StatusBadge status={tx.status} />
                      </td>
                      <td style={{ ...cellStyle, textAlign: 'center' }}>
                        <RiskBadge risk={tx.risk || tx.risk_level} />
                      </td>
                      <td style={{ ...cellStyle, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                        {formatTs(tx.timestamp || tx.created_at)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

const cellStyle = {
  padding: '12px 16px',
  fontSize: 13,
  verticalAlign: 'middle',
}
