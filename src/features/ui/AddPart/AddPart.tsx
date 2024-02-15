import { useState } from "react";
import cls from "./AddPart.module.scss";
import { addPartToFirestore } from "../../../app/providers/StoreProvider/Store/PartSlice";
import { useAppDispatch } from "../../../app/providers/StoreProvider/Store/hooks";

const AddPart = () => {
    const dispatch = useAppDispatch();

    const [partN, setPartN] = useState<string>("");
    const [partName, setPartName] = useState<string>("");
    const [quantity, setQuantity] = useState<number | string>("");
    const [partLife, setPartLife] = useState<number | string>(null);
    const [section, setSection] = useState<string>();

    const handleAddPart = (e: React.FormEvent) => {
        e.preventDefault();
        const part = {
            partN,
            partName,
            quantity,
            partLife,
            section,
        };

        dispatch(addPartToFirestore(part));

        setPartN("");
        setPartName("");
        setQuantity("");
        setPartLife("");
        setSection("");
    };

    return (
        <form className={cls.form} onSubmit={handleAddPart}>
            <div className={cls.box}>
                <label className={cls.label}>Артикул</label>
                <input
                    className={cls.input}
                    onChange={(e) => setPartN(e.target.value)}
                    value={partN}
                ></input>
            </div>
            <div className={cls.box}>
                <label className={cls.label}>Наименование</label>
                <input
                    className={cls.input}
                    onChange={(e) => setPartName(e.target.value)}
                    value={partName}
                ></input>
            </div>
            <div className={cls.box}>
                <label className={cls.label}>Срок службы</label>
                <input
                    className={cls.input}
                    onChange={(e) => setPartLife(e.target.value)}
                    value={partLife}
                    type="number"
                ></input>
            </div>
            <div className={cls.box}>
                <label className={cls.label}>Секция</label>
                <input
                    className={cls.input}
                    onChange={(e) => setSection(e.target.value)}
                    value={section}
                ></input>
            </div>

            <div className={cls.box}>
                <label className={cls.label}>Кол-во</label>
                <input
                    className={cls.inputQty}
                    type="number"
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    value={quantity}
                ></input>
            </div>

            <button className={cls.button} type="submit">
                Добавить
            </button>
        </form>
    );
};

export default AddPart;
