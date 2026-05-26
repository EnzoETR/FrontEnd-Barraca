import imagenLenia from "../images/imagenLenia.jpeg";

export default function FichaCarrito({
    item,
    aumentarCantidad,
    disminuirCantidad,
    eliminarProducto
}) {

    return (
        <div className="bg-[#e9e9e9] w-[220px] p-3 shadow-md">

            <img
                src={imagenLenia}
                alt="Leña"
                className="w-full h-[200px] object-cover"
            />

            <h3 className="text-orange-600 font-bold italic text-lg mt-3">
                {item.descripcion}
            </h3>

            <p>Precio: ${item.precio}</p>

            <p>Cantidad: {item.cantidad}</p>

            <p className="font-bold">
                Subtotal: ${item.subtotal}
            </p>

            <div className="flex gap-2 mt-3">

                <button
                    onClick={() => disminuirCantidad(item.idPresentacion)}
                    className="bg-orange-500 px-3 py-1"
                >
                    -
                </button>

                <button
                    onClick={() => aumentarCantidad(item.idPresentacion)}
                    className="bg-orange-500 px-3 py-1"
                >
                    +
                </button>

                <button
                    onClick={() => eliminarProducto(item.idPresentacion)}
                    className="bg-red-500 px-3 py-1"
                >
                    ❌
                </button>

            </div>
        </div>
    );
}