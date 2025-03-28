import cls from "./Part.module.scss";
import CheckIcon from "../../assets/icons/check-circle.svg";
import EditPenIcon from "../../assets/icons/edit-pen.svg";
import { useState } from "react";
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
        <div className={classNames(cls.part, { [cls.zeroQuantity]: qty <= 0 })} onClick={() => setClickOutside(true)}>
            <p className={cls.name}>{name}</p>
            <p className={cls.number}>{number}</p>
            {onEdit ? (
                <form onSubmit={submitFormHandler} className={cls.qtyBox}>
                    <input
                        type="number"
                        onChange={(e) => setNewQuantity(e.target.value)}
                        autoFocus
                        className={cls.input}
                    ></input>
                    <button type="submit" className={cls.buttonDone}>
                        <CheckIcon />
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
