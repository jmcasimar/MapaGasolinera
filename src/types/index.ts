export interface Coordinates {
  lat: number
  lon: number
}

export interface FuelStation {
  id: string
  name: string
  lat: number
  lon: number
  distanceMeters: number
  address?: string
}
