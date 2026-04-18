# MapaGasolinera

Aplicación web en **React + TypeScript** para localizar gasolineras cercanas con mapa interactivo.

## Características principales

- UI construida con **Ant Design**.
- Mapa interactivo con **Leaflet** y **react-leaflet**.
- Detección de ubicación actual del usuario (Geolocation API).
- Alternativas manuales de ubicación:
  - búsqueda por texto (Nominatim / OpenStreetMap),
  - clic en el mapa para fijar ubicación.
- Consulta de gasolineras cercanas con **Overpass API** (`amenity=fuel`).
- Radio configurable de búsqueda: **2 km, 5 km, 10 km**.
- Listado ordenado por distancia con interacción mapa/lista.
- Estados de carga, error, sin resultados y permiso denegado.
- Diseño responsivo para móvil y escritorio.

## Requisitos

- Node.js 20+
- npm 10+

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abrir en navegador: `http://localhost:5173`

## Scripts disponibles

```bash
npm run dev      # desarrollo
npm run lint     # análisis estático
npm run build    # compilación de producción
npm run preview  # vista previa de build
```

## Estructura del proyecto

```text
src/
  components/    # componentes reutilizables de UI
  hooks/         # lógica de geolocalización
  pages/         # páginas/contenedores
  services/      # integración Overpass y Nominatim
  types/         # tipos de dominio
  utils/         # utilidades (distancia/formato)
```

## Decisiones técnicas

- **Vite + React + TypeScript** para una base moderna y mantenible.
- **Capa de servicios desacoplada** para facilitar cambiar Overpass/Nominatim en el futuro.
- Cálculo de distancia mediante **fórmula de Haversine** para ordenar resultados por cercanía.
- Manejo explícito de errores de red, timeout y respuestas vacías.

## Variables de entorno

Actualmente no se requieren variables de entorno para ejecutar la app.

## Limitaciones conocidas

- Overpass y Nominatim son servicios públicos y pueden responder lento o con límites temporales.
- La disponibilidad de datos depende de OpenStreetMap en cada zona.
- En algunos entornos corporativos/redes restringidas, las teselas OSM o las APIs pueden bloquearse.

## Captura de referencia

- Screenshot sugerido para el PR: https://github.com/user-attachments/assets/d0b40273-d663-4f75-ab22-829d41dd6761
