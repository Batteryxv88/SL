import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import AddPart from "../../../features/ui/AddPart/AddPart";
import Stock from "../../../widgets/Stock/ui/Stock";
import TonersStorage from "../../../widgets/TonersStorage/ui/TonersStorage";
import LaminatePage from "../../LaminatePage/ui/LaminatePage";
import cls from "./MainPage.module.scss";

const MainPage = () => {
    const dispatch = useAppDispatch();
    const storageState = useAppSelector((state) => state.machines.storage);

    dispatch(changePage("main"));

    return (
        <div className={cls.MainPage}>
            {storageState === "Детали" ? <AddPart /> : ''}
            {storageState === "Детали" ? <Stock /> : 
             storageState === "Тонеры" ? <TonersStorage /> :
             storageState === "Ламинация" ? <LaminatePage /> : null}
        </div>
    );
};

export default MainPage;
