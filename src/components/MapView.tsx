import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import type { Marker as LeafletMarker } from 'leaflet'
import type { Coordinates, FuelStation } from '../types'
import { formatDistance } from '../utils/distance'

interface MapViewProps {
  center: Coordinates
  userLocation: Coordinates | null
  stations: FuelStation[]
  selectedStationId: string | null
  onStationSelect: (station: FuelStation) => void
  onMapSelectLocation: (coords: Coordinates) => void
}

const ChangeMapCenter = ({ center }: { center: Coordinates }) => {
  const map = useMap()

  useEffect(() => {
    map.setView([center.lat, center.lon])
  }, [center, map])

  return null
}

const ClickHandler = ({ onMapSelectLocation }: { onMapSelectLocation: (coords: Coordinates) => void }) => {
  useMapEvents({
    click: (event) => {
      onMapSelectLocation({ lat: event.latlng.lat, lon: event.latlng.lng })
    },
  })

  return null
}

export const MapView = ({
  center,
  userLocation,
  stations,
  selectedStationId,
  onStationSelect,
  onMapSelectLocation,
}: MapViewProps) => {
  const markerRefs = useRef<Record<string, LeafletMarker | null>>({})

  useEffect(() => {
    if (!selectedStationId) {
      return
    }

    markerRefs.current[selectedStationId]?.openPopup()
  }, [selectedStationId])

  const stationMarkers = useMemo(
    () =>
      stations.map((station) => (
        <Marker
          key={station.id}
          position={[station.lat, station.lon]}
          ref={(ref) => {
            markerRefs.current[station.id] = ref
          }}
          eventHandlers={{
            click: () => onStationSelect(station),
          }}
        >
          <Popup>
            <strong>{station.name}</strong>
            <br />
            Distancia: {formatDistance(station.distanceMeters)}
            <br />
            {station.address || `${station.lat.toFixed(5)}, ${station.lon.toFixed(5)}`}
          </Popup>
        </Marker>
      )),
    [onStationSelect, stations],
  )

  return (
    <MapContainer center={[center.lat, center.lon]} zoom={14} className="map-container">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeMapCenter center={center} />
      <ClickHandler onMapSelectLocation={onMapSelectLocation} />
      {userLocation ? (
        <Marker position={[userLocation.lat, userLocation.lon]}>
          <Popup>Tu ubicación</Popup>
        </Marker>
      ) : null}
      {stationMarkers}
    </MapContainer>
  )
}
