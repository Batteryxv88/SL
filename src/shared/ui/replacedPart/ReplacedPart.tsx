import cls from "./ReplacedPart.module.scss";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";
import { deleteUsedPart } from "../../../app/providers/StoreProvider/Store/ReplacedPartSlice";
import DeleteIcon from "../../../shared/assets/icons/delete.svg";

export type replacedPartProps = {
    id: string;
    name: string;
    number: string;
    qty: number;
    man: string;
    date: any;
    life: number;
    percent: number;
};

const ReplacedPart = (props: replacedPartProps) => {
    const { id, name, number, qty, date, man, life, percent } = props;
    const dispatch = useAppDispatch();

    const newDate = new Date(date);
    const month = newDate.toLocaleString("ru-RU", { month: "numeric" });
    const day = newDate.toLocaleString("ru-RU", { day: "2-digit" });
    const year = newDate.getFullYear();

    const handleDelete = () => {
        dispatch(deleteUsedPart(id));
    };

    return (
        <div className={cls.replacedPart}>
            <p className={cls.name}>{name}</p>
            <p className={cls.number}>{number}</p>
            <p className={cls.man}>{man}</p>
            <p className={cls.qty}>{qty}</p>
            <div className={cls.percent}>
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
            </div>
            <div className={cls.date}>
                <p>{day + "."}</p>
                <p>{month + "."}</p>
                <p>{year}</p>
            </div>
            <div className={cls.deleteBox}>
            <button 
                className={`${cls.button} ${cls.buttonDelete}`}
                onClick={handleDelete}
            >
                <DeleteIcon />
            </button>
            </div>
            
        </div>
    );
};

export default ReplacedPart;
