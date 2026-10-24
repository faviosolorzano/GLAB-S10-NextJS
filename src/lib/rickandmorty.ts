import { Character, CharacterListResponse } from '@/types/rickandmorty';

export const API_URL = 'https://rickandmortyapi.com/api/character';

// Los datos de la API se actualizan muy poco: se revalidan cada 10 días (ISR)
export const TEN_DAYS = 60 * 60 * 24 * 10;

export const STATUS_STYLES: Record<string, { label: string; badge: string; dot: string }> = {
  Alive: { label: 'Vivo', badge: 'bg-green-500/20 text-green-300 border-green-500/40', dot: 'bg-green-400' },
  Dead: { label: 'Muerto', badge: 'bg-red-500/20 text-red-300 border-red-500/40', dot: 'bg-red-400' },
  unknown: { label: 'Desconocido', badge: 'bg-gray-500/20 text-gray-300 border-gray-500/40', dot: 'bg-gray-400' },
};

export const GENDER_LABELS: Record<string, string> = {
  Female: 'Femenino',
  Male: 'Masculino',
  Genderless: 'Sin género',
  unknown: 'Desconocido',
};

// La API limita las peticiones por segundo (error 429). Durante el build se piden cientos
// de personajes, así que se reintenta con una pequeña espera antes de rendirse.
async function fetchWithRetry(url: string, options: RequestInit & { next?: { revalidate: number } }) {
  const maxAttempts = 8;
  let res = await fetch(url, options);

  for (let attempt = 1; attempt < maxAttempts && (res.status === 429 || res.status >= 500); attempt++) {
    const wait = Number(res.headers.get('retry-after')) * 1000 || attempt * 1500;
    await new Promise((resolve) => setTimeout(resolve, wait));
    res = await fetch(url, options);
  }

  return res;
}

// Página principal (SSR) con caché forzado: la respuesta se guarda y se reutiliza (SSG)
export async function getCharacters(page: number): Promise<CharacterListResponse | null> {
  const res = await fetchWithRetry(`${API_URL}?page=${page}`, { cache: 'force-cache' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Error al cargar los personajes');
  return res.json();
}

// Detalle: se revalida cada 10 días (ISR)
export async function getCharacter(id: string): Promise<Character | null> {
  const res = await fetchWithRetry(`${API_URL}/${id}`, { next: { revalidate: TEN_DAYS } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Error al cargar el personaje');
  return res.json();
}

// Obtiene los id de todos los personajes recorriendo todas las páginas de la API
export async function getAllCharacterIds(): Promise<string[]> {
  const first = await getCharacters(1);
  if (!first) return [];

  const pages = await Promise.all(
    Array.from({ length: first.info.pages - 1 }, (_, i) => getCharacters(i + 2))
  );

  return [first, ...pages]
    .flatMap((page) => page?.results ?? [])
    .map((character) => String(character.id));
}
