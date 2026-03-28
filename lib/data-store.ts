// In-memory data store — persists across requests in dev (Node.js module singleton)

export type Category = 'Food & Beverage' | 'Electronics' | 'Clothing' | 'Home & Garden' | 'Health & Beauty' | 'Services' | 'Other';
export type ExpenseCategory = 'Rent' | 'Utilities' | 'Payroll' | 'Marketing' | 'Inventory' | 'Equipment' | 'Insurance' | 'Other';
export type Priority = 'high' | 'medium' | 'low';

export interface Product {
  id: string;
  name: string;
  category: Category;
  unitCost: number;
  sellingPrice: number;
  unitsSold: number;
  stock: number;
  createdAt: string;
}

export interface Expense {
  id: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  recurring: boolean;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  priority: Priority;
  title: string;
  description: string;
  action: string;
  impact: string;
  category: 'pricing' | 'inventory' | 'expenses' | 'profitability';
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const products: Product[] = [
  {
    id: 'prod-1', name: 'Artisan Coffee Blend', category: 'Food & Beverage',
    unitCost: 12.50, sellingPrice: 28.00, unitsSold: 320, stock: 45, createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'prod-2', name: 'Wireless Earbuds Pro', category: 'Electronics',
    unitCost: 58.00, sellingPrice: 149.99, unitsSold: 87, stock: 12, createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'prod-3', name: 'Organic Cotton T-Shirt', category: 'Clothing',
    unitCost: 18.00, sellingPrice: 34.99, unitsSold: 215, stock: 80, createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'prod-4', name: 'Bamboo Cutting Board', category: 'Home & Garden',
    unitCost: 22.00, sellingPrice: 24.50, unitsSold: 140, stock: 30, createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'prod-5', name: 'Vitamin C Serum', category: 'Health & Beauty',
    unitCost: 9.00, sellingPrice: 49.99, unitsSold: 410, stock: 5, createdAt: '2026-02-10T00:00:00Z',
  },
  {
    id: 'prod-6', name: 'Consulting Session (1hr)', category: 'Services',
    unitCost: 0, sellingPrice: 180.00, unitsSold: 62, stock: 999, createdAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'prod-7', name: 'Smart Plant Pot', category: 'Home & Garden',
    unitCost: 45.00, sellingPrice: 47.00, unitsSold: 28, stock: 20, createdAt: '2026-03-01T00:00:00Z',
  },
];

const expenses: Expense[] = [
  { id: 'exp-1', name: 'Office Rent', category: 'Rent', amount: 3200, date: '2026-03-01', recurring: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'exp-2', name: 'Electricity & Internet', category: 'Utilities', amount: 380, date: '2026-03-01', recurring: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'exp-3', name: 'Staff Salaries', category: 'Payroll', amount: 8500, date: '2026-03-01', recurring: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'exp-4', name: 'Google Ads Campaign', category: 'Marketing', amount: 1200, date: '2026-03-05', recurring: false, createdAt: '2026-03-05T00:00:00Z' },
  { id: 'exp-5', name: 'Product Inventory Restock', category: 'Inventory', amount: 4800, date: '2026-03-08', recurring: false, createdAt: '2026-03-08T00:00:00Z' },
  { id: 'exp-6', name: 'POS Equipment Lease', category: 'Equipment', amount: 250, date: '2026-03-01', recurring: true, createdAt: '2026-02-01T00:00:00Z' },
  { id: 'exp-7', name: 'Business Insurance', category: 'Insurance', amount: 420, date: '2026-03-01', recurring: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: 'exp-8', name: 'Social Media Marketing', category: 'Marketing', amount: 600, date: '2026-03-12', recurring: true, createdAt: '2026-02-12T00:00:00Z' },
];

// ─── Store ────────────────────────────────────────────────────────────────────

const store = {
  products: [...products],
  expenses: [...expenses],
};

// ─── Products CRUD ────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
  return store.products;
}

