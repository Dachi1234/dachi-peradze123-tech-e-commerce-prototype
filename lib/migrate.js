import { neon } from '@neondatabase/serverless';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('Running migrations...');

  const migrationsDir = join(process.cwd(), 'drizzle');
  const files = await readdir(migrationsDir);
  const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

  for (const file of sqlFiles) {
    const filePath = join(migrationsDir, file);
    const migration = await readFile(filePath, 'utf-8');

    console.log(`Applying migration: ${file}`);
    await sql(migration);
  }

  console.log('Migrations complete');
}

migrate().catch(console.error);
