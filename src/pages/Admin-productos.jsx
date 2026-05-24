import { useEffect, useState } from "react";
import { apiFetch } from "../services/apiClient";

function AdminProductos() {

    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        descripcion: "",
        tipUso: "",
        activo: true
    });

    useEffect(() => {

        obtenerProductos();

    }, []);

    const obtenerProductos = async () => {

        try {

            const response = await apiFetch(
                "/api/v1/producto/listarProducto"
            );

            const data = await response.json();

            setProductos(data);

        } catch (error) {

            console.error("Error al obtener productos:", error);

        } finally {

            setLoading(false);
        }
    };

    const crearProducto = async () => {

        try {

            const response = await apiFetch(
                "/api/v1/producto/crearProducto",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(nuevoProducto)
                }
            );

            if (!response.ok) {

                throw new Error("Error al crear producto");
            }

            alert("Producto creado correctamente");

            setNuevoProducto({
                nombre: "",
                descripcion: "",
                tipoUso: "",
                activo: true
            });

            obtenerProductos();

        } catch (error) {

            console.error(error);

            alert("Error al crear producto");
        }
    };

    const actualizarProducto = async (producto) => {

        try {

            const response = await apiFetch(
                `/api/v1/producto/actualizarProducto/${producto.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(producto)
                }
            );

            const data = await response.json();

            console.log(data);

            if (!response.ok) {

                throw new Error(
                    data.message || "Error al actualizar producto"
                );
            }

            alert("Producto actualizado");

            obtenerProductos();

        } catch (error) {

            console.error(error);

            alert(error.message);
        }
    };

    const eliminarProducto = async (idProducto) => {

        const confirmar = confirm(
            "¿Seguro que deseas eliminar este producto?"
        );

        if (!confirmar) return;

        try {

            const response = await apiFetch(
                `/api/v1/producto/eliminarProducto/${idProducto}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {

                throw new Error("Error al eliminar");
            }

            alert("Producto eliminado");

            obtenerProductos();

        } catch (error) {

            console.error(error);

            alert("Error al eliminar");
        }
    };

    const manejarCambio = (id, campo, valor) => {

        setProductos((prev) =>
            prev.map((producto) =>
                producto.id === id
                    ? {
                        ...producto,
                        [campo]: valor
                    }
                    : producto
            )
        );
    };

    if (loading) {

        return (
            <div className="p-10 text-xl">
                Cargando productos...
            </div>
        );
    }

    return (

        <div className="max-w-7xl mx-auto p-6">

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-4xl font-bold text-gray-800">
                    Panel de Productos
                </h1>

                <div className="bg-white shadow px-4 py-2 rounded-lg">
                    Total productos: {productos.length}
                </div>

            </div>

            {/* CREAR PRODUCTO */}
            <div className="bg-white shadow-lg p-6 mb-8 border">

                <h2 className="text-2xl font-bold mb-4">
                    Agregar producto
                </h2>

                <div className="grid md:grid-cols-4 gap-4">

                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nuevoProducto.nombre}
                        onChange={(e) =>
                            setNuevoProducto({
                                ...nuevoProducto,
                                nombre: e.target.value
                            })
                        }
                        className="border p-3 rounded-lg"
                    />

                    <input
                        type="text"
                        placeholder="Descripción"
                        value={nuevoProducto.descripcion}
                        onChange={(e) =>
                            setNuevoProducto({
                                ...nuevoProducto,
                                descripcion: e.target.value
                            })
                        }
                        className="border p-3 rounded-lg"
                    />

                    <input
                        type="text"
                        placeholder="Tipo de uso"
                        value={nuevoProducto.tipoUso}
                        onChange={(e) =>
                            setNuevoProducto({
                                ...nuevoProducto,
                                tipoUso: e.target.value
                            })
                        }
                        className="border p-3 rounded-lg"
                    />

                    <button
                        onClick={crearProducto}
                        className="
                            bg-green-500
                            hover:bg-green-600
                            text-white
                            font-bold
                            rounded-lg
                            px-4
                            py-3
                        "
                    >
                        Crear
                    </button>

                </div>

            </div>

            {/* LISTADO */}
            <div className="grid gap-6">

                {productos.map((producto) => (

                    <div
                        key={producto.id}
                        className="
                            bg-white
                            shadow-lg
                            border
                            border-gray-200
                            p-6
                        "

                    >

                        <div className="grid md:grid-cols-5 gap-4">

                            <input
                                type="text"
                                value={producto.nombre}
                                onChange={(e) =>
                                    manejarCambio(
                                        producto.id,
                                        "nombre",
                                        e.target.value
                                    )
                                }
                                className="border p-3 rounded-lg"
                            />

                            <input
                                type="text"
                                value={producto.descripcion}
                                onChange={(e) =>
                                    manejarCambio(
                                        producto.id,
                                        "descripcion",
                                        e.target.value
                                    )
                                }
                                className="border p-3 rounded-lg"
                            />

                            <input
                                type="text"
                                value={producto.tipoUso}
                                onChange={(e) =>
                                    manejarCambio(
                                        producto.id,
                                        "tipoUso",
                                        e.target.value
                                    )
                                }
                                className="border p-3 rounded-lg"
                            />

                            <select
                                value={producto.activo ? "true" : "false"}
                                onChange={(e) =>
                                    manejarCambio(
                                        producto.id,
                                        "activo",
                                        e.target.value === "true"
                                    )
                                }
                                className="border p-3 rounded-lg"
                            >
                                <option value="true">
                                    Activo
                                </option>

                                <option value="false">
                                    Inactivo
                                </option>

                            </select>

                            <div className="flex gap-2">

                                <button
                                    onClick={() =>
                                        actualizarProducto(producto)
                                    }
                                    className="
                                        bg-blue-500
                                        hover:bg-blue-600
                                        text-white
                                        px-4
                                        py-2
                                        rounded-lg
                                        font-semibold
                                        w-full
                                    "
                                >
                                    Guardar
                                </button>

                                <button
                                    onClick={() =>
                                        eliminarProducto(
                                            producto.id
                                        )
                                    }
                                    className="
                                        bg-red-500
                                        hover:bg-red-600
                                        text-white
                                        px-4
                                        py-2
                                        rounded-lg
                                        font-semibold
                                        w-full
                                    "
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

export default AdminProductos;