import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";
import cls from "./AdminPage.module.scss";
import { AdminMainComponent } from "../../../pages/AdminMainComponent";
import { useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import ReportEditor from "../../../widgets/ReportEditor/ui/ReportEditor";

const AdminPage = () => {

    const dispatch = useAppDispatch();
    dispatch(changePage("admin"));
    const adminComponent = useAppSelector((state) => state.adminComponent.adminComponent);
    console.log(adminComponent);
    return (
        <div className={cls.adminPage}>
            {adminComponent === "Главная" && <AdminMainComponent />}
            {adminComponent === "Радактор отчета" && <ReportEditor />}
        </div>
    );
};

export default AdminPage;
