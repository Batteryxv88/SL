import { useState } from "react";
import cls from "./EditReportPart.module.scss";
import { CheckIcon, EditPenIcon } from "shared/assets/icons";

interface EditReportPartProps {
    name: string;
    number: string;
    quantity: number;
    onEdit: boolean;
}

const EditReportPart = ({ name, number, quantity, onEdit }: EditReportPartProps) => {
    const [orderQuantity, setOrderQuantity] = useState(quantity);
    const [isEditing, setIsEditing] = useState(false);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
            return (
                <div className={cls.editReportPart}>
                    <p className={cls.name}>{name}</p>
                    <p className={cls.number}>{number}</p>
                    <p className={cls.quantity}>{quantity}</p>
                    {onEdit ? (
                        <div className={cls.qtyBox}>
                            <input
                                type="number"
                                value={orderQuantity}
                                onChange={(e) => setOrderQuantity(e.target.value)}
                                onKeyPress={handleKeyPress}
                                autoFocus
                                className={cls.input}
                            />
                            <label className={cls.checkbox}>
                                <input type="checkbox" />
                                <span className={cls.checkmark}></span>
                            </label>
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

        export default EditReportPart;