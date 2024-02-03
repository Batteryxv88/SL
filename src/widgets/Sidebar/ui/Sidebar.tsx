import { useDispatch } from "react-redux";
import cls from "./Sidebar.module.scss";
import { changeFilter } from "../../../app/providers/StoreProvider/Store/FilterPartSlice";
import { useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import { SidebarReplacePart } from "../../SidebarReplacePart";

const Sidebar = () => {

    const pageState: any = useAppSelector((state) => state.pages.page);
    

    return (
        <div className={cls.sidebar}>
            {pageState === 'schedule'? <SidebarReplacePart /> : ''}
        </div>
    );
};

export default Sidebar;
