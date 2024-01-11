import { useState, useEffect } from "react";
import cls from "./AddToner.module.scss";
import { useDispatch } from "react-redux";
import { addToner } from "../../../app/providers/StoreProvider/Store/TonerSlice";
import { useForm } from "react-hook-form";

const AddToner = () => {
    const [date, setDate] = useState<any>("");

    const dispatch = useDispatch<any>();

    useEffect(() => {
        fetch("https://worldtimeapi.org/api/timezone/Europe/Moscow")
            .then((res) => {
                return res.json();
            })
            .then((date) => setDate(date.datetime))
            .catch((err) => {
                console.log("Ошибка. Запрос не выполнен: ", err);
            });
    }, [dispatch]);

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

    const handleAddToner = (e: any) => {
        const newToner = {
            color: e.color,
            man: e.man,
            counter: Number(e.counter),
            date: date,
        };

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
                        className={!errors.counter ? cls.input : cls.error}
                        type="number"
                    ></input>
                </div>
                <button className={cls.button} type="submit">
                    Добавить
                </button>
            </form>
            <div className={cls.errMessage}>
                {(errors?.counter && <p>{errors?.counter.message}</p>) ||
                    (errors?.man && <p>{errors?.man.message}</p>) ||
                    (errors?.color && <p>{errors?.color.message}</p>)}
            </div>
        </>
    );
};

export default AddToner;
