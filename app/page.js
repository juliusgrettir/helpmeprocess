'use client'
import { useState, useRef, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const YEARS = ['2014','2015','2016','2017','2018','2019','2020','2021','2022','2023']

function makeTrend(trendObj) {
  return YEARS.map(y => ({ year: y, value: trendObj?.[y] || 0 }))
}

function fmt(eur_m) {
  if (eur_m >= 1000) return `€${(eur_m / 1000).toFixed(1)}B`
  return `€${eur_m.toFixed(0)}M`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1e2433', border: '1px solid #2d3748', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: '#94a3b8', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#60a5fa', fontWeight: 500 }}>{fmt(payload[0].value)}</p>
    </div>
  )
}

function ChatPanel({ sector, chapter, product }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I\'m your French market analyst. Ask me anything about sectors, trade data, or business opportunities.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    const context = `You are a French market intelligence analyst. The user is viewing "${sector}"${chapter ? ` > "${chapter}"` : ''}${product ? ` > "${product}"` : ''}. Data is from Eurostat COMEXT. Be concise, data-driven, and actionable.`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: context,
          messages: messages.slice(1).concat({ role: 'user', content: userMsg }).map(m => ({
            role: m.role, content: m.text || m.content
          }))
        })
      })
      const data = await res.json()
      const reply = data.content?.[0]?.text || 'Sorry, could not get a response.'
      setMessages(prev => [...prev, { role: 'assistant', text: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e2433' }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0' }}>AI Market Analyst</p>
        <p style={{ fontSize: 11, color: '#4a5568', marginTop: 2 }}>
          {sector ? `${sector}${chapter ? ` › ${chapter}` : ''}${product ? ` › ${product}` : ''}` : 'Select a sector'}
        </p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%',
              background: m.role === 'user' ? '#2563eb' : '#1e2433',
              borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              padding: '10px 14px', fontSize: 13, color: '#e2e8f0', lineHeight: 1.6,
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 4, padding: '8px 0' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', background: '#4a5568',
                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`
              }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1e2433', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about this sector..."
          style={{
            flex: 1, background: '#1e2433', border: '1px solid #2d3748',
            borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#e2e8f0', outline: 'none',
          }}
        />
        <button onClick={send} disabled={loading} style={{
          background: '#2563eb', border: 'none', borderRadius: 8,
          padding: '8px 14px', color: '#fff', fontSize: 13, cursor: 'pointer',
          opacity: loading ? 0.5 : 1,
        }}>↑</button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [activeSectorId, setActiveSectorId] = useState(null)
  const [activeChapterId, setActiveChapterId] = useState(null)
  const [activeHs6, setActiveHs6] = useState(null)

  useEffect(() => {
    fetch('/latest.json')
      .then(r => r.json())
      .then(d => {
        setData(d)
        setActiveSectorId(d[0].id)
        setActiveChapterId(d[0].chapters[0].id)
        setActiveHs6(d[0].chapters[0].products[0].hs6)
      })
  }, [])

  const sector = data?.find(s => s.id === activeSectorId)
  const chapter = sector?.chapters.find(c => c.id === activeChapterId) || sector?.chapters[0]
  const product = chapter?.products.find(p => p.hs6 === activeHs6) || chapter?.products[0]
  const chartData = makeTrend(product?.trend)
  const topGrowing = data ? [...data].sort((a, b) => b.growth_pct - a.growth_pct).slice(0, 5) : []
  const topStats = data ? (() => {
    const sorted = [...data].sort((a, b) => b.growth_pct - a.growth_pct)
    const largest = [...data].sort((a, b) => b.total_eur_m - a.total_eur_m)
    const declining = [...data].filter(s => s.growth_pct < 0).sort((a, b) => a.growth_pct - b.growth_pct)
    const topProd = data.flatMap(s => s.chapters.flatMap(c => c.products)).sort((a, b) => b.growth_pct - a.growth_pct)[0]
    return [
      { label: 'Fastest growing', value: sorted[0]?.label, change: `+${sorted[0]?.growth_pct}%`, up: true },
      { label: 'Largest sector', value: largest[0]?.label, change: fmt(largest[0]?.total_eur_m), up: true },
      { label: 'Most declining', value: declining[0]?.label || 'None', change: `${declining[0]?.growth_pct || 0}%`, up: false },
      { label: 'Hottest product', value: topProd?.label, change: `+${topProd?.growth_pct}%`, up: true },
    ]
  })() : Array(4).fill({ label: 'Loading...', value: '...', change: '...', up: true })

  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0b0f1a', color: '#4a5568', fontSize: 14 }}>
      Loading French market data...
    </div>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0b0f1a', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' }}>

      {/* Sidebar */}
      <div style={{ width: 230, background: '#0f1420', borderRight: '1px solid #1e2433', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 20px 16px' }}>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>helpmeprocess</p>
          <p style={{ fontSize: 11, color: '#4a5568', marginTop: 2 }}>French Market Intelligence</p>
        </div>
        <div style={{ padding: '8px 12px', flex: 1, overflowY: 'auto' }}>
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#4a5568', padding: '4px 8px 8px' }}>Sectors</p>
          {data.map(s => (
            <button key={s.id} onClick={() => {
              setActiveSectorId(s.id)
              setActiveChapterId(s.chapters[0].id)
              setActiveHs6(s.chapters[0].products[0].hs6)
            }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 8, border: 'none',
              background: activeSectorId === s.id ? '#1e2d4a' : 'transparent',
              color: activeSectorId === s.id ? '#60a5fa' : '#94a3b8',
              cursor: 'pointer', marginBottom: 2, textAlign: 'left', fontSize: 13,
            }}>
              <span style={{ fontSize: 14 }}>{s.icon}</span>
              <span style={{ flex: 1, fontSize: 12 }}>{s.label}</span>
              <span style={{ fontSize: 11, color: s.growth_pct > 0 ? '#34d399' : '#f87171', flexShrink: 0 }}>
                {s.growth_pct > 0 ? '+' : ''}{s.growth_pct}%
              </span>
            </button>
          ))}
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1e2433' }}>
          <p style={{ fontSize: 11, color: '#4a5568' }}>Source: Eurostat COMEXT</p>
          <p style={{ fontSize: 11, color: '#4a5568', marginTop: 2 }}>2014–2023 · France imports</p>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{ padding: '14px 24px', borderBottom: '1px solid #1e2433', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>{sector?.label}</h1>
            <p style={{ fontSize: 12, color: '#4a5568', marginTop: 2 }}>
              {fmt(sector?.total_eur_m || 0)} total imports · {sector?.growth_pct > 0 ? '+' : ''}{sector?.growth_pct}% 10-year growth
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid #1e2433', flexShrink: 0 }}>
          {topStats.map((s, i) => (
            <div key={i} style={{ padding: '14px 20px', background: '#0f1420', borderRight: i < 3 ? '1px solid #1e2433' : 'none' }}>
              <p style={{ fontSize: 11, color: '#4a5568', marginBottom: 4 }}>{s.label}</p>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0', marginBottom: 2 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: s.up ? '#34d399' : '#f87171' }}>{s.up ? '↗' : '↘'} {s.change}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Chapters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {sector?.chapters.map(c => (
                <button key={c.id} onClick={() => {
                  setActiveChapterId(c.id)
                  setActiveHs6(c.products[0].hs6)
                }} style={{
                  padding: '6px 14px', borderRadius: 999, border: '1px solid',
                  borderColor: activeChapterId === c.id ? '#2563eb' : '#1e2433',
                  background: activeChapterId === c.id ? '#1e2d4a' : 'transparent',
                  color: activeChapterId === c.id ? '#60a5fa' : '#94a3b8',
                  fontSize: 12, cursor: 'pointer',
                }}>
                  {c.label}
                  <span style={{ marginLeft: 6, fontSize: 11, color: c.growth_pct > 0 ? '#34d399' : '#f87171' }}>
                    {c.growth_pct > 0 ? '+' : ''}{c.growth_pct}%
                  </span>
                </button>
              ))}
            </div>

            {/* Chart */}
            <div style={{ background: '#0f1420', border: '1px solid #1e2433', borderRadius: 12, padding: '20px 20px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>{product?.label}</p>
                  <p style={{ fontSize: 12, color: '#4a5568', marginTop: 2 }}>France imports · HS {product?.hs6} · 2014–2023</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 24, fontWeight: 600, color: (product?.growth_pct || 0) > 0 ? '#34d399' : '#f87171' }}>
                    {(product?.growth_pct || 0) > 0 ? '+' : ''}{product?.growth_pct}%
                  </p>
                  <p style={{ fontSize: 11, color: '#4a5568' }}>{fmt(product?.latest_eur_m || 0)} in 2023</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2433" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#4a5568' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#4a5568' }} axisLine={false} tickLine={false} tickFormatter={v => fmt(v)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} fill="url(#grad)" dot={false} activeDot={{ r: 4, fill: '#2563eb' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Products grid */}
            <div>
              <p style={{ fontSize: 11, color: '#4a5568', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Products in {chapter?.label} — click to view trend
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                {chapter?.products.map(p => (
                  <button key={p.hs6} onClick={() => setActiveHs6(p.hs6)} style={{
                    background: activeHs6 === p.hs6 ? '#1e2d4a' : '#0f1420',
                    border: `1px solid ${activeHs6 === p.hs6 ? '#2563eb' : '#1e2433'}`,
                    borderRadius: 10, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <p style={{ fontSize: 12, fontWeight: 500, color: '#e2e8f0', lineHeight: 1.3, flex: 1, marginRight: 8 }}>{p.label}</p>
                      <span style={{
                        fontSize: 11, padding: '2px 6px', borderRadius: 999, flexShrink: 0,
                        background: p.growth_pct > 20 ? '#052e16' : p.growth_pct > 0 ? '#1a2e1a' : '#2d1a1a',
                        color: p.growth_pct > 20 ? '#34d399' : p.growth_pct > 0 ? '#86efac' : '#f87171',
                      }}>{p.growth_pct > 0 ? '+' : ''}{p.growth_pct}%</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#4a5568' }}>{fmt(p.latest_eur_m)} · HS {p.hs6}</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 20, marginTop: 8 }}>
                      {Object.values(p.trend).map((v, i, arr) => (
                        <div key={i} style={{
                          flex: 1, height: `${Math.max((v / Math.max(...arr, 1)) * 100, 4)}%`,
                          background: p.growth_pct > 0 ? '#1d4ed8' : '#991b1b',
                          borderRadius: 2, opacity: 0.3 + (i / arr.length) * 0.7,
                        }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Top 5 growing */}
            <div style={{ background: '#0f1420', border: '1px solid #1e2433', borderRadius: 12, padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: '#e2e8f0', marginBottom: 14 }}>Top 5 growing sectors in France</p>
              {topGrowing.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: '#4a5568', width: 16, textAlign: 'right' }}>{i + 1}</span>
                  <span style={{ fontSize: 14 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, color: '#e2e8f0', flex: 1 }}>{s.label}</span>
                  <span style={{ fontSize: 12, color: '#4a5568' }}>{fmt(s.total_eur_m)}</span>
                  <div style={{ width: 80, height: 4, background: '#1e2433', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(s.growth_pct / topGrowing[0].growth_pct) * 100}%`, background: '#2563eb', borderRadius: 999 }} />
                  </div>
                  <span style={{ fontSize: 12, color: '#34d399', width: 52, textAlign: 'right' }}>+{s.growth_pct}%</span>
                </div>
              ))}
            </div>

          </div>

          {/* Chat */}
          <div style={{ width: 280, borderLeft: '1px solid #1e2433', background: '#0f1420', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <ChatPanel
              sector={sector?.label}
              chapter={chapter?.label}
              product={product?.label}
            />
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,60%,100%{transform:scale(1);opacity:.4} 30%{transform:scale(1.4);opacity:1} }`}</style>
    </div>
  )
}