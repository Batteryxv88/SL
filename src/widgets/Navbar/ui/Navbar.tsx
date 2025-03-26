import { Link, useLocation } from "react-router-dom";
import cls from "./Navbar.module.scss";
import Button from "../../../shared/ui/Button/Button";

const Navbar = () => {
    const location = useLocation();

    return (
        <div className={cls.navbar}>
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
                <Button name={'РАСЧЕТ ЛАМИНАЦИИ'} />
            </Link>
        </div>
    );
};

export default Navbar;
