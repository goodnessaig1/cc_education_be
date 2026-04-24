import prisma from './src/db';
import { initializeSectorData } from './src/seed';

async function main() {
  console.log('Migrating existing sectors with Error404 section...');
  const sectors = await prisma.sector.findMany();
  
  for (const sector of sectors) {
    console.log(`Checking sector: ${sector.name} (${sector.id})`);
    
    // Using initializeSectorData is safe because it only creates sections if they don't exist
    await initializeSectorData(sector.id);
  }
  
  console.log('Migration complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
