import { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import FichaCarrito from "../components/FichaCarrito";
import { apiFetch } from "../services/apiClient";
import { useAuth } from "../context/AuthContext";
import GoogleAddressAutocomplete from "../components/GoogleAddressAutocomplete";

export default function Carrito() {
    const { usuario } = useAuth();
    const toast = useRef(null);

    const [carrito, setCarrito] = useState(() => {
        return JSON.parse(localStorage.getItem("carrito")) || [];
    });

    const [direcciones, setDirecciones] = useState([]);
    const [mostrarNuevaDireccion, setMostrarNuevaDireccion] = useState(false);

    const [datosCliente, setDatosCliente] = useState({
        nombre: "",
        telefono: "",
        calle: "",
        numeroCasa: "",
        referencia: "",
        direccionCompleta: ""
    });

    const [nuevaDireccion, setNuevaDireccion] = useState({
        calle: "",
        numeroCasa: "",
        referencia: "",
        alias: ""
    });

    const [pedido, setPedido] = useState({
        fechaEntrega: "",
        horarioEntrega: "",
        idDireccion: "",
        idEstado: 1
    });

const [numeroAutomatico, setNumeroAutomatico] = useState(false);
const [creandoPedido, setCreandoPedido] = useState(false);

    const actualizarCarrito = (nuevoCarrito) => {
        setCarrito(nuevoCarrito);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    };

    useEffect(() => {
        const cargarTipoUsoProductos = async () => {
            try {
                const responseProductos = await apiFetch("/api/v1/producto/listarProducto");
                const productos = await responseProductos.json();

                const responsePresentaciones = await apiFetch("/api/v1/presentacion/listarPresentacion");
                const presentaciones = await responsePresentaciones.json();

                const carritoActualizado = carrito.map((item) => {
                    const presentacion = presentaciones.find(
                        (presentacion) => presentacion.id === item.idPresentacion
                    );

                    const producto = productos.find(
                        (producto) => producto.id === presentacion?.idProducto
                    );

                    const usaTipoUso = producto?.usaTipoUso || false;

                    const unidadMedida = presentacion?.unidadMedida;
                    const minimo = unidadMedida === "kg" ? 50 : 1;

                    const cantidadActual =
                        item.cantidad && item.cantidad >= minimo
                            ? item.cantidad
                            : minimo;

                    return {
                        ...item,
                        idProducto: presentacion?.idProducto,
                        unidadMedida,
                        usaTipoUso,
                        cantidad: cantidadActual,
                        subtotal: cantidadActual * item.precio,
                        detallesUso: usaTipoUso
                            ? item.detallesUso?.length > 0
                                ? item.detallesUso.map((detalle) => ({
                                    ...detalle,
                                    cantidad:
                                        detalle.cantidad && detalle.cantidad >= minimo
                                            ? detalle.cantidad
                                            : minimo
                                }))
                                : [
                                    {
                                        tipoUso: "Estufa",
                                        cantidad: minimo
                                    }
                                ]
                            : []
                    };
                });

                actualizarCarrito(carritoActualizado);

            } catch (error) {
                console.error("Error al cargar tipo de uso:", error);
            }
        };

        if (carrito.length > 0) {
            cargarTipoUsoProductos();
        }
    }, []);

    useEffect(() => {
        const cargarDirecciones = async () => {
            if (!usuario) return;

            try {
                const response = await apiFetch(
                    `/api/v1/direcciones/usuario/${usuario.idUsuario}`
                );

                const data = await response.json();
                setDirecciones(data);

            } catch (error) {
                console.error(error);
            }
        };

        cargarDirecciones();
    }, [usuario]);

    const recalcularSubtotal = (detallesUso, precio) => {
        const cantidadTotal = detallesUso.reduce(
            (total, detalle) => total + Number(detalle.cantidad),
            0
        );

        return cantidadTotal * precio;
    };

    const agregarDetalleUso = (idPresentacion) => {
        const nuevoCarrito = carrito.map((item) => {
            if (item.idPresentacion === idPresentacion) {
                const tiposUso = ["estufa", "parrilla", "calefactor", "quematuti"];

                if (item.detallesUso.length >= tiposUso.length) {
                    return item;
                }
                const nuevosDetallesUso = [
                    ...item.detallesUso,
                    {
                         tipoUso: tiposUso.find(
                                (tipo) => !item.detallesUso.some((detalle) => detalle.tipoUso === tipo)
                            ),
                        cantidad: item.unidadMedida === "kg" ? 50 : 1
                    }
                ];

                return {
                    ...item,
                    detallesUso: nuevosDetallesUso,
                    cantidad: nuevosDetallesUso.reduce(
                        (total, detalle) => total + Number(detalle.cantidad),
                        0
                    ),
                    subtotal: recalcularSubtotal(nuevosDetallesUso, item.precio)
                };
            }

            return item;
        });

        actualizarCarrito(nuevoCarrito);
    };

    const cambiarDetalleUso = (idPresentacion, index, campo, valor) => {
        const nuevoCarrito = carrito.map((item) => {
            if (item.idPresentacion === idPresentacion) {
                const minimo = item.unidadMedida === "kg" ? 50 : 1;

                const valorFinal =
                    campo === "cantidad" && valor < minimo
                        ? minimo
                        : valor;
                const nuevosDetallesUso = [...item.detallesUso];

                nuevosDetallesUso[index] = {
                    ...nuevosDetallesUso[index],
                    [campo]: valorFinal
                };

                return {
                    ...item,
                    detallesUso: nuevosDetallesUso,
                    cantidad: nuevosDetallesUso.reduce(
                        (total, detalle) => total + Number(detalle.cantidad),
                        0
                    ),
                    subtotal: recalcularSubtotal(nuevosDetallesUso, item.precio)
                };
            }

            return item;
        });

        actualizarCarrito(nuevoCarrito);
    };

    const eliminarDetalleUso = (idPresentacion, index) => {
        const nuevoCarrito = carrito.map((item) => {
            if (item.idPresentacion === idPresentacion) {
                if (item.detallesUso.length === 1) return item;

                const nuevosDetallesUso = item.detallesUso.filter(
                    (_, i) => i !== index
                );

                return {
                    ...item,
                    detallesUso: nuevosDetallesUso,
                    cantidad: nuevosDetallesUso.reduce(
                        (total, detalle) => total + Number(detalle.cantidad),
                        0
                    ),
                    subtotal: recalcularSubtotal(nuevosDetallesUso, item.precio)
                };
            }

            return item;
        });

        actualizarCarrito(nuevoCarrito);
    };

    const cambiarCantidadSimple = (idPresentacion, cantidad) => {
        const nuevoCarrito = carrito.map((item) => {
            if (item.idPresentacion === idPresentacion) {
                const minimo = item.unidadMedida === "kg" ? 50 : 1;

                const cantidadFinal =
                    cantidad < minimo
                        ? minimo
                        : cantidad;

                return {
                    ...item,
                    cantidad: cantidadFinal,
                    subtotal: cantidadFinal * item.precio
                };
            }

            return item;
        });

        actualizarCarrito(nuevoCarrito);
    };

    const eliminarProducto = (idPresentacion) => {
        const nuevoCarrito = carrito.filter(
            (item) => item.idPresentacion !== idPresentacion
        );

        actualizarCarrito(nuevoCarrito);
    };

    const handleDatosCliente = (e) => {
        setDatosCliente({
            ...datosCliente,
            [e.target.name]: e.target.value
        });
    };

    const handlePedido = (e) => {
        setPedido({
            ...pedido,
            [e.target.name]: e.target.value
        });
    };

    const handleNuevaDireccion = (e) => {
        setNuevaDireccion({
            ...nuevaDireccion,
            [e.target.name]: e.target.value
        });
    };

    const agregarDireccion = async () => {
        try {
            if (!nuevaDireccion.calle || !nuevaDireccion.numeroCasa || !nuevaDireccion.alias) {
                toast.current.show({
                    severity: "warn",
                    summary: "Datos incompletos",
                    detail: "Complete alias, calle y número de casa.",
                    life: 3000
                });
                return;
            }

            const body = {
                idUsuario: usuario.idUsuario,
                calle: nuevaDireccion.calle,
                numeroCasa: Number(nuevaDireccion.numeroCasa),
                referencia: nuevaDireccion.referencia,
                alias: nuevaDireccion.alias
            };

            const response = await apiFetch("/api/v1/direcciones/agregarDireccion", {
                method: "POST",
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error("Error al agregar dirección");
            }

            const direccionCreada = await response.json();

            setDirecciones([...direcciones, direccionCreada]);

            setPedido({
                ...pedido,
                idDireccion: direccionCreada.id
            });

            setNuevaDireccion({
                calle: "",
                numeroCasa: "",
                referencia: "",
                alias: ""
            });

            setMostrarNuevaDireccion(false);

            toast.current.show({
                severity: "success",
                summary: "Dirección agregada",
                detail: "La dirección se guardó correctamente.",
                life: 3000
            });

        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "No se pudo agregar la dirección.",
                life: 3000
            });
        }
    };

    const crearPedido = async (e) => {
        e.preventDefault();

        if (creandoPedido) return;

        setCreandoPedido(true);

        try {
            const faltaTipoUso = carrito.some((item) =>
                item.usaTipoUso &&
                item.detallesUso.some((detalle) => !detalle.tipoUso)
            );

            if (faltaTipoUso) {
                toast.current.show({
                    severity: "warn",
                    summary: "Tipo de uso",
                    detail: "Seleccione el tipo de uso en todos los productos.",
                    life: 3000
                });
                setCreandoPedido(false);
                return;
            }

            const detalles = carrito.flatMap((item) => {
                if (item.usaTipoUso) {
                    return item.detallesUso.map((detalle) => ({
                        idPresentacion: item.idPresentacion,
                        cantidad: Number(detalle.cantidad),
                        tipoUso: detalle.tipoUso
                    }));
                }

                return [
                    {
                        idPresentacion: item.idPresentacion,
                        cantidad: Number(item.cantidad),
                        tipoUso: null
                    }
                ];
            });

            let body = {
                fechaEntrega: pedido.fechaEntrega,
                horarioEntrega: pedido.horarioEntrega,
                idEstado: 1,
                detalles
            };

            if (!pedido.horarioEntrega) {
                toast.current.show({
                    severity: "warn",
                    summary: "Horario",
                    detail: "Seleccione un horario de entrega.",
                    life: 3000
                });
                setCreandoPedido(false);
                return;
            }

            if (usuario) {
                if (!pedido.idDireccion) {
                    toast.current.show({
                        severity: "warn",
                        summary: "Dirección",
                        detail: "Seleccione una dirección.",
                        life: 3000
                    });
                    setCreandoPedido(false);
                    return;
                }

                body = {
                    ...body,
                    idUsuario: usuario.idUsuario,
                    idDireccion: pedido.idDireccion
                };

            } else {
                const { nombre, telefono, calle, numeroCasa } = datosCliente;

                if (!nombre || !telefono || !calle || !numeroCasa) {
                    toast.current.show({
                        severity: "warn",
                        summary: "Datos incompletos",
                        detail: "Complete todos los datos obligatorios.",
                        life: 3000
                    });
                    setCreandoPedido(false);
                    return;
                }

                body = {
                    ...body,
                    clienteAnonimo: {
                        nombre: datosCliente.nombre,
                        telefono: datosCliente.telefono,
                        calle: datosCliente.calle,
                        numeroCasa: datosCliente.numeroCasa,
                        referencia: datosCliente.referencia
                    }
                };
            }

            console.log("BODY QUE SE ENVIA:", body);

            const opcionesFetch = usuario
                ? {
                    method: "POST",
                    body: JSON.stringify(body)
                }
                : {
                    method: "POST",
                    body: JSON.stringify(body),
                    publico: true,
                    credenciales: true
                };

            const response = await apiFetch(
                "/api/v1/pedidos/crearPedido",
                opcionesFetch
            );

            if (!response.ok) {
                throw new Error("Error al crear pedido");
            }

            await response.json();

            toast.current.show({
                severity: "success",
                summary: "Pedido creado",
                detail: "Su pedido fue creado correctamente.",
                life: 3000
            });

            localStorage.removeItem("carrito");
            setCarrito([]);

        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "No se pudo crear el pedido.",
                life: 3000
            });
        } finally {
            setCreandoPedido(false);
        }
    };

    const total = carrito.reduce(
        (acumulador, item) => acumulador + item.subtotal,
        0
    );

    const ahora = new Date();

    const fechaMinima = new Date(
        ahora.getTime() - ahora.getTimezoneOffset() * 60000
    )
        .toISOString()
        .slice(0, 10);

    return (
        <div className="min-h-screen flex flex-col">
            <Toast ref={toast} />
            <main className="flex-grow p-6 max-w-6xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-6">
                    Carrito
                </h1>

                {carrito.length === 0 ? (
                    <p>No hay productos en el carrito.</p>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-8 justify-center mt-10">
                            {carrito.map((item) => (
                                <FichaCarrito
                                    key={item.idPresentacion}
                                    item={item}
                                    agregarDetalleUso={agregarDetalleUso}
                                    cambiarDetalleUso={cambiarDetalleUso}
                                    eliminarDetalleUso={eliminarDetalleUso}
                                    eliminarProducto={eliminarProducto}
                                    cambiarCantidadSimple={cambiarCantidadSimple}
                                />
                            ))}
                        </div>

                        <form
                            onSubmit={crearPedido}
                            className="mt-12 bg-gray-100 p-6 rounded-xl shadow-md"
                        >
                            <h2 className="text-2xl font-bold mb-6">
                                Datos del pedido
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block font-semibold mb-2">
                                        Fecha Entrega
                                    </label>

                                    <input
                                        type="date"
                                        name="fechaEntrega"
                                        min={fechaMinima}
                                        value={pedido.fechaEntrega}
                                        onChange={handlePedido}
                                        className="w-full border p-3 rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold mb-2">
                                        Horario de entrega
                                    </label>

                                    <select
                                        name="horarioEntrega"
                                        value={pedido.horarioEntrega}
                                        onChange={handlePedido}
                                        className="w-full border p-3 rounded"
                                    >
                                        <option value="">Seleccionar horario</option>
                                        <option value="Mañana">En la mañana</option>
                                        <option value="Tarde">En la tarde</option>
                                    </select>
                                </div>
                            </div>

                            {!usuario ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="nombre"
                                        placeholder="Nombre *"
                                        required
                                        value={datosCliente.nombre}
                                        onChange={handleDatosCliente}
                                        className="border p-3 rounded"
                                    />

                                    <input
                                        type="text"
                                        name="telefono"
                                        placeholder="Teléfono *"
                                        required
                                        value={datosCliente.telefono}
                                        onChange={handleDatosCliente}
                                        className="border p-3 rounded"
                                    />

                                    <GoogleAddressAutocomplete
                                        onSelect={(direccion) => {
                                            setNumeroAutomatico(direccion.tieneNumero);

                                            setDatosCliente((prev) => ({
                                                ...prev,
                                                calle: direccion.calle,
                                                numeroCasa: direccion.numero,
                                                direccionCompleta: direccion.direccionCompleta
                                            }));
                                        }}
                                    />
                                    {datosCliente.direccionCompleta && (
                                        <p className="text-sm text-gray-600 -mt-2">
                                            Dirección seleccionada: {datosCliente.direccionCompleta}
                                        </p>
                                    )}

                                    <input
                                        type="text"
                                        name="numeroCasa"
                                        placeholder={
                                            numeroAutomatico
                                                ? "Número detectado"
                                                : "Ingrese el número de casa"
                                        }
                                        required
                                        value={datosCliente.numeroCasa}
                                        onChange={handleDatosCliente}
                                        readOnly={numeroAutomatico}
                                        className={`border p-3 rounded ${
                                            numeroAutomatico
                                                ? "bg-gray-100 cursor-not-allowed"
                                                : ""
                                        }`}
                                    />

                                    <input
                                        type="text"
                                        name="referencia"
                                        placeholder="Referencia"
                                        value={datosCliente.referencia}
                                        onChange={handleDatosCliente}
                                        className="border p-3 rounded md:col-span-2"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block font-semibold mb-2">
                                        Dirección
                                    </label>

                                    <select
                                        name="idDireccion"
                                        value={pedido.idDireccion}
                                        onChange={handlePedido}
                                        className="w-full border p-3 rounded"
                                    >
                                        <option value="">Seleccionar dirección</option>

                                        {direcciones.map((direccion) => (
                                            <option
                                                key={direccion.id}
                                                value={direccion.id}
                                            >
                                                {direccion.alias} - {direccion.calle} {direccion.numeroCasa}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMostrarNuevaDireccion(!mostrarNuevaDireccion)
                                        }
                                        className="mt-3 text-green-700 font-semibold"
                                    >
                                        + Agregar nueva dirección
                                    </button>

                                    {mostrarNuevaDireccion && (
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border">
                                            <input
                                                type="text"
                                                name="alias"
                                                placeholder="Alias, ej: Casa"
                                                value={nuevaDireccion.alias}
                                                onChange={handleNuevaDireccion}
                                                className="border p-3 rounded"
                                            />

                                            <GoogleAddressAutocomplete
                                                onSelect={(direccion) => {
                                                    setNuevaDireccion((prev) => ({
                                                        ...prev,
                                                        calle: direccion.calle,
                                                        numeroCasa: direccion.numero
                                                    }));
                                                }}
                                            />

                                            <input
                                                type="text"
                                                name="numeroCasa"
                                                placeholder="Número de casa"
                                                value={nuevaDireccion.numeroCasa}
                                                onChange={handleNuevaDireccion}
                                                readOnly={!!nuevaDireccion.numeroCasa}
                                                className={`border p-3 rounded ${
                                                    nuevaDireccion.numeroCasa
                                                        ? "bg-gray-100 cursor-not-allowed"
                                                        : ""
                                                }`}
                                            />

                                            <input
                                                type="text"
                                                name="referencia"
                                                placeholder="Referencia"
                                                value={nuevaDireccion.referencia}
                                                onChange={handleNuevaDireccion}
                                                className="border p-3 rounded"
                                            />

                                            <button
                                                type="button"
                                                onClick={agregarDireccion}
                                                className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-bold"
                                            >
                                                Guardar dirección
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-10 flex justify-between items-center">
                                <h2 className="text-3xl font-bold">
                                    Total: ${total}
                                </h2>

                                <button
                                    type="submit"
                                    disabled={creandoPedido}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {creandoPedido ? "Creando pedido..." : "Confirmar Pedido"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </main>
        </div>
    );
}