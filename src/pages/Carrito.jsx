import { useState } from "react";
import FichaCarrito from "../components/FichaCarrito";
import { apiFetch } from "../services/apiClient";

export default function Carrito() {

    const [carrito, setCarrito] = useState(
        JSON.parse(localStorage.getItem("carrito")) || []
    );

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    const [datosCliente, setDatosCliente] = useState({
        nombre: "",
        telefono: "",
        calle: "",
        numeroCasa: "",
        referencia: ""
    });

    const [pedido, setPedido] = useState({
        fechaEntrega: "",
        horarioEntrega: "",
        idDireccion: "",
        idEstado: 1
    });

    const actualizarCarrito = (nuevoCarrito) => {

        setCarrito(nuevoCarrito);

        localStorage.setItem(
            "carrito",
            JSON.stringify(nuevoCarrito)
        );
    };

    const aumentarCantidad = (id) => {

        const nuevoCarrito = carrito.map((item) => {

            if (item.idPresentacion === id) {

                const nuevaCantidad =
                    item.cantidad + 1;

                return {
                    ...item,
                    cantidad: nuevaCantidad,
                    subtotal:
                        nuevaCantidad * item.precio
                };
            }

            return item;
        });

        actualizarCarrito(nuevoCarrito);
    };

    const disminuirCantidad = (id) => {

        let nuevoCarrito = carrito.map((item) => {

            if (item.idPresentacion === id) {

                const nuevaCantidad =
                    item.cantidad - 1;

                return {
                    ...item,
                    cantidad: nuevaCantidad,
                    subtotal:
                        nuevaCantidad * item.precio
                };
            }

            return item;
        });

        nuevoCarrito = nuevoCarrito.filter(
            (item) => item.cantidad > 0
        );

        actualizarCarrito(nuevoCarrito);
    };

    const eliminarProducto = (id) => {

        const nuevoCarrito = carrito.filter(
            (item) => item.idPresentacion !== id
        );

        actualizarCarrito(nuevoCarrito);
    };

    const total = carrito.reduce(
        (acumulador, item) =>
            acumulador + item.subtotal,
        0
    );

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

    const crearPedido = async (e) => {

        e.preventDefault();

        try {

            const detalles = carrito.map((item) => ({
                idPresentacion: item.idPresentacion,
                cantidad: item.cantidad
            }));

            let body = {
                fechaEntrega: pedido.fechaEntrega,
                horarioEntrega: pedido.horarioEntrega,
                idEstado: 1,
                detalles
            };

            if (usuario) {

                body = {
                    ...body,
                    idUsuario: usuario.id,
                    idDireccion: pedido.idDireccion
                };

            } else {

                body = {
                    ...body,

                    clienteAnonimo: {
                        nombre: datosCliente.nombre,
                        telefono: datosCliente.telefono,
                        calle: datosCliente.calle,
                        numeroCasa:
                            datosCliente.numeroCasa,
                        referencia:
                            datosCliente.referencia
                    }
                };
            }

            console.log("========== BODY ==========");

            console.log(
                JSON.stringify(body, null, 2)
            );

            console.log("========== CARRITO ==========");

            console.log(carrito);

            console.log("========== DETALLES ==========");

            console.log(detalles);

            detalles.forEach((detalle, index) => {

                console.log(
                    `DETALLE ${index}`
                );

                console.log(
                    "ID PRESENTACION -> ",
                    detalle.idPresentacion
                );

                console.log(
                    "CANTIDAD -> ",
                    detalle.cantidad
                );
            });

            console.log("========== USUARIO ==========");

            console.log(usuario);

            console.log("========== PEDIDO ==========");

            console.log(pedido);

            console.log("========== DATOS CLIENTE ==========");

            console.log(datosCliente);


            if (!pedido.horarioEntrega) {

                alert("Seleccione un horario");

                return;
            }

            const response = await apiFetch(
                "/api/v1/pedidos/crearPedido",
                {
                    method: "POST",
                    body: JSON.stringify(body)
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Error al crear pedido"
                );
            }

            const data = await response.json();

            console.log(data);

            alert("Pedido creado correctamente");

            localStorage.removeItem("carrito");

            setCarrito([]);

        } catch (error) {

            console.error(error);

            alert("Error al crear pedido");
        }
    };

    const ahora = new Date();

    const fechaMinima =
        new Date(
            ahora.getTime() -
            ahora.getTimezoneOffset() * 60000
        )
            .toISOString()
            .slice(0, 10);

    return (
        <div className="min-h-screen flex flex-col">

            <main className="flex-grow p-6 max-w-6xl mx-auto w-full">

                <h1 className="text-3xl font-bold mb-6">
                    Carrito
                </h1>

                {carrito.length === 0 ? (

                    <p>
                        No hay productos en el carrito.
                    </p>

                ) : (

                    <>
                        <div className="flex flex-wrap gap-10 justify-center mt-10">

                            {carrito.map((item) => (

                                <FichaCarrito
                                    key={item.idPresentacion}
                                    item={item}
                                    aumentarCantidad={
                                        aumentarCantidad
                                    }
                                    disminuirCantidad={
                                        disminuirCantidad
                                    }
                                    eliminarProducto={
                                        eliminarProducto
                                    }
                                />
                            ))}

                        </div>

                        <form
                            onSubmit={crearPedido}
                            className="
                                mt-12
                                bg-gray-100
                                p-6
                                rounded-xl
                                shadow-md
                            "
                        >

                            <h2 className="text-2xl font-bold mb-6">
                                Datos del pedido
                            </h2>

                            {/* FECHA Y HORARIO */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                                <div>

                                    <label className="block font-semibold mb-2">
                                        Fecha Entrega
                                    </label>

                                    <input
                                        type="date"
                                        name="fechaEntrega"
                                        min={fechaMinima}
                                        value={
                                            pedido.fechaEntrega
                                        }
                                        onChange={
                                            handlePedido
                                        }
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

                                        <option value="">
                                            Seleccionar horario
                                        </option>

                                        <option value="Mañana">
                                            En la mañana
                                        </option>

                                        <option value="Tarde">
                                            En la tarde
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* CLIENTE ANONIMO */}
                            {!usuario ? (

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <input
                                        type="text"
                                        name="nombre"
                                        placeholder="Nombre"
                                        value={
                                            datosCliente.nombre
                                        }
                                        onChange={
                                            handleDatosCliente
                                        }
                                        className="border p-3 rounded"
                                    />

                                    <input
                                        type="text"
                                        name="telefono"
                                        placeholder="Teléfono"
                                        value={
                                            datosCliente.telefono
                                        }
                                        onChange={
                                            handleDatosCliente
                                        }
                                        className="border p-3 rounded"
                                    />

                                    <input
                                        type="text"
                                        name="calle"
                                        placeholder="Calle"
                                        value={
                                            datosCliente.calle
                                        }
                                        onChange={
                                            handleDatosCliente
                                        }
                                        className="border p-3 rounded"
                                    />

                                    <input
                                        type="text"
                                        name="numeroCasa"
                                        placeholder="Número de casa"
                                        value={
                                            datosCliente.numeroCasa
                                        }
                                        onChange={
                                            handleDatosCliente
                                        }
                                        className="border p-3 rounded"
                                    />

                                    <input
                                        type="text"
                                        name="referencia"
                                        placeholder="Referencia"
                                        value={
                                            datosCliente.referencia
                                        }
                                        onChange={
                                            handleDatosCliente
                                        }
                                        className="
                                            border
                                            p-3
                                            rounded
                                            md:col-span-2
                                        "
                                    />

                                </div>

                            ) : (

                                /* USUARIO LOGUEADO */
                                <div>

                                    <label className="block font-semibold mb-2">
                                        Dirección
                                    </label>

                                    <select
                                        name="idDireccion"
                                        value={
                                            pedido.idDireccion
                                        }
                                        onChange={
                                            handlePedido
                                        }
                                        className="
                                            w-full
                                            border
                                            p-3
                                            rounded
                                        "
                                    >

                                        <option value="">
                                            Seleccionar dirección
                                        </option>

                                        <option value="1">
                                            Av. Italia 1234
                                        </option>

                                        <option value="2">
                                            Centro 456
                                        </option>

                                    </select>

                                </div>

                            )}

                            {/* TOTAL */}
                            <div className="mt-10 flex justify-between items-center">

                                <h2 className="text-3xl font-bold">
                                    Total: ${total}
                                </h2>

                                <button
                                    type="submit"
                                    className="
                                        bg-green-600
                                        hover:bg-green-700
                                        text-white
                                        px-6
                                        py-3
                                        rounded-xl
                                        font-bold
                                    "
                                >
                                    Confirmar Pedido
                                </button>

                            </div>

                        </form>
                    </>
                )}

            </main>
        </div>
    );
}