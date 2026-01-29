# 🚗 Talleres "La Posada" - Sistema de Facturación Angular

Sistema completo de gestión de facturas para talleres mecánicos desarrollado con Angular 21 y Tailwind CSS 4.

![Angular](https://img.shields.io/badge/Angular-21.0.0-red)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.12-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)

## ✨ Características

### 📋 Formulario Reactivo y Validado
- ✅ Validación completa de todos los campos
- ✅ Validación personalizada de NIF/CIF con algoritmo de letra
- ✅ Validación de email y teléfono
- ✅ Feedback visual en tiempo real

### 📊 Gestión de Líneas de Factura
- ➕ Añadir líneas de factura dinámicamente
- 🗑️ Eliminar líneas (no se pueden modificar según requisitos)
- 💶 Cálculo automático de:
  - Base imponible por tipo de IVA (21%, 10%, 4%)
  - Importe de IVA por tipo
  - Total de la factura
- 📈 Visualización en tabla responsive

### 🔐 Sistema de Captcha
- ✅ Captcha matemático simple (suma de dos números)
- ✅ Validación antes de enviar la factura
- ✅ Generación aleatoria en cada carga

### 🎨 Diseño Profesional
- 🌈 Dashboard moderno con estadísticas
- 📱 Completamente responsive
- 🎭 Gradientes y animaciones suaves
- 🖼️ Iconos SVG integrados
- 🎨 Paleta de colores corporativa (rojo y naranja)

### 🔌 Integración con Servicio Backend
- 📤 Servicio Angular preparado para enviar datos
- 🌐 HTTP Client configurado
- 📦 Modelo de datos tipado (TypeScript)

## 🚀 Instalación y Ejecución

### Requisitos Previos
- Node.js 18+ 
- npm 11+
- Angular CLI 21+

### Instalación

```bash
# Clonar o descargar el proyecto
cd TalleresVivesAngular

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200/`

## 📁 Estructura del Proyecto

```
TalleresVivesAngular/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── dashboard/
│   │   │   │   └── dashboard.component.ts     # Dashboard principal
│   │   │   └── factura/
│   │   │       ├── factura.component.ts       # Componente de factura
│   │   │       ├── factura.component.html     # Template del formulario
│   │   │       └── factura.component.css      # Estilos personalizados
│   │   ├── models/
│   │   │   └── factura.model.ts               # Interfaces TypeScript
│   │   ├── services/
│   │   │   └── factura.service.ts             # Servicio HTTP
│   │   ├── app.config.ts                      # Configuración de la app
│   │   ├── app.routes.ts                      # Rutas
│   │   └── app.ts                             # Componente raíz
│   ├── styles.css                             # Estilos globales
│   └── index.html
├── tailwind.config.js                         # Configuración de Tailwind
├── package.json
└── README-PROYECTO.md
```

## 🎯 Funcionalidades Detalladas

### 1. Datos de la Factura
- **Número de Factura**: Solo acepta números
- **Fecha**: Selector de fecha con valor por defecto (hoy)

### 2. Datos del Cliente
- **Nombre/Razón Social**: Mínimo 3 caracteres
- **Dirección**: Campo obligatorio
- **Provincia y Ciudad**: Campos obligatorios
- **Tipo de Documento**: Selector (NIF, CIF, Pasaporte)
- **Número de Documento**: 
  - NIF: Validación con letra correcta (formato: 12345678A)
  - CIF: Validación de formato (formato: A1234567B)
- **Teléfono**: 9 dígitos exactos
- **Email**: Validación de formato estándar

### 3. Líneas de Factura
Cada línea incluye:
- **Artículo**: Descripción del servicio/producto
- **Cantidad**: Número entero positivo
- **Precio**: Precio unitario (€)
- **IVA**: Selector con opciones 21%, 10%, 4%

Cálculos automáticos:
- Base = Cantidad × Precio
- IVA = Base × (% IVA / 100)
- Total = Base + IVA

### 4. Resumen de IVA
Agrupa automáticamente todas las líneas por tipo de IVA:
- **Base Imponible 21%** + IVA 21%
- **Base Imponible 10%** + IVA 10%
- **Base Imponible 4%** + IVA 4%
- **Total Factura**: Suma de todas las bases + todos los IVAs

### 5. Captcha
- Suma simple de dos números aleatorios (0-9)
- Se regenera al limpiar el formulario
- Validación obligatoria para enviar

### 6. Envío de Datos
Al enviar la factura:
1. Valida todos los campos
2. Verifica que haya al menos una línea
3. Verifica el captcha
4. Envía al servicio `FacturaService.grabarFactura()`
5. Muestra mensaje de éxito
6. Limpia el formulario automáticamente

## 🎨 Tecnologías Utilizadas

### Frontend
- **Angular 21**: Framework principal
- **TypeScript 5.9**: Lenguaje tipado
- **Reactive Forms**: Formularios reactivos con validaciones
- **RxJS**: Programación reactiva

### Estilos
- **Tailwind CSS 4**: Framework de utilidades CSS
- **PostCSS**: Procesador de CSS
- **Autoprefixer**: Compatibilidad cross-browser

### Validaciones Implementadas
- ✅ Campos obligatorios
- ✅ Formatos específicos (email, teléfono)
- ✅ Validación NIF con algoritmo de letra
- ✅ Validación CIF con formato
- ✅ Números mínimos y máximos
- ✅ Captcha matemático

## 📝 Modelos de Datos

### Interface LineaFactura
```typescript
interface LineaFactura {
  id: number;
  articulo: string;
  cantidad: number;
  precio: number;
  tipoIva: number;
  base: number;
  iva: number;
  total: number;
}
```

### Interface Factura
```typescript
interface Factura {
  numeroFactura: string;
  fecha: string;
  nombreCliente: string;
  direccion: string;
  provincia: string;
  ciudad: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  email: string;
  lineas: LineaFactura[];
  baseImponible21: number;
  iva21: number;
  baseImponible10: number;
  iva10: number;
  baseImponible4: number;
  iva4: number;
  totalFactura: number;
}
```

## 🔧 Configuración del Servicio

El servicio está preparado para conectarse a un backend Java:

```typescript
@Injectable({ providedIn: 'root' })
export class FacturaService {
  private urlServicio = 'URL_DEL_SERVICIO_JAVA/grabarfactura';
  
  grabarFactura(facturaData: Factura): Observable<any> {
    return this.http.post<any>(this.urlServicio, facturaData);
  }
}
```

**Nota**: Actualmente simula el éxito ya que el servicio backend no existe.

## 🎭 Componentes Visuales

### Dashboard
- Navbar con logo y usuario
- Tarjetas de estadísticas
- Contenedor principal para las rutas

### Formulario de Factura
- Secciones claramente diferenciadas
- Iconos informativos
- Colores según la acción (verde=éxito, rojo=error, azul=acción)
- Animaciones suaves en hover
- Feedback visual inmediato

## 📱 Responsive Design

La aplicación es completamente responsive:
- **Desktop**: Layout a 2 columnas
- **Tablet**: Layout adaptativo
- **Mobile**: Layout a 1 columna con scroll

## 🎯 Casos de Uso

### Crear Nueva Factura
1. Completar datos de la factura
2. Completar datos del cliente
3. Añadir líneas de factura una por una
4. Verificar totales calculados automáticamente
5. Resolver el captcha
6. Enviar factura

### Añadir Línea
1. Rellenar artículo, cantidad, precio
2. Seleccionar tipo de IVA
3. Click en "Agregar Línea"
4. La línea aparece en la tabla
5. Los totales se actualizan automáticamente

### Eliminar Línea
1. Localizar la línea en la tabla
2. Click en el botón de eliminar (🗑️)
3. La línea desaparece
4. Los totales se recalculan

## 🔒 Seguridad

- Validación en cliente (Angular)
- Sanitización automática de Angular
- CSRF protection lista para implementar
- Preparado para JWT si se requiere

## 🚀 Próximas Mejoras Sugeridas

- [ ] Backend real con Spring Boot
- [ ] Autenticación y autorización
- [ ] Historial de facturas
- [ ] Generación de PDF
- [ ] Envío por email
- [ ] Multi-idioma (i18n)
- [ ] Tests unitarios y E2E
- [ ] Búsqueda y filtros
- [ ] Exportación a Excel
- [ ] Gráficas de estadísticas

## 👨‍💻 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm start              # Inicia servidor dev en puerto 4200
npm run watch          # Build en modo watch

# Testing
npm test               # Ejecuta tests unitarios

# Build
npm run build          # Build de producción
```

## 📄 Licencia

Este proyecto es parte de un ejercicio educativo para el ciclo de DAW.

## 🙏 Créditos

- **Frameworks**: Angular, Tailwind CSS
- **Componentes**: HyperUI, DaisyUI (inspiración)
- **Diseño**: Basado en la imagen de referencia proporcionada

---

## 📸 Capturas de Pantalla

### Dashboard Principal
![Dashboard con navbar, estadísticas y formulario integrado]

### Formulario de Factura
- Sección de datos de factura con número y fecha
- Sección de datos del cliente con validaciones
- Formulario para añadir líneas de factura
- Tabla con líneas añadidas
- Resumen de IVA por tipos
- Captcha de seguridad
- Botones de acción

### Validaciones
- Campos obligatorios marcados con asterisco rojo
- Mensajes de error específicos para cada campo
- Validación NIF/CIF en tiempo real
- Captcha numérico simple

---

**Desarrollado con ❤️ para Talleres "La Posada"**

*Sistema de Facturación Profesional - Angular + Tailwind CSS*
