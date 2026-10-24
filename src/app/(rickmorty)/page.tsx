import Link from 'next/link';
import { notFound } from 'next/navigation';
import CharacterCard from '@/components/CharacterCard';
import { getCharacters } from '@/lib/rickandmorty';

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

function getPageNumbers(current: number, total: number): (number | '...')[] {
  const pages: (number | '...')[] = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - current) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }
  return pages;
}

// SSR con caché forzado: la página se arma en el servidor y la petición a la API
// se guarda con cache: 'force-cache' (SSG), así no se vuelve a pedir en cada visita.
export default async function Home({ searchParams }: HomeProps) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);

  const data = await getCharacters(current);
  if (!data) notFound();

  const { info, results } = data;

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="text-center animate-fade-up">
        <span className="inline-block px-4 py-1 mb-5 rounded-full text-xs font-bold tracking-widest uppercase bg-white/10 border border-white/20 text-lime-300">
          Next.js · SSR + SSG + ISR
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
          Universo{' '}
          <span className="bg-gradient-to-r from-lime-300 via-cyan-300 to-fuchsia-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
            Rick and Morty
          </span>
        </h1>
        <p className="mt-5 text-lg text-slate-300 max-w-2xl mx-auto">
          Explora a todos los personajes de la serie. Cada ficha se genera con anticipación para que cargue al instante.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {[
            { label: 'Personajes', value: info.count },
            { label: 'Páginas', value: info.pages },
            { label: 'Por página', value: results.length },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-4">
              <p className="text-3xl font-extrabold text-lime-300">{item.value}</p>
              <p className="text-xs text-slate-400 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        <Link
          href="/buscar"
          className="inline-block mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-bold hover:scale-105 hover:shadow-lg hover:shadow-lime-400/30 transition"
        >
          🔍 Buscar personajes
        </Link>
      </header>

      <section className="mt-16">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <h2 className="text-3xl font-extrabold">Todos los personajes</h2>
          <span className="text-xs text-lime-300 bg-lime-900/40 border border-lime-700 px-3 py-1 rounded-full">
            Página {current} de {info.pages}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {results.map((character, i) => (
            <CharacterCard key={character.id} character={character} index={i} />
          ))}
        </div>

        {/* Paginación */}
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación">
          {info.prev ? (
            <Link
              href={`/?page=${current - 1}`}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-lime-400 hover:text-lime-300 transition"
            >
              ← Anterior
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-600">← Anterior</span>
          )}

          {getPageNumbers(current, info.pages).map((p, i) =>
            p === '...' ? (
              <span key={`dots-${i}`} className="px-2 text-slate-500">…</span>
            ) : (
              <Link
                key={p}
                href={`/?page=${p}`}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold transition ${
                  p === current
                    ? 'bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950'
                    : 'bg-white/5 border border-white/10 hover:border-lime-400 hover:text-lime-300'
                }`}
              >
                {p}
              </Link>
            )
          )}

          {info.next ? (
            <Link
              href={`/?page=${current + 1}`}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-lime-400 hover:text-lime-300 transition"
            >
              Siguiente →
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-600">Siguiente →</span>
          )}
        </nav>
      </section>
    </main>
  );
}
