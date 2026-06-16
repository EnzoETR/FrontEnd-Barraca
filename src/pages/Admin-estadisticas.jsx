import { useEffect, useState } from "react";
import { apiFetch } from "../services/apiClient";

function AdminEstadisticas() {

    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerEstadisticas();
    }, []);

    const obtenerEstadisticas = async () => {
        try {
            const response = await apiFetch("/api/v1/pedidos/estadisticas");
            const data = await response.json();
            setEstadisticas(data);
        } catch (error) {
            console.error("Error al obtener estadísticas:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-xl">
                Cargando estadísticas...
            </div>
        );
    }

    if (!estadisticas) {
        return (
            <div className="p-10 text-xl text-red-600">
                Error al cargar estadísticas
            </div>
        );
    }
    const primero = estadisticas.productosMasVendidos?.[0];
    const segundo = estadisticas.productosMasVendidos?.[1];
    const tercero = estadisticas.productosMasVendidos?.[2];

    const maxVentaMensual = estadisticas.ventasMensuales?.length > 0
        ? Math.max(...estadisticas.ventasMensuales.map(v => v.totalVentas))
        : 0;

    const maxClienteGasto = estadisticas.clientesTop?.length > 0
        ? Math.max(...estadisticas.clientesTop.map(c => c.totalGastado))
        : 0;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            <h1 className="text-4xl font-bold text-gray-800 mb-8">
                Estadísticas
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">



                {/* VENTAS MENSUALES */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Ventas Mensuales
                    </h2>
                    {estadisticas.ventasMensuales?.length > 0 ? (
                        <div className="space-y-3">
                            {estadisticas.ventasMensuales.map((venta, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-24 text-sm text-gray-600">
                                        {venta.mes}
                                    </div>
                                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                                        <div
                                            className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm font-semibold"
                                            style={{
                                                width: maxVentaMensual > 0
                                                    ? `${(venta.totalVentas / maxVentaMensual) * 100}%`
                                                    : "0%"
                                            }}
                                        >
                                            ${venta.totalVentas?.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay datos de ventas mensuales</p>
                    )}
                </div>

                {/* PRODUCTO MÁS VENDIDO */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Top 3 Productos Más Vendidos
                    </h2>

                    {estadisticas.productosMasVendidos?.length > 0 ? (
                        <div className="flex justify-center items-end gap-4">

                            {segundo && (
                                <div className="bg-gray-200 rounded-lg p-4 h-48 w-40 flex flex-col justify-center items-center">
                                    <div className="text-4xl mb-2">🥈</div>
                                    <p className="font-bold text-center">
                                        {segundo.nombreProducto}
                                    </p>
                                    <p>{segundo.cantidadTotal} ventas</p>
                                    <p className="text-sm text-gray-600">
                                        ${segundo.totalVentas?.toFixed(2)}
                                    </p>
                                </div>
                            )}

                            {primero && (
                                <div className="bg-yellow-200 rounded-lg p-4 h-64 w-44 flex flex-col justify-center items-center shadow-md">
                                    <div className="text-5xl mb-2">🥇</div>
                                    <p className="font-bold text-center text-lg">
                                        {primero.nombreProducto}
                                    </p>
                                    <p>{primero.cantidadTotal} ventas</p>
                                    <p className="font-bold text-green-700">
                                        ${primero.totalVentas?.toFixed(2)}
                                    </p>
                                </div>
                            )}

                            {tercero && (
                                <div className="bg-orange-200 rounded-lg p-4 h-40 w-40 flex flex-col justify-center items-center">
                                    <div className="text-4xl mb-2">🥉</div>
                                    <p className="font-bold text-center">
                                        {tercero.nombreProducto}
                                    </p>
                                    <p>{tercero.cantidadTotal} ventas</p>
                                    <p className="text-sm text-gray-600">
                                        ${tercero.totalVentas?.toFixed(2)}
                                    </p>
                                </div>
                            )}

                        </div>
                    ) : (
                        <p className="text-gray-500">
                            No hay datos de productos
                        </p>
                    )}
                </div>

                {/* CLIENTES TOP */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Top Clientes
                    </h2>
                    {estadisticas.clientesTop?.length > 0 ? (
                        <div className="space-y-3">
                            {estadisticas.clientesTop.map((cliente, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-semibold text-gray-800">
                                            {index + 1}. {cliente.nombreCliente}
                                        </p>
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                            {cliente.cantidadPedidos} pedidos
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                                            <div
                                                className="bg-green-500 h-4 rounded-full"
                                                style={{
                                                    width: maxClienteGasto > 0
                                                        ? `${(cliente.totalGastado / maxClienteGasto) * 100}%`
                                                        : "0%"
                                                }}
                                            />
                                        </div>
                                        <p className="text-green-600 font-bold text-sm whitespace-nowrap">
                                            ${cliente.totalGastado?.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay datos de clientes</p>
                    )}
                </div>

            </div>



        </div>
    );
}

export default AdminEstadisticas;
