import { useEffect, useState } from "react";
import { apiFetch } from "../services/apiClient";

function AdminPresentaciones() {
    const [presentaciones, setPresentaciones] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nuevaPresentacion, setNuevaPresentacion] = useState({
        descripcion: "",
        cantidad: "",
        unidadMedida: "",
        precio: "",
        idProducto: ""
    });

    useEffect(() => {
        obtenerPresentaciones();
        obtenerProductos();
    }, []);

    const obtenerPresentaciones = async () => {
        try {
            const response = await apiFetch("/api/v1/presentacion/listarPresentacion");
            const data = await response.json();
            setPresentaciones(data);
        } catch (error) {
            console.error("Error al obtener presentaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const obtenerProductos = async () => {
        try {
            const response = await apiFetch("/api/v1/producto/listarProducto");
            const data = await response.json();
            setProductos(data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    const crearPresentacion = async () => {
        try {
            const response = await apiFetch("/api/v1/presentacion/crearPresentacion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevaPresentacion)
            });

            if (!response.ok) {
                throw new Error("Error al crear presentación");
            }

            alert("Presentación creada correctamente");

            setNuevaPresentacion({
                descripcion: "",
                cantidad: "",
                unidadMedida: "",
                precio: "",
                idProducto: ""
            });

            obtenerPresentaciones();
        } catch (error) {
            console.error(error);
            alert("Error al crear presentación");
        }
    };

    const actualizarPresentacion = async (presentacion) => {
        try {
            const response = await apiFetch(
                `/api/v1/presentacion/actualizarPresentacion/${presentacion.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(presentacion)
                }
            );

            if (!response.ok) {
                throw new Error("Error al actualizar presentación");
            }

            alert("Presentación actualizada");
            obtenerPresentaciones();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const eliminarPresentacion = async (idPresentacion) => {
        const confirmar = confirm("¿Seguro que deseas eliminar esta presentación?");
        if (!confirmar) return;

        try {
            const response = await apiFetch(
                `/api/v1/presentacion/eliminarPresentacion/${idPresentacion}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Error al eliminar presentación");
            }

            alert("Presentación eliminada");
            obtenerPresentaciones();
        } catch (error) {
            console.error(error);
            alert("Error al eliminar presentación");
        }
    };

    const manejarCambio = (id, campo, valor) => {
        setPresentaciones((prev) =>
            prev.map((presentacion) =>
                presentacion.id === id
                    ? {
                        ...presentacion,
                        [campo]: valor
                    }
                    : presentacion
            )
        );
    };

    if (loading) {
        return <div className="p-10 text-xl">Cargando presentaciones...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">
                    Panel de Presentaciones
                </h1>

                <div className="bg-white shadow px-4 py-2 rounded-lg">
                    Total presentaciones: {presentaciones.length}
                </div>
            </div>

            <div className="bg-white shadow-lg p-6 mb-8 border">
                <h2 className="text-2xl font-bold mb-4">Agregar presentación</h2>

                <div className="grid md:grid-cols-6 gap-4">
                    <input
                        type="text"
                        placeholder="Descripción"
                        value={nuevaPresentacion.descripcion}
                        onChange={(e) =>
                            setNuevaPresentacion({
                                ...nuevaPresentacion,
                                descripcion: e.target.value
                            })
                        }
                        className="border p-3 rounded-lg"
                    />

                    <input
                        type="number"
                        placeholder="Cantidad"
                        value={nuevaPresentacion.cantidad}
                        onChange={(e) =>
                            setNuevaPresentacion({
                                ...nuevaPresentacion,
                                cantidad: e.target.value
                            })
                        }
                        className="border p-3 rounded-lg"
                    />

                    <input
                        type="text"
                        placeholder="Unidad"
                        value={nuevaPresentacion.unidadMedida}
                        onChange={(e) =>
                            setNuevaPresentacion({
                                ...nuevaPresentacion,
                                unidadMedida: e.target.value
                            })
                        }
                        className="border p-3 rounded-lg"
                    />

                    <input
                        type="number"
                        placeholder="Precio"
                        value={nuevaPresentacion.precio}
                        onChange={(e) =>
                            setNuevaPresentacion({
                                ...nuevaPresentacion,
                                precio: e.target.value
                            })
                        }
                        className="border p-3 rounded-lg"
                    />

                    <select
                        value={nuevaPresentacion.idProducto}
                        onChange={(e) =>
                            setNuevaPresentacion({
                                ...nuevaPresentacion,
                                idProducto: e.target.value
                            })
                        }
                        className="border p-3 rounded-lg"
                    >
                        <option value="">Producto</option>
                        {productos.map((producto) => (
                            <option key={producto.id} value={producto.id}>
                                {producto.nombre}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={crearPresentacion}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg px-4 py-3"
                    >
                        Crear
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {presentaciones.map((presentacion) => (
                    <div
                        key={presentacion.id}
                        className="bg-white shadow-lg border border-gray-200 p-6"
                    >
                        <div className="grid md:grid-cols-6 gap-4">
                            <input
                                type="text"
                                value={presentacion.descripcion}
                                onChange={(e) =>
                                    manejarCambio(presentacion.id, "descripcion", e.target.value)
                                }
                                className="border p-3 rounded-lg"
                            />

                            <input
                                type="number"
                                value={presentacion.cantidad}
                                onChange={(e) =>
                                    manejarCambio(presentacion.id, "cantidad", e.target.value)
                                }
                                className="border p-3 rounded-lg"
                            />

                            <input
                                type="text"
                                value={presentacion.unidadMedida}
                                onChange={(e) =>
                                    manejarCambio(presentacion.id, "unidadMedida", e.target.value)
                                }
                                className="border p-3 rounded-lg"
                            />

                            <input
                                type="number"
                                value={presentacion.precio}
                                onChange={(e) =>
                                    manejarCambio(presentacion.id, "precio", e.target.value)
                                }
                                className="border p-3 rounded-lg"
                            />

                            <select
                                value={presentacion.idProducto}
                                onChange={(e) =>
                                    manejarCambio(presentacion.id, "idProducto", e.target.value)
                                }
                                className="border p-3 rounded-lg"
                            >
                                {productos.map((producto) => (
                                    <option key={producto.id} value={producto.id}>
                                        {producto.nombre}
                                    </option>
                                ))}
                            </select>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => actualizarPresentacion(presentacion)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold w-full"
                                >
                                    Guardar
                                </button>

                                <button
                                    onClick={() => eliminarPresentacion(presentacion.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold w-full"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPresentaciones;