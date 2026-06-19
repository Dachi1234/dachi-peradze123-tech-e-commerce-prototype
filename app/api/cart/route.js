import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { cartItems, products } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        productName: products.name,
        productCategory: products.category,
        productPrice: products.price,
        productImageUrl: products.imageUrl,
        productDescription: products.description,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, session.userId))
      .orderBy(desc(cartItems.createdAt));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    const qty = Math.max(1, parseInt(quantity) || 1);

    // Check existing
    const [existing] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, session.userId), eq(cartItems.productId, productId)))
      .limit(1);

    let result;
    if (existing) {
      [result] = await db
        .update(cartItems)
        .set({ quantity: existing.quantity + qty })
        .where(eq(cartItems.id, existing.id))
        .returning();
    } else {
      [result] = await db
        .insert(cartItems)
        .values({
          userId: session.userId,
          productId,
          quantity: qty,
        })
        .returning();
    }

    return NextResponse.json({ item: result }, { status: 201 });
  } catch (error) {
    console.error('Cart add error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.delete(cartItems).where(eq(cartItems.userId, session.userId));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Cart clear error:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
