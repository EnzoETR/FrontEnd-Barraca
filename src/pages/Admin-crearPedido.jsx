import { useState } from "react";
import { apiFetch } from "../services/apiClient";

function CrearPedido() {

    const [pedido, setPedido] = useState({

        fechaEntrega: "",
        horarioEntrega: "",
        idUsuario: "",
        idDireccion: "",
        idEstado: 1,

        detalles: [
            {
                idPresentacion: "",
                cantidad: 1
            }
        ]
    });

    const handleChange = (e) => {

        setPedido({
            ...pedido,
            [e.target.name]: e.target.value
        });
    };

    const handleDetalleChange = (index, campo, valor) => {

        const nuevosDetalles = [...pedido.detalles];

        nuevosDetalles[index][campo] = valor;

        setPedido({
            ...pedido,
            detalles: nuevosDetalles
        });
    };

    const agregarDetalle = () => {

        setPedido({
            ...pedido,
            detalles: [
                ...pedido.detalles,
                {
                    idPresentacion: "",
                    cantidad: 1
                }
            ]
        });
    };

    const crearPedido = async (e) => {

        e.preventDefault();

        try {

            const response = await apiFetch("/api/v1/pedidos/crearPedido", {
                method: "POST",
                body: JSON.stringify(pedido)
            });

            if (!response.ok) {
                throw new Error("Error al crear pedido");
            }

            const data = await response.json();

            console.log(data);

            alert("Pedido creado correctamente");

        } catch (error) {

            console.error(error);

            alert("Error al crear pedido");
        }
    };

const ahora = new Date();

const fechaMinima =
    new Date(
        ahora.getTime() - ahora.getTimezoneOffset() * 60000
    )
    .toISOString()
    .slice(0, 10);
    return (

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow">

            <h1 className="text-3xl font-bold mb-6">
                Crear Pedido
            </h1>

            <form
                onSubmit={crearPedido}
                className="space-y-6"
            >

                {/* FECHA */}
                <div>

                    <label className="block font-semibold mb-2">
                        Fecha Entrega
                    </label>

                    <input
                        type="date"
                        name="fechaEntrega"
                        value={pedido.fechaEntrega}
                        onChange={handleChange}
                        min={fechaMinima}
                        className="w-full border p-3 rounded-lg"
                    />
                </div>

                {/* HORARIO */}
                <div>

                    <label className="block font-semibold mb-2">
                        Horario
                    </label>

                    <select
                        name="horarioEntrega"
                        value={pedido.horarioEntrega}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    >

                        <option value="">
                            Seleccionar horario
                        </option>

                        <option value="Mañana">
                            Mañana
                        </option>

                        <option value="Tarde">
                            Tarde
                        </option>

                    </select>
                </div>

                {/* ID USUARIO */}
                <div>

                    <label className="block font-semibold mb-2">
                        ID Usuario
                    </label>

                    <input
                        type="number"
                        name="idUsuario"
                        value={pedido.idUsuario}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    />
                </div>

                {/* ID DIRECCION */}
                <div>

                    <label className="block font-semibold mb-2">
                        ID Dirección
                    </label>

                    <input
                        type="number"
                        name="idDireccion"
                        value={pedido.idDireccion}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    />
                </div>

                {/* DETALLES */}
                <div>

                    <h2 className="text-2xl font-bold mb-4">
                        Productos
                    </h2>

                    <div className="space-y-4">

                        {pedido.detalles.map((detalle, index) => (

                            <div
                                key={index}
                                className="border p-4 rounded-xl"
                            >

                                <div className="mb-3">

                                    <label className="block mb-1">
                                        ID Presentación
                                    </label>

                                    <input
                                        type="number"
                                        value={detalle.idPresentacion}
                                        onChange={(e) =>
                                            handleDetalleChange(
                                                index,
                                                "idPresentacion",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                                <div>

                                    <label className="block mb-1">
                                        Cantidad
                                    </label>

                                    <input
                                        type="number"
                                        value={detalle.cantidad}
                                        onChange={(e) =>
                                            handleDetalleChange(
                                                index,
                                                "cantidad",
                                                e.target.value
                                            )
                                        }
                                        className="w-full border p-2 rounded"
                                    />
                                </div>

                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={agregarDetalle}
                        className="
                            mt-4
                            bg-gray-800
                            text-white
                            px-4
                            py-2
                            rounded-lg
                        "
                    >
                        Agregar Producto
                    </button>
                </div>

                {/* BOTON */}
                <button
                    type="submit"
                    className="
                        w-full
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        py-3
                        rounded-xl
                        font-bold
                    "
                >
                    Crear Pedido
                </button>

            </form>
        </div>
    );
}

export default CrearPedido;