import { useDispatch, useSelector } from "react-redux";
import cls from "./AddReplacedPart.module.scss";
import { useState, useEffect } from "react";
import {
    addUsedPart,
    updateUsedPart,
} from "../../../app/providers/StoreProvider/Store/ReplacedPartSlice";
import { updateStock } from "../../../app/providers/StoreProvider/Store/PartSlice";
import { partsFilter } from "../../lib/partsFilter/partsFilter";
import { findIdByPartNAndLatestDate } from "../../lib/findIdByPartNandDate/findByNumberAndDate";
import { useForm } from "react-hook-form";

const AddReplacedPart = () => {
    const stockData: any = useSelector<any>((state) => state.parts.partsArray);
    const replacedPartsdata: any = useSelector<any>(
        (state) => state.replacedParts.usedPartsArray
    );

    const dispatch = useDispatch<any>();

    const [quantity, setQuantity] = useState<number>(0);
    const [date, setDate] = useState<any>("");

    useEffect(() => {
        fetch("https://worldtimeapi.org/api/timezone/Europe/Moscow")
            .then((res) => {
                return res.json();
            })
            .then((date) => setDate(date.datetime))
            .catch((err) => {
                console.log("Ошибка. Запрос не выполнен: ", err);
            });
    }, [quantity]);

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
        setValue,
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

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setQuantity(value);
        setValue("quantity", value, { shouldValidate: true });
    };

    const [error, setError] = useState<boolean>(false);

    const handleAddPart = (e: any) => {
        const cleanedPartN = e.partN.trim().toUpperCase();

        const currentPart = stockData.filter((item: any) => {
            if (sameColorParts.includes(cleanedPartN)) {
                return item.part.partN === cleanedPartN.slice(0, -1);
            }
            return item.part.partN === cleanedPartN;
        });

        const partExists = stockData.some(
            (item: any) => item.part.partN === currentPart[0].part.partN
        );

        console.log(partExists)

        if (!partExists) {
            // Устанавливаем сообщение об ошибке
            setError(true);
            reset();
            setTimeout(() => {
                setError(false);
            }, 3000);
            return;
        }

        // Если деталь найдена, сбрасываем ошибку
        setError(false);

        const newQuantity = currentPart[0].part.quantity - Number(e.quantity);
        const newName = currentPart[0].part.partName;
        const section = partsFilter(cleanedPartN);

        const partU = {
            partN: cleanedPartN,
            quantity: Number(e.quantity),
            date: date,
            section: section,
            man: e.man,
            partName: newName,
        };

        const updatedStockPart = {
            id: currentPart[0].id,
            part: {
                quantity: newQuantity >= 0? newQuantity: 0,
            },
        };

        const idForUpdate = findIdByPartNAndLatestDate(
            replacedPartsdata,
            cleanedPartN
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
                        onChange={handleQuantityChange}
                    ></input>
                </div>
                <div className={cls.box}>
                    <label className={cls.label}>Ответственный</label>
                    <select
                        {...register("man", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
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
                {error ? <p>Деталь не найдена в базе</p> : ""}
            </div>
        </>
    );
};

export default AddReplacedPart;
