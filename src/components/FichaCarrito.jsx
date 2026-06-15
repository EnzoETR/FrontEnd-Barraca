import { Card } from "primereact/card";
import { Button } from "primereact/button";

export default function FichaCarrito({
    item,
    agregarDetalleUso,
    cambiarDetalleUso,
    eliminarDetalleUso,
    eliminarProducto
}) {
    const tiposUso = [
        "estufa",
        "parrilla",
        "calefactor"
    ];



    const header = (
        <img
            src={item.imagenProducto}
            alt={item.descripcion}
            className="w-full h-36 object-cover"
        />
    );

    const footer = (
        <div>
            <div className="flex justify-between items-center mb-3">
                <p className="text-sm m-0">
                    Precio: ${item.precio}
                </p>

                <Button
                    icon="pi pi-times"
                    rounded
                    severity="danger"
                    className="!bg-red-500 !border-red-500 hover:!bg-red-600"
                    onClick={() => eliminarProducto(item.idPresentacion)}
                />
            </div>

            <p className="text-orange-500 font-bold text-lg m-0">
                Subtotal: ${item.subtotal}
            </p>
        </div>
    );

    return (
        <Card
            title={item.descripcion}
            header={header}
            footer={footer}
            className="w-[260px]"
        >
            <div className="mt-2 space-y-3">

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
                            className="w-[135px] border border-gray-300 px-2 py-1 text-sm rounded"
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
                            className="w-[65px] border border-gray-300 px-2 py-1 text-center rounded"
                        />
                        <Button
                            icon="pi pi-minus"
                            rounded
                            outlined
                            severity="danger"
                            size="small"
                            disabled={item.detallesUso.length === 1}
                            onClick={() =>
                                eliminarDetalleUso(
                                    item.idPresentacion,
                                    index
                                )
                            }
                        />
                    </div>
                ))}

                <div className="flex justify-end">
                    <Button
                        icon="pi pi-plus"
                        rounded
                        outlined
                        severity="warning"
                        onClick={() => agregarDetalleUso(item.idPresentacion)}
                    />
                </div>

            </div>
        </Card>
    );
}