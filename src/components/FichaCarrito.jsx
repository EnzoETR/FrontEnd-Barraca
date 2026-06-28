import { Card } from "primereact/card";
import { Button } from "primereact/button";

export default function FichaCarrito({
    item,
    agregarDetalleUso,
    cambiarDetalleUso,
    eliminarDetalleUso,
    eliminarProducto,
    cambiarCantidadSimple
}) {
    const tiposUso = ["Estufa", "Parrilla", "Calefactor", "Quematuti"];

    const detallesUso = item.detallesUso || [];
    const cantidadMinima = item.unidadMedida === "kg" ? 50 : 1;
    const puedeAgregarDetalle = detallesUso.length < tiposUso.length;

    const opcionesDisponibles = (index) => {
        return tiposUso.filter((tipo) =>
            !detallesUso.some(
                (detalle, i) => detalle.tipoUso === tipo && i !== index
            )
        );
    };

    const aumentarSimple = () => {
        cambiarCantidadSimple(
            item.idPresentacion,
            Number(item.cantidad) + 1
        );
    };

    const disminuirSimple = () => {
        const nuevaCantidad = Number(item.cantidad) - 1;

        cambiarCantidadSimple(
            item.idPresentacion,
            nuevaCantidad < cantidadMinima ? cantidadMinima : nuevaCantidad
        );
    };

    const header = (
        <div className="h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
            {item.imagenProducto ? (
                <img
                    src={item.imagenProducto}
                    alt={item.descripcion}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className="text-gray-400 text-sm">
                    Sin imagen
                </span>
            )}
        </div>
    );

    return (
        <Card
            header={header}
            className="w-[285px] rounded-2xl overflow-hidden shadow-md border border-gray-100"
        >
            <div className="flex flex-col min-h-[330px]">
                <h3 className="text-2xl font-bold text-gray-700 leading-tight mb-6 min-h-[64px]">
                    {item.descripcion}
                </h3>

                <div className=" space-y-3
                                        h-[185px]
                                        overflow-y-auto
                                        overflow-x-hidden
                                        pr-2">
                    {item.usaTipoUso ? (
                        <>
                            {detallesUso.map((detalle, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-[115px_40px_30px] gap-2 items-center justify-center"
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
                                        className="
                                            h-[40px]
                                            w-full
                                            border-2
                                            border-orange-300
                                            bg-orange-50
                                            rounded-lg
                                            px-2
                                            text-sm
                                            text-gray-700
                                            font-medium
                                            focus:outline-none
                                            focus:border-orange-500
                                            focus:ring-2
                                            focus:ring-orange-200
                                        "
                                    >
                                        <option value="">
                                            Tipo de uso
                                        </option>

                                        {opcionesDisponibles(index).map((tipo) => (
                                            <option key={tipo} value={tipo}>
                                                {tipo}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        min={cantidadMinima}
                                        value={detalle.cantidad}
                                        onChange={(e) =>
                                            cambiarDetalleUso(
                                                item.idPresentacion,
                                                index,
                                                "cantidad",
                                                Number(e.target.value)
                                            )
                                        }
                                        className="
                                            h-[40px]
                                            w-full
                                            border
                                            border-gray-300
                                            rounded-lg
                                            text-center
                                            text-gray-700
                                            focus:outline-none
                                            focus:border-orange-500
                                            focus:ring-2
                                            focus:ring-orange-200
                                        "
                                    />

                                    <Button
                                        icon="pi pi-minus"
                                        text
                                        rounded
                                        severity="secondary"
                                        size="small"
                                        disabled={detallesUso.length === 1}
                                        onClick={() =>
                                            eliminarDetalleUso(
                                                item.idPresentacion,
                                                index
                                            )
                                        }
                                    />
                                </div>
                            ))}

                            {puedeAgregarDetalle && (
                                <div className="flex justify-end">
                                    <Button
                                        icon="pi pi-plus"
                                        text
                                        rounded
                                        severity="warning"
                                        onClick={() =>
                                            agregarDetalleUso(item.idPresentacion)
                                        }
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center gap-2 h-[40px]">
                            <input
                                type="number"
                                min={cantidadMinima}
                                value={item.cantidad}
                                onChange={(e) =>
                                    cambiarCantidadSimple(
                                        item.idPresentacion,
                                        Number(e.target.value)
                                    )
                                }
                                className="
                                    h-[40px]
                                    w-[85px]
                                    border
                                    border-gray-300
                                    rounded-lg
                                    text-center
                                    text-gray-700
                                    font-semibold
                                    focus:outline-none
                                    focus:border-orange-500
                                    focus:ring-2
                                    focus:ring-orange-200
                                "
                            />

                            <Button
                                icon="pi pi-minus"
                                text
                                rounded
                                severity="secondary"
                                size="small"
                                disabled={Number(item.cantidad) <= cantidadMinima}
                                onClick={disminuirSimple}
                            />

                            <Button
                                icon="pi pi-plus"
                                text
                                rounded
                                severity="warning"
                                size="small"
                                onClick={aumentarSimple}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-6 flex items-end justify-between">
                    <div>
                        <p className="text-sm text-gray-600 m-0">
                            Precio: ${item.precio}
                        </p>

                        <p className="text-orange-500 font-bold text-xl m-0 mt-2">
                            Subtotal: ${item.subtotal}
                        </p>
                    </div>

                    <Button
                        icon="pi pi-times"
                        rounded
                        severity="danger"
                        className="!w-12 !h-12 !bg-red-500 !border-red-500 hover:!bg-red-600"
                        onClick={() => eliminarProducto(item.idPresentacion)}
                    />
                </div>
            </div>
        </Card>
    );
}