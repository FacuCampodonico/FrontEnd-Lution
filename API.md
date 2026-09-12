# API Lution — Endpoints de Backend

Diseño REST derivado de las pantallas del frontend ya construido (mesas, pedidos, pagos, catálogo e insumos). Rutas acotadas a lo que las pantallas actuales consumen (sin paginación ni filtros, según los servicios ya implementados en `frontend/src/services/*.ts`). Edición y borrado de catálogo (productos, categorías, insumos, empleados) no están contempladas porque ninguna pantalla del mockup los expone todavía.

## Mesas

Pantalla "Mesas" (grilla principal) y navegación al detalle de mesa.

| Método | Ruta | Propósito |
|---|---|---|
| GET | `/api/mesas` | Lista todas las mesas con su estado y total actual. Pantalla: Mesas (grilla de tarjetas). |
| GET | `/api/mesas/:id` | Detalle de una mesa puntual. Pantalla: Detalle de mesa (header). |
| POST | `/api/mesas` | Crea una mesa nueva. Modal: Crear mesa. |

**POST /api/mesas — request**
```json
{ "numero": "12" }
```

**Mesa — response** (GET /api/mesas, GET /api/mesas/:id, POST /api/mesas → 201)
```json
{
  "id": "m_01",
  "numero": "12",
  "estado": "libre",
  "pedidoActualId": null,
  "totalActual": 0,
  "cantidadItems": 0
}
```
`estado`: `"libre" | "abierta" | "por_pagar"`

## Pedidos

Pantalla de detalle de mesa: catálogo de productos + panel de selección ("Crear pedido", agregar/quitar ítems).

| Método | Ruta | Propósito |
|---|---|---|
| GET | `/api/mesas/:mesaId/pedido` | Pedido abierto de la mesa (o `null` si no hay). Se usa al entrar al detalle de mesa y en la pantalla de Pago. |
| POST | `/api/mesas/:mesaId/pedido` | Crea el pedido de la mesa con los ítems armados en el carrito local y pasa la mesa a "abierta". Botón "Crear pedido". |
| POST | `/api/pedidos/:pedidoId/items` | Agrega un ítem a un pedido ya existente. |
| DELETE | `/api/pedidos/:pedidoId/items/:itemId` | Quita un ítem del pedido. |

**POST /api/mesas/:mesaId/pedido — request**
```json
{
  "items": [
    { "productoId": "p_01", "cantidad": 2 },
    { "productoId": "p_07", "cantidad": 1 }
  ]
}
```

**POST /api/pedidos/:pedidoId/items — request**
```json
{ "productoId": "p_03", "cantidad": 1 }
```

**Pedido — response** (GET, POST, DELETE item → 200/201)
```json
{
  "id": "pe_01",
  "mesaId": "m_01",
  "estado": "abierto",
  "items": [
    {
      "id": "it_01",
      "productoId": "p_01",
      "productoNombre": "Milanesa napolitana",
      "precioUnitario": 8500,
      "cantidad": 2
    }
  ],
  "total": 17000
}
```
`estado`: `"abierto" | "pagado"`

## Pagos

Pantalla de Pago: elección de método (efectivo / tarjeta) y cierre de mesa.

| Método | Ruta | Propósito |
|---|---|---|
| POST | `/api/pagos` | Registra el pago del pedido, lo marca "pagado" y libera la mesa (vuelve a "libre"). |

**POST /api/pagos — request**
```json
{ "pedidoId": "pe_01", "metodo": "efectivo" }
```

**Pago — response** (201)
```json
{
  "id": "pa_01",
  "pedidoId": "pe_01",
  "metodo": "efectivo",
  "monto": 17000,
  "fecha": "2026-09-12T14:30:00Z"
}
```
`metodo`: `"efectivo" | "tarjeta"`

## Categorías

Pantalla listado de Categorías + modal de creación.

| Método | Ruta | Propósito |
|---|---|---|
| GET | `/api/categorias` | Lista de categorías. Alimenta la tabla y el selector de categoría al crear un producto. |
| POST | `/api/categorias` | Crea una categoría. Modal: Crear categoría. |

**POST /api/categorias — request**
```json
{ "nombre": "Bebidas", "productoIds": ["p_01", "p_02"] }
```

**Categoria — response** (200/201)
```json
{
  "id": "c_01",
  "nombre": "Bebidas",
  "productoIds": ["p_01", "p_02"]
}
```

## Productos

Pantalla listado de Productos + modal de creación (con selección de categoría e insumos).

| Método | Ruta | Propósito |
|---|---|---|
| GET | `/api/productos` | Lista de productos. Alimenta la tabla y el catálogo del detalle de mesa. |
| POST | `/api/productos` | Crea un producto asociado a una categoría y a sus insumos/receta. Modal: Crear producto. |

**POST /api/productos — request**
```json
{
  "nombre": "Milanesa napolitana",
  "precio": 8500,
  "categoriaId": "c_01",
  "insumoIds": ["i_01", "i_04"]
}
```

**Producto — response** (200/201)
```json
{
  "id": "p_01",
  "nombre": "Milanesa napolitana",
  "precio": 8500,
  "categoriaId": "c_01",
  "categoriaNombre": "Platos principales",
  "insumoIds": ["i_01", "i_04"]
}
```

## Insumos

Pantalla listado de Insumos + modal de creación.

| Método | Ruta | Propósito |
|---|---|---|
| GET | `/api/insumos` | Lista de insumos. Alimenta la tabla y el selector de insumos al crear un producto. |
| POST | `/api/insumos` | Crea un insumo. Modal: Crear insumo. |

**POST /api/insumos — request**
```json
{ "nombre": "Harina", "stock": 25, "unidad": "kg" }
```

**Insumo — response** (200/201)
```json
{
  "id": "i_01",
  "nombre": "Harina",
  "stock": 25,
  "unidad": "kg"
}
```
`unidad`: `"kg" | "litros" | "unidades" | "latas" | "gramos"`

## Empleados

Pantalla listado de Empleados + modal de creación. Un único recurso con `rol` discriminante cubre mozos y admins.

| Método | Ruta | Propósito |
|---|---|---|
| GET | `/api/empleados` | Lista de empleados (mozos y admins). |
| POST | `/api/empleados` | Crea un empleado con su rol. Modal: Crear empleado. |

**POST /api/empleados — request**
```json
{ "nombre": "Ana", "apellido": "Pérez", "rol": "mozo" }
```

**Empleado — response** (200/201)
```json
{
  "id": "e_01",
  "nombre": "Ana",
  "apellido": "Pérez",
  "rol": "mozo",
  "activo": true
}
```
`rol`: `"mozo" | "admin"`

## Códigos de estado HTTP

| Código | Significado |
|---|---|
| 200 | OK — GET o acción exitosa (agregar/quitar ítem, pago registrado) |
| 201 | Created — recurso creado (mesa, pedido, producto, categoría, insumo, empleado, pago) |
| 400 | Bad Request — payload inválido (campo faltante, cantidad ≤ 0) |
| 404 | Not Found — id de mesa/pedido/producto/ítem inexistente |
| 409 | Conflict — ej. crear pedido en una mesa que ya tiene uno abierto |
| 500 | Internal Server Error — error no controlado del backend |
