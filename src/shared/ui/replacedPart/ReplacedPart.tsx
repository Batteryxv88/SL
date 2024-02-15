import cls from "./ReplacedPart.module.scss";

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

    return (
        <div className={cls.replacedPart}>
            <p className={cls.name}>{name}</p>
            <p className={cls.number}>{number}</p>
            <p className={cls.man}>{man}</p>
            <p className={cls.qty}>{qty}</p>
            <p
                className={
                    percent < 100
                        ? cls.percentRed
                        : !percent
                        ? cls.percentRed
                        : cls.percentGreen
                }
            >
                {percent ? percent + "%" : "0 %"}
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
