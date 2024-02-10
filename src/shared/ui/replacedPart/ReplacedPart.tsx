import cls from "./ReplacedPart.module.scss";
import { useSelector } from "react-redux";
import { lifePercent } from "../../lib/calculatePercentOfLife";
import { useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";

export type replacedPartProps = {
    name: string;
    number: string;
    qty: number;
    man: string;
    date: any;
    life: number;
    percent: number;
};

const ReplacedPart = (props: replacedPartProps) => {
    const { name, number, qty, date, man, life, percent } = props;

    const newDate = new Date(date);
    const month = newDate.toLocaleString("ru-RU", { month: "numeric" });
    const day = newDate.toLocaleString("ru-RU", { day: "2-digit" });
    const year = newDate.getFullYear();

    const partsData = useAppSelector((state) => state.parts.partsArray);

    //const percent = lifePercent(number, partsData, life);


    return (
        <div className={cls.replacedPart}>
            <p className={cls.name}>{name}</p>
            <p className={cls.number}>{number}</p>
            <p className={cls.man}>{man}</p>
            <p className={cls.qty}>{qty}</p>
            <p className={percent < 100 ? cls.percentRed : !percent ? cls.percentRed :  cls.percentGreen}>
                {percent? percent + "%": '0 %'}
            </p>
            <div className={cls.date}>
                <p>{day + "."}</p>
                <p>{month + "."}</p>
                <p>{year}</p>
            </div>
        </div>
    );
};

export default ReplacedPart;
