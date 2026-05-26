import FichaPresentacion from "../components/fichaPresentacion.jsx";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/apiClient.js";

export default function Catalogo() {
    const [presentacion, setPresentacion] = useState([]);
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerPresentaciones();
        obtenerImagenes();
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

    if (loading) {
        return <div className="p-10 text-xl">Cargando catálogo...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow p-6">

                <select>
                    <option>Nombre</option>
                    <option>Precio</option>
                </select>

                <input
                    type="text"
                    placeholder="Leña de Barra"
                />

                <div className="flex flex-wrap gap-10 justify-center mt-10">
                    {presentacion.map((presentacion) => {
                        const imagenPresentacion = obtenerImagenPresentacion(
                            presentacion.id
                        );

                        return (
                            <FichaPresentacion
                                key={presentacion.id}
                                presentacion={presentacion}
                                imagenProducto={imagenPresentacion}
                            />
                        );
                    })}
                </div>

            </main>
        </div>
    );
}