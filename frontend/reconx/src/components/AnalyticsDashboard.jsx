import React from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'

const STATUS_COLORS = {
  matched:        '#00ff88',
  minor_mismatch: '#ffcc00',
  mismatch:       '#ff4466',
  pending:        '#5a6a82',
}

const RISK_COLORS = {
  low:    '#00ff88',
  medium: '#ffcc00',
  high:   '#ff4466',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(13,18,32,0.95)',
      border: '1px solid var(--border-bright)',
      borderRadius: 8,
      padding: '10px 14px',
    }}>
      {label && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: p.fill || p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div style={{
      background: 'rgba(13,18,32,0.95)',
      border: '1px solid var(--border-bright)',
      borderRadius: 8, padding: '8px 12px',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: STATUS_COLORS[name] || '#fff' }}>
        {name?.toUpperCase()}: <strong>{value}</strong>
      </div>
    </div>
  )
}

const RADIAN = Math.PI / 180
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '16px 20px',
      display: 'flex', flexDirection: 'column', gap: 4,
      flex: 1,
    }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '1px' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: color || 'var(--text-primary)' }}>{value}</span>
      {sub && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sub}</span>}
    </div>
  )
}

export default function AnalyticsDashboard({ statusCounts, riskCounts, total }) {
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  const barData = [
    { level: 'Low', count: riskCounts.low || 0 },
    { level: 'Medium', count: riskCounts.medium || 0 },
    { level: 'High', count: riskCounts.high || 0 },
  ]

  const matchRate = total > 0
    ? Math.round(((statusCounts.matched || 0) / total) * 100)
    : 0

  const highRisk = riskCounts.high || 0

  return (
    <section>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-cyan)', letterSpacing: '1px' }}>
            ◈ ANALYTICS DASHBOARD
          </span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>Risk & Reconciliation Analytics</h2>
      </div>

      {/* Stat row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatCard label="TOTAL TRANSACTIONS" value={total} sub="all time" />
        <StatCard label="MATCH RATE" value={`${matchRate}%`} color={matchRate > 80 ? 'var(--accent-green)' : matchRate > 50 ? 'var(--accent-yellow)' : 'var(--accent-red)'} sub="gateway vs bank" />
        <StatCard label="HIGH RISK" value={highRisk} color={highRisk > 0 ? 'var(--accent-red)' : 'var(--accent-green)'} sub="transactions flagged" />
        <StatCard label="MATCHED" value={statusCounts.matched || 0} color="var(--accent-green)" sub="fully reconciled" />
        <StatCard label="MISMATCH" value={statusCounts.mismatch || 0} color="var(--accent-red)" sub="require review" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Pie chart */}
        <div style={chartCard}>
          <div style={chartHeader}>
            <span style={labelStyle}>STATUS DISTRIBUTION</span>
            <h3 style={chartTitle}>Reconciliation Status</h3>
          </div>

          {pieData.length === 0 ? (
            <EmptyChart />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={renderLabel}
                  >
                    {pieData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={STATUS_COLORS[entry.name] || '#5a6a82'}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', justifyContent: 'center', marginTop: 4 }}>
                {pieData.map((d) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: STATUS_COLORS[d.name] || '#5a6a82' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>
                      {d.name} ({d.value})
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bar chart */}
        <div style={chartCard}>
          <div style={chartHeader}>
            <span style={labelStyle}>RISK ANALYSIS</span>
            <h3 style={chartTitle}>Risk Level Distribution</h3>
          </div>

          {total === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="level"
                  tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontFamily: 'var(--font-mono)', fontSize: 11, fill: 'var(--text-muted)' }}
                  axisLine={false} tickLine={false} allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Transactions">
                  {barData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={RISK_COLORS[entry.level.toLowerCase()] || '#5a6a82'}
                      opacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  )
}

function EmptyChart() {
  return (
    <div style={{
      height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12,
    }}>
      NO DATA — GENERATE EVENTS TO POPULATE
    </div>
  )
}

const chartCard = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: 24,
  boxShadow: 'var(--shadow-card)',
}

const chartHeader = { marginBottom: 20 }

const labelStyle = {
  fontFamily: 'var(--font-mono)', fontSize: 10,
  color: 'var(--accent-cyan)', letterSpacing: '1px',
  display: 'block', marginBottom: 4,
}

const chartTitle = {
  fontSize: 16, fontWeight: 600, color: 'var(--text-primary)',
}
