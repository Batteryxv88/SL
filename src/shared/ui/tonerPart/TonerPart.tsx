import cls from "./TonerPart.module.scss";
import DeleteButton from '../../assets/icon/deleteButton1.svg'
import { deleteToner } from "../../../app/providers/StoreProvider/Store/TonerSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";

export type tonerPartProps = {
    color: string;
    counter: string;
    date: any;
    man: string;
    id: string;
};

const TonerPart = (props: tonerPartProps) => {
    const { color, date, man, counter, id } = props;

    const newDate = new Date(date);
    const month = newDate.toLocaleString("ru-RU", { month: "numeric" });
    const day = newDate.toLocaleString("ru-RU", { day: "2-digit" });
    const year = newDate.getFullYear();

    const dispatch = useAppDispatch()

    const handleDelete = (id: string) => {
        dispatch(deleteToner(id))
    }

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
            <button onClick={() => handleDelete(id)} className={cls.buttonDelete}>
                <DeleteButton />
            </button>
        </div>
    );
};

export default TonerPart;
