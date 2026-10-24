import Link from 'next/link';
import Image from 'next/image';
import { Character } from '@/types/rickandmorty';
import { STATUS_STYLES } from '@/lib/rickandmorty';

interface CharacterCardProps {
  character: Character;
  index?: number;
}

export default function CharacterCard({ character, index = 0 }: CharacterCardProps) {
  const status = STATUS_STYLES[character.status] ?? STATUS_STYLES.unknown;

  return (
    <Link
      href={`/character/${character.id}`}
      className="group relative block rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-xl hover:border-lime-400 hover:shadow-lime-400/20 hover:-translate-y-2 transition duration-300 animate-fade-up"
      style={{ animationDelay: `${(index % 20) * 40}ms` }}
    >
      <div className="relative overflow-hidden">
        <Image
          src={character.image}
          alt={character.name}
          width={300}
          height={300}
          loading="lazy" // Lazy Loading: la imagen se descarga solo cuando está por aparecer en pantalla
          className="w-full aspect-square object-cover group-hover:scale-110 transition duration-500"
        />
        <span className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-lime-300">
          #{character.id}
        </span>
        <span
          className={`absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-semibold backdrop-blur ${status.badge}`}
        >
          <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
          {status.label}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-1 group-hover:text-lime-300 transition">
          {character.name}
        </h3>
        <p className="text-slate-400 text-sm mt-1">{character.species}</p>
        <p className="text-slate-500 text-xs mt-3 line-clamp-1">
          📍 {character.location.name}
        </p>
      </div>
    </Link>
  );
}
