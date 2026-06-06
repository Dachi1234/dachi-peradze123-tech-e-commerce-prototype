import { db } from '@/lib/db';
import { ratings } from '@/lib/schema';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

export async function POST(request) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { product_id, stars } = body;

    if (!product_id || !stars) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (stars < 1 || stars > 5) {
      return NextResponse.json(
        { error: 'Stars must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user already rated this product
    const existingRating = await db
      .select()
      .from(ratings)
      .where(
        and(
          eq(ratings.productId, product_id),
          eq(ratings.userId, session.userId)
        )
      )
      .limit(1);

    let result;
    if (existingRating.length > 0) {
      // Update existing rating
      [result] = await db
        .update(ratings)
        .set({ stars: parseInt(stars) })
        .where(eq(ratings.id, existingRating[0].id))
        .returning();
    } else {
      // Create new rating
      [result] = await db
        .insert(ratings)
        .values({
          productId: product_id,
          userId: session.userId,
          stars: parseInt(stars),
        })
        .returning();
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json(
      { error: 'Failed to create rating' },
      { status: 500 }
    );
  }
}
