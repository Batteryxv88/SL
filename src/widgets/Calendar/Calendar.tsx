import cls from "./Calendar.module.scss";
import ReplacedPart from "../../shared/ui/replacedPart/ReplacedPart";
import { filteredAndSortedData } from "./lib/filteredAndSortedData";
import { useAppSelector } from "../../app/providers/StoreProvider/Store/hooks";
import { filterByMachine } from "./lib/filterByMachine";
import { useParts, useUsedParts } from "../../app/providers/StoreProvider/Store/hooks";
import { UsedPartData } from "../../services/usedParts";

const Calendar = () => {
    const { usedPartsArray } = useUsedParts();
    const filterOption = useAppSelector(
        (state) => state.filteredParts.filter.section
    );
    const machineState = useAppSelector((state) => state.machines.machine);

    const filteredDataByMachine = filterByMachine(usedPartsArray, machineState);
    const filterAndSortData = filteredAndSortedData(filteredDataByMachine, filterOption);

    return (
        <div className={cls.calendar}>
            <h2 className={cls.h2}>{machineState === "C71cf" ? "Konica_Minolta_C71cf" : "Konica_Minolta_label_190"}</h2>
            <div className={cls.box}>
                <p className={cls.name}>Наименование</p>
                <p className={cls.number}>Парт номер</p>
                <p className={cls.man}>Ответственный</p>
                <p className={cls.qty}>Кол-во</p>
                <p className={cls.res}>Ресурс</p>
                <p className={cls.date}>Дата</p>
                <p className={cls.delete}>Удалить</p>
            </div>
            {filterAndSortData.map((item: UsedPartData) => (
                <ReplacedPart
                    id={item.id}
                    name={item.part.partName}
                    number={item.part.partN}
                    qty={item.part.quantity}
                    man={item.part.man}
                    date={item.part.date}
                    life={item.part.serviceLife}
                    percent={item.part.percent}
                    key={item.id}
                />
            ))}
        </div>
    );
};

export default Calendar;
