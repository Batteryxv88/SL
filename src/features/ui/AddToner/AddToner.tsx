import { useState, useEffect } from "react";
import cls from "./AddToner.module.scss";
import { useDispatch } from "react-redux";
import { addToner } from "../../../app/providers/StoreProvider/Store/TonerSlice";

const AddToner = () => {
const [color, setColor] = useState('')
const [man, setMan] = useState('')
const [counter, setCounter] = useState('')
const [date, setDate] = useState<any>('');

const dispatch = useDispatch<any>()

useEffect(() => {
    fetch("https://worldtimeapi.org/api/timezone/Europe/Moscow" )
        .then((res) => {
            return res.json();
        })
        .then((date) => setDate(date.datetime))
        .catch((err) => {
            console.log("Ошибка. Запрос не выполнен: ", err);
        });
}, [dispatch]);

const handleAddToner = (e: any) => {
    e.preventDefault()
    const newToner = {
        color: color,
        man: man,
        counter: counter,
        date: date
    }

    dispatch(addToner(newToner))

    setColor('')
    setMan('')
    setCounter('')
}


    return (
        <form className={cls.addToner} onSubmit={handleAddToner}>
            <div className={cls.box}>
                <label>Цвет</label>
                <select value={color} onChange={(e: any) => setColor(e.target.value)} className={cls.input}>
                    <option value={""}></option>
                    <option value={"C"}>C</option>
                    <option value={"M"}>M</option>
                    <option value={"Y"}>Y</option>
                    <option value={"K"}>K</option>
                </select>
            </div>

            <div className={cls.box}>
                <label className={cls.label}>Ответственный</label>
                <select value={man} onChange={(e: any) => setMan(e.target.value)} className={cls.input}>
                    <option value={""}></option>
                    <option value={"Алексей"}>Алексей</option>
                    <option value={"Максим"}>Максим</option>
                    <option value={"Сергей"}>Сергей</option>
                </select>
            </div>

            <div className={cls.box}>
                <label className={cls.label}>Счетчик</label>
                <input value={counter} onChange={(e: any) => setCounter(e.target.value)} className={cls.input} type="number"></input>
            </div>
            <button className={cls.button} type="submit">
                Добавить
            </button>
        </form>
    );
};

export default AddToner;
