import cls from "./Part.module.scss";
import EditIcon from "../../assets/icon/editIcon.svg";
import CheckMark from "../../assets/icon/checkMark.svg";
import { useState } from "react";
import { updateStock } from "../../../app/providers/StoreProvider/Store/PartSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";

export type PartProps = {
    name: string;
    number: string;
    qty: number;
    id: string;
};

const Part = (props: PartProps) => {
    const [onEdit, setOnEdit] = useState<boolean>(false);
    const [newQuantity, setNewQuantity] = useState<string | number>("");
    const [clickOutside, setClickOutside] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const { name, number, qty, id } = props;

    const submitFormHandler = (e: React.FormEvent) => {
        e.preventDefault();

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
        <div className={cls.part} onClick={() => setClickOutside(true)}>
            <p className={cls.name}>{name}</p>
            <p className={cls.number}>{number}</p>
            {onEdit ? (
                <form onSubmit={submitFormHandler} className={cls.form}>
                    <input
                        type="number"
                        onChange={(e) => setNewQuantity(e.target.value)}
                        autoFocus
                        className={cls.input}
                    ></input>
                    <button type="submit" className={cls.buttonDone}>
                        <CheckMark />
                    </button>
                </form>
            ) : (
                <p className={qty <= 0 ? cls.qtyRed : cls.qty}>{qty}</p>
            )}
            {onEdit ? (
                ""
            ) : (
                <button className={cls.button} onClick={() => setOnEdit(true)}>
                    <EditIcon></EditIcon>
                </button>
            )}
        </div>
    );
};

export default Part;
