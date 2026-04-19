import { ConfigProvider } from 'antd'
import { HomePage } from './pages/HomePage'
import './App.css'

function App() {
  return (
    <ConfigProvider>
      <HomePage />
    </ConfigProvider>
  )
}

export default App
