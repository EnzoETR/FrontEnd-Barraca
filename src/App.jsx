import { BrowserRouter, Routes, Route } from "react-router-dom";

import BarraNav from "./components/BarraNav";
import Footer from "./components/Footer";

import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import Pedido from "./pages/Pedido";
import Contacto from "./pages/Contacto";
import MiCuenta from "./pages/MiCuenta";

function App() {
  return (
    <BrowserRouter>

      <BarraNav />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/pedido" element={<Pedido />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/micuenta" element={<MiCuenta />} />
      </Routes>

       <Footer />

    </BrowserRouter>
  );
}

export default App;