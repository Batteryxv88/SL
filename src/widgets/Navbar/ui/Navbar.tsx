import { Link } from "react-router-dom";
import cls from "./Navbar.module.scss";
import Button from "../../../shared/ui/Button/Button";

type NavbarProps = {
    children: React.ReactNode; // 👈️ type children
};

const Navbar = () => {
    return (
        <div className={cls.navbar}>
            <Link to={"/"}><Button name={'ГЛАВНАЯ'} /></Link>
            <Link to={"/schedule"}><Button name={'КАЛЕНДАРЬ'} /></Link>
        </div>
    );
};

export default Navbar;
