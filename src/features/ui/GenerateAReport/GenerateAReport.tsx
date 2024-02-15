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
import { transformArray } from "../../lib/transformReport/transformReport";
import { formatDatesInArray } from "../../lib/transformDateInReport/transformDate";

const GenerateAReport = () => {

    type FormValues = {
      from: string;
      to: string;
      machine: string;
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

    const handleGenerateReport = (e: FormValues) => {
      const filteredToners = toners.filter(
          (toner) =>
              toner.toner.machine === e.machine &&
              new Date(toner.toner.date).setHours(0, 0, 0, 0) >= new Date(e.from).setHours(0, 0, 0, 0) &&
              new Date(toner.toner.date).setHours(0, 0, 0, 0) <= new Date(e.to).setHours(0, 0, 0, 0)
      );
  
      const filteredParts = parts.filter(
          (part) =>
              part.part.machine === e.machine &&
              new Date(part.part.date).setHours(0, 0, 0, 0) >= new Date(e.from).setHours(0, 0, 0, 0) &&
              new Date(part.part.date).setHours(0, 0, 0, 0) <= new Date(e.to).setHours(0, 0, 0, 0)
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
          machine: e.machine,
          period: `${e.from} - ${e.to}`,
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

      const formatDate = (dateString: string): string => {
        const dateObject = new Date(dateString);
        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1; // Месяцы в JavaScript начинаются с 0
        const day = dateObject.getDate();
        return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
    };

    // Проходим по всем элементам в результате и приводим даты
    result.forEach((item: any) => {
        if (item.date) {
            item.date = formatDate(item.date);
        }
    });
  
      dispatch(changeReport(result));
  };

  const transformedToRusLangArray = transformArray(report)
  const eee = formatDatesInArray(transformedToRusLangArray)
  

    //Экспорт отчета в exel
    const exportToFile = () => {
        const worksheet = XLSX.utils.json_to_sheet(eee);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

        // Имя файла для экспорта
        const fileName = "exportedData";

        // Сохраняем файл
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <div>
            <form onSubmit={handleSubmit(handleGenerateReport)} className={cls.form}>
                <h2 className={cls.title}>
                    Отчет по использованию тонеров и деталей
                </h2>
                <div className={cls.wrapper}>
                    <span className={cls.span}>От</span>
                    <input
                        className={cls.date}
                        type="date"
                        {...register("from", {
                          required: "Обязательное поле"
                      })}
                    ></input>
                    {errors.from? <p className={cls.error}>{errors.from.message}</p>: ''}
                </div>
                <div className={cls.wrapper}>
                    <span className={cls.span}>До</span>
                    <input
                        className={cls.date}
                        type="date"
                        {...register("to", {
                          required: "Обязательное поле"
                      })}
                    ></input>
                    {errors.to? <p className={cls.error}>{errors.to.message}</p>: ''}
                </div>
                <div className={cls.wrapper1}>
                    <select
                        className={cls.input}
                        {...register("machine", {
                          required: "Обязательное поле",
                      })}
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
