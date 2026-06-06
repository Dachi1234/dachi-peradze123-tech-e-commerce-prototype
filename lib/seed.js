import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const products = [
  {
    name: 'iPhone 15 Pro',
    category: 'phone',
    price: '999.00',
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
    description: 'Latest iPhone with A17 Pro chip'
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    category: 'phone',
    price: '1199.00',
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    description: 'Premium Android flagship'
  },
  {
    name: 'Google Pixel 8 Pro',
    category: 'phone',
    price: '899.00',
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop',
    description: 'Pure Android experience with AI features'
  },
  {
    name: 'MacBook Pro 16"',
    category: 'laptop',
    price: '2499.00',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    description: 'Powerful M3 Pro chip for professionals'
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    category: 'laptop',
    price: '1699.00',
    image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
    description: 'Business-class ultrabook'
  },
  {
    name: 'Dell XPS 15',
    category: 'laptop',
    price: '1899.00',
    image_url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=400&fit=crop',
    description: 'Stunning 4K display and performance'
  },
  {
    name: 'iPhone 15',
    category: 'phone',
    price: '799.00',
    image_url: 'https://images.unsplash.com/photo-1592286927505-c80e8c6e8e2a?w=400&h=400&fit=crop',
    description: 'Excellent value flagship phone'
  },
  {
    name: 'OnePlus 12',
    category: 'phone',
    price: '799.00',
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
    description: 'Flagship killer with fast charging'
  },
  {
    name: 'HP Spectre x360',
    category: 'laptop',
    price: '1599.00',
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
    description: 'Premium 2-in-1 convertible'
  },
  {
    name: 'ASUS ROG Zephyrus',
    category: 'laptop',
    price: '2299.00',
    image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop',
    description: 'Gaming powerhouse laptop'
  }
];

async function seed() {
  console.log('Seeding products...');

  // Check if products already exist
  const existing = await sql`SELECT COUNT(*) as count FROM products`;
  if (existing[0].count > 0) {
    console.log('Products already seeded');
    return;
  }

  // Insert products
  for (const product of products) {
    await sql`
      INSERT INTO products (name, category, price, image_url, description)
      VALUES (${product.name}, ${product.category}, ${product.price}, ${product.image_url}, ${product.description})
    `;
  }

  console.log(`Seeded ${products.length} products`);
}

seed().catch(console.error);
