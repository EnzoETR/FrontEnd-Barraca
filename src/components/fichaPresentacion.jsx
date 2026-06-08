import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

export default function FichaPresentacion({ presentacion, imagenProducto, nombreProducto }) {


    const [carrito, setCarrito] = useState(
        JSON.parse(localStorage.getItem("carrito")) || []
    );

    const agregarAlCarrito = (presentacion, imagenProducto) => {
        let carritoActual =
            JSON.parse(localStorage.getItem("carrito")) || [];

        const productoExistente = carritoActual.find(
            (item) => item.idPresentacion === presentacion.id
        );

        if (productoExistente) {
            productoExistente.cantidad += 1;
            productoExistente.subtotal =
                productoExistente.cantidad * productoExistente.precio;
        } else {
            carritoActual.push({
                idPresentacion: presentacion.id,
                descripcion: presentacion.descripcion,
                precio: presentacion.precio,
                cantidad: 1,
                subtotal: presentacion.precio,
                imagenProducto: imagenProducto?.imagen,
            });
        }

        localStorage.setItem("carrito", JSON.stringify(carritoActual));
        setCarrito(carritoActual);
    };

    const eliminarDelCarrito = (id) => {
        const carritoActual =
            JSON.parse(localStorage.getItem("carrito")) || [];

        const nuevoCarrito = carritoActual.filter(
            (item) => item.idPresentacion !== id
        );

        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
        setCarrito(nuevoCarrito);
    };

    const estaEnCarrito = carrito.some(
        (item) => item.idPresentacion === presentacion.id
    );

    const header = imagenProducto ? (
        <img
            src={imagenProducto.imagen}
            className="w-full h-36 object-cover"
        />
    ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            Sin imagen
        </div>
    );

    const footer = (
        <div className="flex justify-between items-center">
            <p className="text-orange-500 font-bold text-lg m-0">
                ${presentacion.precio}
            </p>

            {estaEnCarrito ? (
                <Button
                    icon="pi pi-times"
                    rounded
                    severity="danger"
                    className="!bg-red-500 !border-red-500 hover:!bg-red-600"
                    onClick={() => eliminarDelCarrito(presentacion.id)}
                />
            ) : (
                <Button
                    icon="pi pi-shopping-cart"
                    rounded
                    onClick={() => agregarAlCarrito(presentacion, imagenProducto)}
                />
            )}
        </div>
    );

    return (
        <Card
            title={presentacion.descripcion}
            subTitle={
                <div>
                    <p>{nombreProducto}</p>
                    <p>Cantidad: {presentacion.cantidad}</p>
                </div>
            }
            header={header}
            footer={footer}
            className="w-[220px] "
        >

        </Card>
    );
}