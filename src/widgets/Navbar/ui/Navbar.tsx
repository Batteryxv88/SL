import { Link } from "react-router-dom";
import cls from "./Navbar.module.scss";
import Button from "../../../shared/ui/Button/Button";

const Navbar = () => {

    return (
        <div className={cls.navbar}>
            <Link className={cls.button} to={"/"}><Button name={'СКЛАД'}  /></Link>
            <Link className={cls.button} to={"/schedule"}><Button name={'ЗАМЕНА ДЕТАЛЕЙ'}  /></Link>
            <Link className={cls.button} to={"/toner"}> <Button name={'ЗАМЕНА ТОНЕРА'}  /> </Link >
            <Link className={cls.button} to={"/report"}> <Button name={'ОТЧЕТ'}  /> </Link >
        </div>
    );
};

export default Navbar;
