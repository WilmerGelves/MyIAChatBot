import { ParsedQuery } from "@/types/chat";

const INVENTORY_KEYWORDS = [
  "unidades", "unidad", "inventario", "stock", "cantidad", "quedan",
  "hay", "disponible", "disponibles", "tenemos", "queda",
];

const SALES_KEYWORDS = [
  "vendio", "vendi", "vendidos", "vendidas", "ventas", "venta",
  "vendieron", "vendido", "vendida", "vendimos", "vendido",
  "dinero", "genero", "facturado", "facturo", "recaudado",
];

const PRODUCT_NAMES = [
  "laptop lenovo",
  "mouse logitech",
  "teclado logitech",
  "monitor samsung",
  "audifonos sony",
  "laptop",
  "mouse",
  "teclado",
  "monitor",
  "audifonos",
];

export function interpretQuery(message: string): ParsedQuery {
  const lower = message.toLowerCase().trim();

  // Detectar producto
  let product: string | undefined;
  for (const name of PRODUCT_NAMES) {
    if (lower.includes(name)) {
      product = name
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      break;
    }
  }

  // Si no se encontró un producto conocido, intentar extraer después de "de" o "del"
  if (!product) {
    const match = lower.match(/(?:de|del)\s+([a-záéíóúñ\s]+)(?:\?|\.|$)/i);
    if (match) {
      product = match[1].trim();
      if (product) {
        product = product.charAt(0).toUpperCase() + product.slice(1);
      }
    }
  }

  // Detectar tipo de consulta
  let type: ParsedQuery["type"] = "UNKNOWN";

  const isInventory = INVENTORY_KEYWORDS.some((k) => lower.includes(k));
  const isSales = SALES_KEYWORDS.some((k) => lower.includes(k));

  if (isSales && !isInventory) {
    type = "SALES";
  } else if (isInventory && !isSales) {
    type = "INVENTORY";
  } else if (isInventory && isSales) {
    // Si ambos, priorizar según palabras más específicas
    type = lower.includes("vend") ? "SALES" : "INVENTORY";
  }

  return { type, product };
}
