const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@digitalera.com' },
    update: {},
    create: {
      email: 'admin@digitalera.com',
      name: 'DigitalEra Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created/verified:', admin.email);

  // Optional: Create some initial categories
  const categories = ['Technology', 'Programming', 'Web Development'];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { 
        name, 
        slug: name.toLowerCase().replace(/ /g, '-') 
      },
    });
  }
  console.log('✅ Default categories created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
