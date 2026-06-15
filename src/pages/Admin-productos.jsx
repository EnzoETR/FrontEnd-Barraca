import { useEffect, useState } from "react";
import { apiFetch } from "../services/apiClient";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

import "./Admin.css";

function AdminProductos() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [globalFilter, setGlobalFilter] = useState("");

    const [dialogVisible, setDialogVisible] = useState(false);
    const [productoEditando, setProductoEditando] = useState(null);

    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        descripcion: "",
        tipoUso: "",
        activo: true
    });

    useEffect(() => {
        obtenerProductos();
    }, []);

    const obtenerProductos = async () => {
        try {
            const response = await apiFetch("/api/v1/producto/listarProducto");
            const data = await response.json();
            setProductos(data);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        } finally {
            setLoading(false);
        }
    };

    const crearProducto = async () => {
        try {
            const response = await apiFetch("/api/v1/producto/crearProducto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoProducto)
            });

            if (!response.ok) throw new Error("Error al crear producto");

            alert("Producto creado correctamente");

            setNuevoProducto({
                nombre: "",
                descripcion: "",
                tipoUso: "",
                activo: true
            });

            obtenerProductos();
        } catch (error) {
            console.error(error);
            alert("Error al crear producto");
        }
    };

    const actualizarProducto = async () => {
        try {
            const response = await apiFetch(
                `/api/v1/producto/actualizarProducto/${productoEditando.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productoEditando)
                }
            );

            if (!response.ok) throw new Error("Error al actualizar producto");

            alert("Producto actualizado");
            setDialogVisible(false);
            obtenerProductos();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const eliminarProducto = async (idProducto) => {
        const confirmar = confirm("¿Seguro que deseas eliminar este producto?");
        if (!confirmar) return;

        try {
            const response = await apiFetch(
                `/api/v1/producto/eliminarProducto/${idProducto}`,
                { method: "DELETE" }
            );

            if (!response.ok) throw new Error("Error al eliminar producto");

            alert("Producto eliminado");
            obtenerProductos();
        } catch (error) {
            console.error(error);
            alert("Error al eliminar");
        }
    };

    const estadoTemplate = (producto) => {
        return producto.activo ? (
            <Tag value="Activo" severity="success" />
        ) : (
            <Tag value="Inactivo" severity="danger" />
        );
    };

    const accionesTemplate = (producto) => {
        return (
            <div className="acciones-producto">
                <Button
                    label="Editar"
                    size="small"
                    className="btn-editar-tabla"
                    onClick={() => {
                        setProductoEditando({ ...producto });
                        setDialogVisible(true);
                    }}
                />

                <Button
                    label="Eliminar"
                    size="small"
                    className="btn-eliminar-tabla"
                    onClick={() => eliminarProducto(producto.id)}
                />
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">
                    Panel de Productos
                </h1>

                <div className="bg-white shadow px-4 py-2 rounded-lg">
                    Total productos: {productos.length}
                </div>
            </div>

            <div className="bg-white shadow-lg p-6 mb-8 border rounded-lg">
                <h2 className="text-2xl font-bold mb-4">
                    Agregar producto
                </h2>

                <div className="grid md:grid-cols-4 gap-4">
                    <InputText
                        className="input-crear-producto"
                        placeholder="Nombre"
                        value={nuevoProducto.nombre}
                        onChange={(e) =>
                            setNuevoProducto({
                                ...nuevoProducto,
                                nombre: e.target.value
                            })
                        }
                    />

                    <InputText
                        className="input-crear-producto"
                        placeholder="Descripción"
                        value={nuevoProducto.descripcion}
                        onChange={(e) =>
                            setNuevoProducto({
                                ...nuevoProducto,
                                descripcion: e.target.value
                            })
                        }
                    />

                    <InputText
                        className="input-crear-producto"
                        placeholder="Tipo de uso"
                        value={nuevoProducto.tipoUso}
                        onChange={(e) =>
                            setNuevoProducto({
                                ...nuevoProducto,
                                tipoUso: e.target.value
                            })
                        }
                    />

                    <Button
                        label="Crear"
                        icon="pi pi-plus"
                        className="btn-crear-producto"
                        onClick={crearProducto}
                    />
                </div>
            </div>

            <div className="bg-white shadow-xl p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Lista de productos
                    </h2>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700">Buscar:</label>

                        <span className="p-input-icon-right">
                            <InputText
                                className="p-inputtext-sm w-64"
                                placeholder="Buscar producto..."
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                        </span>
                    </div>
                </div>

                <DataTable
                    value={productos}
                    loading={loading}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    globalFilter={globalFilter}
                    emptyMessage="No hay productos registrados"
                    stripedRows
                    showGridlines
                    className="p-datatable-sm tabla-productos"
                    tableStyle={{ minWidth: "60rem" }}
                    paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                >
                    <Column field="id" header="#" sortable style={{ width: "70px" }} />
                    <Column field="nombre" header="Nombre" sortable />
                    <Column field="descripcion" header="Descripción" sortable />
                    <Column field="tipoUso" header="Tipo de uso" sortable />
                    <Column
                        field="activo"
                        header="Estado"
                        body={estadoTemplate}
                        sortable
                        style={{ width: "150px" }}
                    />
                    <Column
                        header="Acciones"
                        body={accionesTemplate}
                        style={{ width: "230px" }}
                    />
                </DataTable>
            </div>

            <Dialog
                header="Editar producto"
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
                            onClick={actualizarProducto}
                        />
                    </div>
                }
            >
                {productoEditando && (
                    <div className="form-editar-producto">
                        <div className="campo-editar">
                            <label>Nombre</label>
                            <InputText
                                className="input-editar"
                                value={productoEditando.nombre}
                                onChange={(e) =>
                                    setProductoEditando({
                                        ...productoEditando,
                                        nombre: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="campo-editar">
                            <label>Descripción</label>
                            <InputText
                                className="input-editar"
                                value={productoEditando.descripcion}
                                onChange={(e) =>
                                    setProductoEditando({
                                        ...productoEditando,
                                        descripcion: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="campo-editar">
                            <label>Tipo de uso</label>
                            <InputText
                                className="input-editar"
                                value={productoEditando.tipoUso}
                                onChange={(e) =>
                                    setProductoEditando({
                                        ...productoEditando,
                                        tipoUso: e.target.value
                                    })
                                }
                            />
                        </div>

                        <div className="campo-editar">
                            <label>Estado</label>
                            <Dropdown
                                className="dropdown-editar"
                                value={productoEditando.activo}
                                options={[
                                    { label: "Activo", value: true },
                                    { label: "Inactivo", value: false }
                                ]}
                                onChange={(e) =>
                                    setProductoEditando({
                                        ...productoEditando,
                                        activo: e.value
                                    })
                                }
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
}

export default AdminProductos;