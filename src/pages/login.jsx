import BarraNav from "../components/BarraNav";
import Footer from "../components/Footer";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <BarraNav />

      <main className="flex-grow p-6">
        <h2>Inicio de Sesion</h2>
      </main>

      <Footer />
    </div>
  );
}