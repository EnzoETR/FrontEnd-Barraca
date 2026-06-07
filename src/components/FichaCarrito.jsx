import imagenLenia from "../images/imagenLenia.jpeg";

export default function FichaCarrito({
    item,
    agregarDetalleUso,
    cambiarDetalleUso,
    eliminarProducto
}) {
    const tiposUso = [
        "estufa",
        "parrilla",
        "calefactor"
    ];

    return (
        <div className="w-[260px] min-h-[430px] border-4 border-black bg-white p-3">

            <div className="border-4 border-black h-[130px] overflow-hidden">
                <img
                    src={imagenLenia}
                    alt="Leña"
                    className="w-full h-full object-cover"
                />
            </div>

            <h3 className="mt-3 text-sm font-medium">
                {item.descripcion}
            </h3>

            <div className="mt-4 space-y-3">

                {item.detallesUso.map((detalle, index) => (

                    <div
                        key={index}
                        className="flex items-center gap-3"
                    >
                        <select
                            value={detalle.tipoUso}
                            onChange={(e) =>
                                cambiarDetalleUso(
                                    item.idPresentacion,
                                    index,
                                    "tipoUso",
                                    e.target.value
                                )
                            }
                            className="w-[135px] border border-black px-2 py-1 text-sm"
                        >
                            <option value="">
                                tipo de uso
                            </option>

                            {tiposUso.map((tipo) => (
                                <option
                                    key={tipo}
                                    value={tipo}
                                >
                                    {tipo}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min="1"
                            value={detalle.cantidad}
                            onChange={(e) =>
                                cambiarDetalleUso(
                                    item.idPresentacion,
                                    index,
                                    "cantidad",
                                    Number(e.target.value)
                                )
                            }
                            className="w-[65px] border border-black px-2 py-1 text-center"
                        />
                    </div>

                ))}

            </div>

            <div className="mt-3 flex justify-end">
                <button
                    type="button"
                    onClick={() => agregarDetalleUso(item.idPresentacion)}
                    className="border border-orange-300 text-orange-500 px-5 py-1 rounded-md"
                >
                    +
                </button>
            </div>

            <button
                type="button"
                onClick={() => eliminarProducto(item.idPresentacion)}
                className="mt-5 bg-red-500 px-3 py-1 text-white"
            >
                X
            </button>

            <p className="mt-3 text-sm">
                Precio: ${item.precio}
            </p>

            <p className="font-bold text-sm">
                Subtotal: ${item.subtotal}
            </p>
        </div>
    );
}