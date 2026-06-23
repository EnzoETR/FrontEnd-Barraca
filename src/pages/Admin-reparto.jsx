import { useEffect, useState } from "react";
import { apiFetch } from "../services/apiClient";

function AdminReparto() {
    const [pedidos, setPedidos] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerPedidos();
    }, []);

    const obtenerPedidos = async () => {
        try {
            const response = await apiFetch("/api/v1/pedidos/listarPedidos");
            const data = await response.json();

            console.log(data);

            const pedidosEnPreparacion = data.filter(
                pedido => pedido.estado === "en_preparacion"  );

            setPedidos(pedidosEnPreparacion);
        } catch (error) {
            console.error("Error al obtener pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    const armarDireccion = (pedido) => {
        let direccion = "";

        if (pedido.calle) {
            direccion += pedido.calle;
        }

        if (pedido.numeroCasa) {
            direccion += ` ${pedido.numeroCasa}`;
        }

        direccion += ", Paysandú, Uruguay";

        return direccion;
    };

    const manejarSeleccion = (pedido) => {
        const yaSeleccionado = seleccionados.some(
            p => p.idPedido === pedido.idPedido
        );

        if (yaSeleccionado) {
            setSeleccionados(
                seleccionados.filter(p => p.idPedido !== pedido.idPedido)
            );
        } else {
            setSeleccionados([...seleccionados, pedido]);
        }
    };

    const generarRuta = () => {
        if (seleccionados.length === 0) {
            alert("Seleccioná al menos un pedido para generar la ruta.");
            return;
        }

        const direcciones = seleccionados.map(pedido =>
            encodeURIComponent(armarDireccion(pedido))
        );

        let url = "";

        if (direcciones.length === 1) {
            url = `https://www.google.com/maps/search/?api=1&query=${direcciones[0]}`;
        } else {
            const origen = direcciones[0];
            const destino = direcciones[direcciones.length - 1];
            const paradas = direcciones.slice(1, direcciones.length - 1).join("|");

            url = `https://www.google.com/maps/dir/?api=1&origin=${origen}&destination=${destino}&travelmode=driving`;

            if (paradas) {
                url += `&waypoints=${paradas}`;
            }
        }

        window.open(url, "_blank");
    };

    return (
        <div className="admin-reparto">
            <h2>Reparto</h2>

            <p>
                Seleccioná los pedidos que querés agregar al viaje.
            </p>

            {loading ? (
                <p>Cargando pedidos...</p>
            ) : pedidos.length === 0 ? (
                <p>No hay pedidos en preparación.</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Seleccionar</th>
                                <th>Pedido</th>
                                <th>Cliente</th>
                                <th>Teléfono</th>
                                <th>Dirección</th>
                                <th>Referencia</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pedidos.map((pedido) => (
                                <tr key={pedido.idPedido}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={seleccionados.some(
                                                p => p.idPedido === pedido.idPedido
                                            )}
                                            onChange={() => manejarSeleccion(pedido)}
                                        />
                                    </td>

                                    <td>#{pedido.idPedido}</td>

                                    <td>{pedido.nombreCliente}</td>

                                    <td>{pedido.telefonoCliente}</td>

                                    <td>
                                        {pedido.calle} {pedido.numeroCasa}
                                    </td>

                                    <td>
                                        {pedido.referencia || "Sin referencia"}
                                    </td>

                                    <td>{pedido.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: "20px" }}>
                        <h3>Ruta del viaje</h3>

                        {seleccionados.length === 0 ? (
                            <p>No seleccionaste ningún pedido.</p>
                        ) : (
                            <ol>
                                {seleccionados.map((pedido, index) => (
                                    <li key={pedido.idPedido}>
                                        Ruta x kilómetro {index + 1}:{" "}
                                        {pedido.calle} {pedido.numeroCasa}
                                        {pedido.referencia && (
                                            <> - {pedido.referencia}</>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>

                    <button
                        onClick={generarRuta}
                        disabled={seleccionados.length === 0}
                    >
                        Generar ruta
                    </button>
                </>
            )}
        </div>
    );
}

export default AdminReparto;