import { useDispatch, useSelector } from "react-redux";
import cls from "./AddReplacedPart.module.scss";
import { useState, useEffect } from "react";
import {
    addUsedPart,
    updateUsedPart,
} from "../../../app/providers/StoreProvider/Store/ReplacedPartSlice";
import {
    fetchParts,
    updateStock,
} from "../../../app/providers/StoreProvider/Store/PartSlice";
import { partsFilter } from "../../lib/partsFilter/partsFilter";
import { findIdByPartNAndLatestDate } from "../../lib/findIdByPartNandDate/findByNumberAndDate";
import { doc, updateDoc } from "firebase/firestore";
import db from "../../../app/config/fbConfig";
import { useForm } from "react-hook-form";

const AddReplacedPart = () => {
    const stockData: any = useSelector<any>((state) => state.parts.partsArray);
    const replacedPartsdata: any = useSelector<any>(
        (state) => state.replacedParts.usedPartsArray
    );

    const dispatch = useDispatch<any>();

    const [partN, setPartN] = useState<string>("");
    const [serviceLife, setServiceLife] = useState<number>();
    const [quantity, setQuantity] = useState<number>(0);
    const [date, setDate] = useState<any>("");
    const [man, setMan] = useState<string>("");
    const [partName, setPartName] = useState<string>();

    useEffect(() => {
        fetch("https://worldtimeapi.org/api/timezone/Europe/Moscow")
            .then((res) => {
                return res.json();
            })
            .then((date) => setDate(date.datetime))
            .catch((err) => {
                console.log("Ошибка. Запрос не выполнен: ", err);
            });
    }, [man, quantity]);

    type FormValues = {
        partN: string;
        serviceLife: number;
        quantity: number;
        man: string;
    };

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<FormValues>({
        mode: "onChange",
    });

    const sameColorParts = [
        "A5WH0Y0C",
        "A5WH0Y0M",
        "A5WH0Y0Y",
        "A5WH0Y0K",
        "A50UR70323C",
        "A50UR70323M",
        "A50UR70323Y",
        "A50UR70323K",
        "A50UR70244C",
        "A50UR70244M",
        "A50UR70244Y",
        "A50UR70244K",
    ];


    const handleAddPart = (e: any) => {

        // const currentPart = stockData.filter((item: any) => {
        //     if (sameColorParts.includes(partN)) {
        //         return item.part.partN === partN.slice(0, -1);
        //     }
        //     return item.part.partN === partN;
        // });

        // const newQuantity = currentPart[0].part.quantity - quantity;
        // const newName = currentPart[0].part.partName;
        // const section = partsFilter(partN);
        // const newServiceLife = serviceLife;

        // const partU = {
        //     partN: partN,
        //     quantity: quantity,
        //     date: date,
        //     section: section,
        //     man: man,
        //     partName: newName,
        // };

        // const updatedStockPart = {
        //     id: currentPart[0].id,
        //     part: {
        //         quantity: newQuantity,
        //     },
        // };

        // const idForUpdate = findIdByPartNAndLatestDate(
        //     replacedPartsdata,
        //     partN
        // );

        // const updatedPart = {
        //     id: idForUpdate,
        //     part: {
        //         serviceLife: newServiceLife,
        //     },
        // };

        // dispatch(updateUsedPart(updatedPart));
        // dispatch(updateStock(updatedStockPart));
        // dispatch(addUsedPart(partU));

        // setPartN("");
        // setServiceLife("");
        // setQuantity(0);
        // setMan("");



         const currentPart = stockData.filter((item: any) => {
            if (sameColorParts.includes(e.partN)) {
                return item.part.partN === e.partN.slice(0, -1);
            }
            return item.part.partN === e.partN;
        });

        const newQuantity = currentPart[0].part.quantity - Number(e.quantity);
        const newName = currentPart[0].part.partName;
        const section = partsFilter(e.partN);
        const newServiceLife = serviceLife;

        const partU = {
            partN: e.partN,
            quantity: Number(e.quantity),
            date: date,
            section: section,
            man: e.man,
            partName: newName,
        };

        const updatedStockPart = {
            id: currentPart[0].id,
            part: {
                quantity: newQuantity,
            },
        };

        const idForUpdate = findIdByPartNAndLatestDate(
            replacedPartsdata,
            e.partN
        );

        const updatedPart = {
            id: idForUpdate,
            part: {
                serviceLife: e.serviceLife,
            },
        };

        dispatch(updateUsedPart(updatedPart));
        dispatch(updateStock(updatedStockPart));
        dispatch(addUsedPart(partU));

        reset();

        // setPartN("");
        // setServiceLife(0);
        // setQuantity(0);
        // setMan("");
    };

    return (
        <>
            <form
                className={cls.addReplacedPart}
                onSubmit={handleSubmit(handleAddPart)}
            >
                <div className={cls.box}>
                    <label className={cls.label}>Парт номер</label>
                    <input
                        {...register("partN", {
                            required: "Обязательное поле",
                            minLength: {
                                value: 5,
                                message: "Минимум 5 символов",
                            },
                        })}
                        className={cls.input}
                        // onChange={(e) => setPartN(e.target.value.trim())}
                        // value={partN}
                    ></input>
                </div>
                <div className={cls.box}>
                    <label className={cls.label}>Пройденный ресурс</label>
                    <input
                        {...register("serviceLife", {
                            required: "Обязательное поле",
                            minLength: {
                                value: 3,
                                message: "Минимум 3 символа",
                            },
                        })}
                        className={cls.input}
                        // onChange={(e) => setServiceLife(e.target.value)}
                        // value={serviceLife}
                        type="number"
                    ></input>
                </div>
                <div className={cls.box}>
                    <label className={cls.label}>Кол-во</label>
                    <input
                        {...register("quantity", {
                            required: "Обязательное поле",
                            minLength: {
                                value: 1,
                                message: "Минимум 1 символ",
                            },
                        })}
                        className={cls.inputQty}
                        type="number"
                        // onChange={(e: any) => setQuantity(e.target.value)}
                        // value={quantity}
                    ></input>
                </div>
                <div className={cls.box}>
                    <label className={cls.label}>Ответственный</label>
                    <select
                        {...register("man", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
                        // onChange={(e: any) => setMan(e.target.value)}
                        // value={man}
                    >
                        <option value={"Алексей"}>Алексей</option>
                        <option value={"Максим"}>Максим</option>
                        <option value={"Сергей"}>Сергей</option>
                    </select>
                </div>
                <button className={cls.button} type="submit">
                    Добавить
                </button>
            </form>
            <div className={cls.errMessage}>
                {(errors?.partN && <p>{errors?.partN.message}</p>) ||
                    (errors?.man && <p>{errors?.man.message}</p>) ||
                    (errors?.quantity && <p>{errors?.quantity.message}</p>) ||
                    (errors?.serviceLife && (
                        <p>{errors?.serviceLife.message}</p>
                    ))}
            </div>
        </>
    );
};

export default AddReplacedPart;
