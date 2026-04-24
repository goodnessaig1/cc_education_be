import prisma from './src/db';
import bcrypt from 'bcryptjs';

async function main() {
  try {
    const admins = await prisma.admin.findMany();
    console.log('Existing admins:', admins.map(a => ({ id: a.id, username: a.username })));

    const admin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    });

    if (admin) {
      const isMatch = await bcrypt.compare('admin123', admin.password);
      console.log('Password "admin123" matches:', isMatch);
    } else {
      console.log('Admin user "admin" does not exist.');
    }
  } catch (error) {
    console.error('Error during database check:', error);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
