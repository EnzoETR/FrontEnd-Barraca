import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import Pedido from "./pages/Pedido";
import Contacto from "./pages/Contacto";
import MiCuenta from "./pages/MiCuenta";

import AdminPedidos from "./pages/Admin-pedidos";
import AdminCrearPedidos from "./pages/Admin-crearPedido";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* PAGINAS NORMALES */}
                <Route element={<MainLayout />}>

                    <Route path="/" element={<Inicio />} />

                    <Route
                        path="/catalogo"
                        element={<Catalogo />}
                    />

                    <Route
                        path="/pedido"
                        element={<Pedido />}
                    />

                    <Route
                        path="/contacto"
                        element={<Contacto />}
                    />

                    <Route
                        path="/micuenta"
                        element={<MiCuenta />}
                    />

                </Route>

                {/* ADMIN */}
                <Route
                    path="/admin"
                    element={<AdminLayout />}
                >

                    <Route
                        path="pedidos"
                        element={<AdminPedidos />}
                    />

                    <Route
                        path="crearPedido"
                        element={<AdminCrearPedidos />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default App;