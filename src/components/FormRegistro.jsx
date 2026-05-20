import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { rutaPorRol } from "../services/authStorage";

export default function FormRegistro() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rut, setRut] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const inputStyles =
    "w-full p-2.5 rounded-lg bg-white border-2 border-orange-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none shadow-sm";
  const labelStyles = "text-gray-900 font-bold mb-1 mt-2 text-left";

  async function enviarFormulario(e) {
    e.preventDefault();
    setError("");

    if (contrasena !== repetirContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setCargando(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/usuario/registrarUsuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          telefono,
          password: contrasena,
          rut: rut || null,
          rol: "CLIENTE",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.mensaje || "No se pudo registrar el usuario");
      }

      const datos = await login(telefono, contrasena);
      navigate(rutaPorRol(datos.roles), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form
      className="bg-transparent w-full max-w-sm mx-auto flex flex-col"
      onSubmit={enviarFormulario}
    >
      {error && (
        <p className="text-red-700 bg-red-100 border border-red-300 rounded-lg p-3 text-sm mb-2">
          {error}
        </p>
      )}

      <label className={labelStyles} htmlFor="nombre">
        Nombre
      </label>
      <input
        className={inputStyles}
        required
        id="nombre"
        type="text"
        placeholder="Nicolas"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <label className={labelStyles} htmlFor="telefono">
        Teléfono
      </label>
      <input
        className={inputStyles}
        required
        id="telefono"
        type="tel"
        placeholder="091000000"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <label className={labelStyles} htmlFor="rut">
        RUT (Opcional)
      </label>
      <input
        className={inputStyles}
        id="rut"
        type="text"
        placeholder="XXXXXXXXX"
        value={rut}
        onChange={(e) => setRut(e.target.value)}
      />

      <label className={labelStyles} htmlFor="contrasena">
        Contraseña
      </label>
      <input
        className={inputStyles}
        required
        id="contrasena"
        placeholder="********"
        type="password"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
      />

      <label className={labelStyles}>Repetir Contraseña</label>
      <input
        className={inputStyles}
        placeholder="********"
        required
        id="contrasenaR"
        type="password"
        value={repetirContrasena}
        onChange={(e) => setRepetirContrasena(e.target.value)}
      />

      <button
        className="mt-6 bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-60"
        type="submit"
        disabled={cargando}
      >
        {cargando ? "Registrando..." : "Registrarse"}
      </button>
    </form>
  );
}
