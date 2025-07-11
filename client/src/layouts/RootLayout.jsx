import { Outlet } from "react-router";
import {Navbar} from '@/components'
import {Footer} from '@/components/'

const RootLayout = () => {
    return(
        <>
            <header >
                <Navbar />
            </header>
            <main className="bg-dynamic-main text-[var(--text-color)]">
                <Outlet />
            </main>

            <div className="bg-dynamic-footer text-[var(--text-color)]">
                <Footer />
            </div>
        </>
    )
}

export default RootLayout