import { useDispatch, useSelector } from "react-redux";
import cls from "./AddReplacedPart.module.scss";
import { useState, useEffect } from "react";
import {
    addUsedPart,
    updateUsedPart,
} from "../../../app/providers/StoreProvider/Store/ReplacedPartSlice";
import { fetchParts, updateStock } from "../../../app/providers/StoreProvider/Store/PartSlice";
import { partsFilter } from "../../lib/partsFilter/partsFilter";
import { findIdByPartNAndLatestDate } from "../../lib/findIdByPartNandDate/findByNumberAndDate";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../../app/config/fbConfig";

const AddReplacedPart = () => {
    const stockData: any = useSelector<any>((state) => state.parts.partsArray);
    const replacedPartsdata: any = useSelector<any>(
        (state) => state.replacedParts.usedPartsArray
    );

    const dispatch = useDispatch<any>();

    const [partN, setPartN] = useState<string>("");
    const [serviceLife, setServiceLife] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(0);
    const [date, setDate] = useState<any>("");
    const [man, setMan] = useState<string>("");
    const [partName, setPartName] = useState<string>();

    useEffect(() => {
        fetch("https://worldtimeapi.org/api/timezone/Europe/Moscow" )
            .then((res) => {
                return res.json();
            })
            .then((date) => setDate(date.datetime))
            .catch((err) => {
                console.log("Ошибка. Запрос не выполнен: ", err);
            });
    }, [man, quantity])


    const handleAddPart = (e: React.FormEvent) => {
        e.preventDefault();

        const currentPart = stockData.filter(
            (item: any) => item.part.partN === partN
        );

        

        const newQuantity = currentPart[0].part.quantity - quantity;
        const newName = currentPart[0].part.partName
        const section = partsFilter(partN);
        const newServiceLife = serviceLife;


        const partU = {
            partN: partN,
            quantity: quantity,
            date: date,
            section: section,
            man: man,
            partName: newName
        };

        const part = {
            quantity: newQuantity,
        };

        const updatedStockPart = {
            id: currentPart[0].id,
            part: {
                quantity: newQuantity,
            },
        };

        const idForUpdate = findIdByPartNAndLatestDate(
            replacedPartsdata,
            partN
        );

        const updatedPart = {
            id: idForUpdate,
            part: {
               serviceLife: newServiceLife,
            }  
        };

        dispatch(updateUsedPart(updatedPart));
        dispatch(updateStock(updatedStockPart));
        dispatch(addUsedPart(partU));

        setPartN("");
        setServiceLife("");
        setQuantity(0);
        setPartName("");
        setMan("");
    };

    console.log(replacedPartsdata)

    return (
        <form className={cls.addReplacedPart} onSubmit={handleAddPart}>
            <div className={cls.box}>
                <label className={cls.label}>Парт номер</label>
                <input
                    className={cls.input}
                    onChange={(e) => setPartN(e.target.value.trim())}
                    value={partN}
                ></input>
            </div>
            <div className={cls.box}>
                <label className={cls.label}>Пройденный ресурс</label>
                <input
                    className={cls.input}
                    onChange={(e) => setServiceLife(e.target.value)}
                    value={serviceLife}
                ></input>
            </div>
            <div className={cls.box}>
                <label className={cls.label}>Кол-во</label>
                <input
                    className={cls.inputQty}
                    type="number"
                    onChange={(e: any) => setQuantity(e.target.value)}
                    value={quantity}
                ></input>
            </div>
            <div className={cls.box}>
                <label className={cls.label}>Ответственный</label>
                <select
                    className={cls.input}
                    onChange={(e: any) => setMan(e.target.value)}
                    value={man}
                >
                    <option value={""}></option>
                    <option value={"Алексей"}>Алексей</option>
                    <option value={"Максим"}>Максим</option>
                    <option value={"Сергей"}>Сергей</option>
                </select>
            </div>
            <button className={cls.button} type="submit">
                Добавить
            </button>
        </form>
    );
};

export default AddReplacedPart;
