import { useCallback, useState } from 'react'
import type { Coordinates } from '../types'

export const useUserLocation = () => {
  const [location, setLocation] = useState<Coordinates | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSupported = 'geolocation' in navigator

  const requestLocation = useCallback(() => {
    if (!isSupported) {
      setIsLoading(false)
      setError('Tu navegador no soporta geolocalización.')
      return
    }

    setIsLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: coords.latitude, lon: coords.longitude })
        setIsLoading(false)
      },
      (positionError) => {
        setIsLoading(false)
        if (positionError.code === positionError.PERMISSION_DENIED) {
          setError('Permiso de ubicación denegado. Usa una ubicación manual.')
          return
        }
        setError('No se pudo obtener tu ubicación actual.')
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    )
  }, [isSupported])

  return {
    location,
    isLoading,
    error,
    isSupported,
    requestLocation,
  }
}
