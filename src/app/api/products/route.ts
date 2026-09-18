import { NextResponse } from "next/server";
import { getAllProducts } from "@/services/inventoryService";

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { success: false, message: "Error al obtener productos." },
      { status: 500 }
    );
  }
}
