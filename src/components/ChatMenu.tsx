"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
}

interface MenuOption {
  id: string;
  label: string;
  icon?: string;
  action: "navigate" | "send" | "back" | "info";
  target?: string;
  message?: string;
  infoContent?: string;
}

interface MenuDefinition {
  id: string;
  title: string;
  description?: string;
  options: MenuOption[];
}

export interface ChatMenuRef {
  selectOption: (index: number) => boolean;
  getOptionCount: () => number;
}

interface ChatMenuProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  resetKey?: number;
}

const ChatMenu = forwardRef<ChatMenuRef, ChatMenuProps>(function ChatMenu(
  { onSendMessage, disabled, resetKey = 0 },
  ref
) {
  const [currentMenuId, setCurrentMenuId] = useState("main");
  const [menuHistory, setMenuHistory] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setProductsLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success && data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const productNames = products.length > 0
    ? products.map((p) => p.name)
    : ["Laptop Lenovo", "Mouse Logitech", "Teclado Logitech", "Monitor Samsung", "Audifonos Sony"];

  const menus: Record<string, MenuDefinition> = {
    main: {
      id: "main",
      title: "Menú Principal",
      description: "Selecciona una opción (escribe el número o haz click):",
      options: [
        { id: "inv", label: "Consultar Inventario", icon: "📦", action: "navigate", target: "inventory" },
        { id: "sales", label: "Consultar Ventas", icon: "💰", action: "navigate", target: "sales" },
        { id: "products", label: "Ver Lista de Productos", icon: "📝", action: "navigate", target: "products_list" },
      ],
    },
    inventory: {
      id: "inventory",
      title: "Consultar Inventario",
      description: "Selecciona un producto para ver su stock:",
      options: [
        ...productNames.map((name, idx) => ({
          id: `inv-${idx}`,
          label: name,
          icon: "📦",
          action: "send" as const,
          message: `¿Cuántas unidades hay de ${name}?`,
        })),
        { id: "back", label: "Volver al menú principal", icon: "🔙", action: "back" as const },
      ],
    },
    sales: {
      id: "sales",
      title: "Consultar Ventas",
      description: "Selecciona un producto para ver sus ventas:",
      options: [
        ...productNames.map((name, idx) => ({
          id: `sale-${idx}`,
          label: name,
          icon: "💰",
          action: "send" as const,
          message: `¿Cuántas ventas tuvo ${name}?`,
        })),
        { id: "back", label: "Volver al menú principal", icon: "🔙", action: "back" as const },
      ],
    },
    products_list: {
      id: "products_list",
      title: "Lista de Productos",
      description: "Estos son los productos disponibles:",
      options: [
        ...(products.length > 0
          ? products.map((p, idx) => ({
              id: `prod-${idx}`,
              label: `${p.name} - Stock: ${p.stock} - $${p.price.toLocaleString("es-CO")}`,
              icon: "📝",
              action: "info" as const,
              infoContent: `${p.name}\nStock: ${p.stock} unidades\nPrecio: $${p.price.toLocaleString("es-CO")}`,
            }))
          : productNames.map((name, idx) => ({
              id: `prod-${idx}`,
              label: name,
              icon: "📝",
              action: "info" as const,
              infoContent: name,
            }))),
        { id: "back", label: "Volver al menú principal", icon: "🔙", action: "back" as const },
      ],
    },
  };

  const currentMenu = menus[currentMenuId] || menus["main"];

  // Resetear a main cuando cambia resetKey (después de cada respuesta del bot)
  useEffect(() => {
    if (resetKey > 0) {
      setCurrentMenuId("main");
      setMenuHistory([]);
    }
  }, [resetKey]);

  const handleOptionClick = (option: MenuOption) => {
    if (disabled) return;

    switch (option.action) {
      case "navigate":
        if (option.target) {
          setMenuHistory((prev) => [...prev, currentMenuId]);
          setCurrentMenuId(option.target);
        }
        break;
      case "send":
        if (option.message) {
          onSendMessage(option.message);
        }
        break;
      case "back":
        setMenuHistory((prev) => {
          const newHistory = [...prev];
          const previous = newHistory.pop();
          setCurrentMenuId(previous || "main");
          return newHistory;
        });
        break;
      case "info":
        break;
    }
  };

  useImperativeHandle(ref, () => ({
    selectOption: (index: number) => {
      const options = currentMenu.options;
      if (index >= 1 && index <= options.length) {
        handleOptionClick(options[index - 1]);
        return true;
      }
      return false;
    },
    getOptionCount: () => currentMenu.options.length,
  }));

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-gray-800">{currentMenu.title}</h3>
        {currentMenu.description && (
          <p className="text-xs text-gray-500 mt-1">{currentMenu.description}</p>
        )}
      </div>

      {productsLoading && currentMenuId === "products_list" ? (
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
          <span className="ml-2 text-sm text-gray-500">Cargando productos...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {currentMenu.options.map((option, idx) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              disabled={disabled}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                option.action === "back"
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                  : option.action === "info"
                  ? "bg-gray-50 text-gray-700 border border-gray-100 cursor-default"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              <span className="font-bold mr-2">{idx + 1}.</span>
              <span className="mr-2">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      )}

      {menuHistory.length > 0 && currentMenuId !== "main" && (
        <button
          onClick={() => {
            setMenuHistory((prev) => {
              const newHistory = [...prev];
              const previous = newHistory.pop();
              setCurrentMenuId(previous || "main");
              return newHistory;
            });
          }}
          disabled={disabled}
          className="mt-3 w-full text-center px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔙 Volver al menú anterior
        </button>
      )}
    </div>
  );
});

export default ChatMenu;
