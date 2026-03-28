'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Receipt, Search, RefreshCw } from 'lucide-react';

type ExpenseCategory = 'Rent' | 'Utilities' | 'Payroll' | 'Marketing' | 'Inventory' | 'Equipment' | 'Insurance' | 'Other';

interface Expense {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  recurring: boolean;
  createdAt: string;
}

const CATEGORIES: ExpenseCategory[] = ['Rent', 'Utilities', 'Payroll', 'Marketing', 'Inventory', 'Equipment', 'Insurance', 'Other'];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Rent: '#6366f1', Utilities: '#06b6d4', Payroll: '#8b5cf6', Marketing: '#f59e0b',
  Inventory: '#10b981', Equipment: '#f97316', Insurance: '#64748b', Other: '#94a3b8',
};

const defaultForm = {
  name: '', category: 'Other' as ExpenseCategory,
  amount: '', date: new Date().toISOString().split('T')[0], recurring: false,
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'All'>('All');
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch('/api/expenses').then(r => r.json()).then(data => { setExpenses(data); setLoading(false); });

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditExpense(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (e: Expense) => {
    setEditExpense(e);
    setForm({ name: e.name, category: e.category, amount: String(e.amount), date: e.date, recurring: e.recurring });
    setShowModal(true);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSaving(true);
    const body = {
      ...(editExpense ? { id: editExpense.id } : {}),
      name: form.name, category: form.category,
      amount: Number(form.amount), date: form.date, recurring: form.recurring,
    };
    await fetch('/api/expenses', {
      method: editExpense ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    await load();
    setShowModal(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
    await load();
  };

  const filtered = expenses.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || e.category === filterCategory;
    return matchSearch && matchCat;
  });

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const recurringTotal = expenses.filter(e => e.recurring).reduce((s, e) => s + e.amount, 0);
  const oneTimeTotal = expenses.filter(e => !e.recurring).reduce((s, e) => s + e.amount, 0);

  // Category totals
  const byCategory = CATEGORIES.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).sort((a, b) => b.total - a.total);

  return (
    <div style={{ padding: '36px 40px', maxWidth: '1300px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div className="page-header" style={{ margin: 0 }}>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Track and categorize your business expenses</p>
        </div>
        <button id="add-expense-btn" className="btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Expenses', value: fmt(total), color: '#ef4444', icon: Receipt },
          { label: 'Fixed / Recurring', value: fmt(recurringTotal), sub: `${((recurringTotal / total) * 100).toFixed(0)}% of total`, color: '#f59e0b', icon: RefreshCw },
          { label: 'One-Time Costs', value: fmt(oneTimeTotal), sub: `${((oneTimeTotal / total) * 100).toFixed(0)}% of total`, color: '#6366f1', icon: Receipt },
        ].map(({ label, value, sub, color, icon: Icon }) => (
          <div key={label} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 40, height: 40, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{label}</div>
              {sub && <div style={{ fontSize: '11px', color: color, marginTop: '2px' }}>{sub}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Category breakdown mini bars */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ fontWeight: 600, color: '#94a3b8', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '11px' }}>
          Expense Distribution by Category
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {byCategory.filter(b => b.total > 0).map(({ cat, total: catTotal }) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '100px', fontSize: '12px', color: '#94a3b8', flexShrink: 0 }}>{cat}</div>
              <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '3px',
                  width: `${(catTotal / total * 100).toFixed(1)}%`,
                  background: CATEGORY_COLORS[cat],
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <div style={{ width: '80px', fontSize: '12px', color: '#f1f5f9', fontWeight: 600, textAlign: 'right' }}>{fmt(catTotal)}</div>
              <div style={{ width: '40px', fontSize: '11px', color: '#475569', textAlign: 'right' }}>
                {total > 0 ? (catTotal / total * 100).toFixed(0) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
          <input id="expense-search" className="form-input" style={{ paddingLeft: '40px' }} placeholder="Search expenses…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select
          id="expense-category-filter"
          className="form-input"
          style={{ width: 'auto' }}
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value as ExpenseCategory | 'All')}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading expenses…</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Expense</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
                      borderRadius: '999px', fontSize: '11px', fontWeight: 600,
                      background: `${CATEGORY_COLORS[e.category]}18`,
                      color: CATEGORY_COLORS[e.category],
                      border: `1px solid ${CATEGORY_COLORS[e.category]}30`,
                    }}>{e.category}</span>
                  </td>
                  <td style={{ color: '#f1f5f9', fontWeight: 600 }}>{fmt(e.amount)}</td>
                  <td>{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td>
                    {e.recurring
                      ? <span className="badge badge-warning"><RefreshCw size={10} style={{ display: 'inline', marginRight: '4px' }} />Recurring</span>
                      : <span className="badge badge-info">One-Time</span>
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        id={`edit-expense-${e.id}`}
                        onClick={() => openEdit(e)}
                        style={{
                          padding: '6px 12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                          borderRadius: '6px', color: '#6366f1', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button id={`delete-expense-${e.id}`} className="btn-danger" onClick={() => handleDelete(e.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#475569' }}>No expenses found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={ev => ev.target === ev.currentTarget && setShowModal(false)}>
          <div className="modal-content">
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '24px' }}>
              {editExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Expense Name *</label>
                <input id="expense-name" className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Office Rent" />
              </div>
              <div>
                <label className="form-label">Category *</label>
                <select id="expense-category" className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ExpenseCategory }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">Amount ($) *</label>
                  <input id="expense-amount" className="form-input" type="number" step="0.01" min="0" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
                </div>
                <div>
                  <label className="form-label">Date *</label>
                  <input id="expense-date" className="form-input" type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  id="expense-recurring"
                  type="checkbox"
                  checked={form.recurring}
                  onChange={e => setForm(f => ({ ...f, recurring: e.target.checked }))}
                  style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
                />
                <label htmlFor="expense-recurring" style={{ fontSize: '14px', color: '#94a3b8', cursor: 'pointer' }}>
                  This is a recurring monthly expense
                </label>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button id="submit-expense-btn" className="btn-primary" type="submit" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Saving…' : editExpense ? 'Update Expense' : 'Add Expense'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
