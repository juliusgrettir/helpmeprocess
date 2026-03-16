'use client'
import { useState } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const petFoodTrend = [
  { year: '2019', value: 41.8 },
  { year: '2020', value: 46.7 },
  { year: '2021', value: 52.3 },
  { year: '2022', value: 64.0 },
  { year: '2023', value: 74.0 },
]

const biocharTrend = [
  { year: '2019', value: 292 },
  { year: '2020', value: 311 },
  { year: '2021', value: 341 },
  { year: '2022', value: 467 },
  { year: '2023', value: 491 },
]

const petFoodSuppliers = [
  { name: 'USA', value: 31 },
  { name: 'UK', value: 22 },
  { name: 'Denmark', value: 18 },
  { name: 'Germany', value: 14 },
  { name: 'Other', value: 15 },
]

const opportunities = [
  {
    id: 'petfood',
    tag: 'Iceland · Food production',
    title: 'Premium fish-based pet food',
    subtitle: 'Turning Icelandic fish byproduct waste into premium European pet treats',
    score: 9.1,
    budget: '€30–50k',
    color: '#0F6E56',
    lightColor: '#E1F5EE',
    metric: '€74M',
    metricLabel: 'Iceland pet food imports 2023',
    growth: '+77% since 2019',
    trend: petFoodTrend,
    trendLabel: 'Iceland pet food imports (€M)',
    suppliers: petFoodSuppliers,
    suppliersLabel: 'Current import sources',
    pros: [
      'Raw material is fish byproduct — near free',
      '77% import growth in 4 years, no signs of slowing',
      '"Made in Iceland" commands strong premium in EU',
      'Geothermal drying = near-zero energy cost',
      'EEA membership = zero tariff export to EU',
    ],
    cons: [
      'EU food safety certification required (~6 months)',
      'US competitors already established (Icelandic+, Gunni\'s)',
      'EU distribution network takes time to build',
    ],
    plan: [
      'Contact 3 Icelandic fish processors — secure free byproduct supply',
      'Build small geothermal drying unit — €15-25k equipment',
      'Apply for EU pet food certification — €5-10k, 3-6 months',
      'Target French & German premium pet stores as first buyers',
      'Scale to private label once volume is proven',
    ],
    insight: 'Existing Icelandic players (Gunni\'s, Pure Iceland Pet, Icelandic+) all target North America. Continental Europe is wide open.',
  },
  {
    id: 'biochar',
    tag: 'France / Iceland · Industrial',
    title: 'Activated carbon & biochar',
    subtitle: 'Wood waste converted to high-value activated carbon for water treatment, food, pharma',
    score: 7.8,
    budget: '€35–55k',
    color: '#185FA5',
    lightColor: '#E6F1FB',
    metric: '€491M',
    metricLabel: 'France activated carbon imports 2023',
    growth: '+68% since 2019',
    trend: biocharTrend,
    trendLabel: 'France activated carbon imports (€M)',
    suppliers: [
      { name: 'Belgium', value: 21 },
      { name: 'China', value: 8 },
      { name: 'Germany', value: 5 },
      { name: 'Netherlands', value: 5 },
      { name: 'India', value: 3 },
    ],
    suppliersLabel: 'France import sources',
    pros: [
      'France imports €491M/year, growing 68% in 4 years',
      'Raw material (wood waste) often free from sawmills',
      'EU policy actively subsidising biochar in agriculture',
      'B2B sales only — no consumer marketing needed',
      'Geothermal pyrolysis in Iceland = lowest energy cost in Europe',
    ],
    cons: [
      'Food/pharma grade certification expensive and slow',
      'Established Asian producers compete hard on price',
      'Pyrolysis unit requires technical knowledge to operate',
    ],
    plan: [
      'Source small pyrolysis unit — €15-25k for 1-2 tonne/day',
      'Secure wood waste supply from local forestry or sawmills',
      'Start with agricultural grade (lower cert bar) — sell to vineyards',
      'Build direct B2B relationships with French wine cooperatives',
      'Upgrade to food/pharma grade once cash flow established',
    ],
    insight: 'France re-exports €82M of activated carbon to Italy, Spain and Germany — there are French trading companies in this chain. They are potential distribution partners.',
  },
  {
    id: 'condiments',
    tag: 'Iceland · Food production',
    title: 'Specialty sauces & condiments',
    subtitle: 'Iceland imports €103M of sauces annually with no dominant domestic producer',
    score: 6.4,
    budget: '€10–20k',
    color: '#854F0B',
    lightColor: '#FAEEDA',
    metric: '€103M',
    metricLabel: 'Iceland condiment imports 2023',
    growth: 'No local producer',
    trend: [
      { year: '2019', value: 78 },
      { year: '2020', value: 84 },
      { year: '2021', value: 91 },
      { year: '2022', value: 98 },
      { year: '2023', value: 103 },
    ],
    trendLabel: 'Iceland condiment imports (€M)',
    suppliers: [
      { name: 'UK/Ireland', value: 38 },
      { name: 'USA', value: 22 },
      { name: 'Germany', value: 15 },
      { name: 'Other EU', value: 25 },
    ],
    suppliersLabel: 'Import sources',
    pros: [
      '€103M imported into a market of 390,000 people',
      'Lowest capital requirement — kitchen-scale to start',
      'Tourism creates captive premium buyer in Reykjavik',
      'Unique Icelandic ingredients: crowberries, seaweed, skyr, lamb',
      'Easy to test at farmers markets before investing',
    ],
    cons: [
      'Highly competitive category globally',
      'Most base ingredients still need to be imported',
      'Small domestic market limits scale without export focus',
    ],
    plan: [
      'Develop 2-3 recipes using unique Icelandic ingredients',
      'Register small food production unit — €5-10k setup',
      'Sell direct to Reykjavik restaurants and tourist shops',
      'Export to Scandinavian specialty food retailers',
      'Build DTC online store targeting European market',
    ],
    insight: 'The "Made in Iceland" brand story is completely unused in this category. Clean water, volcanic soil, Nordic heritage — a product story that writes itself.',
  },
]

