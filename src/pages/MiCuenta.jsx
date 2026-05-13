import Login from "./Login";
import Registro from "./Registro";

export default function MiCuenta() {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-[radial-gradient(circle,_#ffffff_0%,_#ffedd5_100%)] items-center md:items-stretch justify-center gap-12 md:gap-10 py-10 px-4 sm:px-6 md:px-10">
        <Login />
        <div
          className="hidden md:block w-px shrink-0 bg-black self-stretch my-16"
          aria-hidden="true"
        />
        <Registro />
    </div>
  );
}
