import cls from './TonerStockItem.module.scss';
import EditIcon from "../../../shared/assets/icon/editIcon.svg";
import CheckMark from "../../assets/icon/checkMark.svg";
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from '../../../app/providers/StoreProvider/Store/hooks';
import { updateToner } from '../../../app/providers/StoreProvider/Store/TonersStorageSlice';
import EditPenIcon from "../../../shared/assets/icons/edit-pen.svg";

type TonerStockItemTypes = {
    color: string;
    qty: string;
    id: string;
}

const TonerStockItem = ({color, qty, id}: TonerStockItemTypes) => {
    const [onEdit, setOnEdit] = useState<boolean>(false);
    const [newQuantity, setNewQuantity] = useState<string>("");
    const dispatch = useAppDispatch();
    const tonerBoxRef = useRef<HTMLDivElement>(null);

    // Обработчик клика вне блока - оптимизированный
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            
            // Проверяем, что клик НЕ по инпуту и НЕ по области редактирования
            const isInput = target.tagName === 'INPUT';
            const isForm = target.closest(`.${cls.form}`);
            
            if (!isInput && !isForm) {
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

    const handleEditClick = useCallback(() => {
        setOnEdit(true);
        setNewQuantity(qty); // Показываем текущее количество
    }, [qty]);

    const handleSave = useCallback(() => {
        if (newQuantity !== "") {
            const qtyNum = parseInt(newQuantity);
            
            if (!isNaN(qtyNum) && qtyNum >= 0) {
                const updatedTonerQty = {
                    id: id,
                    toner: {
                        qty: newQuantity,
                    },
                };

                dispatch(updateToner(updatedTonerQty));
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

    const getColorClass = useCallback(() => {
        switch(color) {
            case "C": return cls.c;
            case "M": return cls.m;
            case "Y": return cls.y;
            case "K": return cls.k;
            default: return "";
        }
    }, [color]);

    return (
        <div className={cls.tonerBox} ref={tonerBoxRef}>
            <div className={cls.cBox}>
                <p className={cls.title}>{color}</p>
                <div className={getColorClass()}></div>
            </div>
            {onEdit ? (
                <div className={cls.form}>
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
                        <CheckMark className={cls.checkMark} />
                    </button>
                </div>
            ) : (
                <div className={cls.qtyBox}>
                    <p className={cls.qty}>{qty}</p>
                    <button className={cls.button} onClick={handleEditClick}>
                        <EditPenIcon className={cls.editIcon} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default TonerStockItem;
