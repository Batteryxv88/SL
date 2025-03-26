import cls from "./Sidebar.module.scss";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../app/providers/StoreProvider/Store/hooks";
import { SidebarReplacePart } from "../../SidebarReplacePart";
import { SidebarReplaceToner } from "../../SidebarReplaceToner";
import GenerateAReport from "../../../features/ui/GenerateAReport/GenerateAReport";
import { ChangeButton } from "../../ChangeButton";
import { changeTonerMachine } from "../../../app/providers/StoreProvider/Store/ChangeMachineSlice";
import { changeStorage } from "../../../app/providers/StoreProvider/Store/ChangeMachineSlice";
import { SidebarLamination } from "../../SidebarLamination";

const Sidebar = () => {
    const pageState = useAppSelector((state) => state.pages.page);
    const dispatch = useAppDispatch();
    const machineState = useAppSelector((state) => state.machines.storage);

    const dispatchStorage = () => dispatch(changeStorage("Детали"));
    const dispatchToners = () => dispatch(changeStorage("Тонеры"));

    return (
        <div className={cls.sidebar}>
            {pageState === "laminate" ? (
                <SidebarLamination />
            ) : pageState === "schedule" ? (
                <SidebarReplacePart />
            ) : pageState === "toner" ? (
                <SidebarReplaceToner />
            ) : pageState === "report" ? (
                <GenerateAReport />
            ) : pageState === "main" ? (
                <ChangeButton
                    dispatch1={dispatchStorage}
                    dispatch2={dispatchToners}
                    name1="Детали"
                    name2="Тонеры"
                    selector={machineState}
                />
            ) : (
                ""
            )}
        </div>
    );
};

export default Sidebar;
