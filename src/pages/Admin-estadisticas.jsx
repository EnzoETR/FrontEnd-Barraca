import { useEffect, useState } from "react";
import { apiFetch } from "../services/apiClient";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

function AdminEstadisticas() {

    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [opcionSeleccionada, setOpcionSeleccionada] = useState("ventasMensuales");
    const [rangoMeses, setRangoMeses] = useState(6);
    const [mesProductoSeleccionado, setMesProductoSeleccionado] = useState("todos");

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
    

   

    const formatearPrecio = (valor) => {
        if (valor == null) return "$0";
        return `$${valor.toFixed(2)}`;
    };

    const formatearMes = (mes) => {
        if (!mes) return "-";

        const partes = mes.split("-");
        const anio = partes[0];
        const numeroMes = partes[1];

        const meses = {
            "01": "Enero",
            "02": "Febrero",
            "03": "Marzo",
            "04": "Abril",
            "05": "Mayo",
            "06": "Junio",
            "07": "Julio",
            "08": "Agosto",
            "09": "Septiembre",
            "10": "Octubre",
            "11": "Noviembre",
            "12": "Diciembre"
        };

        return `${meses[numeroMes]} ${anio}`;
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
 const ventasPorProductoMesFiltradas = estadisticas.ventasPorProductoMes
        ?.filter((venta) => {
            if (mesProductoSeleccionado === "todos") {
                return true;
            }

            return venta.mes === mesProductoSeleccionado;
        })
        .sort((a, b) => a.producto.localeCompare(b.producto));
    const ventasMensualesFiltradas = estadisticas.ventasMensuales
        ?.slice()
        .sort((a, b) => a.mes.localeCompare(b.mes))
        .slice(-rangoMeses);

    const mesesVentasPorProducto = [
        ...new Set(
            estadisticas.ventasPorProductoMes
                ?.map((venta) => venta.mes)
                .filter((mes) => mes != null)
        )
    ].sort();
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <h1 className="text-4xl font-bold text-gray-800">
                    Estadísticas
                </h1>

                <select
                    value={opcionSeleccionada}
                    onChange={(e) => setOpcionSeleccionada(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700"
                >
                    <option value="ventasMensuales">Ventas mensuales</option>
                    <option value="productosMasVendidos">Productos más vendidos</option>
                    <option value="clientesTop">Clientes top</option>
                    <option value="ventasPorProductoMes">Ventas por producto y mes</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">

                {opcionSeleccionada === "ventasMensuales" && (
                    <div>
                        <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Ventas mensuales
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Muestra el total vendido según el rango seleccionado.
                                </p>
                            </div>

                            <select
                                value={rangoMeses}
                                onChange={(e) => setRangoMeses(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700"
                            >
                                <option value={1}>1 mes</option>
                                <option value={3}>3 meses</option>
                                <option value={6}>6 meses</option>
                                <option value={12}>1 año</option>
                            </select>
                        </div>

                        {ventasMensualesFiltradas?.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-5 py-3">Mes</th>
                                        <th className="px-5 py-3">Total estimado</th>
                                        <th className="px-5 py-3">Total entregado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ventasMensualesFiltradas.map((venta, index) => (
                                        <tr key={index} className="border-t border-gray-200">
                                            <td className="px-5 py-3">
                                                {formatearMes(venta.mes)}
                                            </td>
                                            <td className="px-5 py-3 font-semibold">
                                                {formatearPrecio(venta.totalVentasEstimado)}
                                            </td>
                                            <td className="px-5 py-3 font-semibold text-green-600">
                                                {formatearPrecio(venta.totalVentasEntregado)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="p-5 text-gray-500">
                                No hay datos de ventas mensuales.
                            </p>
                        )}

                        {ventasMensualesFiltradas?.length > 0 && (
                            <div className="p-5 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Gráfico de ventas mensuales</h3>
                                <div className="h-80">
                                    <Bar
                                        data={{
                                            labels: ventasMensualesFiltradas.map(v => formatearMes(v.mes)),
                                            datasets: [
                                                {
                                                    label: 'Total estimado',
                                                    data: ventasMensualesFiltradas.map(v => v.totalVentasEstimado),
                                                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                                                    borderColor: 'rgb(59, 130, 246)',
                                                    borderWidth: 1,
                                                },
                                                {
                                                    label: 'Total entregado',
                                                    data: ventasMensualesFiltradas.map(v => v.totalVentasEntregado),
                                                    backgroundColor: 'rgba(34, 197, 94, 0.5)',
                                                    borderColor: 'rgb(34, 197, 94)',
                                                    borderWidth: 1,
                                                }
                                            ]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function(context) {
                                                            return context.dataset.label + ': $' + context.raw.toFixed(2);
                                                        }
                                                    }
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        callback: function(value) {
                                                            return '$' + value;
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {opcionSeleccionada === "productosMasVendidos" && (
                    <div>
                        <div className="p-5 border-b border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Productos más vendidos
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Muestra los productos con mayor cantidad vendida.
                            </p>
                        </div>

                        {estadisticas.productosMasVendidos?.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-5 py-3">Producto</th>
                                        <th className="px-5 py-3">Kilos vendidos</th>
                                        <th className="px-5 py-3">Total vendido</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estadisticas.productosMasVendidos.map((producto, index) => (
                                        <tr key={index} className="border-t border-gray-200">
                                            <td className="px-5 py-3">
                                                {producto.nombreProducto}
                                            </td>
                                            <td className="px-5 py-3">
                                                {producto.kilosTotal?.toFixed(2)} kg
                                            </td>
                                            <td className="px-5 py-3 font-semibold">
                                                {formatearPrecio(producto.totalVentas)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="p-5 text-gray-500">
                                No hay datos de productos vendidos.
                            </p>
                        )}

                        {estadisticas.productosMasVendidos?.length > 0 && (
                            <div className="p-5 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Gráfico de productos más vendidos</h3>
                                <div className="h-80">
                                    <Bar
                                        data={{
                                            labels: estadisticas.productosMasVendidos.map(p => p.nombreProducto),
                                            datasets: [
                                                {
                                                    label: 'Kilos vendidos',
                                                    data: estadisticas.productosMasVendidos.map(p => p.kilosTotal),
                                                    backgroundColor: 'rgba(168, 85, 247, 0.5)',
                                                    borderColor: 'rgb(168, 85, 247)',
                                                    borderWidth: 1,
                                                }
                                            ]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function(context) {
                                                            return 'Kilos: ' + context.raw.toFixed(2) + ' kg';
                                                        }
                                                    }
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        callback: function(value) {
                                                            return value + ' kg';
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {opcionSeleccionada === "clientesTop" && (
                    <div>
                        <div className="p-5 border-b border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Clientes top
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Muestra los clientes que más compraron.
                            </p>
                        </div>

                        {estadisticas.clientesTop?.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-5 py-3">Cliente</th>
                                        <th className="px-5 py-3">Teléfono</th>
                                        <th className="px-5 py-3">Cantidad de pedidos</th>
                                        <th className="px-5 py-3">Total gastado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estadisticas.clientesTop.map((cliente, index) => (
                                        <tr key={index} className="border-t border-gray-200">
                                            <td className="px-5 py-3">
                                                {cliente.nombreCliente}
                                            </td>
                                            <td className="px-5 py-3">
                                                {cliente.telefono || "-"}
                                            </td>
                                            <td className="px-5 py-3">
                                                {cliente.cantidadPedidos}
                                            </td>
                                            <td className="px-5 py-3 font-semibold">
                                                {formatearPrecio(cliente.totalGastado)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="p-5 text-gray-500">
                                No hay datos de clientes.
                            </p>
                        )}

                        {estadisticas.clientesTop?.length > 0 && (
                            <div className="p-5 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Gráfico de clientes top</h3>
                                <div className="h-80">
                                    <Bar
                                        data={{
                                            labels: estadisticas.clientesTop.map(c => c.nombreCliente),
                                            datasets: [
                                                {
                                                    label: 'Total gastado',
                                                    data: estadisticas.clientesTop.map(c => c.totalGastado),
                                                    backgroundColor: 'rgba(234, 179, 8, 0.5)',
                                                    borderColor: 'rgb(234, 179, 8)',
                                                    borderWidth: 1,
                                                }
                                            ]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function(context) {
                                                            return 'Gastado: $' + context.raw.toFixed(2);
                                                        }
                                                    }
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        callback: function(value) {
                                                            return '$' + value;
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {opcionSeleccionada === "ventasPorProductoMes" && (
                    <div>
                        <div className="p-5 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Ventas por producto y mes
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    Muestra cuántos kilos se vendieron por producto en el mes seleccionado.
                                </p>
                            </div>

                            <select
                                value={mesProductoSeleccionado}
                                onChange={(e) => setMesProductoSeleccionado(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700"
                            >
                                <option value="todos">Todos los meses</option>

                                {mesesVentasPorProducto.map((mes) => (
                                    <option key={mes} value={mes}>
                                        {formatearMes(mes)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {ventasPorProductoMesFiltradas?.length > 0 ? (
                            <table className="w-full text-left">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-5 py-3">Mes</th>
                                        <th className="px-5 py-3">Producto</th>
                                        <th className="px-5 py-3">Kilos estimados</th>
                                        <th className="px-5 py-3">Kilos entregados</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ventasPorProductoMesFiltradas.map((venta, index) => (
                                        <tr key={index} className="border-t border-gray-200">
                                            <td className="px-5 py-3">
                                                {formatearMes(venta.mes)}
                                            </td>
                                            <td className="px-5 py-3">
                                                {venta.producto}
                                            </td>
                                            <td className="px-5 py-3">
                                                {venta.kilosEstimados?.toFixed(2)} kg
                                            </td>
                                            <td className="px-5 py-3 font-semibold text-green-600">
                                                {venta.kilosEntregados?.toFixed(2)} kg
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="p-5 text-gray-500">
                                No hay datos de ventas por producto para el mes seleccionado.
                            </p>
                        )}

                        {ventasPorProductoMesFiltradas?.length > 0 && (
                            <div className="p-5 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Gráfico de ventas por producto y mes</h3>
                                <div className="h-80">
                                    <Bar
                                        data={{
                                            labels: ventasPorProductoMesFiltradas.map(v => v.producto),
                                            datasets: [
                                                {
                                                    label: 'Kilos estimados',
                                                    data: ventasPorProductoMesFiltradas.map(v => v.kilosEstimados),
                                                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                                                    borderColor: 'rgb(59, 130, 246)',
                                                    borderWidth: 1,
                                                },
                                                {
                                                    label: 'Kilos entregados',
                                                    data: ventasPorProductoMesFiltradas.map(v => v.kilosEntregados),
                                                    backgroundColor: 'rgba(34, 197, 94, 0.5)',
                                                    borderColor: 'rgb(34, 197, 94)',
                                                    borderWidth: 1,
                                                }
                                            ]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'top',
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function(context) {
                                                            return context.dataset.label + ': ' + context.raw.toFixed(2) + ' kg';
                                                        }
                                                    }
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        callback: function(value) {
                                                            return value + ' kg';
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminEstadisticas;