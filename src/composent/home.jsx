import ProductPg from "./ProductPg/ProductPg"

import Sidebar from "./NavBar/Navbar"
function Home(){
    return(
            <div className="h-screen">

                <Sidebar />

                    <div className="ml-20">


                        <ProductPg />

                    </div>
            
            </div>
    )

}
export default Home