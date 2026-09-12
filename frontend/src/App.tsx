import { Navigate, Route, Routes } from 'react-router-dom'

import { AppLayout } from '@/components/layout/AppLayout'
import CategoriasPage from '@/pages/categorias/CategoriasPage'
import EmpleadosPage from '@/pages/empleados/EmpleadosPage'
import InsumosPage from '@/pages/insumos/InsumosPage'
import MesaDetallePage from '@/pages/mesas/MesaDetallePage'
import MesasPage from '@/pages/mesas/MesasPage'
import NotFound from '@/pages/NotFound'
import PagoPage from '@/pages/pagos/PagoPage'
import ProductosPage from '@/pages/productos/ProductosPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/mesas" replace />} />
        <Route path="mesas" element={<MesasPage />} />
        <Route path="mesas/:mesaId" element={<MesaDetallePage />} />
        <Route path="mesas/:mesaId/pago" element={<PagoPage />} />
        <Route path="insumos" element={<InsumosPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="empleados" element={<EmpleadosPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
