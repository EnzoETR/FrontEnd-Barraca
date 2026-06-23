import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import Contacto from "./pages/Contacto";
import MiCuenta from "./pages/MiCuenta";

import AdminPedidos from "./pages/Admin-pedidos";
import AdminProductos from "./pages/Admin-productos";
import Carrito from "./pages/Carrito.jsx";
import AdminPresentaciones from "./pages/Admin-presentaciones.jsx";
import MisPedidos from "./pages/Mis-Pedidos.jsx";
import AdminEstadisticas from "./pages/Admin-estadisticas.jsx";
import AdminReparto from "./pages/Admin-reparto.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/micuenta" element={<MiCuenta />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/mispedidos" element={<MisPedidos/>}/>
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminPedidos />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="productos" element={<AdminProductos />} />
              <Route path="presentacion" element={<AdminPresentaciones />} />
            <Route path="estadisticas" element={<AdminEstadisticas />} />
            <Route path="reparto" element={<AdminReparto />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
