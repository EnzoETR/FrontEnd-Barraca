import { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { apiFetch } from "../services/apiClient";
import {FaWhatsapp} from "react-icons/fa";

function AdminPedidos() {
    const toast = useRef(null);

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [estados, setEstados] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState("en_espera");

    const [estadoSeleccionado, setEstadoSeleccionado] = useState({});

    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {

        obtenerPedidos();
        obtenerEstados();

    }, []);

    const obtenerPedidos = async () => {

        try {

            const response = await apiFetch("/api/v1/pedidos/listarPedidos");

            const data = await response.json();

            console.log(data);

            setPedidos(data);

        } catch (error) {

            console.error("Error al obtener pedidos:", error);

        } finally {

            setLoading(false);
        }
    };

    const obtenerEstados = async () => {

        try {

            const response = await apiFetch("/api/v1/estados/listarEstados");

            const data = await response.json();

            console.log(data);

            setEstados(data);

        } catch (error) {

            console.error("Error al obtener estados:", error);
        }
    };

    const actualizarEstadoPedido = async (idPedido) => {

        try {

            const idEstado = estadoSeleccionado[idPedido];

            if (!idEstado) {

                toast.current.show({
                    severity: "warn",
                    summary: "Estado requerido",
                    detail: "Selecciona un estado.",
                    life: 3000
                });

                return;
            }

            const response = await apiFetch(
                `/api/v1/pedidos/actualizarEstadoPedido/${idPedido}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        idEstado: Number(idEstado)
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Error al actualizar estado");
            }

            const estadoNuevo = estados.find(
                (estado) => estado.id === Number(idEstado)
            );

            setPedidos((prev) =>
                prev.map((pedido) =>
                    pedido.idPedido === idPedido
                        ? {
                            ...pedido,
                            idEstado: Number(idEstado),
                            estado: estadoNuevo.estado
                        }
                        : pedido
                )
            );

            setPedidoSeleccionado((prev) => ({
                ...prev,
                idEstado: Number(idEstado),
                estado: estadoNuevo.estado
            }));

            setEstadoSeleccionado({
                ...estadoSeleccionado,
                [idPedido]: ""
            });

            toast.current.show({
                severity: "success",
                summary: "Estado actualizado",
                detail: "El estado del pedido se actualizó correctamente.",
                life: 3000
            });

        } catch (error) {

            console.error(error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "No se pudo actualizar el estado.",
                life: 3000
            });
        }
    };

    const abrirModal = (pedido) => {
        setPedidoSeleccionado(pedido);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setPedidoSeleccionado(null);
    };

    const pedidosFiltrados = pedidos
        .filter(
            (pedido) =>
                !filtroEstado ||
                pedido.estado === filtroEstado
        )
        .sort((a, b) => b.idPedido - a.idPedido);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pedidosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(pedidosFiltrados.length / itemsPerPage);

    const getStatusColor = (estado) => {
        switch (estado) {
            case "en_espera":
                return "bg-yellow-400 text-black";
            case "en_preparacion":
                return "bg-blue-400 text-black";
            case "entregado":
                return "bg-green-400 text-black";
            case "rechazado":
                return "bg-red-400 text-black";
            default:
                return "bg-gray-400 text-black";
        }
    };

    const formatearEstado = (estado) => {
        switch (estado) {
            case "en_espera":
                return "En espera";
            case "en_preparacion":
                return "En preparación";
            case "entregado":
                return "Entregado";
            case "rechazado":
                return "Rechazado";
            case "en_viaje":
                return "En viaje";
            default:
                return estado;
        }
    };

    const formatearTelefonoWhatsApp = (telefono) => {
        if (!telefono) return "";

        let numero = telefono.replace(/\D/g, "");

        if (numero.startsWith("0")) {
            numero = "598" + numero.substring(1);
        }

        if (!numero.startsWith("598")) {
            numero = "598" + numero;
        }

        return numero;
    };


    if (loading) {

        return (
            <div className="p-10 text-xl">
                Cargando pedidos...
            </div>
        );
    }

    return (

        <div className="min-h-screen">
            <Toast ref={toast} />

            <div className="max-w-7xl mx-auto px-4 py-8">

                <div className="flex items-center justify-between mb-6">

                    <h1 className="text-4xl font-bold text-gray-800">
                        Panel de Pedidos
                    </h1>

                    <div className="bg-white px-4 py-2 rounded-lg shadow">
                        Total pedidos: {pedidosFiltrados.length}
                    </div>

                </div>

                {/* FILTRO POR ESTADO */}
                <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Filtrar por estado:
                    </label>
                    <select
                        value={filtroEstado}
                        onChange={(e) => {
                            setFiltroEstado(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="
                            bg-white
                            border
                            border-gray-300
                            rounded-lg
                            px-4
                            py-2
                            text-gray-700
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    >
                        <option value="">
                            Todos
                        </option>

                        {estados.map((estado) => (
                            <option key={estado.id} value={estado.estado}>
                                {formatearEstado(estado.estado)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* GRID DE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

                    {currentItems.map((pedido) => (

                        <div
                            key={pedido.idPedido}
                            className="
                                bg-white
                                shadow-lg
                                rounded-lg
                                overflow-hidden
                                border
                                border-gray-200
                                hover:shadow-xl
                                transition-shadow
                                aspect-square
                                flex
                                flex-col
                            "
                        >

                            <div className="p-4 flex-1 flex flex-col justify-between">

                                <div>
                                    <p className="text-gray-600 text-sm mb-1">
                                        <span className="font-semibold">Cliente:</span>{" "}
                                        {pedido.nombreCliente || "No disponible"}
                                    </p>
                                    <p className="text-gray-600 text-sm mb-1">
                                        <span className="font-semibold">Fecha:</span>{" "}
                                        {pedido.fechaEntrega || "No disponible"}
                                    </p>

                                    <p className="text-2xl font-bold text-green-600 mb-2">
                                        ${pedido.precioTotal}
                                    </p>

                                    <span
                                        className={`
                                            inline-block
                                            px-3
                                            py-1
                                            text-sm
                                            font-semibold
                                            rounded-full
                                            ${getStatusColor(pedido.estado)}
                                        `}
                                    >
                                        {formatearEstado(pedido.estado)}
                                    </span>

                                </div>

                                <button
                                    onClick={() => abrirModal(pedido)}
                                    className="
                                        mt-4
                                        w-full
                                        bg-blue-500
                                        hover:bg-blue-600
                                        text-white
                                        font-semibold
                                        py-2
                                        px-4
                                        rounded-lg
                                        transition-colors
                                    "
                                >
                                    Ver detalles
                                </button>

                            </div>

                        </div>

                    ))}

                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">

                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="
                                bg-white
                                border
                                border-gray-300
                                px-4
                                py-2
                                rounded-lg
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                hover:bg-gray-50
                            "
                        >
                            Anterior
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`
                                    px-4
                                    py-2
                                    rounded-lg
                                    ${currentPage === page
                                        ? "bg-blue-500 text-white"
                                        : "bg-white border border-gray-300 hover:bg-gray-50"
                                    }
                                `}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="
                                bg-white
                                border
                                border-gray-300
                                px-4
                                py-2
                                rounded-lg
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                hover:bg-gray-50
                            "
                        >
                            Siguiente
                        </button>

                    </div>
                )}

            </div>


            {modalAbierto && pedidoSeleccionado && (

                <div
                    className="
                        fixed
                        inset-0
                        bg-black
                        bg-opacity-50
                        flex
                        items-center
                        justify-center
                        z-50
                        p-4
                    "
                    onClick={cerrarModal}
                >

                    <div
                        className="
                            bg-white
                            rounded-lg
                            shadow-xl
                            max-w-4xl
                            w-full
                            max-h-[90vh]
                            overflow-y-auto
                        "
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="bg-gray-800 text-white p-6 rounded-t-lg">

                            <div className="flex justify-between items-start">

                                <div>

                                    <p className="text-gray-300">
                                        Cliente: {pedidoSeleccionado.nombreCliente}
                                    </p>

                                    <p className="text-gray-300">
                                        Teléfono: {pedidoSeleccionado.telefonoCliente || "No disponible"}
                                    </p>

                                </div>

                                <div className="text-right">

                                    <span
                                        className={`
                                            inline-block
                                            px-4
                                            py-2
                                            text-lg
                                            font-semibold
                                            rounded-full
                                            ${getStatusColor(pedidoSeleccionado.estado)}
                                        `}
                                    >
                                        {formatearEstado(pedidoSeleccionado.estado)}
                                    </span>

                                    <p className="mt-2 text-2xl font-bold">
                                        Total: ${pedidoSeleccionado.precioTotal}
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="p-6 grid md:grid-cols-2 gap-8">

                            {/* INFO DEL PEDIDO */}
                            <div>

                                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                    Información del pedido
                                </h3>

                                <div className="space-y-3 text-gray-700">

                                    <p>
                                        <span className="font-semibold">Fecha pedido:</span>{" "}
                                        {pedidoSeleccionado.fechaPedido}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Fecha entrega:</span>{" "}
                                        {pedidoSeleccionado.fechaEntrega}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Horario:</span>{" "}
                                        {pedidoSeleccionado.horarioEntrega}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Dirección:</span>{" "}
                                        {pedidoSeleccionado.calle} {pedidoSeleccionado.numeroCasa}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Referencia:</span>{" "}
                                        {pedidoSeleccionado.referencia}
                                    </p>

                                </div>

                                {/* ACTUALIZAR ESTADO */}
                                <div className="mt-6 pt-6 border-t">

                                    <h4 className="font-semibold mb-3 text-gray-800">
                                        Cambiar estado
                                    </h4>

                                    <div className="flex gap-2">

                                        <select
                                            value={
                                                estadoSeleccionado[pedidoSeleccionado.idPedido]
                                                || ""
                                            }
                                            onChange={(e) =>
                                                setEstadoSeleccionado({
                                                    ...estadoSeleccionado,
                                                    [pedidoSeleccionado.idPedido]:
                                                        e.target.value
                                                })
                                            }
                                            className="
                                                text-black
                                                rounded-lg
                                                px-3
                                                py-2
                                                border
                                                border-gray-300
                                            "
                                        >

                                            <option value="">
                                                Cambiar estado
                                            </option>

                                            {estados.filter(
                                                (estado) =>
                                                    estado.id !== pedidoSeleccionado.idEstado
                                            ).map((estado) => (

                                                <option
                                                    key={estado.id}
                                                    value={estado.id}
                                                    disabled={
                                                        estado.id === pedidoSeleccionado.idEstado
                                                    }
                                                >
                                                    {formatearEstado(estado.estado)}
                                                </option>

                                            ))}

                                        </select>

                                        <button
                                            onClick={() =>
                                                actualizarEstadoPedido(
                                                    pedidoSeleccionado.idPedido
                                                )
                                            }
                                            className="
                                                bg-blue-500
                                                hover:bg-blue-600
                                                px-4
                                                py-2
                                                rounded-lg
                                                font-semibold
                                                text-white
                                            "
                                        >
                                            Actualizar
                                        </button>

                                    </div>

                                </div>

                            </div>

                            {/* PRODUCTOS */}
                            <div>

                                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                                    Productos
                                </h3>

                                <div className="space-y-4">

                                    {pedidoSeleccionado.detalles?.map((detalle) => (

                                        <div
                                            key={detalle.idDetalle}
                                            className="
                                                border
                                                p-4
                                                bg-gray-50
                                                rounded-lg
                                            "
                                        >

                                            <div className="flex justify-between items-start">

                                                <div className="flex-1">

                                                    <h4 className="font-bold text-lg text-gray-800">
                                                        {detalle.nombreProducto}
                                                    </h4>

                                                    <p className="text-gray-600 text-sm">
                                                        x{detalle.cantidad} {detalle.nombrePresentacion}
                                                        {" - "}{detalle.cantidadPresentacion}
                                                    </p>

                                                    <p className="text-gray-600 text-sm">
                                                        Tipo: {detalle.tipoUso}
                                                    </p>

                                                </div>

                                                <div className="text-right ml-4">

                                                    <p className="text-green-600 font-bold text-lg">
                                                        Subtotal: ${detalle.subtotal}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            </div>

                        </div>

                        <div className="p-4 bg-gray-100 rounded-b-lg flex justify-end items-center gap-3">


                            <a
                                href={`https://api.whatsapp.com/send?phone=${formatearTelefonoWhatsApp(pedidoSeleccionado.telefonoCliente)}&text=${encodeURIComponent(
                                    `Hola, tu pedido fue actualizado a: ${formatearEstado(pedidoSeleccionado.estado)}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-5 rounded-lg transition"
                            >
                                <FaWhatsapp size={24} />
                                Notificar por WhatsApp
                            </a>


                            <button
                                onClick={cerrarModal}
                                className="
                                    bg-gray-500
                                    hover:bg-gray-600
                                    text-white
                                    font-semibold
                                    py-3
                                    px-6
                                    rounded-lg
                                    transition
                                "
                            >
                                Cerrar
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default AdminPedidos;