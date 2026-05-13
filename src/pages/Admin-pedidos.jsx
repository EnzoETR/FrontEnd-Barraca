import { useEffect, useState } from "react";

function AdminPedidos() {

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerPedidos();
    }, []);

    const obtenerPedidos = async () => {

        try {

            const response = await fetch(
                "http://localhost:8081/api/v1/pedidos/listarPedidos"
            );

            const data = await response.json();
console.log(data);

            setPedidos(data);

        } catch (error) {

            console.error("Error al obtener pedidos:", error);

        } finally {

            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-xl">
                Cargando pedidos...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="max-w-7xl mx-auto">

                <div className="flex items-center justify-between mb-8">

                    <h1 className="text-4xl font-bold text-gray-800">
                        Panel de Pedidos
                    </h1>

                    <div className="bg-white px-4 py-2 rounded-lg shadow">
                        Total pedidos: {pedidos.length}
                    </div>
                </div>

                <div className="grid gap-6">

                    {pedidos.map((pedido) => (

                        <div
                            key={pedido.idPedido}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
                        >

                            {/* HEADER */}
                            <div className="bg-gray-800 text-white p-5 flex flex-col md:flex-row md:justify-between md:items-center">

                                <div>
                                    <h2 className="text-2xl font-bold">
                                        Pedido #{pedido.idPedido}
                                    </h2>

                                    <p className="text-gray-300 mt-1">
                                        Cliente: {pedido.nombreCliente}
                                    </p>
                                </div>

                                <div className="mt-4 md:mt-0 text-right">

                                    <span className="
                                        inline-block
                                        bg-yellow-400
                                        text-black
                                        px-3
                                        py-1
                                        rounded-full
                                        text-sm
                                        font-semibold
                                    ">
                                        {pedido.estado}
                                    </span>

                                    <p className="mt-2 text-lg font-bold">
                                        ${pedido.precioTotal}
                                    </p>
                                </div>
                            </div>

                            {/* BODY */}
                            <div className="p-6 grid md:grid-cols-2 gap-8">

                                {/* INFO */}
                                <div>

                                    <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                        Información del pedido
                                    </h3>

                                    <div className="space-y-2 text-gray-600">

                                        <p>
                                            <span className="font-semibold">
                                                Fecha pedido:
                                            </span>
                                            {" "}
                                            {pedido.fechaPedido}
                                        </p>

                                        <p>
                                            <span className="font-semibold">
                                                Fecha entrega:
                                            </span>
                                            {" "}
                                            {pedido.fechaEntrega}
                                        </p>

                                        <p>
                                            <span className="font-semibold">
                                                Horario:
                                            </span>
                                            {" "}
                                            {pedido.horarioEntrega}
                                        </p>

                                        <p>
                                            <span className="font-semibold">
                                                Dirección:
                                            </span>
                                            {" "}
                                            {pedido.calle}
                                            {" "}
                                            {pedido.numeroCasa}
                                        </p>

                                        <p>
                                            <span className="font-semibold">
                                                Referencia:
                                            </span>
                                            {" "}
                                            {pedido.referencia}
                                        </p>

                                    </div>
                                </div>

                                {/* DETALLES */}
                                <div>

                                    <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                        Productos
                                    </h3>

                                    <div className="space-y-4">

                                        {pedido.detalles?.map((detalle) => (

                                            <div
                                                key={detalle.idDetalle}
                                                className="
                                                    border
                                                    rounded-xl
                                                    p-4
                                                    bg-gray-50
                                                "
                                            >

                                                <div className="flex justify-between items-start">

                                                    <div>

                                                        <h4 className="font-bold text-lg">
                                                            {detalle.nombreProducto}
                                                        </h4>

                                                        <p className="text-gray-500">
                                                            Presentación:
                                                            {" "}
                                                            {detalle.nombrePresentacion}
                                                        </p>

                                                    </div>

                                                    <div className="text-right">

                                                        <p className="font-semibold">
                                                            x{detalle.cantidad}
                                                        </p>

                                                        <p className="text-green-600 font-bold">
                                                            ${detalle.subtotal}
                                                        </p>

                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminPedidos;