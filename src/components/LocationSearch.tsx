import { Button, Input, Space } from 'antd'
import { useState } from 'react'

interface LocationSearchProps {
  onSearch: (query: string) => Promise<void>
  loading: boolean
}

export const LocationSearch = ({ onSearch, loading }: LocationSearchProps) => {
  const [query, setQuery] = useState('')

  const onSubmit = async () => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      return
    }

    await onSearch(trimmedQuery)
  }

  return (
    <Space.Compact block>
      <Input
        placeholder="Buscar ciudad, dirección o código postal"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onPressEnter={() => {
          void onSubmit()
        }}
        aria-label="Buscar ubicación"
      />
      <Button type="primary" loading={loading} onClick={() => void onSubmit()}>
        Buscar
      </Button>
    </Space.Compact>
  )
}
