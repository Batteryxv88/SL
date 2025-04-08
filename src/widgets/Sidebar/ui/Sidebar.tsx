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
import SidebarRotation from "../../SidebarRotation/ui/SidebarRotation";

const Sidebar = () => {
    const pageState = useAppSelector((state) => state.pages.page);
    const dispatch = useAppDispatch();
    const machineState = useAppSelector((state) => state.machines.storage);

    console.log(machineState);
    console.log(pageState);

    const dispatchStorage = () => dispatch(changeStorage("Детали"));
    const dispatchToners = () => dispatch(changeStorage("Тонеры"));
    const dispatchPaper = () => dispatch(changeStorage("Бумага"));
    const dispatchLaminationStock = () => dispatch(changeStorage("ламинация"));
    const dispatchHolders = () => dispatch(changeStorage("Держатели / Лезвия"));

    return (
        <div className={cls.sidebar}>
            {pageState === "rotation" ? (
                <SidebarRotation />
            ) : pageState === "calculator" ? (
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
                    dispatch3={dispatchPaper}
                    dispatch4={dispatchLaminationStock}
                    dispatch5={dispatchHolders}
                    name1="Детали"
                    name2="Тонеры"
                    name3="Бумага"
                    name4="ламинация"
                    name5="Держатели / Лезвия"
                    selector={machineState}
                />
            ) : (
                ""
            )}
        </div>
    );
};

export default Sidebar;
