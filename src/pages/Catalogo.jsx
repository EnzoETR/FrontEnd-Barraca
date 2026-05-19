
import FichaPresentacion from "../components/fichaPresentacion.jsx";
import {useState} from "react";
import {apiFetch} from "../services/apiClient.js";
import {useEffect} from "react";



export default function Catalogo() {

    const [presentacion, setPresentacion] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerPresentaciones()


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
              {presentacion.map((presentacion) => (

                  <FichaPresentacion
                      key={presentacion.id}
                      presentacion={presentacion}
                  />

              ))}
          </div>

      </main>
    </div>
  );
}