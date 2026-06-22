import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function cerrarSesion() {
    logout();
    navigate("/micuenta");
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-2">Admin</h2>
        {usuario?.nombre && (
          <p className="text-sm text-gray-400 mb-8">{usuario.nombre}</p>
        )}

        <nav className="space-y-3 flex-1">
          <Link
            to="/admin/pedidos"
            className="block p-3 rounded-lg hover:bg-gray-800"
          >
            Pedidos
          </Link>

          <Link
                      to="/admin/productos"
                      className="block p-3 rounded-lg hover:bg-gray-800"
                    >
                      Productos
                    </Link>
            <Link to={"/admin/presentacion"}
                  className="block p-3 rounded-lg hover:bg-gray-800"
                  >
                Presentacion
            </Link>
          <Link
            to="/admin/estadisticas"
            className="block p-3 rounded-lg hover:bg-gray-800"
          >
            Estadísticas
          </Link>


          <Link
            to="/catalogo"
            className="block p-3 rounded-lg hover:bg-gray-800 text-gray-300"
          >
            Volver al sitio
          </Link>
        </nav>

        <button
          type="button"
          onClick={cerrarSesion}
          className="mt-4 p-3 rounded-lg bg-red-700 hover:bg-red-600 text-left"
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
