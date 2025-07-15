import { Outlet } from "react-router";
import {Navbar} from '@/components'
import {Footer} from '@/components/'
import { Toaster } from "react-hot-toast";

const RootLayout = () => {
    return(
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <header >
                <Navbar />
            </header>
            <main className="bg-dynamic-main text-[var(--text-color)]">
                <Outlet />
            </main>

            <Footer />
        </>
    )
}

export default RootLayout