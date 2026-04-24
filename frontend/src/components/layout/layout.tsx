import { Outlet } from "react-router";

const WebLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <header>
                <div>
                    
                </div>
                <div>

                </div>
            </header>

                <main className="flex-1">
                    <Outlet />
                </main>

            <footer>

            </footer>
        </div>
    )
}

export default WebLayout;

