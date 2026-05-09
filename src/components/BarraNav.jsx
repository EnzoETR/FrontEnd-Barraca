import logo from "../assets/logoBarracaInicio.png";


export default function BarraNav() {
  return (
    <nav className="bg-[#e5701e] text-white p-4 flex justify-between items-center" >
        <img   className="w-20 h-20 object-contain" src={logo} alt="Logo" />
      <ul className="flex gap-6 text-black">
          <li><a href="/">Inicio</a></li>
          <li>Catalogo</li>
          <li>Hacer Pedido</li>
          <li>Contacto</li>
          <li>Iniciar Sesion</li>
      </ul>
    </nav>
  );
}