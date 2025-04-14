import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import cls from "./Navbar.module.scss";
import Button from "../../../shared/ui/Button/Button";
import { useAuth } from "../../../contexts/AuthContext";
import { logout } from "../../../services/auth";
import { useAppSelector } from '../../../app/providers/StoreProvider/Store/hooks';
import StorageIcon from '../../../shared/ui/StorageIcon/StorageIcon';
import InventoryReminder from '../../../shared/ui/InventoryReminder/InventoryReminder';
import InventoryModal from '../../../shared/ui/InventoryModal/InventoryModal';
import { useInventoryCheck } from '../../../shared/lib/hooks/useInventoryCheck';

const Navbar: React.FC = () => {
    const pageState = useAppSelector((state) => state.pages.page);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, userData } = useAuth();
    useInventoryCheck();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Проверяем, является ли текущий пользователь администратором
    const isAdmin = userData?.role === 'администратор';
    const isDirector = userData?.role === 'руководитель';
    const isPrinter = userData?.role === 'печатник';

    return (
        <div className={cls.navbar}>
            <div className={cls.navLinks}>
                {/* <StorageIcon /> */}
                <Link
                    className={`${cls.button} ${location.pathname === "/" ? cls.active : ""}`}
                    to={"/"}
                >
                    <Button name={'СКЛАД'} />
                </Link>
                {(isDirector || isAdmin || isPrinter) && (
                <Link
                    className={`${cls.button} ${location.pathname === "/schedule" ? cls.active : ""}`}
                    to={"/schedule"}
                >
                    <Button name={'ЗАМЕНА ДЕТАЛЕЙ'} />
                </Link>
                )}
                {(isDirector || isAdmin || isPrinter) && (<Link
                    className={`${cls.button} ${location.pathname === "/toner" ? cls.active : ""}`}
                    to={"/toner"}
                >
                    <Button name={'ЗАМЕНА ТОНЕРА'} />
                </Link>)}
                {(isDirector || isAdmin) && (
                    <Link
                        className={`${cls.button} ${location.pathname === "/report" ? cls.active : ""}`}
                        to={"/report"}
                    >
                        <Button name={'ОТЧЕТ'} />
                    </Link>
                )}
                <Link
                    className={`${cls.button} ${location.pathname === "/calculator" ? cls.active : ""}`}
                    to={"/calculator"}
                >
                    <Button name={'КАЛЬКУЛЯТОР'} />
                </Link>
                <Link
                    className={`${cls.button} ${location.pathname === "/rotation" ? cls.active : ""}`}
                    to={"/rotation"}
                >
                    <Button name={'РОТАЦИЯ'} />
                </Link>
                {/* Отображаем кнопку админ-панели только для администраторов */}
                {isAdmin && (
                    <Link
                        className={`${cls.button} ${location.pathname === "/admin" ? cls.active : ""}`}
                        to={"/admin"}
                    >
                        <Button name={'АДМИНИСТРИРОВАНИЕ'} />
                    </Link>
                )}
                <InventoryReminder />
            </div>
            <div className={cls.rightSection}>
                {user && (
                    <div className={cls.userInfo}>
                        <div className={cls.userInfoContent}>
                            <span className={cls.name}>{user.displayName}</span>
                            {userData && <span className={cls.role}>{userData.role}</span>}
                        </div>
                        <button onClick={handleLogout} className={cls.logoutButton}>
                            Выйти
                        </button>
                    </div>
                )}
            </div>
            <InventoryModal />
        </div>
    );
};

export default Navbar;
