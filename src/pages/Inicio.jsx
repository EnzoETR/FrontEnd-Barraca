import ImagenFuego from "../assets/leniafuego.png";
import FichaPresentacion from "../components/fichaPresentacion.jsx";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/apiClient.js";
import { Paginator } from "primereact/paginator";

export default function Inicio() {
    const [presentacion, setPresentacion] = useState([]);
    const [producto, setProducto] = useState([]);
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(3);

    useEffect(() => {
        obtenerPresentaciones();
        obtenerImagenes();
        obtenenerProductos()
    }, []);

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

    const obtenerPresentaciones = async () => {
        try {
            const response = await apiFetch(
                "/api/v1/presentacion/listarPresentacionUltimas4Nuevas"
            );

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
            const response = await apiFetch(
                "/api/v1/imagenProducto/listarImagenes"
            );

            const data = await response.json();

            setImagenes(data);
        } catch (error) {
            console.error("Error al obtener imágenes:", error);
        }
    };

    const obtenerImagenPresentacion = (idPresentacion) => {
        return imagenes.find(
            (imagen) =>
                Number(imagen.idPresentacion) === Number(idPresentacion)
        );
    };

    const obtenerNombreProductoPresentacion = (presentacion) => {
        const prod = producto.find(
            p => Number(p.id) === Number(presentacion.idProducto)
        );

        return prod ? prod.nombre : "Producto no encontrado";
    };


    const presentacionesPaginadas = presentacion.slice(first, first + rows);

    if (loading) {
        return <div className="p-10 text-xl">Cargando catálogo...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow p-6">
                <div className="relative mt-10 h-64 overflow-hidden rounded-3xl">
                    <img
                        src={ImagenFuego}
                        alt=""
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/30"></div>

                    <div className="absolute bottom-6 left-6 text-white">
                        <h2 className="text-3xl font-bold mb-2">
                            Leña de calidad para cada momento
                        </h2>

                        <p className="mb-4">
                            Para estufa, parrilla o calefacción. Entrega rápida en Young.
                        </p>

                        <a
                            href="/pedido"
                            className="inline-block bg-orange-500 px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 transition"
                        >
                            Hacer Pedido
                        </a>
                    </div>
                </div>

                <div className="mt-16 max-w-7xl mx-auto text-center">
                    <h3 className="text-2xl font-bold mb-6">
                        Productos destacados
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
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
                            totalRecords={presentacion.length}
                            rowsPerPageOptions={[3]}
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