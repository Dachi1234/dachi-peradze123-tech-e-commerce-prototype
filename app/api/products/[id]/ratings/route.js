import { db } from '@/lib/db';
import { ratings } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const productRatings = await db
      .select()
      .from(ratings)
      .where(eq(ratings.productId, id))
      .orderBy(desc(ratings.createdAt));

    return NextResponse.json(productRatings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
  }
}
