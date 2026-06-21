import { db } from '@/lib/db';
import { products, ratings } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const rows = await db
      .select({
        id: products.id,
        name: products.name,
        category: products.category,
        price: products.price,
        imageUrl: products.imageUrl,
        description: products.description,
        avgRating: sql`COALESCE(AVG(${ratings.stars}), 0)`.as('avg_rating'),
        ratingCount: sql`COUNT(${ratings.id})`.as('rating_count'),
      })
      .from(products)
      .leftJoin(ratings, eq(products.id, ratings.productId))
      .where(eq(products.id, id))
      .groupBy(products.id);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
