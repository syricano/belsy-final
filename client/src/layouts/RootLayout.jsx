import { Outlet } from "react-router";
import {Navbar} from '@/components'
import {Footer} from '@/components/'
import { Toaster } from "react-hot-toast";
import { useModal } from '@/context/ModalContext';
import ReservationModal from '@/components/Reservations/ReservationModal';



const RootLayout = () => {

    const { open, setOpen } = useModal();
    
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
            {open && (
            <ReservationModal
                onClose={() => setOpen(false)}
                onSuccess={(data) => console.log('Reservation created:', data)}
            />
            )}
        </>
    )
}

export default RootLayout