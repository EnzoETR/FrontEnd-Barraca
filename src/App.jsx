import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import Pedido from "./pages/Pedido";
import Contacto from "./pages/Contacto";
import MiCuenta from "./pages/MiCuenta";

import AdminPedidos from "./pages/Admin-pedidos";
import AdminCrearPedidos from "./pages/Admin-crearPedido";
import AdminProductos from "./pages/Admin-productos";
import Carrito from "./pages/Carrito.jsx";
import AdminPresentaciones from "./pages/Admin-presentaciones.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/pedido" element={<Pedido />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/micuenta" element={<MiCuenta />} />
              <Route path="/carrito" element={<Carrito />} />
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
            <Route path="crearPedido" element={<AdminCrearPedidos />} />
            <Route path="productos" element={<AdminProductos />} />
              <Route path="presentacion" element={<AdminPresentaciones />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
