import BarraNav from "../components/BarraNav";
import Footer from "../components/Footer";
import { FaWhatsapp } from "react-icons/fa";

export default function Contacto() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="md:col-span-2">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3545.800226907805!2d-57.63842229999999!3d-32.69140369999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95af7fae0e8c544d%3A0x5ea8ce7602a007c1!2sLe%C3%B1eria%20Young!5e1!3m2!1ses!2suy!4v1782234759585!5m2!1ses!2suy"
              width="100%"
              height="190%"
              style={{ border: 0 }}
              loading="lazy"
              className="rounded-xl shadow-lg"
            ></iframe>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4">
              Barraca Leña
            </h3>

            <div className="space-y-4">
              <p><strong>📍 Dirección:</strong><br /> Cam. de Tropas, 65100 Young, Departamento de Río Negro</p>
              <p><strong>📞 Teléfono:</strong> <br />099 993 157   /  099 567 603</p>
              <p>
                <strong>🕒 Horario:</strong><br />
                Todos los días: 08:00 - 18:00<br />
              </p>
              <p>
                <strong>📌 Referencia:</strong><br />
                Al norte pegado a planta de silos Copagran.
              </p>
            </div>
            <a
              href="https://wa.me/59899993157?text=Hola,%20quiero%20consultar%20por%20leña"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              <FaWhatsapp size={24} />
              Contactar por WhatsApp
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}