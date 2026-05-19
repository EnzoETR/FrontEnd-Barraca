import FichaPresentacion from "../components/fichaPresentacion.jsx";

export default function Carrito() {

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow p-6">

                <h1 className="text-3xl font-bold mb-6">
                    Carrito
                </h1>

                {carrito.length === 0 ? (
                    <p>No hay productos en el carrito.</p>
                ) : (
                    <div className="flex flex-wrap gap-10 justify-center mt-10">
                        {carrito.map((item) => (
                            <FichaPresentacion
                                key={item.id}
                                presentacion={item}
                            />
                        ))}
                    </div>
                )}

            </main>
        </div>
    );
}