import { Alert, Button, Card, Col, Layout, Radio, Row, Space, Spin, Typography, message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { LocationSearch } from '../components/LocationSearch'
import { MapView } from '../components/MapView'
import { StationList } from '../components/StationList'
import { useUserLocation } from '../hooks/useUserLocation'
import { searchLocation } from '../services/geocodingService'
import { fetchNearbyFuelStations } from '../services/overpassService'
import type { Coordinates, FuelStation } from '../types'

const { Content, Header } = Layout

const DEFAULT_CENTER: Coordinates = {
  lat: 19.4326,
  lon: -99.1332,
}

const SEARCH_RADII = [
  { label: '2 km', value: 2000 },
  { label: '5 km', value: 5000 },
  { label: '10 km', value: 10000 },
]

export const HomePage = () => {
  const { location, isLoading: locationLoading, error: locationError, requestLocation } = useUserLocation()

  const [manualCenter, setManualCenter] = useState<Coordinates | null>(null)
  const [radius, setRadius] = useState<number>(5000)
  const [stations, setStations] = useState<FuelStation[]>([])
  const [stationsLoading, setStationsLoading] = useState(false)
  const [stationsError, setStationsError] = useState<string | null>(null)
  const [manualSearchLoading, setManualSearchLoading] = useState(false)
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)

  const searchCenter = manualCenter ?? location ?? DEFAULT_CENTER

  const loadStations = useCallback(async (coords: Coordinates, selectedRadius: number) => {
    setStationsLoading(true)
    setStationsError(null)

    try {
      const nearbyStations = await fetchNearbyFuelStations(coords, selectedRadius)
      setStations(nearbyStations)
      setSelectedStationId(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error inesperado al consultar gasolineras.'
      setStationsError(errorMessage)
      setStations([])
    } finally {
      setStationsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStations(searchCenter, radius)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadStations, radius, searchCenter])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      requestLocation()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [requestLocation])

  const handleManualSearch = useCallback(async (query: string) => {
    setManualSearchLoading(true)

    try {
      const result = await searchLocation(query)

      if (!result) {
        message.warning('No encontramos esa ubicación. Intenta con otro texto.')
        return
      }

      setManualCenter(result)
      message.success('Ubicación actualizada manualmente.')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'No se pudo buscar la ubicación.'
      message.error(errorMessage)
    } finally {
      setManualSearchLoading(false)
    }
  }, [])

  const handleStationSelect = useCallback((station: FuelStation) => {
    setSelectedStationId(station.id)
    setManualCenter({ lat: station.lat, lon: station.lon })
  }, [])

  const controls = useMemo(
    () => (
      <Space orientation="vertical" size="middle" className="full-width">
        {locationLoading ? <Spin description="Obteniendo ubicación actual..." /> : null}
        {locationError ? <Alert type="warning" showIcon title={locationError} /> : null}
        {stationsError ? <Alert type="error" showIcon title={stationsError} /> : null}

        <LocationSearch onSearch={handleManualSearch} loading={manualSearchLoading} />

        <Space wrap>
          <Button
            onClick={() => {
              requestLocation()
              setManualCenter(null)
            }}
          >
            Usar mi ubicación
          </Button>
          <Button onClick={() => void loadStations(searchCenter, radius)}>Recargar gasolineras</Button>
        </Space>

        <div>
          <Typography.Text strong>Radio de búsqueda</Typography.Text>
          <br />
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={SEARCH_RADII}
            value={radius}
            onChange={(event) => setRadius(event.target.value)}
          />
        </div>
      </Space>
    ),
    [handleManualSearch, loadStations, locationError, locationLoading, manualSearchLoading, radius, requestLocation, searchCenter, stationsError],
  )

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Typography.Title level={3} className="app-title">
          Gasolineras cercanas
        </Typography.Title>
      </Header>
      <Content className="app-content">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card title="Mapa" extra="Haz clic en el mapa para establecer ubicación manual">
              {controls}
              <div className="map-wrapper">
                <MapView
                  center={searchCenter}
                  userLocation={location}
                  stations={stations}
                  selectedStationId={selectedStationId}
                  onStationSelect={handleStationSelect}
                  onMapSelectLocation={(coords) => setManualCenter(coords)}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title={`Resultados (${stations.length})`}>
              <StationList
                stations={stations}
                loading={stationsLoading}
                selectedStationId={selectedStationId}
                onSelect={handleStationSelect}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}
