import AddPart from "../../../features/ui/AddPart/AddPart";
import Stock from "../../../widgets/Stock/ui/Stock";
import cls from "./MainPage.module.scss";

const MainPage = () => {
    return (
        <div className={cls.MainPage}>
            <AddPart />
            <Stock/>
        </div>
    );
};

export default MainPage;
