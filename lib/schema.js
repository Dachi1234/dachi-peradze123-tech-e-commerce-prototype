import { pgTable, uuid, text, decimal, integer, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url').notNull(),
  description: text('description').notNull(),
});

export const ratings = pgTable('ratings', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  userIdentifier: text('user_identifier').notNull(),
  stars: integer('stars').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
