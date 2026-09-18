# MyIA ChatBot

ChatBot interactivo para consultas de inventario y ventas, construido con [Next.js](https://nextjs.org), Prisma y Tailwind CSS.

## Características

- **Menú interactivo**: Navegación por opciones con botones o ingresando números.
- **Consultas de inventario**: Consulta stock de productos en tiempo real.
- **Consultas de ventas**: Revisa ventas y facturación por producto.
- **Lista de productos**: Visualiza todos los productos disponibles con stock y precios.
- **Respuestas inteligentes**: El bot interpreta consultas en lenguaje natural.

## Tecnologías

- [Next.js](https://nextjs.org) 16
- [React](https://react.dev) 19
- [Prisma](https://prisma.io) ORM con SQLite
- [Tailwind CSS](https://tailwindcss.com) 4

## Requisitos previos

- [Node.js](https://nodejs.org) 18 o superior
- npm (incluido con Node.js)

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd myia-chatbot
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la base de datos

El proyecto usa SQLite. El archivo `.env` ya está configurado, solo debes generar el cliente de Prisma y aplicar las migraciones:

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Aplicar migraciones (crea la base de datos SQLite)
npm run prisma:migrate

# Poblar la base de datos con datos de demo
npm run prisma:seed
```

> **Nota**: Si la base de datos `prisma/dev.db` ya existe con datos, puedes omitir los pasos de migrate y seed.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Cómo probar el proyecto

Al abrir la aplicación verás el chat con un **Menú Principal**. Puedes interactuar de dos formas:

### Opción A: Usar los botones del menú

1. Haz click en una opción del menú (por ejemplo: **1. Consultar Inventario**).
2. Selecciona un producto de la lista.
3. El bot responderá con la información solicitada.
4. El menú se reinicia automáticamente para una nueva consulta.

### Opción B: Escribir el número de opción

1. En el campo de texto, escribe el número de la opción que deseas (por ejemplo: `1`) y presiona **Enter**.
2. Luego escribe el número del producto (por ejemplo: `2`) y presiona **Enter**.
3. El bot responderá y el menú volverá a aparecer.

### Opción C: Escribir en lenguaje natural

También puedes escribir consultas libres como:

- `¿Cuántas unidades hay de Laptop Lenovo?`
- `¿Cuántas ventas tuvo Mouse Logitech?`
- `Resumen general de ventas`

### Navegación del menú

- Cada submenú incluye una opción para **volver al menú anterior**.
- Después de cada respuesta del bot, el **menú principal se muestra automáticamente** para facilitar una nueva consulta.

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:3000` |
| `npm run build` | Compila la aplicación para producción |
| `npm run start` | Inicia la aplicación compilada |
| `npm run lint` | Ejecuta el linter de ESLint |
| `npm run prisma:generate` | Genera el cliente de Prisma |
| `npm run prisma:migrate` | Aplica migraciones de base de datos |
| `npm run prisma:seed` | Puebla la base de datos con datos de demo |
| `npm run prisma:studio` | Abre Prisma Studio para gestionar la base de datos |

## Estructura del proyecto

```
myia-chatbot/
├── prisma/
│   ├── schema.prisma      # Esquema de la base de datos
│   ├── dev.db             # Base de datos SQLite
│   └── seed.ts            # Datos de demo
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/      # Endpoint del chatbot
│   │   │   └── products/  # Endpoint de productos
│   │   ├── page.tsx       # Página principal
│   │   └── layout.tsx     # Layout raíz
│   ├── components/
│   │   ├── Chat.tsx       # Lógica principal del chat
│   │   ├── ChatMenu.tsx   # Menú interactivo
│   │   ├── ChatInput.tsx  # Campo de entrada
│   │   └── ChatMessage.tsx # Burbujas de mensaje
│   ├── lib/
│   │   ├── prisma.ts      # Cliente de Prisma
│   │   └── interpreter/   # Intérprete de consultas
│   ├── services/
│   │   ├── inventoryService.ts
│   │   └── salesService.ts
│   └── types/
│       └── chat.ts        # Tipos TypeScript
└── package.json
```

## Base de datos

El proyecto usa **SQLite** para desarrollo. La base de datos incluye tablas de `Product` y `Sale` precargadas con datos de demo (5 productos y ventas asociadas) al ejecutar `npm run prisma:seed`.

## Despliegue

El proyecto puede desplegarse en [Vercel](https://vercel.com) o cualquier plataforma que soporte Next.js. Para producción, se recomienda cambiar SQLite por PostgreSQL actualizando la variable `DATABASE_URL` en el archivo `.env`.
