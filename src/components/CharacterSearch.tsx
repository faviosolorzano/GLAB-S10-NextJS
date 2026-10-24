'use client';

// CSR: la búsqueda cambia con cada letra o filtro que elige el usuario,
// por eso necesita useState, useEffect y ejecutarse en el navegador.

import { useState, useEffect } from 'react';
import CharacterCard from '@/components/CharacterCard';
import { API_URL } from '@/lib/rickandmorty';
import { CharacterListResponse } from '@/types/rickandmorty';

interface Filters {
  name: string;
  status: string;
  type: string;
  gender: string;
}

const EMPTY_FILTERS: Filters = { name: '', status: '', type: '', gender: '' };

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'alive', label: 'Vivo' },
  { value: 'dead', label: 'Muerto' },
  { value: 'unknown', label: 'Desconocido' },
];

const GENDER_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'female', label: 'Femenino' },
  { value: 'male', label: 'Masculino' },
  { value: 'genderless', label: 'Sin género' },
  { value: 'unknown', label: 'Desconocido' },
];

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-slate-900 text-white placeholder-slate-500 border-2 border-slate-700 focus:border-lime-400 focus:shadow-lg focus:shadow-lime-400/20 focus:outline-none transition';

export default function CharacterSearch() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CharacterListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Búsqueda en tiempo real: espera 400 ms después del último cambio antes de consultar
  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({ page: String(page) });
      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim()) params.set(key, value.trim());
      });

      try {
        const res = await fetch(`${API_URL}?${params.toString()}`, { signal: controller.signal });
        if (res.status === 404) {
          setData(null);
          setError('No se encontraron personajes con esos filtros.');
        } else if (!res.ok) {
          throw new Error('Error de la API');
        } else {
          setData(await res.json());
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setData(null);
        setError('No se pudo conectar con la API. Intenta de nuevo.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, page]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setPage(1);
  };

  const hasFilters = Object.values(filters).some((v) => v.trim());

  return (
    <div>
      {/* Filtros */}
      <div className="rounded-3xl bg-white/5 backdrop-blur border border-white/10 p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wider text-lime-300 mb-2">Nombre</span>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => updateFilter('name', e.target.value)}
              placeholder="Ej: rick, morty, summer..."
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wider text-lime-300 mb-2">Tipo</span>
            <input
              type="text"
              value={filters.type}
              onChange={(e) => updateFilter('type', e.target.value)}
              placeholder="Ej: parasite, robot..."
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wider text-lime-300 mb-2">Estado</span>
            <select
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wider text-lime-300 mb-2">Género</span>
            <select
              value={filters.gender}
              onChange={(e) => updateFilter('gender', e.target.value)}
              className={inputClass}
            >
              {GENDER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-400">
            {loading ? 'Buscando...' : data ? (
              <>
                <span className="text-lime-300 font-bold">{data.info.count}</span> personajes encontrados
              </>
            ) : ' '}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-white/5 border border-white/10 hover:bg-pink-500 hover:border-pink-500 transition cursor-pointer"
            >
              ✕ Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Cargando */}
      {loading && (
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
              <div className="aspect-square bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%] animate-shimmer"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 rounded bg-slate-700 animate-pulse"></div>
                <div className="h-3 w-1/2 rounded bg-slate-700 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error o sin resultados */}
      {!loading && error && (
        <div className="text-center py-20 animate-fade-in">
          <p className="text-6xl">🛸</p>
          <p className="mt-4 text-slate-300">{error}</p>
        </div>
      )}

      {/* Resultados */}
      {!loading && data && (
        <>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {data.results.map((character, i) => (
              <CharacterCard key={character.id} character={character} index={i} />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!data.info.prev}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-lime-400 hover:text-lime-300 transition disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white cursor-pointer disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <span className="text-sm text-slate-400">
              Página <span className="text-lime-300 font-bold">{page}</span> de {data.info.pages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.info.next}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-lime-400 hover:text-lime-300 transition disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-white cursor-pointer disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
