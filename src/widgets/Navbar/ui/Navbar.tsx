import { Link } from "react-router-dom";
import cls from "./Navbar.module.scss";
import Button from "../../../shared/ui/Button/Button";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";
import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";

type NavbarProps = {
    children: React.ReactNode; // 👈️ type children
};

const Navbar = () => {

const dispatch = useAppDispatch()

    return (
        <div className={cls.navbar}>
            <Link className={cls.button} to={"/"}><Button name={'ГЛАВНАЯ'}  /></Link>
            <Link className={cls.button} to={"/schedule"}><Button name={'ЗАМЕНА ДЕТАЛЕЙ'}  /></Link>
            <Link className={cls.button} to={"/toner"}> <Button name={'ЗАМЕНА ТОНЕРА'}  /> </Link >
        </div>
    );
};

export default Navbar;
