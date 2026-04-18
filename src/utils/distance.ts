import type { Coordinates } from '../types'

const EARTH_RADIUS = 6371000

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

export const calculateDistanceMeters = (from: Coordinates, to: Coordinates): number => {
  const dLat = toRadians(to.lat - from.lat)
  const dLon = toRadians(to.lon - from.lon)
  const lat1 = toRadians(from.lat)
  const lat2 = toRadians(to.lat)

  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const angularDistance = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  return EARTH_RADIUS * angularDistance
}

export const formatDistance = (distanceMeters: number): string => {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`
  }

  return `${(distanceMeters / 1000).toFixed(2)} km`
}
