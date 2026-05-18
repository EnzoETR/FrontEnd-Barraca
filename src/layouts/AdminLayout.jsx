import { Outlet, Link } from "react-router-dom";

function AdminLayout() {

    return (

        <div className="min-h-screen flex bg-gray-100">

            {/* SIDEBAR */}
            <aside className="w-64 bg-gray-900 text-white p-6">

                <h2 className="text-2xl font-bold mb-8">
                    Admin
                </h2>

                <nav className="space-y-3">

                    <Link
                        to="/admin/pedidos"
                        className="block p-3 rounded-lg hover:bg-gray-800"
                    >
                        Pedidos
                    </Link>

                    <Link
                   to="/admin/crearPedido"
                   className="block p-3 rounded-lg hover:bg-gray-800"
                   >
                   Crear pedido
                    </Link>

                </nav>

            </aside>

            {/* CONTENIDO */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>

        </div>
    );
}

export default AdminLayout;