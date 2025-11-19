import { DataSource } from 'typeorm';
import { Item } from './items/item.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'testdb',
  entities: [Item],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('Connected to database');

  const itemRepository = dataSource.getRepository(Item);
  
  const count = await itemRepository.count();
  if (count >= 50000) {
    console.log('Database already seeded');
    await dataSource.destroy();
    return;
  }

  console.log('Seeding database...');
  const batchSize = 1000;
  const totalItems = 50000;

  for (let i = 0; i < totalItems; i += batchSize) {
    const items = [];
    for (let j = 0; j < batchSize && i + j < totalItems; j++) {
      items.push({
        name: `Item ${i + j + 1}`,
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      });
    }
    await itemRepository.insert(items);
    console.log(`Inserted ${i + batchSize} / ${totalItems}`);
  }

  console.log('Seeding completed');
  await dataSource.destroy();
}

seed().catch(console.error);