import Link from 'next/link'
import { IoSearch } from 'react-icons/io5'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-black to-purple-900 flex items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden text-center">
        <div className="bg-linear-to-r from-black to-purple-700 p-8">
          <p className="text-8xl font-black text-yellow-300 drop-shadow-lg">404</p>
          <h1 className="text-3xl font-bold text-white mt-2">¡Pokémon no encontrado!</h1>
        </div>

        <div className="p-8 text-gray-700">
          <IoSearch size={48} className="inline-block text-purple-700" />
          <p className="text-lg mt-3">
            Buscamos en toda la Pokédex pero esta página escapó de su Pokébola.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Revisa la dirección o regresa al listado de Pokémon.
          </p>

          <Link
            href="/pokemon"
            className="inline-block mt-8 bg-black hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            ← Volver al Pokédex
          </Link>
        </div>
      </div>
    </div>
  )
}
