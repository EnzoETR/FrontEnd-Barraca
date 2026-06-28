import { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { apiFetch } from "../services/apiClient";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

import "./Admin.css";

const SUGERENCIAS_DESCRIPCION = ["Tarrina", "Bolsa", "Camion", "Camioneta"];

function AdminPresentaciones() {
    const toast = useRef(null);
    const [presentaciones, setPresentaciones] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState("");

    const [dialogVisible, setDialogVisible] = useState(false);
    const [presentacionEditando, setPresentacionEditando] = useState(null);

    const [nuevaPresentacion, setNuevaPresentacion] = useState({
        descripcion: "",
        cantidad: null,
        unidadMedida: "",
        precio: null,
        idProducto: ""
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);

        try {
            const timestamp = new Date().getTime();

            const [resPresentaciones, resProductos] = await Promise.all([
                apiFetch(`/api/v1/presentacion/listarPresentacion?t=${timestamp}`),
                apiFetch(`/api/v1/producto/listarProducto?t=${timestamp}`)
            ]);

            const dataPresentaciones = await resPresentaciones.json();
            const dataProductos = await resProductos.json();

            console.log("Presentaciones recargadas:", dataPresentaciones);

            setPresentaciones(dataPresentaciones);
            setProductos(dataProductos);
        } catch (error) {
            console.error("Error al cargar datos:", error);
        } finally {
            setLoading(false);
        }
    };

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

    const obtenerIdProducto = (presentacion) => {
        return (
            presentacion.idProducto ??
            presentacion.productoId ??
            presentacion.id_producto ??
            presentacion.producto?.id ??
            ""
        );
    };

    const crearPresentacion = async () => {
        try {
            const response = await apiFetch("/api/v1/presentacion/crearPresentacion", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevaPresentacion)
            });

            if (!response.ok) {
                throw new Error("Error al crear presentación");
            }

            toast.current.show({
                severity: "success",
                summary: "Presentación creada",
                detail: "La presentación se creó correctamente.",
                life: 3000
            });

            setNuevaPresentacion({
                descripcion: "",
                cantidad: null,
                unidadMedida: "",
                precio: null,
                idProducto: ""
            });

           await cargarDatos();
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "No se pudo crear la presentación.",
                life: 3000
            });
        }
    };

    const actualizarPresentacion = async () => {
        try {
            console.log("Enviando al backend:", presentacionEditando);

            const response = await apiFetch(
                `/api/v1/presentacion/actualizarPresentacion/${presentacionEditando.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(presentacionEditando)
                }
            );

            const data = await response.json();

            console.log("Respuesta del backend:", data);

            if (!response.ok) {
                throw new Error("Error al actualizar presentación");
            }

            setPresentaciones((prev) =>
                prev.map((presentacion) =>
                    presentacion.id === data.id ? data : presentacion
                )
            );

            toast.current.show({
                severity: "success",
                summary: "Presentación actualizada",
                detail: "Los cambios se guardaron correctamente.",
                life: 3000
            });
            setDialogVisible(false);
            setPresentacionEditando(null);

        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.message,
                life: 3000
            });
        }
    };

    const eliminarPresentacion = (idPresentacion) => {
        confirmDialog({
            header: "Eliminar presentación",
            message: "¿Está seguro de que desea eliminar esta presentación?",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Eliminar",
                rejectLabel: "Cancelar",

                acceptClassName: "p-button-danger",
                rejectClassName: "p-button-secondary p-button-outlined",

            accept: async () => {
                try {
                    const response = await apiFetch(
                        `/api/v1/presentacion/eliminarPresentacion/${idPresentacion}`,
                        { method: "DELETE" }
                    );

                    if (!response.ok) {
                        throw new Error("Error al eliminar presentación");
                    }

                    toast.current.show({
                        severity: "success",
                        summary: "Presentación eliminada",
                        detail: "La presentación se eliminó correctamente.",
                        life: 3000
                    });

                    await cargarDatos();

                } catch (error) {
                    console.error(error);

                    toast.current.show({
                        severity: "error",
                        summary: "Error",
                        detail: "No se pudo eliminar la presentación.",
                        life: 3000
                    });
                }
            }
        });
    };

    const productoTemplate = (presentacion) => {
        const producto = productos.find(
            (producto) => Number(producto.id) === Number(presentacion.idProducto)
        );

        return producto ? producto.nombre : "Sin producto";
    };

    const precioTemplate = (presentacion) => {
        return `$${presentacion.precio}`;
    };

    const accionesTemplate = (presentacion) => {
        return (
            <div className="acciones-producto">
                <Button
                    label="Editar"
                    size="small"
                    className="btn-editar-tabla"
                    onClick={() => {
                        setPresentacionEditando({
                            ...presentacion,
                            idProducto: obtenerIdProducto(presentacion)
                        });

                        setDialogVisible(true);
                    }}
                />

                <Button
                    label="Eliminar"
                    size="small"
                    className="btn-eliminar-tabla"
                    onClick={() => eliminarPresentacion(presentacion.id)}
                />
            </div>
        );
    };

    return (
        <>
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">
                    Panel de Presentaciones
                </h1>

                <div className="bg-white shadow px-4 py-2 rounded-lg">
                    Total presentaciones: {presentaciones.length}
                </div>
            </div>

            <div className="bg-white shadow-lg p-6 mb-8 border rounded-lg">
                <h2 className="text-2xl font-bold mb-4">
                    Agregar presentación
                </h2>

                <datalist id="sugerencias-descripcion-presentacion">
                    {SUGERENCIAS_DESCRIPCION.map((opcion) => (
                        <option key={opcion} value={opcion} />
                    ))}
                </datalist>

                <div className="grid md:grid-cols-6 gap-4">
                    <InputText
                        className="input-crear-producto"
                        list="sugerencias-descripcion-presentacion"
                        placeholder="Descripción"
                        value={nuevaPresentacion.descripcion}
                        onChange={(e) =>
                            setNuevaPresentacion({
                                ...nuevaPresentacion,
                                descripcion: e.target.value
                            })
                        }
                    />

                    <InputNumber
                        className="input-crear-producto"
                        placeholder="Cantidad"
                        value={nuevaPresentacion.cantidad}
                        onValueChange={(e) =>
                            setNuevaPresentacion({
                                ...nuevaPresentacion,
                                cantidad: e.value
                            })
                        }
                    />

                    <InputText
                        className="input-crear-producto"
                        placeholder="Unidad"
                        value={nuevaPresentacion.unidadMedida}
                        onChange={(e) =>
                            setNuevaPresentacion({
                                ...nuevaPresentacion,
                                unidadMedida: e.target.value
                            })
                        }
                    />

                    <InputNumber
                        className="input-crear-producto"
                        placeholder="Precio"
                        value={nuevaPresentacion.precio}
                        onValueChange={(e) =>
                            setNuevaPresentacion({
                                ...nuevaPresentacion,
                                precio: e.value
                            })
                        }
                    />

                    <Dropdown
                        className="input-crear-producto"
                        value={nuevaPresentacion.idProducto}
                        options={productos}
                        optionLabel="nombre"
                        optionValue="id"
                        placeholder="Producto"
                        onChange={(e) =>
                            setNuevaPresentacion({
                                ...nuevaPresentacion,
                                idProducto: e.value
                            })
                        }
                    />

                    <Button
                        label="Crear"
                        icon="pi pi-plus"
                        className="btn-crear-producto"
                        onClick={crearPresentacion}
                    />
                </div>
            </div>

            <div className="bg-white shadow-xl p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Lista de presentaciones
                    </h2>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Buscar:</label>

                        <InputText
                            className="p-inputtext-sm w-64"
                            placeholder="Buscar presentación..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                </div>

                <DataTable
                    value={presentaciones}
                    loading={loading}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    globalFilter={globalFilter}
                    emptyMessage="No hay presentaciones registradas"
                    stripedRows
                    showGridlines
                    className="p-datatable-sm tabla-productos"
                    tableStyle={{ minWidth: "60rem" }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                >

                    <Column field="descripcion" header="Descripción" sortable />
                    <Column field="cantidad" header="Cantidad" sortable />
                    <Column field="unidadMedida" header="Unidad" sortable />
                    <Column field="precio" header="Precio" body={precioTemplate} sortable />
                    <Column header="Producto" body={productoTemplate} sortable />
                    <Column
                        header="Acciones"
                        body={accionesTemplate}
                        style={{ width: "230px" }}
                    />
                </DataTable>
            </div>

            <Dialog
                header="Editar presentación"
                visible={dialogVisible}
                modal
                className="dialog-producto"
                style={{ width: "720px" }}
                onHide={() => setDialogVisible(false)}
                footer={
                    <div className="footer-dialog-producto">
                        <Button
                            label="Cancelar"
                            icon="pi pi-times"
                            className="btn-cancelar-dialog"
                            onClick={() => setDialogVisible(false)}
                        />

                        <Button
                            label="Guardar cambios"
                            icon="pi pi-save"
                            className="btn-guardar-dialog"
                            onClick={actualizarPresentacion}
                        />
                    </div>
                }
            >
                {presentacionEditando && (
                    <div className="form-editar-producto">
                        <div className="campo-editar">
                            <label>Descripción</label>
                            <InputText
                                className="input-editar"
                                value={presentacionEditando.descripcion}
                                onChange={(e) =>
                                    setPresentacionEditando({
                                        ...presentacionEditando,
                                        descripcion: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="campo-editar">
                            <label>Cantidad</label>
                            <InputNumber
                                className="input-editar"
                                value={Number(presentacionEditando.cantidad)}
                                onValueChange={(e) =>
                                    setPresentacionEditando({
                                        ...presentacionEditando,
                                        cantidad: e.value
                                    })
                                }
                            />
                        </div>

                        <div className="campo-editar">
                            <label>Unidad</label>
                            <InputText
                                className="input-editar"
                                value={presentacionEditando.unidadMedida}
                                onChange={(e) =>
                                    setPresentacionEditando({
                                        ...presentacionEditando,
                                        unidadMedida: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="campo-editar">
                            <label>Precio</label>
                            <InputNumber
                                className="input-editar"
                                value={Number(presentacionEditando.precio)}
                                onValueChange={(e) =>
                                    setPresentacionEditando({
                                        ...presentacionEditando,
                                        precio: e.value
                                    })
                                }
                            />
                        </div>

                        <div className="campo-editar">
                            <label>Producto</label>
                            <Dropdown
                                className="dropdown-editar"
                                value={presentacionEditando.idProducto}
                                options={productos}
                                optionLabel="nombre"
                                optionValue="id"
                                placeholder="Seleccionar producto"
                                onChange={(e) =>
                                    setPresentacionEditando({
                                        ...presentacionEditando,
                                        idProducto: e.value
                                    })
                                }
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
        </>
    );
}

export default AdminPresentaciones;