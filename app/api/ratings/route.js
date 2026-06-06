import { db } from '@/lib/db';
import { ratings } from '@/lib/schema';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { product_id, stars, user_identifier } = body;

    if (!product_id || !stars || !user_identifier) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'Stars must be between 1 and 5' }, { status: 400 });
    }

    const [newRating] = await db
      .insert(ratings)
      .values({
        productId: product_id,
        stars: parseInt(stars),
        userIdentifier: user_identifier,
      })
      .returning();

    return NextResponse.json(newRating, { status: 201 });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json({ error: 'Failed to create rating' }, { status: 500 });
  }
}
