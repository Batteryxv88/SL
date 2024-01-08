import cls from "./TonerPart.module.scss";

export type tonerPartProps = {
    color: string;
    counter: number;
    date: any;
    man: string;
};

const TonerPart = (props: tonerPartProps) => {
    const { color, date, man, counter } = props;

    const newDate = new Date(date);
    const month = newDate.toLocaleString("ru-RU", { month: "numeric" });
    const day = newDate.toLocaleString("ru-RU", { day: "2-digit" });
    const year = newDate.getFullYear();

    return (
        <div className={cls.tonerPart}>
            <div className={cls.colorBox}>
                <p className={cls.colorName}>{color}</p>
                <div
                    className={
                        color === "C"
                            ? cls.colorC
                            : color === "M"
                            ? cls.colorM
                            : color === "Y"
                            ? cls.colorY
                            : color === "K"
                            ? cls.colorK
                            : ""
                    }
                ></div>
            </div>
            <p className={cls.counter}>{counter}</p>
            <p className={cls.man}>{man}</p>
            <div className={cls.dateBox}>
                <p>{day + "."}</p>
                <p>{month + "."}</p>
                <p>{year}</p>
            </div>
        </div>
    );
};

export default TonerPart;
