import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getCharacter,
  getAllCharacterIds,
  STATUS_STYLES,
  GENDER_LABELS,
} from '@/lib/rickandmorty';

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

// ISR: los datos del personaje se revalidan cada 10 días
export const revalidate = 864000; // 10 días en segundos

// SSG: genera una página estática por cada personaje (todos los id de la API)
export async function generateStaticParams() {
  const ids = await getAllCharacterIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) return { title: 'Personaje no encontrado' };

  return {
    title: `${character.name} - Rick and Morty`,
    description: `${character.name}: ${character.species}, ${character.status}`,
  };
}

// Los episodios vienen como URL, de ahí se saca el número final
function getEpisodeNumber(url: string) {
  return url.split('/').pop();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function CharacterDetail({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  if (!character) notFound();

  const status = STATUS_STYLES[character.status] ?? STATUS_STYLES.unknown;
  const prevId = character.id > 1 ? character.id - 1 : null;
  const nextId = character.id + 1;

  const fields = [
    { label: 'ID', value: `#${character.id}` },
    { label: 'Especie', value: character.species },
    { label: 'Tipo', value: character.type || 'Sin tipo' },
    { label: 'Género', value: GENDER_LABELS[character.gender] ?? character.gender },
    { label: 'Origen', value: character.origin.name },
    { label: 'Ubicación actual', value: character.location.name },
    { label: 'Apariciones', value: `${character.episode.length} episodios` },
    { label: 'Creado en la API', value: formatDate(character.created) },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-lime-300 transition"
      >
        ← Volver a los personajes
      </Link>

      <article className="mt-6 rounded-3xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden shadow-2xl animate-fade-up">
        <div className="relative isolate overflow-hidden">
          <Image
            src={character.image}
            alt=""
            aria-hidden="true"
            width={300}
            height={300}
            className="absolute inset-0 -z-10 w-full h-full object-cover blur-3xl opacity-30 scale-150"
          />

          <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative shrink-0">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-lime-400 to-cyan-400 blur-xl opacity-40"></div>
              <Image
                src={character.image}
                alt={character.name}
                width={300}
                height={300}
                priority
                className="relative w-64 h-64 md:w-72 md:h-72 rounded-3xl object-cover border-4 border-white/20 shadow-2xl"
              />
            </div>

            <div className="text-center md:text-left">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold ${status.badge}`}
              >
                <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${status.dot}`}></span>
                {status.label}
              </span>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">{character.name}</h1>
              <p className="mt-2 text-lg text-slate-300">
                {character.species}
                {character.type ? ` · ${character.type}` : ''}
              </p>
              <a
                href={character.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-5 text-xs text-slate-400 hover:text-lime-300 underline break-all transition"
              >
                {character.url}
              </a>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 grid sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.label} className="rounded-2xl bg-slate-900/60 border border-white/10 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-lime-300">{field.label}</p>
              <p className="mt-1 text-slate-100">{field.value}</p>
            </div>
          ))}
        </div>

        <div className="px-8 md:px-10 pb-8 md:pb-10">
          <h2 className="text-xl font-bold mb-4">📺 Episodios en los que aparece</h2>
          <div className="flex flex-wrap gap-2">
            {character.episode.map((url) => (
              <span
                key={url}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-200"
              >
                Ep. {getEpisodeNumber(url)}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 p-6 bg-black/30 border-t border-white/10">
          {prevId ? (
            <Link
              href={`/character/${prevId}`}
              className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-lime-400 hover:text-lime-300 transition"
            >
              ← Anterior
            </Link>
          ) : (
            <span></span>
          )}
          <Link
            href={`/character/${nextId}`}
            className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-lime-400 hover:text-lime-300 transition"
          >
            Siguiente →
          </Link>
        </div>
      </article>
    </main>
  );
}
