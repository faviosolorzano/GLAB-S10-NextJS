import { ReactNode } from 'react';
import Link from 'next/link';

interface RickMortyLayoutProps {
  children: ReactNode;
}

export default function RickMortyLayout({ children }: RickMortyLayoutProps) {
  return (
    <div className="relative isolate min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <div className="absolute top-0 -left-24 -z-10 w-[32rem] h-[32rem] rounded-full bg-lime-500/20 blur-3xl animate-float"></div>
      <div className="absolute top-1/3 -right-24 -z-10 w-[32rem] h-[32rem] rounded-full bg-cyan-500/20 blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-0 left-1/4 -z-10 w-96 h-96 rounded-full bg-fuchsia-500/10 blur-3xl animate-float"></div>

      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/70 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <span className="inline-block w-8 h-8 rounded-full bg-[conic-gradient(from_0deg,#a3e635,#22d3ee,#a3e635)] animate-spin-slow"></span>
            <span className="bg-gradient-to-r from-lime-300 to-cyan-300 bg-clip-text text-transparent">
              Rick and Morty
            </span>
          </Link>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Link href="/" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-lime-300 transition">
              Personajes
            </Link>
            <Link href="/buscar" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-lime-300 transition">
              Buscar
            </Link>
            <Link
              href="/pokemon"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-lime-400 to-cyan-400 text-slate-950 font-bold hover:scale-105 transition"
            >
              Pokédex
            </Link>
          </div>
        </div>
      </nav>

      {children}

      <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-500">
        Datos de The Rick and Morty API · Hecho con Next.js, TypeScript y Tailwind CSS
      </footer>
    </div>
  );
}
