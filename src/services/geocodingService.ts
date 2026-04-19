import type { Coordinates } from '../types'

interface NominatimResponse {
  lat: string
  lon: string
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

export const searchLocation = async (query: string): Promise<Coordinates | null> => {
  const params = new URLSearchParams({
    q: query,
    format: 'jsonv2',
    limit: '1',
  })

  let response: Response
  try {
    response = await fetch(`${NOMINATIM_URL}?${params.toString()}`)
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('No fue posible conectar con el servicio de geocodificación.')
    }
    throw error
  }

  if (!response.ok) {
    throw new Error(`No fue posible buscar la ubicación (${response.status})`)
  }

  const data = (await response.json()) as NominatimResponse[]
  const firstResult = data[0]

  if (!firstResult) {
    return null
  }

  return {
    lat: Number(firstResult.lat),
    lon: Number(firstResult.lon),
  }
}
