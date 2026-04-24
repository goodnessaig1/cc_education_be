import prisma from './src/db';
import { initializeSectorData } from './src/seed';

async function repair() {
  console.log('🏗️ Starting sector repair...');
  
  const sectors = await prisma.sector.findMany();
  console.log(`Found ${sectors.length} sectors to check.`);

  for (const sector of sectors) {
    console.log(`🔍 Checking sector: ${sector.name} (${sector.id})...`);
    await initializeSectorData(sector.id);
  }

  console.log('🎉 Sector repair complete!');
}

repair()
  .catch(e => { console.error('❌ Repair failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
