import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { cartItems } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (quantity == null) {
      return NextResponse.json({ error: 'quantity is required' }, { status: 400 });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 0) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    // If quantity is 0, treat as a delete
    if (qty === 0) {
      const deleted = await db
        .delete(cartItems)
        .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, session.userId)))
        .returning();

      if (deleted.length === 0) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
      return NextResponse.json({ ok: true, deleted: true });
    }

    const [updated] = await db
      .update(cartItems)
      .set({ quantity: qty })
      .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, session.userId)))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = await params;

    const deleted = await db
      .delete(cartItems)
      .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, session.userId)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Cart delete error:', error);
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 });
  }
}
