import cls from "./ReplacedPart.module.scss";
import { useSelector } from "react-redux";
import { lifePercent } from "../../lib/calculatePercentOfLife";

export type replacedPartProps = {
    name: string;
    number: string;
    qty: number;
    date: any;
    man: string;
    life?: number;
};

const ReplacedPart = (props: replacedPartProps) => {
    const { name, number, qty, date, man, life } = props;

    const dat = new Date(date);
    const month = dat.toLocaleString("ru-RU", { month: "numeric" });
    const day = dat.toLocaleString("ru-RU", { day: "2-digit" });
    const year = dat.getFullYear();

    const partsData: any = useSelector<any>((state) => state.parts.partsArray);

    const percent = lifePercent(number, partsData, life);

    return (
        <div className={cls.replacedPart}>
            <p className={cls.name}>{name}</p>
            <p className={cls.number}>{number}</p>
            <p className={cls.man}>{man}</p>
            <p className={cls.qty}>{qty}</p>
            <p className={percent < 100 ? cls.percentRed : cls.percentGreen}>
                {percent + "%"}
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
