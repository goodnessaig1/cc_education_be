import prisma from './db';

async function migrate() {
  console.log('🚀 Starting migration to Multi-Sector architecture...');

  // 1. Create the "Shopping" sector
  let shoppingSector = await prisma.sector.findUnique({
    where: { name: 'Shopping' }
  });

  if (!shoppingSector) {
    shoppingSector = await prisma.sector.create({
      data: { name: 'Shopping' }
    });
    console.log(`✅ Created "Shopping" sector with ID: ${shoppingSector.id}`);
  } else {
    console.log(`ℹ️ "Shopping" sector already exists (ID: ${shoppingSector.id})`);
  }

  const sectorId = shoppingSector.id;

  // 2. Link orphaned SiteConfig
  const orphanedConfigs = await prisma.siteConfig.updateMany({
    where: { sectorId: null },
    data: { sectorId }
  });
  console.log(`✅ Linked ${orphanedConfigs.count} site config(s) to "Shopping" sector.`);

  // 3. Link orphaned Sections
  const orphanedSections = await prisma.section.updateMany({
    where: { sectorId: null },
    data: { sectorId }
  });
  console.log(`✅ Linked ${orphanedSections.count} section(s) to "Shopping" sector.`);

  console.log('\n🎉 Migration complete!');
}

migrate()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
