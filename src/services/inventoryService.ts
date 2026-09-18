import { prisma } from "@/lib/prisma";

export async function getInventoryByProductName(name: string) {
  const product = await prisma.product.findUnique({
    where: { name },
  });

  if (!product) {
    return null;
  }

  return product;
}

export async function getAllProducts() {
  return prisma.product.findMany({
    orderBy: { name: "asc" },
  });
}
