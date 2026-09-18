import { NextResponse } from "next/server";
import { interpretQuery } from "@/lib/interpreter/queryInterpreter";
import { getInventoryByProductName } from "@/services/inventoryService";
import { getSalesByProductName } from "@/services/salesService";
import { ChatResponse } from "@/types/chat";

const LOW_STOCK_THRESHOLD = 5;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { success: false, type: "UNKNOWN", message: "Mensaje no válido." },
        { status: 400 }
      );
    }

    const query = interpretQuery(message);

    if (query.type === "UNKNOWN") {
      const response: ChatResponse = {
        success: true,
        type: "UNKNOWN",
        message:
          "Por ahora puedo ayudarte con consultas de inventario y ventas.",
      };
      return NextResponse.json(response);
    }

    if (query.type === "INVENTORY") {
      if (!query.product) {
        const response: ChatResponse = {
          success: true,
          type: "INVENTORY",
          message: "No pude identificar el producto. Intenta escribir el nombre completo.",
        };
        return NextResponse.json(response);
      }

      const product = await getInventoryByProductName(query.product);

      if (!product) {
        const response: ChatResponse = {
          success: true,
          type: "INVENTORY",
          message: `No encontré un producto llamado '${query.product}' en el inventario registrado.`,
        };
        return NextResponse.json(response);
      }

      const isLowStock = product.stock <= LOW_STOCK_THRESHOLD;
      let msg = `Hay ${product.stock} unidades de ${product.name} disponibles.`;

      if (isLowStock) {
        msg += `\n\n⚠️ Alerta: el inventario de este producto se encuentra bajo.`;
      }

      const response: ChatResponse = {
        success: true,
        type: "INVENTORY",
        message: msg,
        data: {
          product: product.name,
          stock: product.stock,
          price: product.price,
        },
        alert: isLowStock,
      };

      return NextResponse.json(response);
    }

    if (query.type === "SALES") {
      if (!query.product) {
        const response: ChatResponse = {
          success: true,
          type: "SALES",
          message: "No pude identificar el producto. Intenta escribir el nombre completo.",
        };
        return NextResponse.json(response);
      }

      const sales = await getSalesByProductName(query.product);

      if (!sales) {
        const response: ChatResponse = {
          success: true,
          type: "SALES",
          message: `No encontré un producto llamado '${query.product}' en el inventario registrado.`,
        };
        return NextResponse.json(response);
      }

      const formattedTotal = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(sales.totalSales);

      const msg = `Se han vendido ${sales.quantitySold} unidades de ${sales.product}, por un total de ${formattedTotal}.`;

      const response: ChatResponse = {
        success: true,
        type: "SALES",
        message: msg,
        data: {
          product: sales.product,
          quantitySold: sales.quantitySold,
          totalSales: sales.totalSales,
        },
        alert: false,
      };

      return NextResponse.json(response);
    }

    return NextResponse.json(
      { success: false, type: "UNKNOWN", message: "No entendí la consulta." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { success: false, type: "UNKNOWN", message: "Ocurrió un error al procesar tu consulta." },
      { status: 500 }
    );
  }
}
