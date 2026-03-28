'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, Search, TrendingUp, TrendingDown } from 'lucide-react';

type Category = 'Food & Beverage' | 'Electronics' | 'Clothing' | 'Home & Garden' | 'Health & Beauty' | 'Services' | 'Other';

interface Product {
  id: string;
  name: string;
  category: Category;
  unitCost: number;
  sellingPrice: number;
  unitsSold: number;
  stock: number;
  createdAt: string;
}

const CATEGORIES: Category[] = ['Food & Beverage', 'Electronics', 'Clothing', 'Home & Garden', 'Health & Beauty', 'Services', 'Other'];

const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

const defaultForm = {
  name: '', category: 'Other' as Category,
  unitCost: '', sellingPrice: '', unitsSold: '', stock: '',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch('/api/products').then(r => r.json()).then(data => { setProducts(data); setLoading(false); });

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditProduct(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({
      name: p.name, category: p.category,
      unitCost: String(p.unitCost), sellingPrice: String(p.sellingPrice),
      unitsSold: String(p.unitsSold), stock: String(p.stock),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...(editProduct ? { id: editProduct.id } : {}),
      name: form.name,
      category: form.category,
      unitCost: Number(form.unitCost),
      sellingPrice: Number(form.sellingPrice),
      unitsSold: Number(form.unitsSold),
      stock: Number(form.stock),
    };
    await fetch('/api/products', {
      method: editProduct ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    await load();
    setShowModal(false);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    await load();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = products.reduce((s, p) => s + p.sellingPrice * p.unitsSold, 0);
  const totalProfit = products.reduce((s, p) => s + (p.sellingPrice - p.unitCost) * p.unitsSold, 0);

  return (
    <div className="p-[20px] md:p-[36px_40px] max-w-[1300px] w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-[16px] mb-[32px]">
        <div className="page-header" style={{ margin: 0 }}>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage your product catalog and track profitability</p>
        </div>
        <button id="add-product-btn" className="btn-primary w-full sm:w-auto justify-center" onClick={openAdd}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] mb-[28px]">
        {[
          { label: 'Products Tracked', value: String(products.length), color: '#6366f1', icon: Package },
          { label: 'Total Revenue', value: fmt(totalRevenue), color: '#10b981', icon: TrendingUp },
          { label: 'Total Gross Profit', value: fmt(totalProfit), color: '#06b6d4', icon: TrendingUp },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 40, height: 40, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={18} color={color} />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>{value}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-[360px] mb-[20px]">
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
        <input
          id="product-search"
          className="form-input"
          style={{ paddingLeft: '40px' }}
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card w-full overflow-x-auto">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading products…</div>
        ) : (
          <div className="min-w-[800px]">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Unit Cost</th>
                  <th>Selling Price</th>
                  <th>Margin</th>
                  <th>Units Sold</th>
                  <th>Stock</th>
                  <th>Revenue</th>
                  <th>Gross Profit</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const margin = p.sellingPrice > 0
                    ? ((p.sellingPrice - p.unitCost) / p.sellingPrice * 100)
                    : 0;
                  const profit = (p.sellingPrice - p.unitCost) * p.unitsSold;
                  const revenue = p.sellingPrice * p.unitsSold;
                  const isLowStock = p.stock < 10 && p.category !== 'Services';
                  return (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>
                        <span className="badge badge-primary">{p.category}</span>
                      </td>
                      <td>{fmt(p.unitCost)}</td>
                      <td>{fmt(p.sellingPrice)}</td>
                      <td>
                        <span style={{
                          fontWeight: 600,
                          color: margin >= 30 ? '#10b981' : margin >= 15 ? '#f59e0b' : '#ef4444',
                        }}>
                          {margin.toFixed(1)}%
                        </span>
                      </td>
                      <td>{p.unitsSold.toLocaleString()}</td>
                      <td>
                        <span style={{ color: isLowStock ? '#ef4444' : '#94a3b8', fontWeight: isLowStock ? 600 : 400 }}>
                          {p.category === 'Services' ? '—' : p.stock}
                          {isLowStock && ' ⚠'}
                        </span>
                      </td>
                      <td style={{ color: '#f1f5f9', fontWeight: 600 }}>{fmt(revenue)}</td>
                      <td>
                        <span style={{ color: profit >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                          {fmt(profit)}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            id={`edit-product-${p.id}`}
                            onClick={() => openEdit(p)}
                            style={{
                              padding: '6px 12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                              borderRadius: '6px', color: '#6366f1', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px',
                            }}
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          <button
                            id={`delete-product-${p.id}`}
                            className="btn-danger"
                            onClick={() => handleDelete(p.id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: '48px', color: '#475569' }}>
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-content">
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '24px' }}>
              {editProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Product Name *</label>
                <input id="product-name" className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Organic Coffee Blend" />
              </div>
              <div>
                <label className="form-label">Category *</label>
                <select id="product-category" className="form-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
                <div>
                  <label className="form-label">Unit Cost ($) *</label>
                  <input id="product-cost" className="form-input" type="number" step="0.01" min="0" required value={form.unitCost} onChange={e => setForm(f => ({ ...f, unitCost: e.target.value }))} placeholder="0.00" />
                </div>
                <div>
                  <label className="form-label">Selling Price ($) *</label>
                  <input id="product-price" className="form-input" type="number" step="0.01" min="0" required value={form.sellingPrice} onChange={e => setForm(f => ({ ...f, sellingPrice: e.target.value }))} placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
                <div>
                  <label className="form-label">Units Sold</label>
                  <input id="product-units-sold" className="form-input" type="number" min="0" value={form.unitsSold} onChange={e => setForm(f => ({ ...f, unitsSold: e.target.value }))} placeholder="0" />
                </div>
                <div>
                  <label className="form-label">Stock on Hand</label>
                  <input id="product-stock" className="form-input" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" />
                </div>
              </div>

              {/* Live margin preview */}
              {form.unitCost && form.sellingPrice && (
                <div style={{
                  padding: '12px 16px', borderRadius: '8px',
                  background: (() => {
                    const m = (Number(form.sellingPrice) - Number(form.unitCost)) / Number(form.sellingPrice) * 100;
                    return m >= 20 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)';
                  })(),
                  border: '1px solid rgba(255,255,255,0.07)',
                  fontSize: '13px',
                }}>
                  <span style={{ color: '#94a3b8' }}>Projected margin: </span>
                  <strong style={{
                    color: (() => {
                      const m = (Number(form.sellingPrice) - Number(form.unitCost)) / Number(form.sellingPrice) * 100;
                      return m >= 20 ? '#10b981' : '#f59e0b';
                    })(),
                  }}>
                    {((Number(form.sellingPrice) - Number(form.unitCost)) / Number(form.sellingPrice) * 100).toFixed(1)}%
                  </strong>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button id="submit-product-btn" className="btn-primary" type="submit" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Saving…' : editProduct ? 'Update Product' : 'Add Product'}
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
