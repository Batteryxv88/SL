import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import cls from "./Navbar.module.scss";
import Button from "../../../shared/ui/Button/Button";
import { useAuth } from "../../../contexts/AuthContext";
import { logout } from "../../../services/auth";

const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className={cls.navbar}>
            <div className={cls.navLinks}>
                <Link 
                    className={`${cls.button} ${location.pathname === "/" ? cls.active : ""}`} 
                    to={"/"}
                >
                    <Button name={'СКЛАД'} />
                </Link>
                <Link 
                    className={`${cls.button} ${location.pathname === "/schedule" ? cls.active : ""}`} 
                    to={"/schedule"}
                >
                    <Button name={'ЗАМЕНА ДЕТАЛЕЙ'} />
                </Link>
                <Link 
                    className={`${cls.button} ${location.pathname === "/toner" ? cls.active : ""}`} 
                    to={"/toner"}
                >
                    <Button name={'ЗАМЕНА ТОНЕРА'} />
                </Link>
                <Link 
                    className={`${cls.button} ${location.pathname === "/report" ? cls.active : ""}`} 
                    to={"/report"}
                >
                    <Button name={'ОТЧЕТ'} />
                </Link>
                <Link 
                    className={`${cls.button} ${location.pathname === "/laminate" ? cls.active : ""}`} 
                    to={"/laminate"}
                >
                    <Button name={'КАЛЬКУЛЯТОР'} />
                </Link>
                <Link 
                    className={`${cls.button} ${location.pathname === "/rotation" ? cls.active : ""}`} 
                    to={"/rotation"}
                >
                    <Button name={'РОТАЦИЯ'} />
                </Link>
            </div>
            {user && (
                <div className={cls.userInfo}>
                    <div className={cls.userInfoContent}>
                    <span className={cls.name}>{user.displayName}</span>
                    <span className={cls.email}>{user.email}</span>
                    </div>
                    
                    <button onClick={handleLogout} className={cls.logoutButton}>
                        Выйти
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;
