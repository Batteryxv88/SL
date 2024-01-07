import cls from "./Calendar.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUsedParts } from "../../app/providers/StoreProvider/Store/ReplacedPartSlice";
import { fetchParts } from "../../app/providers/StoreProvider/Store/PartSlice";
import ReplacedPart from "../../shared/ui/replacedPart/ReplacedPart";
import { sortByDate } from "./lib/sortByDate";
import { StringifyOptions } from "querystring";
import { filteredDataBySection } from "./lib/filterBySection";

const Calendar = () => {
    const data: any = useSelector<any>(
        (state) => state.replacedParts.usedPartsArray
    );
    const filterOption: any = useSelector<any>(
        (state) => state.filteredParts.filter
    );

    const filteredData = filteredDataBySection(data, filterOption);
    const sortedData = sortByDate(filteredData);

    const dispatch = useDispatch<any>();
    useEffect(() => {
        dispatch(fetchParts());
        dispatch(fetchUsedParts());
    }, [dispatch]);



    return (
        <div className={cls.calendar}>
            <div className={cls.box}>
                <p className={cls.name}>Наименование</p>
                <p className={cls.number}>Парт номер</p>
                <p className={cls.man}>Ответственный</p>
                <p className={cls.qty}>Кол-во</p>
                <p className={cls.res}>Ресурс</p>
                <p className={cls.date}>Дата</p>
            </div>
            {sortedData.map((item: any) => (
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
