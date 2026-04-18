import type { Coordinates, FuelStation } from '../types'
import { calculateDistanceMeters } from '../utils/distance'

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter'
const REQUEST_TIMEOUT_MS = 12000

interface OverpassElement {
  id: number
  type: 'node' | 'way' | 'relation'
  lat?: number
  lon?: number
  center?: {
    lat: number
    lon: number
  }
  tags?: Record<string, string>
}

interface OverpassResponse {
  elements: OverpassElement[]
}

const buildAddress = (tags: Record<string, string> | undefined): string | undefined => {
  if (!tags) {
    return undefined
  }

  if (tags['addr:full']) {
    return tags['addr:full']
  }

  const parts = [tags['addr:street'], tags['addr:housenumber'], tags['addr:city']].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : undefined
}

export const fetchNearbyFuelStations = async (
  origin: Coordinates,
  radiusMeters: number,
): Promise<FuelStation[]> => {
  const query = `[out:json][timeout:25];(node["amenity"="fuel"](around:${radiusMeters},${origin.lat},${origin.lon});way["amenity"="fuel"](around:${radiusMeters},${origin.lat},${origin.lon});relation["amenity"="fuel"](around:${radiusMeters},${origin.lat},${origin.lon}););out center tags;`

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Overpass respondió con estado ${response.status}`)
    }

    const data = (await response.json()) as OverpassResponse

    const stations = data.elements
      .map((element): FuelStation | null => {
        const lat = element.lat ?? element.center?.lat
        const lon = element.lon ?? element.center?.lon

        if (lat === undefined || lon === undefined) {
          return null
        }

        const name = element.tags?.name?.trim() || 'Gasolinera sin nombre'
        const address = buildAddress(element.tags)

        return {
          id: `${element.type}-${element.id}`,
          name,
          lat,
          lon,
          ...(address ? { address } : {}),
          distanceMeters: calculateDistanceMeters(origin, { lat, lon }),
        }
      })
      .filter((station): station is FuelStation => station !== null)

    return stations.sort((a, b) => a.distanceMeters - b.distanceMeters)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La consulta tardó demasiado. Intenta nuevamente.')
    }

    if (error instanceof TypeError) {
      throw new Error('No fue posible conectar con Overpass API. Reintenta en unos minutos.')
    }

    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}
