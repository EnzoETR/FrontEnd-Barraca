import BarraNav from "../components/BarraNav";
import Footer from "../components/Footer";

export default function Inicio() {
  return (
    <div className="min-h-screen flex flex-col">
      <BarraNav />

      <main className="flex-grow p-6">
        <h2>Página principal</h2>
      </main>

      <Footer />
    </div>
  );
}