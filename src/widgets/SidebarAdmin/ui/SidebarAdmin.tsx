import { changeAdminComponent } from "../../../app/providers/StoreProvider/Store/ChangeAdminComponent";
import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import ChoiseButton from "../../../shared/ui/ChoiseButton/ChoiseButton";
import cls from "./SidebarAdmin.module.scss";


const SidebarAdmin = () => {
    const dispatch = useAppDispatch();
    const adminComponent = useAppSelector((state) => state.adminComponent.adminComponent);

    return (
        <div className={cls.sidebar}>
            <ChoiseButton name="Главная" onClick={() => dispatch(changeAdminComponent("Главная"))} state={adminComponent} />
            <ChoiseButton name="Радактор отчета" onClick={() => dispatch(changeAdminComponent("Радактор отчета"))} state={adminComponent} />
        </div>
    );
};

export default SidebarAdmin;
