import AppRoutes from './routes'
import { BrowserRouter } from 'react-router-dom'
import DataProvider from './context/DataContext'

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AppRoutes />
      </DataProvider>
    </BrowserRouter>
  )
}

export default App
