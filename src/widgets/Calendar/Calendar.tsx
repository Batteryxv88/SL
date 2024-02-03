import cls from "./Calendar.module.scss";
import { useEffect } from "react";
import { UsedPartsArray, fetchUsedParts } from "../../app/providers/StoreProvider/Store/ReplacedPartSlice";
import { fetchParts } from "../../app/providers/StoreProvider/Store/PartSlice";
import ReplacedPart from "../../shared/ui/replacedPart/ReplacedPart";
import { filteredAndSortedData } from "./lib/filteredAndSortedData";
import { useAppDispatch, useAppSelector } from "../../app/providers/StoreProvider/Store/hooks";
import { filterByMachine } from "./lib/filterByMachine";

const Calendar = () => {
    const data = useAppSelector(
        (state) => state.replacedParts.usedPartsArray
    );
    const filterOption = useAppSelector(
        (state) => state.filteredParts.filter.section
    );

    const machineState = useAppSelector((state) => state.machines.machine);

    const filteredDataByMachine = filterByMachine(data, machineState)

    const filterAndSortData = filteredAndSortedData(filteredDataByMachine, filterOption)

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchParts());
        dispatch(fetchUsedParts());
    }, [dispatch]);

    return (
        <div className={cls.calendar}>
            <h2 className={cls.h2}>{machineState}</h2>
            <div className={cls.box}>
                <p className={cls.name}>Наименование</p>
                <p className={cls.number}>Парт номер</p>
                <p className={cls.man}>Ответственный</p>
                <p className={cls.qty}>Кол-во</p>
                <p className={cls.res}>Ресурс</p>
                <p className={cls.date}>Дата</p>
            </div>
            {filterAndSortData.map((item: UsedPartsArray) => (
                <ReplacedPart
                    name={item.part.partName}
                    number={item.part.partN}
                    qty={item.part.quantity}
                    man={item.part.man}
                    date={item.part.date}
                    life={item.part.serviceLife}
                    key={item.id}
                />
            ))}
        </div>
    );
};

export default Calendar;
