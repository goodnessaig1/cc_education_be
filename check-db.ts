import prisma from './src/db';

async function checkNodes() {
  const sections = await prisma.section.findMany({
    include: { sector: true }
  });
  console.log('Total sections:', sections.length);
  sections.forEach(s => {
    console.log(`Sector: ${s.sector.name} (${s.sector.id}) | Type: ${s.type} | Page: ${s.page} | Visible: ${s.isVisible}`);
  });
}

checkNodes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
