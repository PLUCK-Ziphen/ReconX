import React, { useState, useEffect, useCallback } from 'react'
import Hero from './components/Hero.jsx'
import EventSimulator from './components/EventSimulator.jsx'
import EventFlowIndicator from './components/EventFlowIndicator.jsx'
import TransactionFeed from './components/TransactionFeed.jsx'
import AnalyticsDashboard from './components/AnalyticsDashboard.jsx'
import StatusBar from './components/StatusBar.jsx'

const API_BASE = window.location.hostname === "localhost"
  ? "http://127.0.0.1:8000"
  : "https://your-ngrok-url"

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [flowStep, setFlowStep] = useState(null) // null | 0 | 1 | 2 | 3
  const [lastEvent, setLastEvent] = useState(null)
  const [fetchError, setFetchError] = useState(false)
  const [isLive, setIsLive] = useState(true)

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/transactions`)
      if (!res.ok) throw new Error('Network error')
      const data = await res.json()
      setTransactions(Array.isArray(data) ? data : [])
      setFetchError(false)
    } catch {
      setFetchError(true)
    }
  }, [])

  // Poll every 3 seconds when live
  useEffect(() => {
    fetchTransactions()
    if (!isLive) return
    const id = setInterval(fetchTransactions, 3000)
    return () => clearInterval(id)
  }, [fetchTransactions, isLive])

  const generateEvent = async () => {
    if (isGenerating) return
    setIsGenerating(true)
    setFlowStep(0)

    try {
      await sleep(400)
      setFlowStep(1)

      const res = await fetch(`${API_BASE}/create`, { method: 'POST' })
      const data = await res.json()
      setLastEvent(data)
      setFlowStep(2)

      await sleep(500)
      await fetchTransactions()
      setFlowStep(3)

      await sleep(1200)
      setFlowStep(null)
    } catch {
      setFetchError(true)
      setFlowStep(null)
    } finally {
      setIsGenerating(false)
    }
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  // Derive analytics from transactions
  const statusCounts = transactions.reduce((acc, t) => {
    const s = (t.status || 'pending').toLowerCase()
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})

  const riskCounts = transactions.reduce((acc, t) => {
    const r = (t.risk || t.risk_level || 'low').toLowerCase()
    acc[r] = (acc[r] || 0) + 1
    return acc
  }, {})

  return (
    <div style={{ minHeight: '100vh', padding: '0' }}>
      <StatusBar
        txCount={transactions.length}
        fetchError={fetchError}
        isLive={isLive}
        onToggleLive={() => setIsLive(v => !v)}
      />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 80px' }}>
        <Hero />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <EventSimulator
            isGenerating={isGenerating}
            onGenerate={generateEvent}
            lastEvent={lastEvent}
          />
          <EventFlowIndicator activeStep={flowStep} />
        </div>

        <TransactionFeed transactions={transactions} fetchError={fetchError} onRefresh={fetchTransactions} />

        <AnalyticsDashboard statusCounts={statusCounts} riskCounts={riskCounts} total={transactions.length} />
      </main>
    </div>
  )
}
