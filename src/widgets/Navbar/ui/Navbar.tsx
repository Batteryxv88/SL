import { Link } from "react-router-dom";
import cls from "./Navbar.module.scss";
import Button from "../../../shared/ui/Button/Button";

type NavbarProps = {
    children: React.ReactNode; // 👈️ type children
};

const Navbar = () => {
    return (
        <div className={cls.navbar}>
            <Link className={cls.button} to={"/"}><Button name={'ГЛАВНАЯ'} /></Link>
            <Link className={cls.button} to={"/schedule"}><Button name={'ЗАМЕНА ДЕТАЛЕЙ'} /></Link>
            <Link className={cls.button} to={"/toner"}> <Button name={'ЗАМЕНА ТОНЕРА'} /> </Link >
        </div>
    );
};

export default Navbar;
