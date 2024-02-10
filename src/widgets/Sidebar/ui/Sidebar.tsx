import { useDispatch } from "react-redux";
import cls from "./Sidebar.module.scss";
import { changeFilter } from "../../../app/providers/StoreProvider/Store/FilterPartSlice";
import { useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import { SidebarReplacePart } from "../../SidebarReplacePart";
import { SidebarReplaceToner } from "../../SidebarReplaceToner";
import GenerateAReport from "../../../features/ui/GenerateAReport/GenerateAReport";

const Sidebar = () => {
    const pageState: any = useAppSelector((state) => state.pages.page);

    return (
        <div className={cls.sidebar}>
            {pageState === "schedule" ? (
                <SidebarReplacePart />
            ) : pageState === "toner" ? (
                <SidebarReplaceToner />
            ) : pageState === "report" ? (
                <GenerateAReport />
            ) : (
                ""
            )}
        </div>
    );
};

export default Sidebar;
