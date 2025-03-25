import { useEffect } from "react";
import cls from "./TonersStorage.module.scss";
import { fetchTonersStorage } from "../../../app/providers/StoreProvider/Store/TonersStorageSlice";
import EditIcon from "../../../shared/assets/icon/editIcon.svg";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../app/providers/StoreProvider/Store/hooks";
import { useState } from "react";
import CheckMark from "../../assets/icon/checkMark.svg";
import TonerStockItem from "../../../shared/ui/tonerStockItem/TonerStockItem";

const TonersStorage = () => {
    const tonersArr = useAppSelector(
        (state) => state.tonersStorage.tonersStorageArr
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTonersStorage());
    }, []);

    

    console.log(tonersArr)

    return (
        <div className={cls.tonerStorage}>
            <div className={cls.titleBox}>
                <h6>ТОНЕРЫ</h6>
            </div>
            {tonersArr.length > 0
                ? tonersArr.map((item) => (
                      <TonerStockItem color={item.toner.color} qty={item.toner.qty} id={item.id}/>
                  ))
                : "Loading..."}
        </div>
    );
};

export default TonersStorage;
