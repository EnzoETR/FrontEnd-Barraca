import { Outlet } from "react-router-dom";

import BarraNav from "../components/BarraNav";
import Footer from "../components/Footer";

function MainLayout() {

    return (
        <>
            <BarraNav />

            <Outlet />

            <Footer />
        </>
    );
}

export default MainLayout;