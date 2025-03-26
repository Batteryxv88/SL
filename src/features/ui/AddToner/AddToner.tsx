import { useState, useEffect } from "react";
import cls from "./AddToner.module.scss";
import { useDispatch } from "react-redux";
import { addToner } from "../../../app/providers/StoreProvider/Store/TonerSlice";
import { useForm } from "react-hook-form";
import { useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import { fetchTonersStorage, updateToner } from "../../../app/providers/StoreProvider/Store/TonersStorageSlice";

const AddToner = () => {
    const [date, setDate] = useState<any>("");

    const dispatch = useDispatch<any>();
    const tonersArr = useAppSelector(
        (state) => state.tonersStorage.tonersStorageArr
    );
    
    const machineTonerState = useAppSelector((state) => state.machines.tonerMachine);


    useEffect(() => {
        const currentDate = new Date();

        function formatDate(date:any) {
            const pad = (num:any) => String(num).padStart(2, '0');
            const year = date.getFullYear();
            const month = pad(date.getMonth() + 1); // Месяцы в JS начинаются с 0
            const day = pad(date.getDate());
            const hours = pad(date.getHours());
            const minutes = pad(date.getMinutes());
            const seconds = pad(date.getSeconds());
            const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        
            // Получаем смещение по времени в минутах и конвертируем в часы:минуты
            const timezoneOffset = -date.getTimezoneOffset();
            const timezoneHours = pad(Math.floor(timezoneOffset / 60));
            const timezoneMinutes = pad(Math.abs(timezoneOffset % 60));
            const timezoneSign = timezoneOffset >= 0 ? "+" : "-";
            
            // Формируем строку
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${timezoneHours}:${timezoneMinutes}`;
        }

        const formattedDate = formatDate(currentDate);

        setDate(formattedDate)
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchTonersStorage());
    }, []);

    type FormValues = {
        color: string;
        man: string;
        counter: number;
    };

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm<FormValues>({
        mode: "onChange",
    });

    //учитываем замену нового тонера
    const handleAddToner = (e: any) => {
        const newToner = {
            color: e.color,
            man: e.man,
            counter: Number(e.counter),
            date: date,
            machine: machineTonerState
        };

        const tonerId = tonersArr.filter((item) => {
            return item.toner.color === e.color
        })[0].id

        const tonerQty = tonersArr.filter((item) => {
            return item.toner.color === e.color
        })[0].toner.qty

        const updatedTonerQty = {
            id: tonerId,
            toner: {
                qty: tonerQty - 1,
            },
        };

        dispatch(updateToner(updatedTonerQty));
        dispatch(addToner(newToner));

        reset();
    };

    return (
        <>
            <form
                className={cls.addToner}
                onSubmit={handleSubmit(handleAddToner)}
            >
                <div className={cls.box}>
                    <label>Цвет</label>
                    <select
                        {...register("color", {
                            required: "Обязательное поле",
                        })}
                        className={cls.input}
                    >
                        <option value={"C"}>C</option>
                        <option value={"M"}>M</option>
                        <option value={"Y"}>Y</option>
                        <option value={"K"}>K</option>
                    </select>
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
                <div className={cls.box}>
                    <label className={cls.label}>Счетчик</label>
                    <input
                        {...register("counter", {
                            required: "Обязательное поле",
                            minLength: {
                                value: 5,
                                message: "Минимум 5 символов",
                            },
                        })}
                        className={cls.input}
                        type="number"
                    ></input>
                </div>
                <button className={cls.button} type="submit">
                    Добавить
                </button>
            </form>
            <div className={cls.errorContainer}>
                <div className={`${cls.errMessage} ${Object.keys(errors).length > 0 ? cls.visible : ''}`}>
                    {(errors?.counter && <p>{errors?.counter.message}</p>) ||
                        (errors?.man && <p>{errors?.man.message}</p>) ||
                        (errors?.color && <p>{errors?.color.message}</p>)}
                </div>
            </div>
        </>
    );
};

export default AddToner;
