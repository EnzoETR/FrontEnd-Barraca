import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Tag } from "primereact/tag";
import { apiFetch } from "../services/apiClient";

function AdminReparto() {
    const [pedidos, setPedidos] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [optimizando, setOptimizando] = useState(false);
    const [mapUrl, setMapUrl] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        void obtenerPedidos();
    }, []);

    const obtenerPedidos = async () => {
        try {
            const response = await apiFetch("/api/v1/pedidos/listarPedidos");
            const data = await response.json();

            const pedidosEnPreparacion = data.filter(
                (pedido) => pedido.estado === "en_preparacion"
            );

            setPedidos(pedidosEnPreparacion);
        } catch (error) {
            console.error("Error al obtener pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    const armarDireccion = (pedido) => {
        const partes = [pedido.calle, pedido.numeroCasa].filter(Boolean);
        return `${partes.join(" ")}, Paysandú, Uruguay`;
    };

    const construirUrlMapa = (rutaPedidos) => {
        if (!rutaPedidos?.length) {
            return "";
        }

        const direcciones = rutaPedidos.map((pedido) => armarDireccion(pedido));
        const url = new URL("https://www.google.com/maps/dir/");
        url.searchParams.set("api", "1");
        url.searchParams.set("origin", direcciones[0]);
        url.searchParams.set("destination", direcciones[direcciones.length - 1]);
        url.searchParams.set("travelmode", "driving");

        if (direcciones.length > 2) {
            url.searchParams.set("waypoints", direcciones.slice(1, -1).join("|"));
        }

        return url.toString();
    };

    const mostrarRuta = (rutaPedidos = seleccionados) => {
        if (!rutaPedidos.length) {
            setMapUrl("");
            setMensaje("Seleccioná al menos un pedido para ver la ruta.");
            return;
        }

        const urlMapa = construirUrlMapa(rutaPedidos);
        setMapUrl(urlMapa);
        setMensaje(`Ruta lista para ${rutaPedidos.length} parada${rutaPedidos.length === 1 ? "" : "s"}.`);
    };

    const geocodificarDireccion = async (direccion) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=0&q=${encodeURIComponent(direccion)}`,
                {
                    headers: {
                        "Accept-Language": "es",
                    },
                }
            );

            if (!response.ok) {
                return null;
            }

            const data = await response.json();

            if (!data?.length) {
                return null;
            }

            const { lat, lon } = data[0];
            return { lat: Number(lat), lon: Number(lon) };
        } catch {
            return null;
        }
    };

    const optimizarRuta = async () => {
        if (seleccionados.length < 2) {
            setMensaje("Seleccioná al menos dos pedidos para optimizar el orden.");
            return;
        }

        setOptimizando(true);
        setMensaje("Optimizando el orden de las paradas...");

        try {
            const resultados = await Promise.all(
                seleccionados.map(async (pedido) => ({
                    pedido,
                    coords: await geocodificarDireccion(armarDireccion(pedido)),
                }))
            );

            const conCoordenadas = resultados.filter((item) => item.coords);
            const sinCoordenadas = resultados.filter((item) => !item.coords);

            if (conCoordenadas.length < 2) {
                throw new Error("No se pudieron ubicar las direcciones");
            }

            const rutaOptimizada = [];
            const pendientes = [...conCoordenadas];
            let actual = pendientes.shift();
            rutaOptimizada.push(actual.pedido);

            while (pendientes.length > 0) {
                let siguienteIndex = 0;
                let distanciaMinima = Number.POSITIVE_INFINITY;

                pendientes.forEach((item, index) => {
                    const distancia = Math.hypot(
                        item.coords.lat - actual.coords.lat,
                        item.coords.lon - actual.coords.lon
                    );

                    if (distancia < distanciaMinima) {
                        distanciaMinima = distancia;
                        siguienteIndex = index;
                    }
                });

                actual = pendientes.splice(siguienteIndex, 1)[0];
                rutaOptimizada.push(actual.pedido);
            }

            const rutaFinal = [...rutaOptimizada, ...sinCoordenadas.map((item) => item.pedido)];
            setSeleccionados(rutaFinal);
            mostrarRuta(rutaFinal);
            setMensaje("El orden de reparto quedó optimizado automáticamente.");
        } catch {
            setMensaje("No fue posible optimizar automáticamente; se mantuvo el orden actual.");
        } finally {
            setOptimizando(false);
        }
    };

    const renderEstado = (pedido) => {
        const severity = pedido.estado === "en_preparacion" ? "info" : "success";
        return <Tag value={pedido.estado.replace(/_/g, " ")} severity={severity} />;
    };

    return (
        <div style={{ display: "grid", gap: "1rem" }}>
            <Card title="Reparto" subTitle="Seleccioná los pedidos, optimizá el orden y visualizá la ruta en la misma pantalla.">
                {loading ? (
                    <p>Cargando pedidos...</p>
                ) : pedidos.length === 0 ? (
                    <p>No hay pedidos en preparación.</p>
                ) : (
                    <>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
                            <Button
                                label="Optimizar orden"
                                icon="pi pi-sort-alt"
                                onClick={optimizarRuta}
                                disabled={seleccionados.length < 2 || optimizando}
                                loading={optimizando}
                            />
                            <Button
                                label="Calcular ruta"
                                icon="pi pi-map-marker"
                                onClick={() => mostrarRuta(seleccionados)}
                                disabled={seleccionados.length === 0}
                            />
                        </div>

                        {mensaje ? <Message severity="info" text={mensaje} style={{ marginBottom: "1rem" }} /> : null}

                        <DataTable
                            value={pedidos}
                            selection={seleccionados}
                            onSelectionChange={(e) => {
                                setSeleccionados(e.value);
                                setMensaje("");
                            }}
                            selectionMode="multiple"
                            dataKey="idPedido"
                            responsiveLayout="scroll"
                            paginator
                            rows={8}
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
                            <Column header="Pedido" body={(pedido) => `#${pedido.idPedido}`} />
                            <Column field="nombreCliente" header="Cliente" />
                            <Column field="telefonoCliente" header="Teléfono" />
                            <Column
                                header="Dirección"
                                body={(pedido) => `${pedido.calle || ""} ${pedido.numeroCasa || ""}`.trim() || "Sin dirección"}
                            />
                            <Column
                                header="Referencia"
                                body={(pedido) => pedido.referencia || "Sin referencia"}
                            />
                            <Column header="Estado" body={(pedido) => renderEstado(pedido)} />
                        </DataTable>

                        <Divider />

                        <div style={{ display: "grid", gap: "1rem" }}>
                            <div>
                                <h3 style={{ marginBottom: "0.5rem" }}>Ruta propuesta</h3>
                                {seleccionados.length === 0 ? (
                                    <p>No seleccionaste ningún pedido.</p>
                                ) : (
                                    <ol>
                                        {seleccionados.map((pedido, index) => (
                                            <li key={pedido.idPedido} style={{ marginBottom: "0.35rem" }}>
                                                <strong>Parada {index + 1}:</strong> {pedido.calle} {pedido.numeroCasa}
                                                {pedido.referencia ? ` - ${pedido.referencia}` : ""}
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </div>

                            {mapUrl ? (
                                <div>
                                    <h3 style={{ marginBottom: "0.5rem" }}>Vista previa del mapa</h3>
                                    <iframe
                                        title="Vista previa de ruta"
                                        src={mapUrl}
                                        style={{ width: "100%", minHeight: "420px", border: "1px solid #d1d5db", borderRadius: "12px" }}
                                        loading="lazy"
                                    />
                                    <div style={{ marginTop: "0.75rem" }}>
                                        <Button
                                            label="Abrir en Google Maps"
                                            icon="pi pi-external-link"
                                            onClick={() => window.open(mapUrl, "_blank", "noopener,noreferrer")}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <Message severity="warn" text="Calculá la ruta para ver la vista previa aquí." />
                            )}
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
}

export default AdminReparto;