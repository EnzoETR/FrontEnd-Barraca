import logo from "../assets/logoBarracaInicio.png";
import { Link } from "react-router-dom";

export default function BarraNav() {
  return (
    <nav className="bg-[#e5701e] text-white p-4 flex justify-between items-center">

         <div className="flex items-center gap-10">

           <img
             className="w-20 h-20 object-contain"
             src={logo}
             alt="Logo"
           />

           <ul className="flex gap-6 text-black">
             <li><Link to="/">Inicio</Link></li>
             <li><Link to="/catalogo">Catalogo</Link></li>
             <li><Link to="/pedido">Hacer Pedido</Link></li>
             <li><Link to="/contacto">Contacto</Link></li>
           </ul>

         </div>

         <ul className="text-black">
           <li>
             <Link to="/micuenta">Mi cuenta</Link>
           </li>
         </ul>

       </nav>
  );
}