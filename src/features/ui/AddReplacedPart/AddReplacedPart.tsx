import { useDispatch, useSelector } from "react-redux";
import cls from "./AddReplacedPart.module.scss";
import { useState, useEffect, useRef } from "react";
import {
    addUsedPart,
    updateUsedPart,
} from "../../../app/providers/StoreProvider/Store/ReplacedPartSlice";
import { updateStock } from "../../../app/providers/StoreProvider/Store/PartSlice";
import { partsFilter } from "../../lib/partsFilter/partsFilter";
import { findIdByPartNAndLatestDate } from "../../lib/findIdByPartNandDate/findByNumberAndDate";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import { lifePercent } from "../../../shared/lib/calculatePercentOfLife";

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={cls.modalOverlay}>
            <div className={cls.modalContent} ref={modalRef}>
                <h2 className={cls.modalTitle}>Замена детали</h2>
                <button className={cls.closeButton} onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

const AddReplacedPart = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const stockData: any = useSelector<any>((state) => state.parts.partsArray);
    const replacedPartsdata: any = useSelector<any>(
        (state) => state.replacedParts.usedPartsArray
    );
    const machineState = useAppSelector((state) => state.machines.machine);

    console.log(replacedPartsdata)

    const dispatch = useAppDispatch();

    const [quantity, setQuantity] = useState<number>(0);
    const [date, setDate] = useState<any>("");

    // useEffect(() => {
    //     fetch("https://worldtimeapi.org/api/timezone/Europe/Moscow")
    //         .then((res) => {
    //             return res.json();
    //         })
    //         .then((date) => setDate(date.datetime))
    //         .catch((err) => {
    //             console.log("Ошибка. Запрос не выполнен: ", err);
    //         });
    // }, [quantity]);

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
        defaultValues: {
            partN: "",
            serviceLife: 0,
            quantity: 0,
            man: "Алексей"
        }
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

    // const handleSetDate = () => {
    //     fetch("https://worldtimeapi.org/api/timezone/Europe/Moscow")
    //         .then((res) => {
    //             return res.json();
    //         })
    //         .then((date) => setDate(date.datetime))
    //         .catch((err) => {
    //             console.log("Ошибка. Запрос не выполнен: ", err);
    //         });
    // }

    const handleSetDate = () => {
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
    }

    

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

        // Находим отработанный ресурс детали в процентах
        const percent = lifePercent(cleanedPartN, stockData, e.serviceLife);

        const partU = {
            partN: cleanedPartN,
            quantity: Number(e.quantity),
            date: date,
            section: section,
            man: e.man,
            partName: newName,
            machine: machineState
        };

        const updatedStockPart = {
            id: currentPart[0].id,
            part: {
                quantity: newQuantity >= 0? newQuantity: 0,
            },
        };

        const idForUpdate = findIdByPartNAndLatestDate(
            replacedPartsdata,
            cleanedPartN, machineState
        );

        const updatedPart = {
            id: idForUpdate,
            part: {
                serviceLife: e.serviceLife,
                percent: percent
            },
        };

        dispatch(updateUsedPart(updatedPart));
        dispatch(updateStock(updatedStockPart));
        dispatch(addUsedPart(partU));

        reset();
    };

    const handleCloseModal = () => {
        reset();
        setIsModalOpen(false);
    };

    return (
        <>
            <button 
                className={cls.openModalButton} 
                onClick={() => setIsModalOpen(true)}
            >
                Заменить деталь
            </button>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <form
                    className={cls.addReplacedPart}
                    onSubmit={handleSubmit(handleAddPart)}
                >
                    <div className={cls.box}>
                        <label className={cls.label}>Артикул</label>
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
                            onChange={handleSetDate}
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
                <div className={cls.errorContainer}>
                    <div className={`${cls.errMessage} ${Object.keys(errors).length > 0 ? cls.visible : ''}`}>
                        {(errors?.partN && <p>{errors?.partN.message}</p>) ||
                            (errors?.serviceLife && <p>{errors?.serviceLife.message}</p>) ||
                            (errors?.quantity && <p>{errors?.quantity.message}</p>) ||
                            (errors?.man && <p>{errors?.man.message}</p>)}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AddReplacedPart;
