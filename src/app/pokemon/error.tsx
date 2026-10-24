'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { IoWarning, IoRefresh } from 'react-icons/io5'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function PokemonError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Registra el error en la consola para depuración
    console.error(error)
  }, [error])

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden text-center">
        <div className="bg-linear-to-r from-black to-red-600 p-8">
          <IoWarning size={80} className="inline-block text-yellow-300" />
          <h1 className="text-4xl font-bold text-white mt-2">¡Algo salió mal!</h1>
        </div>

        <div className="p-8 text-gray-700">
          <p className="text-lg">
            Un Pokémon salvaje interrumpió la carga de la Pokédex.
          </p>
          <p className="mt-3 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg p-3 font-mono text-sm">
            {error.message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition cursor-pointer"
            >
              <IoRefresh size={20} /> Intentar de nuevo
            </button>
            <Link
              href="/pokemon"
              className="inline-block bg-black hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition"
            >
              ← Volver al Pokédex
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
