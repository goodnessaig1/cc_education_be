import prisma from './src/db';
import { initializeSectorData } from './src/seed';

async function reseed() {
  console.log('🌱 Reseeding sectors...');
  
  // 1. Re-initialize all existing sectors
  const allSectors = await prisma.sector.findMany();
  
  for (const sector of allSectors) {
    console.log(`🌱 Initializing data for sector: ${sector.name} (${sector.id})...`);
    await initializeSectorData(sector.id);
  }
  
  console.log('🎉 Reseeding complete!');
}

reseed()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