const CustomTooltip = ({ active, payload, label, color }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
        color: '#111',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <p style={{ color: '#888', marginBottom: 2 }}>{label}</p>
        <p style={{ fontWeight: 500, color: color }}>€{payload[0].value}M</p>
      </div>
    )
  }
  return null
}

function OpportunityCard({ opp }) {
  const [tab, setTab] = useState('overview')

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 32,
      fontFamily: '"DM Sans", system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '28px 32px 20px',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
      }}>
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#9ca3af',
            marginBottom: 8,
          }}>{opp.tag}</p>
          <h2 style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: 400,
            color: '#111',
            marginBottom: 8,
            lineHeight: 1.2,
          }}>{opp.title}</h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{opp.subtitle}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: 40, fontWeight: 500, color: opp.color, lineHeight: 1 }}>{opp.score}</p>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginTop: 4 }}>score /10</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #f3f4f6',
        padding: '0 32px',
      }}>
        {['overview', 'data', 'plan'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            fontSize: 13,
            padding: '12px 16px 12px 0',
            marginRight: 24,
            background: 'none',
            border: 'none',
            borderBottom: tab === t ? `2px solid ${opp.color}` : '2px solid transparent',
            color: tab === t ? opp.color : '#9ca3af',
            cursor: 'pointer',
            textTransform: 'capitalize',
            fontFamily: 'inherit',
            fontWeight: tab === t ? 500 : 400,
            transition: 'all 0.15s',
          }}>{t}</button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '24px 32px 28px' }}>

        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 12 }}>Why this works</p>
              {opp.pros.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: opp.lightColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 9, color: opp.color }}>▲</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{p}</p>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 12 }}>Challenges</p>
              {opp.cons.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 9, color: '#ef4444' }}>▼</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{c}</p>
                </div>
              ))}
              <div style={{
                marginTop: 20,
                padding: '14px 16px',
                background: opp.lightColor,
                borderRadius: 10,
                borderLeft: `3px solid ${opp.color}`,
              }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: opp.color, marginBottom: 4 }}>Key insight</p>
                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{opp.insight}</p>
              </div>
            </div>
          </div>
        )}

        {tab === 'data' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 32, fontWeight: 500, color: opp.color }}>{opp.metric}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>{opp.metricLabel}</p>
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 500, color: '#111' }}>{opp.growth}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>trend</p>
                </div>
              </div>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 12 }}>{opp.trendLabel}</p>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={opp.trend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id={`grad-${opp.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={opp.color} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={opp.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip color={opp.color} />} />
                  <Area type="monotone" dataKey="value" stroke={opp.color} strokeWidth={2} fill={`url(#grad-${opp.id})`} dot={{ fill: opp.color, r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 12 }}>{opp.suppliersLabel} (%)</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={opp.suppliers} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip formatter={v => [`${v}%`, 'Share']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {opp.suppliers.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? opp.color : '#e5e7eb'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 12, lineHeight: 1.6 }}>
                Source: Eurostat COMEXT DS-059341 · 2023 annual figures
              </p>
            </div>
          </div>
        )}

        {tab === 'plan' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 16 }}>Step by step</p>
              {opp.plan.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: i === 0 ? opp.color : '#f3f4f6',
                    color: i === 0 ? '#fff' : '#9ca3af',
                    fontSize: 11, fontWeight: 500,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>{i + 1}</div>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, paddingTop: 3 }}>{step}</p>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 16 }}>Budget breakdown</p>
              <div style={{
                background: '#f9fafb',
                borderRadius: 12,
                padding: '20px 20px',
              }}>
                <p style={{ fontSize: 36, fontWeight: 500, color: opp.color }}>{opp.budget}</p>
                <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>estimated starting capital</p>
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7 }}>
                    This estimate covers initial equipment, certifications, and 3 months working capital.
                    Raw material costs are near-zero in all three scenarios due to byproduct sourcing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <main style={{
      maxWidth: 900,
      margin: '0 auto',
      padding: '0 24px 80px',
      fontFamily: '"DM Sans", system-ui, sans-serif',
      background: '#fafafa',
      minHeight: '100vh',
    }}>

      {/* Nav */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 0',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: 56,
      }}>
        <p style={{ fontSize: 15, fontWeight: 500, color: '#111' }}>helpmeprocess.com</p>
        <p style={{ fontSize: 12, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Venture thesis · Iceland × Europe</p>
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 64 }}>
        <p style={{
          fontSize: 11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#9ca3af',
          marginBottom: 16,
        }}>Data-backed physical product opportunities</p>
        <h1 style={{
          fontFamily: '"DM Serif Display", Georgia, serif',
          fontSize: 'clamp(2.2rem, 6vw, 4rem)',
          fontWeight: 400,
          lineHeight: 1.1,
          color: '#111',
          marginBottom: 24,
        }}>
          What Europe needs.<br />
          <span style={{ color: '#0F6E56', fontStyle: 'italic' }}>Iceland can make.</span>
        </h1>
        <p style={{
          fontSize: 16,
          color: '#6b7280',
          maxWidth: 580,
          lineHeight: 1.8,
        }}>
          Three physical product opportunities identified through European trade data.
          Each backed by Eurostat import figures, ingredient analysis, and a realistic path to first revenue.
        </p>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12,
        marginBottom: 56,
      }}>
        {[
          { label: 'Iceland pet food imports', value: '€74M', change: '+77% in 4 years' },
          { label: 'France activated carbon', value: '€491M', change: '+68% in 4 years' },
          { label: 'Iceland condiment imports', value: '€103M', change: 'No local producer' },
          { label: 'Min. starting capital', value: '€10k', change: 'Condiments opportunity' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            padding: '16px 20px',
          }}>
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 24, fontWeight: 500, color: '#111' }}>{s.value}</p>
            <p style={{ fontSize: 12, color: '#0F6E56', marginTop: 4 }}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Section label */}
      <p style={{
        fontSize: 11,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#9ca3af',
        marginBottom: 24,
        paddingBottom: 12,
        borderBottom: '1px solid #e5e7eb',
      }}>Ranked opportunities</p>

      {/* Cards */}
      {opportunities.map(opp => <OpportunityCard key={opp.id} opp={opp} />)}

      {/* Methodology */}
      <div style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 16,
        padding: '24px 32px',
        marginTop: 16,
      }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: 12 }}>Methodology</p>
        <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8, maxWidth: 640 }}>
          All import figures sourced from Eurostat COMEXT dataset DS-059341 via REST API.
          Opportunity scores weight import volume (30%), growth trend (25%), raw material
          availability in Iceland (25%), and capital requirement (20%).
          Data reflects 2023 annual figures. Competitor analysis sourced from public company databases.
        </p>
      </div>

    </main>
  )
}