import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";
import { Report } from "../../../widgets/Report";

const ReportPage = () => {
    const dispatch = useAppDispatch()

    dispatch(changePage("report"));

    return (
        <div>
            <Report />
        </div>
    );
};

export default ReportPage;
