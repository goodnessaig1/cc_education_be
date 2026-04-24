import { initializeSectorData } from './src/seed';
import prisma from './src/db';

async function test() {
  const testSector = await prisma.sector.create({
    data: { name: `Test Sector ${Date.now()}` }
  });
  console.log(`Created test sector: ${testSector.id}`);
  
  try {
    await initializeSectorData(testSector.id);
    console.log('✅ Initialization finished without visible errors.');
  } catch (err) {
    console.error('❌ Initialization failed with error:', err);
  } finally {
    // Check results
    const counts = await prisma.section.groupBy({
      by: ['page'],
      where: { sectorId: testSector.id },
      _count: true
    });
    console.log('Section counts:', JSON.stringify(counts, null, 2));
    
    const breadcrumbs = await prisma.section.findMany({
      where: { sectorId: testSector.id, type: 'Breadcrumbs' }
    });
    console.log('Breadcrumbs found:', breadcrumbs.length);
    
    await prisma.$disconnect();
  }
}

test();
