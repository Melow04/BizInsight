import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/data-store';
import type { NextRequest } from 'next/server';

export async function GET() {
  return Response.json(getProducts());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = addProduct(body);
    return Response.json(product, { status: 201 });
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
    const product = updateProduct(id, data);
    if (!product) return Response.json({ error: 'Product not found' }, { status: 404 });
    return Response.json(product);
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
  const ok = deleteProduct(id);
  if (!ok) return Response.json({ error: 'Product not found' }, { status: 404 });
  return Response.json({ success: true });
}
