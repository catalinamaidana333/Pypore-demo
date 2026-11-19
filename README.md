# Pypore · Trazabilidad Ganadera Soberana

Demo/MVP de **pasaporte digital de ganado** con registro de eventos en Hedera Hashgraph (HCS) y control del productor sobre qué información comparte con terceros.

**[Ver la demo](https://pypore-demo.vercel.app)**

## ¿Qué hace el proyecto?

Es una aplicación web de una sola pantalla, con estética de móvil, que simula el pasaporte de un animal (caravana `AR-05-8842-A`, raza Braford, RENSPA, origen y titular). El usuario puede:

- **Ver el pasaporte**: una línea de tiempo con los hitos del animal (nacimiento, vacunación, pesaje, traslado). Cada evento muestra su fecha, datos, un enlace a Hashscan y el identificador de la transacción previa.
- **Simular roles**: cambiar entre *Productor*, *Auditor SENASA* y *Frigorífico* para ver cómo cambia la información disponible según el rol.
- **Administrar la soberanía de datos**: el productor activa o desactiva 4 políticas de compartición (historial sanitario, métricas de peso, ubicación exacta y datos genéticos). Los eventos cuyas políticas están desactivadas se muestran bloqueados/difuminados para los demás roles.
- **Registrar un evento**: completar un formulario que envía la firma del evento a Hedera y lo agrega a la línea de tiempo, con su enlace de verificación en Hashscan.

Técnicamente, el registro encadena cada evento con el ID de transacción anterior (`previousHash`) y publica un mensaje `JSON` en un topic de Hedera Consensus Service (HCS) en testnet. La beta usa datos de ejemplo: un animal con tres eventos iniciales ya precargados.

## ¿Qué resuelve?

Eldemo aborda tres problemas del sector ganadero:

1. **Trazabilidad fragmentada**: los datos sanitarios, de peso y de origen suelen estar dispersos en sistemas distintos. El pasaporte los concentra en una sola vista.
2. **Falta de confianza**: apoyar el registro en un ledger distribuido permite que cada hito tenga un identificador de transacción público consultable en Hashscan, en lugar de depender solo de una base de datos privada.
3. **Soberanía del productor**: demuestra un modelo donde el titular decide qué categorías de datos se comparten con la autoridad sanitaria o con el comprador, y cómo cambia la vista de cada actor.

> Es una demostración de producto: el simulador de roles, los datos semilla y el estado en memoria son ilustrativos (ver *Mejoras futuras*).

## Tecnologías usadas

| Área | Tecnología |
|---|---|
| Framework | Next.js 16.4.2 (App Router, Turbopack, `cacheComponents`) |
| Interfaz | React 19.3.0, TypeScript 5.9, Tailwind CSS 4, `lucide-react`, fuentes Geist |
| Blockchain | `@hashgraph/sdk` 2.81 (Hedera Hashgraph, HCS en testnet) |
| Backend | Route Handler de Next.js (`POST /api/sign`) |
| Estado | React Context + hooks (sin librería externa) |
| Herramientas | ESLint 9, `ts-node` para scripts de operación, Node.js ≥ 20.9 |

Variables de entorno necesarias (ver `.env.example`): `HEDERA_ACCOUNT_ID`, `HEDERA_PRIVATE_KEY` y `HEDERA_TOPIC_ID`. Las credenciales se usan **solo en servidor**; nunca se exponen al navegador.

## Estructura del repositorio

```text
.
├── src/
│   ├── app/                          # App Router de Next.js
│   │   ├── api/sign/route.ts         # Endpoint POST /api/sign: valida y envía el evento a HCS
│   │   ├── globals.css               # Entrada de Tailwind CSS y tema de fuentes
│   │   ├── layout.tsx                # Layout raíz: metadatos, fuentes e idioma (es)
│   │   ├── page.tsx                  # Página única (/): monta el AppShell
│   │   └── favicon.ico
│   ├── components/                   # Capa de presentación (componentes de UI)
│   │   ├── AppShell.tsx              # Composición general, provider y cambio de vistas
│   │   ├── AnimalHeaderCard.tsx      # Cabecera con identidad del animal y rol activo
│   │   ├── BottomNavigation.tsx      # Navegación: Pasaporte / Soberanía / Registrar
│   │   ├── RoleSimulatorBanner.tsx   # Selector de rol (simulador)
│   │   ├── PassportView.tsx          # Línea de tiempo y reglas visuales de visibilidad
│   │   ├── SovereigntyView.tsx       # Interruptores de políticas del productor
│   │   ├── RegisterEventView.tsx     # Formulario de alta y estados de carga/éxito/error
│   │   └── HederaTransactionLink.tsx # Enlace reutilizable a Hashscan
│   ├── context/
│   │   └── TraceabilityContext.tsx   # Estado global y acciones (store + lógica de aplicación)
│   ├── domain/                       # Modelo y configuración de dominio
│   │   ├── traceability.ts           # Tipos: AnimalRecord, TraceabilityEvent, roles, políticas
│   │   └── demoConfig.ts             # Datos semilla, textos, etiquetas y mapeos de eventos
│   ├── lib/                          # Infraestructura y utilidades
│   │   ├── hedera.ts                 # Adaptador Hedera: cliente, topic, env y envío de mensajes
│   │   └── format.ts                 # Formateo de hashes y fechas
│   └── scripts/                      # Tareas operativas (se ejecutan con ts-node)
│       ├── createTopic.ts            # Crea el topic HCS e imprime HEDERA_TOPIC_ID
│       └── seedHistoricalEvents.ts   # Publica los eventos semilla y sugiere la config resultante
├── public/                           # Recursos estáticos
├── .env.example                      # Plantilla de variables de entorno
├── eslint.config.mjs                 # Configuración de ESLint (flat config)
├── next.config.ts                    # Configuración de Next.js / Turbopack / Tailwind
├── tsconfig.json                     # Configuración de TypeScript (alias @/* y override para ts-node)
├── package.json                      # Dependencias y scripts npm
└── AGENTS.md                         # Reglas generadas para agentes de Next.js
```

La organización sigue una **arquitectura en capas ligera**: `components` es la vista, `context` hace de controlador, `domain` contiene el modelo y `lib` la infraestructura; `app/api/sign` es la única frontera con el backend. El flujo de una firma es:

`RegisterEventView` → `registerSignedEvent` (Context) → `POST /api/sign` → `lib/hedera.ts` → topic HCS → respuesta con ID de transacción → actualización del estado y enlace en Hashscan.

## Uso local

```bash
npm install
cp .env.example .env.local   # completar con tu cuenta, clave y topic de testnet
npm run dev
```

Scripts adicionales:

- `npm run hedera:create-topic` — crea un topic HCS y muestra el `HEDERA_TOPIC_ID`.
- `npm run hedera:seed` — publica los eventos históricos de ejemplo en el topic.
- `npm run lint` — ejecuta ESLint.
- `npm run build` / `npm run start` — build y servidor de producción.

## Mejoras futuras

- **Persistencia**: hoy los eventos nuevos viven solo en memoria y se pierden al recargar. Incorporar una base de datos y/o leer los mensajes del topic mediante el mirror node para reconstruir el pasaporte desde la ledger.
- **Verificación real**: el estado `verified` actual es ilustrativo. Calcular un hash criptográfico del payload (por ejemplo SHA-256), validar el encadenamiento en servidor y confirmar el contenido contra el mirror node antes de mostrar el badge de "verificado".
- **Autenticación y permisos**: reemplazar el simulador de roles por identidad real (sesión o firma con billetera) y aplicar control de acceso en el servidor, no solo en la interfaz.
- **Soberanía efectiva**: evitar publicar datos sensibles en texto plano en un topic público; almacenar hashes o referencias y cifrar la información por destinatario, con políticas aplicadas también en backend.
- **Seguridad del endpoint**: agregar autenticación, límite de tasa, límite de tamaño del body, validación estricta del esquema e idempotencia en `POST /api/sign`.
- **Configuración de red**: permitir testnet / previewnet / mainnet por variable de entorno en lugar de valores fijos.
- **Calidad y observabilidad**: incorporar tests automatizados, error boundaries, estados de carga y manejo diferenciado de errores de configuración frente a errores de red.
- **Producto**: múltiples animales, lectura de QR/RFID, permisos por organización y trazabilidad de la cadena de frío u otros hitos sanitarios.
