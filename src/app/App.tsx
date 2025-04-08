import { Route, Routes, Navigate } from "react-router-dom";
import { MainPage } from "../pages/MainPage";
import { SchedulePage } from "../pages/SchedulePage";
import { Suspense } from "react";
import { Navbar } from "../widgets/Navbar";
import Sidebar from "../widgets/Sidebar/ui/Sidebar";
import { TonerPage } from "../pages/TonerPage";
import Favicon from "react-favicon";
import Fvicon from '../../public/favicon.svg'
import { ReportPage } from "../pages/ReportPage";
import { CalculatorPageAsync } from "../pages/CalculatorPage/ui/CalculatorPage.async";
import { AuthForm } from "../components/AuthForm";
import { AuthProvider } from "../contexts/AuthContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RoleBasedRoute } from "../components/RoleBasedRoute";
import cls from './App.module.scss';
import { RotationPageAsync } from "../pages/RotationPage/ui/RotationPage.async";
import { AdminPage } from "../pages/AdminPage";

const App = () => {
  return (
    <AuthProvider>
      <div className={cls.app}>
        <Favicon url={Fvicon} />
        <Routes>
          <Route 
            path="/login" 
            element={<AuthForm />} 
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
                        <Route 
                            path="/toner" 
                            element={
                              <RoleBasedRoute allowedRoles={['администратор', 'руководитель', 'печатник']}>
                                <TonerPage />
                              </RoleBasedRoute>
                            } 
                          />
                          <Route 
                            path="/schedule" 
                            element={
                              <RoleBasedRoute allowedRoles={['администратор', 'руководитель', 'печатник']}>
                                <SchedulePage />
                              </RoleBasedRoute>
                            } 
                          />
                          <Route path="/" element={<MainPage />} />
                          <Route 
                            path="/report" 
                            element={
                              <RoleBasedRoute allowedRoles={['администратор', 'руководитель']}>
                                <ReportPage />
                              </RoleBasedRoute>
                            } 
                          />
                          <Route path="/calculator" element={<CalculatorPageAsync />} />
                          <Route path="/rotation" element={<RotationPageAsync />} />
                          <Route 
                            path="/admin" 
                            element={
                              <RoleBasedRoute allowedRoles={['администратор']}>
                                <AdminPage />
                              </RoleBasedRoute>
                            } 
                          />
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
