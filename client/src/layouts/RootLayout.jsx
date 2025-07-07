import { Outlet } from "react-router";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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