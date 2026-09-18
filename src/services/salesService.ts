import { prisma } from "@/lib/prisma";

export async function getSalesByProductName(name: string) {
  const product = await prisma.product.findUnique({
    where: { name },
    include: { sales: true },
  });

  if (!product) {
    return null;
  }

  const totalQuantity = product.sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalRevenue = product.sales.reduce((sum, sale) => sum + sale.total, 0);

  return {
    product: product.name,
    quantitySold: totalQuantity,
    totalSales: totalRevenue,
    salesCount: product.sales.length,
  };
}

export async function getAllSalesSummary() {
  const sales = await prisma.sale.findMany();
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);

  return {
    totalRevenue,
    totalQuantity,
    salesCount: sales.length,
  };
}
