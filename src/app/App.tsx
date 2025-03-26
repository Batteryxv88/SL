import { Route, Routes } from "react-router-dom";
import { MainPage } from "../pages/MainPage";
import { SchedulePage } from "../pages/SchedulePage";
import { Suspense } from "react";
import { Navbar } from "../widgets/Navbar";
import Sidebar from "../widgets/Sidebar/ui/Sidebar";
import { TonerPage } from "../pages/TonerPage";
import Favicon from "react-favicon";
import Fvicon from '../../public/favicon.svg'
import { ReportPage } from "../pages/ReportPage";
import { LaminatePageAsync } from "../pages/LaminatePage/ui/LaminatePage.async";
import cls from './App.module.scss';

const App = () => {
    return (
        <div className={cls.app}>
            <Favicon url={Fvicon} />
            <Navbar />
            <div className={cls.container}>
                <Sidebar />
                <div className={cls.pages}>
                <Suspense fallback={<div className={cls.loading}>Loading...</div>}>
                    <Routes>
                        <Route path={"/toner"} element={<TonerPage />} />
                        <Route path={"/schedule"} element={<SchedulePage />} />
                        <Route path={"/"} element={<MainPage />} />
                        <Route path={"/report"} element={<ReportPage />} />
                        <Route path={"/laminate"} element={<LaminatePageAsync />} />
                    </Routes>
                </Suspense>
                </div>
                
            </div>
        </div>
    );
};

export default App;
