import prisma from './src/db';
import { initializeSectorData } from './src/seed';

async function main() {
  console.log('🚀 Starting about-page migration...');

  // 1. Get all unique sectors
  const configs = await prisma.siteConfig.findMany({
    select: { sectorId: true },
  });

  const uniqueSectors = Array.from(new Set(configs.map(c => c.sectorId)));
  console.log(`Found ${uniqueSectors.length} sector(s) to process.`);

  // 2. Run the initializeSectorData for each which now contains the about sections conditionally checking their existence
  for (const sector of uniqueSectors) {
    if (!sector) continue;
    try {
      console.log(`\nMigrating sector: ${sector}`);
      await initializeSectorData(sector);
    } catch (e) {
      console.error(`❌ Failed migrating sector ${sector}:`, e);
    }
  }

  console.log('\n✅ Migration complete!');
}

main()
  .catch((e) => {
    console.error('Migration crashed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
