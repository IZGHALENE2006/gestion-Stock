import Sidebar from "./NavBar/Navbar"
import { Outlet } from "react-router"

function Home(){
    return(
        <div className="h-screen">
            <Sidebar />

            {/* ml-0: No margin on phone
               md:ml-20: Restore margin for desktop
               pt-20: Added padding top for mobile so content starts below the menu button
               md:pt-0: Remove that padding on desktop
            */}
            <div className="ml-0 md:ml-20 md:pt-0">
                <Outlet />
            </div>
        </div>
    )
}

export default Home