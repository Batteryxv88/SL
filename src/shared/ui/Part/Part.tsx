import cls from "./Part.module.scss";
import CheckIcon from "../../assets/icons/check-circle.svg";
import EditPenIcon from "../../assets/icons/edit-pen.svg";
import { useState, useEffect, useRef, useCallback } from "react";
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
    const [newQuantity, setNewQuantity] = useState<string>("");
    const partRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const dispatch = useAppDispatch();
    const { name, number, qty, id } = props;

    // Обработчик клика вне блока - оптимизированный
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            
            // Проверяем, что клик НЕ по инпуту и НЕ по области редактирования
            const isInput = target.tagName === 'INPUT';
            const isQtyBox = target.closest(`.${cls.qtyBox}`);
            
            if (!isInput && !isQtyBox) {
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
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            
            timerRef.current = setTimeout(() => {
                setOnEdit(false);
                setNewQuantity("");
            }, 15000); // 15 секунд
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [onEdit]);

    const handleEditClick = useCallback(() => {
        setOnEdit(true);
        setNewQuantity(qty.toString()); // Показываем текущее количество
    }, [qty]);

    const handleSave = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        if (newQuantity !== "") {
            const qtyNum = parseInt(newQuantity);
            
            if (!isNaN(qtyNum) && qtyNum >= 0) {
                const updatedPart = {
                    id: id,
                    part: {
                        quantity: newQuantity,
                    },
                };

                dispatch(updateStock(updatedPart));
                setNewQuantity("");
                setOnEdit(false);
            }
        }
    }, [newQuantity, id, dispatch]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    }, [handleSave]);

    return (
        <div className={classNames(cls.part, { [cls.zeroQuantity]: qty <= 0 })} ref={partRef}>
            <p className={cls.name}>{name}</p>
            <p className={cls.number}>{number}</p>
            {onEdit ? (
                <div className={cls.qtyBox}>
                    <input
                        type="number"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e.target.value)}
                        onKeyPress={handleKeyPress}
                        autoFocus
                        className={cls.input}
                    />
                    <button 
                        type="button" 
                        className={cls.buttonDone}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSave();
                        }}
                    >
                        <CheckIcon className={cls.checkIcon} />
                    </button>
                </div>
            ) : (
                <div className={cls.qtyBox}>
                    <p className={cls.qty}>{qty}</p>
                    <EditPenIcon 
                        className={cls.editIcon} 
                        onClick={handleEditClick}
                    />
                </div>
            )}
        </div>
    );
};

export default Part;
