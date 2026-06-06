import { db } from '@/lib/db';
import { products, ratings } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch all products with their average ratings
    const productsWithRatings = await db
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
      .groupBy(products.id);

    return NextResponse.json(productsWithRatings);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
