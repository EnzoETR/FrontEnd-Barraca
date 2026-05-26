import BarraNav from "../components/BarraNav";
import Footer from "../components/Footer";
import ImagenFuego from "../assets/leniafuego.png"
import FichaPresentacion from "../components/fichaPresentacion.jsx";
import {useState} from "react";
import {apiFetch} from "../services/apiClient.js";
import {useEffect} from "react";

export default function Inicio() {

     const [presentacion, setPresentacion] = useState([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
        obtenerPresentaciones()


     }, []);
    const obtenerPresentaciones = async () => {

            try {

                const response = await apiFetch("/api/v1/presentacion/listarPresentacionUltimas4Nuevas");

                const data = await response.json();

                console.log(data);

                setPresentacion(data);

            } catch (error) {

                console.error("Error al obtener presentaciones:", error);

            } finally {

                setLoading(false);
            }
        };

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

        <div className="mt-16 max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">Productos destacados</h3>
          <div className="flex flex-wrap gap-10 justify-center mt-10">
                        {presentacion.map((presentacion) => (

                            <FichaPresentacion
                                key={presentacion.id}
                                presentacion={presentacion}
                            />

                        ))}
                    </div>
        </div>
      </main>
    </div>
  );
}