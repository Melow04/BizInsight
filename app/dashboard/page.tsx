'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  DollarSign, TrendingUp, TrendingDown, Package,
  AlertTriangle, ShoppingCart, Lightbulb, ArrowUpRight,
} from 'lucide-react';

interface Analytics {
  totalRevenue: number;
  totalCOGS: number;
  grossProfit: number;
  totalExpenses: number;
  netProfit: number;
  grossMargin: number;
  netMargin: number;
  revenueByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  productProfits: Array<{ name: string; revenue: number; profit: number; margin: number }>;
  monthlyTrend: Array<{ month: string; revenue: number; expenses: number; profit: number }>;
  productCount: number;
  expenseCount: number;
  lowStockCount: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#f97316'];

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;

const fmtFull = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);

function StatCard({
  label, value, sub, icon: Icon, trend, color,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  color: string;
}) {
  return (
    <div className="stat-card animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{
          width: 44, height: 44,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={color} />
        </div>
        {trend && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '12px', fontWeight: 600,
            color: trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#94a3b8',
          }}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : null}
            vs last month
          </div>
        )}
      </div>
      <div style={{ fontSize: '26px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.5px', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: '12px', color: color, marginTop: '4px', fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0f1828', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '10px', padding: '12px 16px', fontSize: '13px',
    }}>
      <p style={{ color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color, margin: '2px 0' }}>
          {p.name}: {fmtFull(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(data => { setAnalytics(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: '#6366f1', fontSize: '16px' }}>Loading analytics…</div>
      </div>
    );
  }

  if (!analytics) return null;

  const categoryData = Object.entries(analytics.revenueByCategory).map(([name, value]) => ({ name, value }));
  const expCategoryData = Object.entries(analytics.expensesByCategory).map(([name, value]) => ({ name, value }));
  const top5Products = analytics.productProfits.slice(0, 5);

  return (
    <div className="p-[20px] md:p-[36px_40px] max-w-[1400px] w-full mx-auto">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Business Dashboard</h1>
        <p className="page-subtitle">Real-time financial overview and performance analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[32px]">
        <StatCard
          label="Total Revenue"
          value={fmtFull(analytics.totalRevenue)}
          icon={DollarSign}
          trend="up"
          color="#6366f1"
        />
        <StatCard
          label="Net Profit"
          value={fmtFull(analytics.netProfit)}
          sub={`${analytics.netMargin.toFixed(1)}% net margin`}
          icon={TrendingUp}
          trend={analytics.netProfit >= 0 ? 'up' : 'down'}
          color={analytics.netProfit >= 0 ? '#10b981' : '#ef4444'}
        />
        <StatCard
          label="Total Expenses"
          value={fmtFull(analytics.totalExpenses)}
          sub={`${analytics.expenseCount} line items`}
          icon={ShoppingCart}
          color="#f59e0b"
        />
        <StatCard
          label="Gross Margin"
          value={`${analytics.grossMargin.toFixed(1)}%`}
          sub={`${analytics.productCount} products tracked`}
          icon={Package}
          color="#06b6d4"
        />
      </div>

      {/* Alert Banner */}
      {analytics.lowStockCount > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '12px', padding: '14px 20px', marginBottom: '28px',
        }}>
          <AlertTriangle size={18} color="#f59e0b" />
          <span style={{ fontSize: '14px', color: '#f59e0b', fontWeight: 500 }}>
            {analytics.lowStockCount} product{analytics.lowStockCount > 1 ? 's' : ''} running low on inventory — action required
          </span>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px] mb-[20px]">
        {/* Revenue Trend */}
        <div className="card lg:col-span-2 p-[20px] md:p-[24px]">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-[12px] mb-[24px]">
            <div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9' }}>Revenue vs Expenses Trend</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>Last 6 months</div>
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
              {[
                { color: '#6366f1', label: 'Revenue' },
                { color: '#ef4444', label: 'Expenses' },
                { color: '#10b981', label: 'Net Profit' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={analytics.monthlyTrend}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" fill="url(#gradRevenue)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10b981" fill="url(#gradProfit)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category Pie */}
        <div className="card lg:col-span-1 p-[20px] md:p-[24px]">
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Revenue by Category</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Product mix breakdown</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(val: number) => [fmtFull(val), 'Revenue']}
                contentStyle={{ background: '#0f1828', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
            {categoryData.slice(0, 4).map((item, i) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <span style={{ color: '#94a3b8' }}>{item.name}</span>
                </div>
                <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{fmtFull(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        {/* Top Products by Profit */}
        <div className="card p-[20px] md:p-[24px]">
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Top Products by Profit</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Gross profit contribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={top5Products} layout="vertical" barSize={12}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="profit" name="Gross Profit" radius={[0, 4, 4, 0]}>
                {top5Products.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expenses Breakdown */}
        <div className="card p-[20px] md:p-[24px]">
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>Expense Breakdown</div>
          <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Monthly expenses by category</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={expCategoryData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                {expCategoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="card flex flex-col md:flex-row gap-[16px] md:gap-[24px] items-start md:items-center p-[20px] md:p-[24px] mt-[20px]">
        <Lightbulb size={24} color="#6366f1" className="shrink-0 hidden md:block" />
        <div>
          <div className="flex items-center gap-[8px]">
            <Lightbulb size={18} color="#6366f1" className="shrink-0 md:hidden" />
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#f1f5f9' }}>Quick Insight</div>
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            Your gross margin is <strong style={{ color: '#6366f1' }}>{analytics.grossMargin.toFixed(1)}%</strong> and net margin is{' '}
            <strong style={{ color: analytics.netMargin >= 10 ? '#10b981' : '#f59e0b' }}>{analytics.netMargin.toFixed(1)}%</strong>.
            {analytics.netMargin < 10
              ? ' Focus on reducing fixed costs or increasing prices to hit the 10% target.'
              : ' Great job — keep optimizing your top-performing products.'}
          </div>
        </div>
        <a
          href="/recommendations"
          className="md:ml-auto w-full md:w-auto text-center shrink-0 px-[20px] py-[10px] bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white rounded-[8px] text-[13px] font-semibold no-underline whitespace-nowrap"
        >
          View Recommendations
        </a>
      </div>
    </div>
  );
}
