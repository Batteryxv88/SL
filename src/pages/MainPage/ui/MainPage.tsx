import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";
import AddPart from "../../../features/ui/AddPart/AddPart";
import Stock from "../../../widgets/Stock/ui/Stock";
import cls from "./MainPage.module.scss";

const MainPage = () => {
    const dispatch = useAppDispatch();

    dispatch(changePage("main"));

    return (
        <div className={cls.MainPage}>
            <AddPart />
            <Stock />
        </div>
    );
};

export default MainPage;
