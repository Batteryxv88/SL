import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";
import { Report } from "../../../widgets/Report";
import cls from "./ReportPage.module.scss";

const ReportPage = () => {
    const dispatch = useAppDispatch()

    dispatch(changePage("report"));

    return (
        <div className={cls.ReportPage}>
            <div className={cls.report}>
                <Report />
            </div>
        </div>
    );
};

export default ReportPage;
