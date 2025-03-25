import cls from './TonerStockItem.module.scss';
import EditIcon from "../../../shared/assets/icon/editIcon.svg";
import CheckMark from "../../assets/icon/checkMark.svg";
import { useState } from 'react';
import { useAppDispatch } from '../../../app/providers/StoreProvider/Store/hooks';
import { updateToner } from '../../../app/providers/StoreProvider/Store/TonersStorageSlice';


type TonerStockItemTypes = {
    color: string;
    qty: string;
    id: string;
}

const TonerStockItem = ({color, qty, id}: TonerStockItemTypes) => {

    const [onEdit, setOnEdit] = useState<boolean>(false);
    const [newQuantity, setNewQuantity] = useState<string | number>("");
    const dispatch = useAppDispatch();

    const submitFormHandler = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedTonerQty = {
            id: id,
            toner: {
                qty: newQuantity,
            },
        };

        dispatch(updateToner(updatedTonerQty));
        setNewQuantity("");
        setOnEdit(false);
    };

    return (
        <div className={cls.tonerBox}>
            <div className={cls.cBox}>
                <p className={cls.title}>{color}</p>
                <div
                    className={
                        color === "C"
                            ? cls.c
                            : color === "M"
                            ? cls.m
                            : color === "Y"
                            ? cls.y
                            : color === "K"
                            ? cls.k
                            : ""
                    }
                ></div>
            </div>
            {onEdit ? (
                <form onSubmit={submitFormHandler} className={cls.form}>
                    <input
                        type="number"
                        onChange={(e) => setNewQuantity(e.target.value)}
                        autoFocus
                        className={cls.input}
                        placeholder={qty}
                    ></input>
                    <button type="submit" className={cls.buttonDone}>
                        <CheckMark className={cls.checkMark} />
                    </button>
                </form>
            ) : (
                <p className={cls.qty}>{qty}</p>
            )}
            {onEdit ? (
                ""
            ) : (
                <button className={cls.button} onClick={() => setOnEdit(true)}>
                    <EditIcon className={cls.editIcon}></EditIcon>
                </button>
            )}
        </div>
    );
};

export default TonerStockItem;
