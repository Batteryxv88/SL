import { useState, useCallback, useRef, useEffect } from "react";
import cls from "./EditReportPart.module.scss";
import CheckIcon from "../../assets/icons/check-icon.svg";
import EditPenIcon from "../../assets/icons/edit-pen.svg";
import { useQuantityToOrder } from "../../../shared/lib/hooks/useQuantityToOrder";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../../services/firebase";

interface EditReportPartProps {
    name: string;
    number: string;
    qtyStock: number;
    qtyOrder: number;
    use: boolean;
    id: string;
    orderDataId: string | null;
}

const EditReportPart = (props: EditReportPartProps) => {
    const { name, number, qtyStock, qtyOrder, use, id, orderDataId } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [newQuantity, setNewQuantity] = useState("");
    const [newUse, setNewUse] = useState(use);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
    const componentRef = useRef<HTMLDivElement | null>(null);
    const { updateQtyAndUse, updateQuantity, updateUse } = useQuantityToOrder();

    // Функция для сброса таймера автозакрытия
    const resetAutoCloseTimer = useCallback(() => {
        if (autoCloseTimerRef.current) {
            clearTimeout(autoCloseTimerRef.current);
        }
        
        if (isEditing) {
            autoCloseTimerRef.current = setTimeout(() => {
                setIsEditing(false);
                setNewQuantity("");
                setNewUse(use);
            }, 8000); // 8 секунд
        }
    }, [isEditing, use]);

    useEffect(() => {
        // Сброс состояния при изменении props
        setNewQuantity("");
        setNewUse(use);
    }, [qtyOrder, use, number]);

    useEffect(() => {
        // Запуск таймера при входе в режим редактирования
        if (isEditing) {
            resetAutoCloseTimer();
        } else {
            // Очистка таймера при выходе из режима редактирования
            if (autoCloseTimerRef.current) {
                clearTimeout(autoCloseTimerRef.current);
                autoCloseTimerRef.current = null;
            }
        }

        // Очистка таймера при размонтировании компонента
        return () => {
            if (autoCloseTimerRef.current) {
                clearTimeout(autoCloseTimerRef.current);
            }
        };
    }, [isEditing, resetAutoCloseTimer]);

    // Обработчик клика вне компонента
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isEditing && componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setIsEditing(false);
                setNewQuantity("");
                setNewUse(use);
            }
        };

        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing, use]);

    const handleEditClick = useCallback(() => {
        setIsEditing(true);
        setNewQuantity(qtyOrder.toString());
        setNewUse(use);
    }, [qtyOrder, use]);

    const createNewOrderRecord = async (qty: number, useFlag: boolean) => {
        try {
            const newOrderData = {
                PartN: number,
                PartName: name,
                qty: qty,
                use: useFlag
            };

            await addDoc(collection(db, 'quantityToOrder'), newOrderData);
        } catch (error) {
            console.error('Error creating order record:', error);
        }
    };

    const handleSave = useCallback(async () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        const qtyNum = newQuantity === "" ? 0 : parseInt(newQuantity);

        if (isNaN(qtyNum) || qtyNum < 0) {
            setNewQuantity(qtyOrder.toString());
            setIsEditing(false);
            return;
        }

        try {
            if (orderDataId) {
                // Обновляем существующую запись
                await updateQtyAndUse(orderDataId, qtyNum, newUse);
            } else {
                // Создаем новую запись, если ее еще нет
                await createNewOrderRecord(qtyNum, newUse);
            }

            setNewQuantity("");
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving order data:', error);
            alert('Ошибка при сохранении данных: ' + error);
        }
    }, [newQuantity, newUse, orderDataId, updateQtyAndUse, qtyOrder, number, name]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
        resetAutoCloseTimer(); // Сброс таймера при нажатии клавиш
    }, [handleSave, resetAutoCloseTimer]);

    const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUse(e.target.checked);
        resetAutoCloseTimer(); // Сброс таймера при изменении чекбокса
    }, [resetAutoCloseTimer]);

    return (
        <div className={cls.editReportPart} ref={componentRef}>
            <p className={cls.name}>{name}</p>
            <p className={cls.number}>{number}</p>
            <p className={cls.quantity}>{qtyStock}</p>

            {isEditing ? (
                <div className={cls.qtyBox}>
                    <input
                        type="number"
                        value={newQuantity}
                        onChange={(e) => {
                            setNewQuantity(e.target.value);
                            resetAutoCloseTimer(); // Сброс таймера при изменении количества
                        }}
                        onKeyPress={handleKeyPress}
                        autoFocus
                        className={cls.input}
                        min="0"
                    />
                    <div className={cls.checkboxBox}>
                        <label className={cls.checkbox}>
                            <input
                                type="checkbox"
                                checked={newUse}
                                onChange={handleCheckboxChange}
                            />
                            <span className={cls.checkmark}></span>
                        </label>
                    </div>
                    <div className={cls.buttonBox}>
                        <button
                            type="button"
                            className={cls.buttonDone}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                resetAutoCloseTimer(); // Сброс таймера при клике на кнопку
                                handleSave();
                            }}
                        >
                            <CheckIcon className={cls.checkIcon} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className={cls.qtyBox}>
                    <p className={cls.qty}>{qtyOrder}</p>
                    <div className={cls.checkboxBox}>
                        <label className={cls.checkbox}>
                            <input
                                type="checkbox"
                                checked={use}
                                readOnly
                            />
                            <span className={cls.checkmark}></span>
                        </label>
                    </div>
                    <div className={cls.buttonBox}>
                        <EditPenIcon
                            className={cls.editIcon}
                            onClick={handleEditClick}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditReportPart;