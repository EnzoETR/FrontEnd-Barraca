
import { useState } from "react";

export default function FormRegistro() {
  const [contrasena, setContrasena] = useState("");
  const [repetirContrasena, setRepetirContrasena] = useState("");

  const inputStyles = "w-full p-2.5 rounded-lg bg-white border-2 border-orange-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none shadow-sm";
  const labelStyles = "text-gray-900 font-bold mb-1 mt-2 text-left";

  function enviarFormulario(e) {
    e.preventDefault();
    if (contrasena !== repetirContrasena) {
      alert("Las contraseñas no coinciden");
      return;
    }
    alert("Formulario enviado");
  }

  return (
    <form className="bg-transparent w-full max-w-sm mx-auto flex flex-col">

      <label className={labelStyles} htmlFor="nombre">Nombre</label>
      <input className={inputStyles} required id="nombre" type="text" placeholder="Nicolas"/>

      <label className={labelStyles} htmlFor="telefono">Teléfono</label>
      <input className={inputStyles} required id="telefono" type="tel" placeholder="091000000"/>

      <label className={labelStyles} htmlFor="rut">RUT (Opcional)</label>
      <input className={inputStyles} id="rut" type="text" placeholder="XXXXXXXXX"/>

      <label className={labelStyles} htmlFor="contrasena">Contraseña</label>
      <input className={inputStyles} required id="contrasena" placeholder="********" type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)}/>

      <label className={labelStyles}>Repetir Contraseña</label>
      <input className={inputStyles} placeholder="********" required id="contrasenaR" type="password" value={repetirContrasena} onChange={(e) => setRepetirContrasena(e.target.value)}/>

      <button className="mt-6 bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition-all shadow-lg active:scale-95" type="submit">
        Registrarse
      </button>
    </form>
  );
}