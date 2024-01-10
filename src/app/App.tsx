import { Route, Routes } from "react-router-dom";
import { MainPage } from "../pages/MainPage";
import { SchedulePage } from "../pages/SchedulePage";
import { Suspense } from "react";
import { Navbar } from "../widgets/Navbar";
import Sidebar from "../widgets/Sidebar/ui/Sidebar";
import { TonerPage } from "../pages/TonerPage";
import Favicon from "react-favicon";
import Fvicon from '../../public/favicon.svg'

const App = () => {
    return (
        <div className="app">
            
            <Favicon url={Fvicon} />
            <Navbar />
            <div className="container">
                <Sidebar />
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path={"/toner"} element={<TonerPage />} />
                        <Route path={"/schedule"} element={<SchedulePage />} />
                        <Route path={"/"} element={<MainPage />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
};

export default App;
