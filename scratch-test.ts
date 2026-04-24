import prisma from './src/db';
import { initializeSectorData } from './src/seed';

async function main() {
  const sectorId = '8361d07f-6563-43a0-bd93-df139f96861f';
  try {
    await initializeSectorData(sectorId);
    console.log('Success!');
  } catch(e: any) {
    console.log('Error message:', e.message);
    if (e.meta) {
      console.log('Error meta:', e.meta);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
