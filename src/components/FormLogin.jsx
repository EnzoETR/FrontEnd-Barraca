import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { rutaPorRol } from "../services/authStorage";

export default function FormLogin() {
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function enviarFormulario(e) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      const datos = await login(telefono, password);
      navigate(rutaPorRol(datos.roles), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form
      className="bg-transparent w-full max-w-sm mx-auto"
      onSubmit={enviarFormulario}
    >
      <div className="flex flex-col gap-4">
        {error && (
          <p className="text-red-700 bg-red-100 border border-red-300 rounded-lg p-3 text-sm">
            {error}
          </p>
        )}

        <div className="flex flex-col text-left">
          <label className="text-gray-900 font-bold mb-1" htmlFor="telefono">
            Teléfono
          </label>
          <input
            className="p-3 rounded-lg bg-white border-2 border-orange-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none shadow-sm"
            id="telefono"
            type="text"
            placeholder="091000000"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col text-left">
          <label className="text-gray-900 font-bold mb-1" htmlFor="contrasena">
            Contraseña
          </label>
          <input
            className="p-3 rounded-lg bg-white border-2 border-orange-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none shadow-sm"
            id="contrasena"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="mt-4 bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition-colors shadow-lg active:scale-95 disabled:opacity-60"
          type="submit"
          disabled={cargando}
        >
          {cargando ? "Ingresando..." : "Iniciar Sesión"}
        </button>
      </div>
    </form>
  );
}
