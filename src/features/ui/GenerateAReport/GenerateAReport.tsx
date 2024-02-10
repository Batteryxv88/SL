import { useState, useEffect } from "react";
import cls from "./GenerateAReport.module.scss";
import {
    useAppDispatch,
    useAppSelector,
} from "../../../app/providers/StoreProvider/Store/hooks";
import { fetchToners } from "../../../app/providers/StoreProvider/Store/TonerSlice";
import { fetchUsedParts } from "../../../app/providers/StoreProvider/Store/ReplacedPartSlice";
import * as XLSX from "xlsx";
import { changeReport } from "../../../app/providers/StoreProvider/Store/ReportSlice";
import { useForm } from "react-hook-form";

const GenerateAReport = () => {
    const [selectedMachine, setSelectedMachine] = useState("C71cf");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchToners());
        dispatch(fetchUsedParts());
    }, [dispatch]);

    const toners = useAppSelector((state) => state.toners.tonersArray);

    const parts = useAppSelector((state) => state.replacedParts.usedPartsArray);

    const report = useAppSelector((state) => state.report.report);

    const handleGenerateReport = (e: any) => {
        e.preventDefault();

        const filteredToners = toners.filter(
            (toner) =>
                toner.toner.machine === selectedMachine &&
                new Date(toner.toner.date) >= new Date(startDate) &&
                new Date(toner.toner.date) <= new Date(endDate)
        );

        const filteredParts = parts.filter(
            (part) =>
                part.part.machine === selectedMachine &&
                new Date(part.part.date) >= new Date(startDate) &&
                new Date(part.part.date) <= new Date(endDate)
        );

        const result = [];

        // Жестко задаем цвета тонеров
        const tonerColors = ["Y", "M", "C", "K"];

        // Подсчет тонеров разных цветов
        const tonerCounts: { [key: string]: number } = {
            tonerY: 0,
            tonerM: 0,
            tonerC: 0,
            tonerK: 0,
        };

        filteredToners.forEach((toner) => {
            const color = toner.toner.color.toUpperCase();
            if (tonerColors.includes(color)) {
                tonerCounts[`toner${color}`]++;
            }
        });

        // Добавление информации о тонерах в результат
        result.push({
            machine: selectedMachine,
            period: `${startDate} - ${endDate}`,
            ...tonerCounts,
        });

        // Добавление информации о деталях в результат
        filteredParts.forEach((part) => {
            result.push({
                partName: part.part.partName,
                partN: part.part.partN,
                partLife: part.part.serviceLife || 0,
                quantity: part.part.quantity,
                man: part.part.man,
                date: part.part.date,
                percent: part.part.percent,
            });
        });

        dispatch(changeReport(result));
        //setRest(result)
    };

    //Экспорт отчета в exel
    const exportToFile = () => {
        const worksheet = XLSX.utils.json_to_sheet(report);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

        // Имя файла для экспорта
        const fileName = "exportedData";

        // Сохраняем файл
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <div>
            <form onSubmit={handleGenerateReport} className={cls.form}>
                <h2 className={cls.title}>
                    Отчет по использованию тонеров и деталей
                </h2>
                <div className={cls.wrapper}>
                    <span className={cls.span}>От</span>
                    <input
                        onChange={(e) => setStartDate(e.target.value)}
                        className={cls.date}
                        type="date"
                    ></input>
                </div>
                <div className={cls.wrapper}>
                    <span className={cls.span}>До</span>
                    <input
                        onChange={(e) => setEndDate(e.target.value)}
                        className={cls.date}
                        type="date"
                    ></input>
                </div>
                <div className={cls.wrapper1}>
                    <select
                        onChange={(e) => setSelectedMachine(e.target.value)}
                        value={selectedMachine}
                        className={cls.input}
                    >
                        <option value={"C71cf"}>C71cf</option>
                        <option value={"Label 190"}>Label 190</option>
                    </select>
                </div>
                <button className={cls.submit} type="submit">
                    Сформировать
                </button>
                <button className={cls.buttonExport} onClick={exportToFile}>
                    Экспорт в Excel
                </button>
            </form>
        </div>
    );
};

export default GenerateAReport;
