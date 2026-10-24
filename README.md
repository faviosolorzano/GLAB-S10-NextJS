# Laboratorio 10 · Enrutamiento y Páginas

Curso: Desarrollo de Aplicaciones Web Avanzado
Docente: Arévalo Sermeño, Edwin William

Proyecto con Next.js (App Router), TypeScript y Tailwind CSS para implementar páginas estáticas y dinámicas con el sistema de enrutamiento de Next.js.

## Contenido

| Ruta | Descripción | Estrategia |
|---|---|---|
| `/pokemon` | Ejercicio 1 · Lista de los 151 Pokémon | ISR (24 horas) |
| `/pokemon/[name]` | Ejercicio 1 · Detalle de cada Pokémon | SSG + ISR (24 horas) |
| `/` | Tarea · Lista de personajes de Rick and Morty con paginación | SSR + caché forzado (SSG) |
| `/buscar` | Tarea · Búsqueda por nombre, tipo, estado y género | CSR |
| `/character/[id]` | Tarea · Detalle de cada personaje | SSG + ISR (10 días) |

## Tarea: Rick and Morty

- **Página principal:** la lista se obtiene en el servidor (SSR) y la petición usa `cache: 'force-cache'` para guardar la respuesta (SSG). Las imágenes se cargan bajo demanda (lazy loading).
- **Búsqueda:** componente de cliente con `useState` y `useEffect`. Filtra en tiempo real por `name`, `type`, `status` y `gender`, sin recargar la página.
- **Detalle:** muestra todos los campos que devuelve la API. Con `generateStaticParams` se generan las rutas de todos los personajes por id, y `revalidate` actualiza los datos cada 10 días.

## Convenciones de archivos

- `src/app/pokemon/error.tsx`: pantalla personalizada cuando ocurre un error.
- `src/app/not-found.tsx`: pantalla personalizada para páginas no encontradas.

## Requisitos

- Node.js 18.18 o superior

## Instalación y ejecución

```bash
npm install
npm run dev
```

Abre http://localhost:3000 en el navegador.

Para probar la versión de producción:

```bash
npm run build
npm start
```

## Tecnologías

- Next.js
- React
- TypeScript
- Tailwind CSS
- react-icons
- PokeAPI y The Rick and Morty API
