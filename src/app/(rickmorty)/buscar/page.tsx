import { Metadata } from 'next';
import CharacterSearch from '@/components/CharacterSearch';

export const metadata: Metadata = {
  title: 'Buscar personajes - Rick and Morty',
  description: 'Busca personajes por nombre, estado, tipo y género',
};

export default function SearchPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10 animate-fade-up">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl md:text-5xl font-extrabold">🔍 Buscador</h1>
          <span className="text-xs text-cyan-300 bg-cyan-900/40 border border-cyan-700 px-3 py-1 rounded-full">
            CSR · en tiempo real
          </span>
        </div>
        <p className="mt-3 text-slate-400">
          Filtra por nombre, tipo, estado o género. Los resultados cambian mientras escribes, sin recargar la página.
        </p>
      </header>

      <CharacterSearch />
    </main>
  );
}
