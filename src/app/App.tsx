import { Route, Routes, Navigate } from "react-router-dom";
import { MainPage } from "../pages/MainPage";
import { SchedulePage } from "../pages/SchedulePage";
import { Suspense, useState } from "react";
import { Navbar } from "../widgets/Navbar";
import Sidebar from "../widgets/Sidebar/ui/Sidebar";
import { TonerPage } from "../pages/TonerPage";
import Favicon from "react-favicon";
import Fvicon from '../../public/favicon.svg'
import { ReportPage } from "../pages/ReportPage";
import { LaminatePageAsync } from "../pages/LaminatePage/ui/LaminatePage.async";
import { AuthForm } from "../components/AuthForm";
import { AuthProvider } from "../contexts/AuthContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import cls from './App.module.scss';
import { RotationPageAsync } from "../pages/RotationPage/ui/RotationPage.async";
const App = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <AuthProvider>
      <div className={cls.app}>
        <Favicon url={Fvicon} />
        <Routes>
          <Route 
            path="/login" 
            element={
              <AuthForm 
                mode={authMode} 
                onModeChange={setAuthMode} 
              />
            } 
          />
          <Route 
            path="/*"
            element={
              <ProtectedRoute>
                <div className={cls.container}>
                  <Navbar />
                  <div className={cls.content}>
                    <Sidebar />
                    <div className={cls.pages}>
                      <Suspense fallback={<div className={cls.loading}>Loading...</div>}>
                        <Routes>
                          <Route path="/toner" element={<TonerPage />} />
                          <Route path="/schedule" element={<SchedulePage />} />
                          <Route path="/" element={<MainPage />} />
                          <Route path="/report" element={<ReportPage />} />
                          <Route path="/laminate" element={<LaminatePageAsync />} />
                          <Route path="/rotation" element={<RotationPageAsync />} />
                        </Routes>
                      </Suspense>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
