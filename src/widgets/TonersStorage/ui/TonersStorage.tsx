import { useEffect } from "react";
import cls from "./TonersStorage.module.scss";
import { fetchTonersStorage } from "../../../app/providers/StoreProvider/Store/TonersStorageSlice";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../app/providers/StoreProvider/Store/hooks";
import TonerStockItem from "../../../shared/ui/tonerStockItem/TonerStockItem";

const TonersStorage = () => {
    const tonersArr = useAppSelector(
        (state) => state.tonersStorage.tonersStorageArr
    );
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchTonersStorage());
    }, []);

    return (
        <div className={cls.tonerStorage}>
                <h2 className={cls.title}>Склад тонеров</h2>
            <div className={cls.tonersGrid}>
                {tonersArr.length > 0
                    ? tonersArr.map((item) => (
                          <TonerStockItem 
                              key={item.id}
                              color={item.toner.color} 
                              qty={item.toner.qty} 
                              id={item.id}
                          />
                      ))
                    : "Loading..."}
            </div>
        </div>
    );
};

export default TonersStorage;
