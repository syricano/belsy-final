import { Outlet } from "react-router";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const RootLayout = () => {
    return(
        <div>
            <header>
                <Navbar />
            </header>
            <main>

            </main>
            <Footer />
        </div>
    )
}

export default RootLayout