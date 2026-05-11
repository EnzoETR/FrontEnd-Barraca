import FormRegistro from "../components/FormRegistro";

export default function Registro() {
  return (
    <div
      className="flex-1 w-full max-w-md min-h-0 min-w-0 h-full
                 bg-gradient-to-br from-white via-orange-50/50 to-orange-100/35
                 p-8 rounded-xl border border-orange-100/50
                 shadow-[0_2px_10px_rgba(0,0,0,0.07)]
                 flex flex-col items-center justify-start"
    >

      <h3 className="text-gray-900 text-3xl font-black mb-6 tracking-tight">
        Registrarse
      </h3>

      <div className="w-full">
        <FormRegistro />
      </div>
    </div>
  );
}