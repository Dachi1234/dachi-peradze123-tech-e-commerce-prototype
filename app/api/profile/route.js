import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { ratings, products } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user's ratings with product details
    const userRatings = await db
      .select({
        id: ratings.id,
        stars: ratings.stars,
        createdAt: ratings.createdAt,
        productId: ratings.productId,
        productName: products.name,
        productImageUrl: products.imageUrl,
        productCategory: products.category,
      })
      .from(ratings)
      .innerJoin(products, eq(ratings.productId, products.id))
      .where(eq(ratings.userId, session.userId))
      .orderBy(desc(ratings.createdAt));

    return NextResponse.json({
      username: session.username,
      ratings: userRatings,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
