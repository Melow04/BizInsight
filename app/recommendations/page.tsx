'use client';

import { useEffect, useState } from 'react';
import {
  Lightbulb, AlertTriangle, AlertCircle, Info,
  TrendingUp, Package, DollarSign, BarChart2, RefreshCw,
} from 'lucide-react';

type Priority = 'high' | 'medium' | 'low';
type RecCategory = 'pricing' | 'inventory' | 'expenses' | 'profitability';

interface Recommendation {
  id: string;
  priority: Priority;
  title: string;
  description: string;
  action: string;
  impact: string;
  category: RecCategory;
}

const PRIORITY_CONFIG = {
  high: {
    label: 'High Priority',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.2)',
    icon: AlertTriangle,
    badgeClass: 'badge-danger',
  },
  medium: {
    label: 'Medium Priority',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.2)',
    icon: AlertCircle,
    badgeClass: 'badge-warning',
  },
  low: {
    label: 'Low Priority',
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.2)',
    icon: Info,
    badgeClass: 'badge-primary',
  },
};

const CATEGORY_CONFIG: Record<RecCategory, { label: string; icon: React.ElementType; color: string }> = {
  pricing: { label: 'Pricing', icon: DollarSign, color: '#10b981' },
  inventory: { label: 'Inventory', icon: Package, color: '#06b6d4' },
  expenses: { label: 'Expenses', icon: BarChart2, color: '#f59e0b' },
  profitability: { label: 'Profitability', icon: TrendingUp, color: '#6366f1' },
};

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Priority | 'all'>('all');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const load = () =>
    fetch('/api/recommendations')
      .then(r => r.json())
      .then(data => { setRecommendations(data); setLoading(false); });

  useEffect(() => { load(); }, []);

  const handleRefresh = () => {
    setLoading(true);
    setDismissed(new Set());
    load();
  };

  const visible = recommendations.filter(r =>
    !dismissed.has(r.id) && (filter === 'all' || r.priority === filter)
  );

  const counts = {
    all: recommendations.filter(r => !dismissed.has(r.id)).length,
    high: recommendations.filter(r => r.priority === 'high' && !dismissed.has(r.id)).length,
    medium: recommendations.filter(r => r.priority === 'medium' && !dismissed.has(r.id)).length,
    low: recommendations.filter(r => r.priority === 'low' && !dismissed.has(r.id)).length,
  };

  return (
    <div style={{ padding: '36px 40px', maxWidth: '1000px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <h1 className="page-title">AI Recommendations</h1>
          <p className="page-subtitle">Rule-based insights to grow your business profitability</p>
        </div>
        <button className="btn-secondary" onClick={handleRefresh} style={{ gap: '8px' }}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* How It Works Banner */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '14px',
        background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: '12px', padding: '16px 20px', margin: '20px 0 28px',
      }}>
        <Lightbulb size={20} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
          <strong style={{ color: '#a5b4fc' }}>How recommendations work:</strong>{' '}
          Our engine continuously analyzes your product margins, inventory levels, expense ratios, and overall profitability using
          business best-practice rules. Recommendations update automatically as you add or edit products and expenses.
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { key: 'all', label: 'Total', color: '#94a3b8' },
          { key: 'high', label: 'High', color: '#ef4444' },
          { key: 'medium', label: 'Medium', color: '#f59e0b' },
          { key: 'low', label: 'Low', color: '#6366f1' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            id={`filter-${key}`}
            onClick={() => setFilter(key as Priority | 'all')}
            style={{
              padding: '16px', borderRadius: '12px', cursor: 'pointer', border: 'none', textAlign: 'left',
              background: filter === key ? `${color}18` : 'rgba(255,255,255,0.03)',
              borderColor: filter === key ? `${color}40` : 'rgba(255,255,255,0.07)',
              borderWidth: '1px', borderStyle: 'solid',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ fontSize: '26px', fontWeight: 700, color: filter === key ? color : '#f1f5f9' }}>
              {counts[key as keyof typeof counts]}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{label} Priority</div>
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Generating recommendations…</div>
      ) : visible.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🎉</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9', marginBottom: '8px' }}>
            {dismissed.size > 0 ? 'All caught up!' : 'No recommendations for this filter'}
          </div>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            {dismissed.size > 0
              ? "You've reviewed all recommendations. Great work!"
              : 'Add more products and expenses to generate insights.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {visible.map((rec, i) => {
            const pConfig = PRIORITY_CONFIG[rec.priority];
            const cConfig = CATEGORY_CONFIG[rec.category];
            const PIcon = pConfig.icon;
            const CIcon = cConfig.icon;

            return (
              <div
                key={rec.id}
                id={`rec-${rec.id}`}
                className="animate-in"
                style={{
                  background: pConfig.bg,
                  border: `1px solid ${pConfig.border}`,
                  borderRadius: '16px',
                  padding: '24px',
                  animationDelay: `${i * 0.05}s`,
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '10px',
                      background: `${pConfig.color}20`,
                      border: `1px solid ${pConfig.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <PIcon size={18} color={pConfig.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9' }}>{rec.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span className={`badge ${pConfig.badgeClass}`}>{pConfig.label}</span>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          fontSize: '11px', color: cConfig.color, fontWeight: 600,
                        }}>
                          <CIcon size={12} /> {cConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDismissed(d => new Set([...d, rec.id]))}
                    style={{
                      padding: '5px 14px', background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px',
                      color: '#64748b', fontSize: '12px', cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    Dismiss
                  </button>
                </div>

                {/* Description */}
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '16px' }}>
                  {rec.description}
                </p>

                {/* Action + Impact */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{
                    padding: '14px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Recommended Action
                    </div>
                    <div style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.5 }}>{rec.action}</div>
                  </div>
                  <div style={{
                    padding: '14px', background: 'rgba(16,185,129,0.05)',
                    border: '1px solid rgba(16,185,129,0.1)', borderRadius: '10px',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Potential Impact
                    </div>
                    <div style={{ fontSize: '13px', color: '#10b981', lineHeight: 1.5, fontWeight: 500 }}>{rec.impact}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
