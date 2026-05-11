export default function FormLogin() {
  return (
    <form className="bg-transparent w-full max-w-sm mx-auto">
      <div className="flex flex-col gap-4">

        <div className="flex flex-col text-left">
          <label className="text-gray-900 font-bold mb-1" htmlFor="telefono">
            Teléfono
          </label>
          <input
            className="p-3 rounded-lg bg-white border-2 border-orange-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:outline-none shadow-sm"
            id="telefono"
            type="text"
            placeholder="091000000"
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
          />
        </div>

        <button
          className="mt-4 bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition-colors shadow-lg active:scale-95"
          type="submit"
        >
          Iniciar Sesión
        </button>

      </div>
    </form>
  );
}