import { Outlet } from "react-router";
import Navbar from '../components/UI/Navbar'
import Footer from '../components/UI/Footer'

const RootLayout = () => {
    return(
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default RootLayout