export function addProduct(data: Omit<Product, 'id' | 'createdAt'>): Product {
  const product: Product = {
    ...data,
    id: `prod-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  store.products.push(product);
  return product;
}

export function updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Product | null {
  const idx = store.products.findIndex(p => p.id === id);
  if (idx === -1) return null;
  store.products[idx] = { ...store.products[idx], ...data };
  return store.products[idx];
}

export function deleteProduct(id: string): boolean {
  const idx = store.products.findIndex(p => p.id === id);
  if (idx === -1) return false;
  store.products.splice(idx, 1);
  return true;
}

// ─── Expenses CRUD ────────────────────────────────────────────────────────────

export function getExpenses(): Expense[] {
  return store.expenses;
}

export function addExpense(data: Omit<Expense, 'id' | 'createdAt'>): Expense {
  const expense: Expense = {
    ...data,
    id: `exp-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  store.expenses.push(expense);
  return expense;
}

export function updateExpense(id: string, data: Partial<Omit<Expense, 'id' | 'createdAt'>>): Expense | null {
  const idx = store.expenses.findIndex(e => e.id === id);
  if (idx === -1) return null;
  store.expenses[idx] = { ...store.expenses[idx], ...data };
  return store.expenses[idx];
}

export function deleteExpense(id: string): boolean {
  const idx = store.expenses.findIndex(e => e.id === id);
  if (idx === -1) return false;
  store.expenses.splice(idx, 1);
  return true;
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export function getAnalytics() {
  const products = store.products;
  const expenses = store.expenses;

  const totalRevenue = products.reduce((s, p) => s + p.sellingPrice * p.unitsSold, 0);
  const totalCOGS = products.reduce((s, p) => s + p.unitCost * p.unitsSold, 0);
  const grossProfit = totalRevenue - totalCOGS;
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = grossProfit - totalExpenses;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Revenue by category
  const revenueByCategory: Record<string, number> = {};
  for (const p of products) {
    revenueByCategory[p.category] = (revenueByCategory[p.category] || 0) + p.sellingPrice * p.unitsSold;
  }

  // Expenses by category
  const expensesByCategory: Record<string, number> = {};
  for (const e of expenses) {
    expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + e.amount;
  }

  // Top products by profit
  const productProfits = products.map(p => ({
    name: p.name,
    revenue: p.sellingPrice * p.unitsSold,
    profit: (p.sellingPrice - p.unitCost) * p.unitsSold,
    margin: p.sellingPrice > 0 ? ((p.sellingPrice - p.unitCost) / p.sellingPrice) * 100 : 0,
  })).sort((a, b) => b.profit - a.profit);

  // Monthly trend (simulated from current data spread across months)
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const growthFactors = [0.55, 0.65, 0.78, 0.88, 0.94, 1.0];
  const monthlyTrend = months.map((month, i) => ({
    month,
    revenue: Math.round(totalRevenue * growthFactors[i]),
    expenses: Math.round(totalExpenses * growthFactors[i]),
    profit: Math.round(netProfit * growthFactors[i]),
  }));

  return {
    totalRevenue,
    totalCOGS,
    grossProfit,
    totalExpenses,
    netProfit,
    grossMargin,
    netMargin,
    revenueByCategory,
    expensesByCategory,
    productProfits,
    monthlyTrend,
    productCount: products.length,
    expenseCount: expenses.length,
    lowStockCount: products.filter(p => p.stock < 10 && p.category !== 'Services').length,
  };
}

// ─── Recommendation Engine ───────────────────────────────────────────────────

export function generateRecommendations(): Recommendation[] {
  const products = store.products;
  const expenses = store.expenses;
  const analytics = getAnalytics();
  const recs: Recommendation[] = [];

  // Rule 1: Low margin products (margin < 20%)
  for (const p of products) {
    if (p.category === 'Services') continue;
    const margin = p.sellingPrice > 0 ? ((p.sellingPrice - p.unitCost) / p.sellingPrice) * 100 : 0;
    if (margin < 20 && margin >= 0) {
      recs.push({
        id: `rec-margin-${p.id}`,
        priority: margin < 10 ? 'high' : 'medium',
        title: `Low Margin: ${p.name}`,
        description: `"${p.name}" has a gross margin of only ${margin.toFixed(1)}%, which is below the recommended 20% threshold.`,
        action: `Consider raising the selling price from $${p.sellingPrice.toFixed(2)} to at least $${(p.unitCost / 0.80).toFixed(2)} to achieve 20% margin.`,
        impact: `+$${((p.unitCost / 0.80 - p.sellingPrice) * p.unitsSold).toFixed(0)} additional profit potential`,
        category: 'pricing',
      });
    }
  }

  // Rule 2: Near out-of-stock (non-service products with stock < 10)
  for (const p of products) {
    if (p.category === 'Services') continue;
    if (p.stock < 10 && p.unitsSold > 50) {
      recs.push({
        id: `rec-stock-${p.id}`,
        priority: p.stock <= 5 ? 'high' : 'medium',
        title: `Low Inventory: ${p.name}`,
        description: `"${p.name}" has only ${p.stock} units remaining and is a high-demand product (${p.unitsSold} units sold).`,
        action: `Reorder at least ${Math.ceil(p.unitsSold * 0.3)} units to maintain a 30-day buffer based on sales velocity.`,
        impact: `Prevent stockout revenue loss of ~$${(p.sellingPrice * Math.ceil(p.unitsSold * 0.3)).toFixed(0)}`,
        category: 'inventory',
      });
    }
  }

  // Rule 3: Net margin below 10%
  if (analytics.netMargin < 10 && analytics.netMargin >= 0) {
    recs.push({
      id: 'rec-net-margin',
      priority: analytics.netMargin < 5 ? 'high' : 'medium',
      title: 'Net Profit Margin Below Target',
      description: `Your overall net margin is ${analytics.netMargin.toFixed(1)}%, which is below the healthy 10–20% range for small businesses.`,
      action: 'Review your largest expense categories and identify areas to reduce costs by 10–15%.',
      impact: `Reaching 10% net margin would add ~$${((analytics.totalRevenue * 0.1) - analytics.netProfit).toFixed(0)} to your bottom line`,
      category: 'profitability',
    });
  }

  // Rule 4: Marketing expenses > 15% of revenue
  const marketingTotal = expenses.filter(e => e.category === 'Marketing').reduce((s, e) => s + e.amount, 0);
  if (analytics.totalRevenue > 0 && (marketingTotal / analytics.totalRevenue) > 0.15) {
    recs.push({
      id: 'rec-marketing',
      priority: 'medium',
      title: 'High Marketing Spend Ratio',
      description: `Marketing expenses ($${marketingTotal.toFixed(0)}) represent ${((marketingTotal / analytics.totalRevenue) * 100).toFixed(1)}% of revenue, above the 15% industry benchmark.`,
      action: 'Audit marketing ROI by channel. Pause or reduce spend on channels with poor conversion rates.',
      impact: `Reducing to 15% saves ~$${(marketingTotal - analytics.totalRevenue * 0.15).toFixed(0)} monthly`,
      category: 'expenses',
    });
  }

  // Rule 5: High performer — champion product
  const topProduct = products.reduce((best, p) => {
    const profit = (p.sellingPrice - p.unitCost) * p.unitsSold;
    const bestProfit = (best.sellingPrice - best.unitCost) * best.unitsSold;
    return profit > bestProfit ? p : best;
  }, products[0]);

  if (topProduct) {
    const topMargin = ((topProduct.sellingPrice - topProduct.unitCost) / topProduct.sellingPrice * 100);
    if (topMargin > 40) {
      recs.push({
        id: `rec-champion-${topProduct.id}`,
        priority: 'low',
        title: `Scale Up Champion: ${topProduct.name}`,
        description: `"${topProduct.name}" is your most profitable product with a ${topMargin.toFixed(1)}% margin and strong sales velocity.`,
        action: 'Invest in increased marketing and inventory for this product. Consider bundle deals to increase average order value.',
        impact: `A 20% sales increase could add ~$${((topProduct.sellingPrice - topProduct.unitCost) * topProduct.unitsSold * 0.2).toFixed(0)} in profit`,
        category: 'profitability',
      });
    }
  }

  // Rule 6: Recurring expenses dominate
  const recurringTotal = expenses.filter(e => e.recurring).reduce((s, e) => s + e.amount, 0);
  if (analytics.totalExpenses > 0 && (recurringTotal / analytics.totalExpenses) > 0.70) {
    recs.push({
      id: 'rec-fixed-costs',
      priority: 'low',
      title: 'High Fixed Cost Exposure',
      description: `${((recurringTotal / analytics.totalExpenses) * 100).toFixed(0)}% of your expenses are recurring fixed costs ($${recurringTotal.toFixed(0)}), creating high break-even risk.`,
      action: 'Negotiate flexible payment terms or variable pricing with suppliers. Explore shared office space to reduce rent.',
      impact: 'Reduces financial risk during revenue downturns',
      category: 'expenses',
    });
  }

  // Sort: high → medium → low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
