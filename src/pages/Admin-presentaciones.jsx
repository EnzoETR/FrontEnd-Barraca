import { useEffect, useState } from "react";
import { apiFetch } from "../services/apiClient";

const SUGERENCIAS_DESCRIPCION = ["Tarrina", "Bolsa", "Camion", "Camioneta"];

function AdminPresentaciones() {
    const [presentaciones, setPresentaciones] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [idPresentacionImagen, setIdPresentacionImagen] = useState(null);

    const [nuevaPresentacion, setNuevaPresentacion] = useState({
        descripcion: "",
        cantidad: "",
        unidadMedida: "",
        precio: "",
        idProducto: ""
    });

    const [imagenProducto, setImagenProducto] = useState({
        nombre: "",
        extension: "",
        imagen: "",
        esPrincipal: false,
        idProducto: "",
        idPresentacion: ""
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

            const data = await response.json();

            alert("Presentación creada correctamente");

            obtenerPresentaciones();

            return data;

        } catch (error) {
            console.error(error);
            alert("Error al crear presentación");
            return false;
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

            await subirImagen(presentacion);

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

    const convertirABase64 = (archivo) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(archivo);

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const manejarImagen = async (e) => {
        const archivo = e.target.files[0];

        if (!archivo) return;

        const base64 = await convertirABase64(archivo);

        setImagenProducto({
            ...imagenProducto,
            nombre: archivo.name,
            extension: archivo.type,
            imagen: base64
        });
    };

    const subirImagen = async (presentacion) => {
        try {
            if (!imagenProducto.imagen) {
                return true;
            }

            if (
                idPresentacionImagen !== null &&
                idPresentacionImagen !== presentacion.id
            ) {
                return true;
            }

            const imagenParaEnviar = {
                ...imagenProducto,
                idProducto: presentacion.idProducto,
                idPresentacion: presentacion.id
            };

            const response = await apiFetch(
                "/api/v1/imagenProducto/crearImagen",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(imagenParaEnviar)
                }
            );

            if (!response.ok) {
                throw new Error("Error al subir imagen");
            }

            alert("Imagen subida correctamente");

            setImagenProducto({
                nombre: "",
                extension: "",
                imagen: "",
                esPrincipal: false,
                idProducto: "",
                idPresentacion: ""
            });

            setIdPresentacionImagen(null);

            return true;
        } catch (error) {
            console.error(error);
            alert("Error al subir imagen");
            return false;
        }
    };

    const crearPresentacionCompleta = async () => {
        const presentacionCreada = await crearPresentacion();

        if (!presentacionCreada) {
            return;
        }

        await subirImagen(presentacionCreada);
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

                <datalist id="sugerencias-descripcion-presentacion">
                    {SUGERENCIAS_DESCRIPCION.map((opcion) => (
                        <option key={opcion} value={opcion} />
                    ))}
                </datalist>

                <div className="grid md:grid-cols-6 gap-4">
                    <div className="flex flex-col gap-1">
                        <input
                            type="text"
                            list="sugerencias-descripcion-presentacion"
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

                    </div>

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
                        onChange={(e) => {
                            setNuevaPresentacion({
                                ...nuevaPresentacion,
                                idProducto: e.target.value
                            });

                            setImagenProducto({
                                ...imagenProducto,
                                idProducto: e.target.value
                            });
                        }}
                        className="border p-3 rounded-lg"
                    >
                        <option value="">Producto</option>
                        {productos.map((producto) => (
                            <option key={producto.id} value={producto.id}>
                                {producto.nombre}
                            </option>
                        ))}
                    </select>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            manejarImagen(e);
                        }}
                    />

                    <button
                        onClick={crearPresentacionCompleta}
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

                            <input
                                type="file"
                                accept="image/*"
                                onChange={manejarImagen}
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