import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

const categories = [
  { name: 'NEW'},
  { name: 'TRENDING'},
  { name: 'EXCITING'},
  { name: 'HELLO'},
  { name: 'HAPPY'},
  { name: 'WELCOME'},
  { name: 'FUNNY'},
  { name: 'REVEAL'},
  { name: 'SAD'},
  { name: 'CLOTHES'},
  { name: 'POSTER'}
];

const fonts = [
  { name: 'Arial', style: 'Arial' },
  { name: 'Cooper', style: 'Cooper' },
  { name: 'Netigen', style: 'Netigen' },
  { name: 'Arial Arista', style: 'Arial Arista' },
  { name: 'Hobo', style: 'Hobo' },
  { name: 'Lazer', style: 'Lazer' },
  { name: 'Marker', style: 'Marker' },
  { name: 'Silom', style: 'Silom' },
  { name: 'Typo', style: 'Typo' },
  { name: 'Universal', style: 'Universal' }
];

const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Navy', hex: '#000080' }
];

async function main() {
  console.log('Start seeding categories...');
  
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: category,
      create: category,
    });
  }

    for (const font of fonts) {
    await prisma.font.upsert({
      where: { name: font.name },
      update: font,
      create: font,
    });
  }

    for (const color of colors) {
    await prisma.color.upsert({
      where: { name: color.name },
      update: color,
      create: color,
    });
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
