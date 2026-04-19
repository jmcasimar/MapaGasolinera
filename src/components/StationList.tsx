import { Empty, Tag, Typography } from 'antd'
import type { FuelStation } from '../types'
import { formatDistance } from '../utils/distance'

interface StationListProps {
  stations: FuelStation[]
  loading: boolean
  selectedStationId: string | null
  onSelect: (station: FuelStation) => void
}

export const StationList = ({
  stations,
  loading,
  selectedStationId,
  onSelect,
}: StationListProps) => {
  if (loading) {
    return <Typography.Text>Cargando gasolineras...</Typography.Text>
  }

  if (stations.length === 0) {
    return <Empty description="No se encontraron gasolineras para esta ubicación." />
  }

  return (
    <div className="station-list">
      {stations.map((station) => (
        <button
          type="button"
          key={station.id}
          onClick={() => onSelect(station)}
          className={selectedStationId === station.id ? 'station-item station-item-selected' : 'station-item'}
        >
          <Typography.Text strong>
            {station.name} <Tag>{formatDistance(station.distanceMeters)}</Tag>
          </Typography.Text>
          <Typography.Text type="secondary">
            {station.address || `${station.lat.toFixed(5)}, ${station.lon.toFixed(5)}`}
          </Typography.Text>
        </button>
      ))}
    </div>
  )
}
