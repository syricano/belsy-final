import { Outlet } from "react-router";
import {Navbar} from '@/components'
import {Footer} from '@/components/'

const RootLayout = () => {
    return(
        <>
            <header>
                <Navbar />
            </header>
            <main>
                <Outlet />
            </main>
            <Footer className="footer-section"/>
        </>
    )
}

export default RootLayout