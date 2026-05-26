import imagenLenia from "../images/imagenLenia.jpeg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


export default function FichaPresentacion({ presentacion, imagenProducto }) {
    const navigate = useNavigate();

    const [carrito, setCarrito] = useState(
        JSON.parse(localStorage.getItem("carrito")) || []
    );

    const agregarAlCarrito = (presentacion) => {

        let carritoActual =
            JSON.parse(localStorage.getItem("carrito")) || [];

        const productoExistente = carritoActual.find(
            (item) =>
                item.idPresentacion ===
                presentacion.id
        );

        if (productoExistente) {

            productoExistente.cantidad += 1;

            productoExistente.subtotal =
                productoExistente.cantidad *
                productoExistente.precio;

        } else {

            carritoActual.push({
                idPresentacion: presentacion.id,
                descripcion: presentacion.descripcion,
                precio: presentacion.precio,
                cantidad: 1,
                subtotal: presentacion.precio
            });
        }

console.log(
    "PRODUCTO AGREGADO -> ",
    carritoActual
);
        localStorage.setItem(
            "carrito",
            JSON.stringify(carritoActual)
        );

        setCarrito(carritoActual);

    };

    const eliminarDelCarrito = (id) => {
        const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

        const nuevoCarrito = carritoActual.filter((item) => item.idPresentacion !== id);

        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        setCarrito(nuevoCarrito);
    };

    const estaEnCarrito = carrito.some(
        (item) => item.idPresentacion === presentacion.id
    );

    return (
        <div className="bg-[#e9e9e9] w-[250px] p-3 flex flex-col items-center shadow-md">
            <div className="w-full h-[12px] bg-orange-500 mb-[-12px] z-10"></div>

            {imagenProducto ? (
                <img
                    src={imagenProducto.imagen}
                    alt={imagenProducto.nombre}
                    className="w-full h-48 object-cover rounded-lg"
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    Sin imagen
                </div>
            )}

            <div className="w-full flex flex-col mt-3">
                <h3 className="text-orange-600 font-bold italic text-lg">
                    {presentacion.descripcion}
                </h3>

                <p className="text-orange-500 font-bold italic text-lg mt-1">
                    ${presentacion.precio}
                </p>
                <p className="text-orange-500 font-bold italic text-lg mt-1">
                    Cantidad: {presentacion.cantidad}
                </p>

                {estaEnCarrito ? (
                    <button
                        className="mt-3 self-end bg-orange-500 hover:bg-orange-600 transition-colors px-4 py-2"
                        type="button"
                        onClick={() => eliminarDelCarrito(presentacion.id)}
                    >
                        ❌
                    </button>
                ) : (
                    <button
                        className="mt-3 self-end bg-orange-500 hover:bg-orange-600 transition-colors px-4 py-2"
                        type="button"
                        onClick={() => agregarAlCarrito(presentacion)}
                    >
                        🛒
                    </button>
                )}
            </div>
        </div>
    );
}