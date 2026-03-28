import { getExpenses, addExpense, updateExpense, deleteExpense } from '@/lib/data-store';
import type { NextRequest } from 'next/server';

export async function GET() {
  return Response.json(getExpenses());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const expense = addExpense(body);
    return Response.json(expense, { status: 201 });
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
    const expense = updateExpense(id, data);
    if (!expense) return Response.json({ error: 'Expense not found' }, { status: 404 });
    return Response.json(expense);
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
  const ok = deleteExpense(id);
  if (!ok) return Response.json({ error: 'Expense not found' }, { status: 404 });
  return Response.json({ success: true });
}
