import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import AddPart from "../../../features/ui/AddPart/AddPart";
import Stock from "../../../widgets/Stock/ui/Stock";
import TonersStorage from "../../../widgets/TonersStorage/ui/TonersStorage";
import PaperStockPage from "../../PaperStockPage/ui/PaperStockPage";
import LaminationStockPage from "../../LaminationStockPage/ui/LaminationStockPage";
import HoldersAndKnifesStockPage from "../../HoldersAndKnifesStockPage/ui/HoldersAndKnifesStockPage";
import cls from "./MainPage.module.scss";
import MainPageButtonsBar from "../../../widgets/MainPageButtonsBar/ui/MainPageButtonsBar";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect } from 'react';
import { changeStorage } from "../../../app/providers/StoreProvider/Store/ChangeMachineSlice";


const MainPage = () => {
    const dispatch = useAppDispatch();
    const storageState = useAppSelector((state) => state.machines.storage);
    

    const { user, userData, loading } = useAuth();
    

    useEffect(() => {
        if (!loading && userData) {
            if (userData.role === 'дизайнер') {
                dispatch(changeStorage('Бумага'));
            } else if (userData.role === 'резчик') {
                dispatch(changeStorage('Держатели / Лезвия'));
            } else if (userData.role === 'менеджер') {
                dispatch(changeStorage('Бумага'));
            }
        }
    }, [loading, userData, dispatch]);

    dispatch(changePage("main"));


    return (
        <div className={cls.MainPage}>
            {/* {storageState === "Детали" ? <AddPart /> : ''} */}
            {storageState === "Детали" ? <><MainPageButtonsBar /><Stock /></> :
                storageState === "Тонеры" ? <TonersStorage /> :
                    storageState === "Бумага" ? <PaperStockPage /> :
                        storageState === "Ламинация" ? <LaminationStockPage /> :
                            storageState === "Держатели / Лезвия" ? <HoldersAndKnifesStockPage /> :
                                null}
        </div>
    );
};

export default MainPage;
