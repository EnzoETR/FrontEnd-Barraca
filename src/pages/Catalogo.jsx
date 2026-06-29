import FichaPresentacion from "../components/fichaPresentacion.jsx";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/apiClient.js";
import { Paginator } from "primereact/paginator";
import { AutoComplete } from "primereact/autocomplete";

export default function Catalogo() {
    const [presentacion, setPresentacion] = useState([]);
    const [producto, setProducto] = useState([]);
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(8);
    const [selectedItem, setSelectedItem] = useState("");
    const [globalFilter, setGlobalFilter] = useState("");
    const [filtroProducto, setFiltroProducto] = useState("");

    useEffect(() => {
        obtenerPresentaciones();
        obtenerImagenes();
        obtenenerProductos()
    }, []);

    const obtenerPresentaciones = async () => {
        try {
            const response = await apiFetch("/api/v1/presentacion/listarPresentacion");
            const data = await response.json();

            console.log(data);

            setPresentacion(data);
        } catch (error) {
            console.error("Error al obtener presentaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const obtenerImagenes = async () => {
        try {
            const response = await apiFetch("/api/v1/imagenProducto/listarImagenes");
            const data = await response.json();

            setImagenes(data);
        } catch (error) {
            console.error("Error al obtener imágenes:", error);
        }
    };

    const obtenerImagenPresentacion = (idPresentacion) => {
        return imagenes.find(
            (imagen) => Number(imagen.idPresentacion) === Number(idPresentacion)
        );
    };

    const obtenenerProductos = async () => {
        try {
            const response = await  apiFetch(
                "/api/v1/producto/listarProducto"
            );

            const data = await response.json();

            console.log(data);

            setProducto(data);
        }catch(err) {
            console.error("Error al obtener los productos",err);
        }finally {
            setLoading(false);
        }
    };


    const obtenerNombreProductoPresentacion = (presentacion) => {
        const prod = producto.find(
            p => Number(p.id) === Number(presentacion.idProducto)
        );

        return prod ? prod.nombre : "Producto no encontrado";
    };

    const presentacionesFiltradas = presentacion.filter((p) => {
        const textoBusqueda = globalFilter.toLowerCase();

        const nombreProducto = obtenerNombreProductoPresentacion(p).toLowerCase();
        const descripcion = p.descripcion?.toLowerCase() || "";
        const unidadMedida = p.unidadMedida?.toLowerCase() || "";

        const coincideBusqueda =
            descripcion.includes(textoBusqueda) ||
            nombreProducto.includes(textoBusqueda) ||
            unidadMedida.includes(textoBusqueda);

        const coincideProducto =
            !filtroProducto ||
            Number(p.idProducto) === Number(filtroProducto);

        return coincideBusqueda && coincideProducto;
    });


    const productosConPresentacion = producto.filter((prod) =>
        presentacion.some((p) => Number(p.idProducto) === Number(prod.id))
    );

    const presentacionesPaginadas = presentacionesFiltradas.slice(first, first + rows);

    if (loading) {
        return <div className="p-10 text-xl">Cargando catálogo...</div>;
    }

    const descripciones = presentacion.map(
        (p) => p.descripcion
    );



    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow p-6">

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">

                    <select
                        className="border rounded-lg px-4 py-2"
                        value={filtroProducto}
                        onChange={(e) => {
                            setFiltroProducto(e.target.value);
                            setFirst(0);
                        }}
                    >
                        <option value="">Todos los tipos</option>

                        {productosConPresentacion.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                                {prod.nombre}
                            </option>
                        ))}
                    </select>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <input
                            className="border rounded-lg px-4 py-2"
                            type="text"
                            placeholder="Buscar presentación..."
                            value={globalFilter}
                            onChange={(e) => {
                                setGlobalFilter(e.target.value);
                                setFirst(0);
                            }}
                        />
                    </form>

                </div>

                <div className="mt-10 max-w-7xl mx-auto px-6">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">

                        {presentacionesPaginadas.map((p) => {
                            const imagenPresentacion =
                                obtenerImagenPresentacion(p.id);
                            const nombreProducto = obtenerNombreProductoPresentacion(p);

                            return (
                                <FichaPresentacion
                                    key={p.id}
                                    presentacion={p}
                                    imagenProducto={imagenPresentacion}
                                    nombreProducto={nombreProducto}
                                />
                            );
                        })}

                    </div>

                    <div className="mt-8 flex justify-center">
                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={presentacionesFiltradas.length}
                            rowsPerPageOptions={[4, 8, 12, 16]}
                            onPageChange={(e) => {
                                setFirst(e.first);
                                setRows(e.rows);
                            }}
                        />
                    </div>

                </div>

            </main>
        </div>
    );
}