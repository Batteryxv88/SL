import cls from "./Part.module.scss";
import CheckIcon from "../../assets/icons/check-circle.svg";
import EditPenIcon from "../../assets/icons/edit-pen.svg";
import { useState, useEffect, useRef } from "react";
import { updateStock } from "../../../app/providers/StoreProvider/Store/PartSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";
import classNames from "classnames";

export type PartProps = {
    name: string;
    number: string;
    qty: number;
    id: string;
};

const Part = (props: PartProps) => {
    const [onEdit, setOnEdit] = useState<boolean>(false);
    const [newQuantity, setNewQuantity] = useState<string | number>("");
    const partRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const dispatch = useAppDispatch();
    const { name, number, qty, id } = props;

    // Обработчик клика вне блока
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (partRef.current && !partRef.current.contains(event.target as Node)) {
                setOnEdit(false);
                setNewQuantity("");
            }
        };

        if (onEdit) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onEdit]);

    // Таймер для автоматического закрытия
    useEffect(() => {
        if (onEdit) {
            // Очищаем предыдущий таймер если он есть
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            
            // Устанавливаем новый таймер
            timerRef.current = setTimeout(() => {
                setOnEdit(false);
                setNewQuantity("");
            }, 15000); // 15 секунд
        }

        return () => {
            // Очищаем таймер при размонтировании или изменении onEdit
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [onEdit]);

    const submitFormHandler = (e: React.FormEvent) => {
        e.preventDefault();

        // Очищаем таймер при подтверждении формы
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        const updatedPart = {
            id: id,
            part: {
                quantity: newQuantity,
            },
        };

        dispatch(updateStock(updatedPart));
        setNewQuantity("");
        setOnEdit(false);
    };

    return (
        <div className={classNames(cls.part, { [cls.zeroQuantity]: qty <= 0 })} ref={partRef}>
            <p className={cls.name}>{name}</p>
            <p className={cls.number}>{number}</p>
            {onEdit ? (
                <form onSubmit={submitFormHandler} className={cls.qtyBox}>
                    <input
                        type="number"
                        onChange={(e) => setNewQuantity(e.target.value)}
                        autoFocus
                        className={cls.input}
                    />
                    <button type="submit" className={cls.buttonDone}>
                        <CheckIcon className={cls.checkIcon} />
                    </button>
                </form>
            ) : (
                <div className={cls.qtyBox}>
                    <p className={cls.qty}>{qty}</p>
                    <EditPenIcon 
                        className={cls.editIcon} 
                        onClick={() => setOnEdit(true)}
                    />
                </div>
            )}
        </div>
    );
};

export default Part;
