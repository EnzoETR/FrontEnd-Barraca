import logo from "../assets/logoBarracaInicio.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/apiClient.js";

export default function BarraNav() {
    const { usuario, logout, esAdmin } = useAuth();
    const navigate = useNavigate();

    const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]);
    const [cantidadSinLeer, setCantidadSinLeer] = useState(0);

    function cerrarSesion() {
        logout();
        navigate("/micuenta");
    }

    useEffect(() => {
        if (usuario?.token) {
            cargarNotificaciones();
        }
    }, [usuario]);

    const cargarNotificaciones = async () => {
        try {
            const idUsuario = usuario.idUsuario || usuario.id;

            const response = await apiFetch(
                `/api/v1/notificacion/listarNotificacionesPorUsuario/${idUsuario}`
            );

            const data = await response.json();

            const ordenadas = data.sort((a, b) => {
                return new Date(b.fechaHora) - new Date(a.fechaHora);
            });

            setNotificaciones(ordenadas.slice(0, 6));

            const sinLeer = data.filter((n) => !n.leido).length;
            setCantidadSinLeer(sinLeer);

        } catch (error) {
            console.error("Error al obtener notificaciones:", error);
        }
    };

    const abrirNotificaciones = async () => {
        const nuevoEstado = !mostrarNotificaciones;
        setMostrarNotificaciones(nuevoEstado);

        if (nuevoEstado) {
            await cargarNotificaciones();

            const idUsuario = usuario.idUsuario || usuario.id;

            await apiFetch(
                `/api/v1/notificacion/marcarTodasComoLeidasPorUsuario/${idUsuario}`,
                {
                    method: "PUT"
                }
            );

            setCantidadSinLeer(0);
        }
    };

    const abrirPedidoDesdeNotificacion = (notificacion) => {
        setMostrarNotificaciones(false);

        navigate("/mispedidos", {
            state: {
                idPedido: notificacion.idPedido
            }
        });
    };

    return (
        <nav className="bg-[#e5701e] text-white p-4 flex justify-between items-center relative">
            <div className="flex items-center gap-10">
                <img className="w-20 h-20 object-contain" src={logo} alt="Logo" />

                <ul className="flex gap-6 text-black">
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/catalogo">Catalogo</Link></li>
                    <li><Link to="/contacto">Contacto</Link></li>
                    <li><Link to="/carrito">Carrito</Link></li>

                    <li>
                        {usuario?.token && (
                            <Link to="/mispedidos">Mis pedidos</Link>
                        )}
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
                        <li className="relative">
                            <button
                                type="button"
                                onClick={abrirNotificaciones}
                                className={`relative text-2xl hover:opacity-80 ${
                                    cantidadSinLeer > 0 ? "text-red-700" : ""
                                }`}
                            >
                                <i className="pi pi-bell" style={{ fontSize: "1.5rem" }}></i>

                                {cantidadSinLeer > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                                        {cantidadSinLeer}
                                    </span>
                                )}
                            </button>

                            {mostrarNotificaciones && (
                                <div className="absolute right-0 top-10 w-80 bg-white text-black shadow-lg rounded-lg z-50 border">
                                    <div className="p-3 font-semibold border-b">
                                        Notificaciones
                                    </div>

                                    {notificaciones.length > 0 ? (
                                        <div className="max-h-80 overflow-y-auto">
                                            {notificaciones.map((notificacion) => (
                                                <div
                                                    key={notificacion.id}
                                                    onClick={() => abrirPedidoDesdeNotificacion(notificacion)}
                                                    className={`
                                                        p-3 border-b text-sm hover:bg-gray-100 cursor-pointer
                                                        ${!notificacion.leido ? "bg-orange-100 font-semibold" : "bg-white"}
                                                    `}
                                                >
                                                    <p>{notificacion.mensaje}</p>

                                                    {notificacion.fechaHora && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(notificacion.fechaHora).toLocaleString()}
                                                        </p>
                                                    )}

                                                    {!notificacion.leido && (
                                                        <p className="text-xs text-orange-600 mt-1">
                                                            Nueva
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-3 text-sm text-gray-500">
                                            No tenés notificaciones.
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>

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