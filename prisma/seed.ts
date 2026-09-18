import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes
  await prisma.sale.deleteMany();
  await prisma.product.deleteMany();

  // Crear productos
  const products = await prisma.product.createMany({
    data: [
      { name: "Laptop Lenovo", stock: 12, price: 2500000 },
      { name: "Mouse Logitech", stock: 8, price: 30000 },
      { name: "Teclado Logitech", stock: 4, price: 50000 },
      { name: "Monitor Samsung", stock: 6, price: 800000 },
      { name: "Audifonos Sony", stock: 3, price: 150000 },
    ],
  });

  console.log(`Created ${products.count} products`);

  // Obtener productos para crear ventas
  const laptop = await prisma.product.findUnique({ where: { name: "Laptop Lenovo" } });
  const mouse = await prisma.product.findUnique({ where: { name: "Mouse Logitech" } });
  const teclado = await prisma.product.findUnique({ where: { name: "Teclado Logitech" } });
  const monitor = await prisma.product.findUnique({ where: { name: "Monitor Samsung" } });
  const audifonos = await prisma.product.findUnique({ where: { name: "Audifonos Sony" } });

  if (laptop && mouse && teclado && monitor && audifonos) {
    await prisma.sale.createMany({
      data: [
        { productId: laptop.id, quantity: 3, unitPrice: 2500000, total: 7500000 },
        { productId: mouse.id, quantity: 15, unitPrice: 30000, total: 450000 },
        { productId: teclado.id, quantity: 23, unitPrice: 50000, total: 1150000 },
        { productId: monitor.id, quantity: 8, unitPrice: 800000, total: 6400000 },
        { productId: audifonos.id, quantity: 12, unitPrice: 150000, total: 1800000 },
        { productId: mouse.id, quantity: 5, unitPrice: 30000, total: 150000 },
        { productId: laptop.id, quantity: 1, unitPrice: 2500000, total: 2500000 },
      ],
    });
    console.log("Created sales");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
