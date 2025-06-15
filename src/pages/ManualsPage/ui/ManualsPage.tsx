import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import { useState, FormEvent, useEffect } from "react";
import { Label_190 } from "../../../shared/lib/manuals/Label190";
import { Label_400 } from "../../../shared/lib/manuals/Label400";
import cls from "./ManualsPage.module.scss";
import MachineSvg from "../../../shared/assets/machine1.svg";

const ManualsPage = () => {
    const dispatch = useAppDispatch();
    dispatch(changePage('manuals'));

    const manualState = useAppSelector((state) => state.manuals.manual);
    const [searchCode, setSearchCode] = useState("");
    const [foundErrors, setFoundErrors] = useState<any[]>([]);
    const [showWarning, setShowWarning] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);
    console.log(foundErrors);

    // Сброс состояния поиска при смене машины
    useEffect(() => {
        setSearchCode("");
        setFoundErrors([]);
        setShowWarning(false);
        setSearchPerformed(false);
    }, [manualState]);

    // Автоматически скрываем предупреждение через 3 секунды
    useEffect(() => {
        if (showWarning) {
            const timer = setTimeout(() => {
                setShowWarning(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showWarning]);

    // Выбираем нужный массив данных в зависимости от выбранной машины
    const currentManualData = manualState === "label_190" ? Label_190 : Label_400;

    // Функция для преобразования номеров секций в названия
    const getSectionNames = (sectionNumbers: string) => {
        if (!sectionNumbers || sectionNumbers.trim() === "") return "";
        
        const sectionMap: { [key: string]: string } = {
            "1": "Отработка",
            "2": "Протяжка бумаги, ADU",
            "3": "Входная секция",
            "4": "Выходная секция",
            "5": "Печка",
            "6": "Блок с датчиками IDC",
            "7": "Лента переноса",
            "8": "Узел второго переноса",
            "9": "Барабаны",
            "10": "Блоки проявки",
            "11": "Коронаторы",
            "12": "Лазеры",
            "13": "Регистрация бумаги",
            "14": "Подача тонера"
        };

        // Разбиваем строку по запятым, удаляем пробелы и преобразуем номера в названия
        const numbers = sectionNumbers.split(',').map(num => num.trim());
        const sectionNames = numbers.map(num => {
            const name = sectionMap[num];
            return name ? `${num} ${name}` : num;
        });

        return sectionNames.join(', ');
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        setSearchPerformed(true);
        
        if (!searchCode.trim()) {
            setFoundErrors([]);
            return;
        }

        // Ищем ошибки по коду (игнорируем первый элемент массива с моделью)
        const results = currentManualData.slice(1).filter((item: any) =>
            item.code && item.code.toLowerCase().includes(searchCode.toLowerCase())
        );
        setFoundErrors(results);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        if (value.length <= 4) {
            setSearchCode(value);
            setShowWarning(false);
            setSearchPerformed(false); // Сбрасываем статус поиска при изменении инпута
        } else {
            setShowWarning(true);
        }
    };

    return (
        <div className={cls.manualsPage}>
            <div className={cls.manualsContainer}>
                <div className={cls.findErrorForm}>
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Введите номер ошибки"
                            value={searchCode}
                            onChange={handleInputChange}
                        />
                        <button type="submit">Найти</button>
                    </form>
                    {showWarning && (
                        <div className={cls.warning}>
                            Код ошибки не может быть длинней 4х символов
                        </div>
                    )}
                </div>
                <div className={cls.errorDescription}>
                    <h1>Описание ошибки</h1>
                    {foundErrors.length === 0 ? (
                        <p className={searchPerformed && searchCode ? cls.error_not_found : cls.not_found}>
                            {searchPerformed && searchCode ? "Код ошибки не найден" : "Введите код ошибки для поиска"}
                        </p>
                    ) : (
                        foundErrors.map((item: any) => (
                            <div className={cls.error_code} key={item.code}>
                                <h3 className={cls.title}>Code</h3>
                                <p className={cls.des}>{item.code}</p>
                                <h3 className={cls.title}>Classification</h3>
                                <p className={cls.des}>{item.class}</p>
                                <h3 className={cls.title}>Cause</h3>
                                <p className={cls.des}>{item.cause}</p>
                                <h3 className={cls.title}>Measures to take when alert occurs</h3>
                                <p className={cls.des}>{item.measure}</p>
                                <h3 className={cls.title}>Estimated abnormal parts</h3>
                                <p className={cls.des}>{item.abnormal}</p>
                                {item.corr && (
                                    <>
                                        <h3 className={cls.title}>Correction</h3>
                                        <p className={cls.des}>{item.corr}</p>
                                    </>
                                )}
                                <h3 className={cls.title}>Note</h3>
                                <p className={cls.des}>{item.note}</p>
                                <h3 className={cls.title}>Solution</h3>
                                <p className={cls.des}>{item.solution}</p>
                                {item.isolate && (
                                    <>
                                        <h3 className={cls.title}>Faulty part isolation DIPSW</h3>
                                        <p className={cls.des}>{item.isolate}</p>
                                    </>
                                )}
                                {item.control && (
                                    <>
                                        <h3 className={cls.title}>Control</h3>
                                        <p className={cls.des}>{item.control}</p>
                                    </>
                                )}
                                {item.additional && item.additional.trim() !== "" && (
                                    <>
                                        <h3 className={cls.title}>Комментарий</h3>
                                        <p className={cls.des}>{item.additional}</p>
                                    </>
                                )}
                                {item.section && (
                                    <>
                                        <h3 className={cls.title}>Секция</h3>
                                        <p className={cls.des}>{getSectionNames(item.section)}</p>
                                    </>
                                )}
                                {manualState === "label_190" && (
                                    <div className={cls.machine}>
                                        <MachineSvg />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManualsPage;
