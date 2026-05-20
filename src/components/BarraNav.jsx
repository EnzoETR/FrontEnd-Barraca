import logo from "../assets/logoBarracaInicio.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BarraNav() {
  const { usuario, logout, esAdmin } = useAuth();
  const navigate = useNavigate();

  function cerrarSesion() {
    logout();
    navigate("/micuenta");
  }

  return (
    <nav className="bg-[#e5701e] text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-10">
        <img className="w-20 h-20 object-contain" src={logo} alt="Logo" />

        <ul className="flex gap-6 text-black">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/catalogo">Catalogo</Link>
          </li>
          <li>
            <Link to="/pedido">Hacer Pedido</Link>
          </li>
          <li>
            <Link to="/contacto">Contacto</Link>
          </li>
          {esAdmin() && (
            <li>
              <Link to="/admin/pedidos">Admin</Link>
            </li>
          )}
        </ul>
      </div>

      <ul className="text-black flex items-center gap-4">
        {usuario?.token ? (
          <>
            <li className="font-semibold">Hola, {usuario.nombre}</li>
            <li>
              <button
                type="button"
                onClick={cerrarSesion}
                className="underline hover:opacity-80"
              >
                Cerrar sesión
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/micuenta">Mi cuenta</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
