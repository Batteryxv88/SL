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
// Импортируем хуки для получения данных складов
import { useMaterials, useLaminations, useToners, useHoldersAndKnifes, useParts } from "../../../app/providers/StoreProvider/Store/hooks";

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

    // Подключаем хуки для получения данных складов
    const { materials } = useMaterials();
    const { laminations } = useLaminations();
    const { tonersArr } = useToners();
    const { holdersAndKnifes } = useHoldersAndKnifes();
    const { partsArray } = useParts();

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

    // Новая функция для полного отчета
    const exportFullReport = () => {
        const workbook = XLSX.utils.book_new();
        
        // Текущая дата для названия файла
        const currentDate = new Date().toLocaleDateString('ru-RU');

        // 1. Лист "Потраченные тонеры" - машины в разных колонках
        const c71cfToners = toners.filter(t => t.toner.machine === 'C71cf');
        const label190Toners = toners.filter(t => t.toner.machine === 'Label 190');
        
        const maxTonerRows = Math.max(c71cfToners.length, label190Toners.length);
        const usedTonersData: any[] = [];
        
        // Заголовки
        usedTonersData.push({
            'C71cf - Аппарат': 'C71cf',
            'C71cf - Цвет': 'Цвет', 
            'C71cf - Счетчик': 'Счетчик',
            'C71cf - Ответственный': 'Ответственный',
            'C71cf - Дата': 'Дата',
            '': '',
            'Label 190 - Аппарат': 'Label 190',
            'Label 190 - Цвет': 'Цвет',
            'Label 190 - Счетчик': 'Счетчик', 
            'Label 190 - Ответственный': 'Ответственный',
            'Label 190 - Дата': 'Дата'
        });
        
        // Данные
        for (let i = 0; i < maxTonerRows; i++) {
            const c71cfToner = c71cfToners[i];
            const label190Toner = label190Toners[i];
            
            usedTonersData.push({
                'C71cf - Аппарат': c71cfToner ? c71cfToner.toner.machine : '',
                'C71cf - Цвет': c71cfToner ? c71cfToner.toner.color : '',
                'C71cf - Счетчик': c71cfToner ? c71cfToner.toner.counter : '',
                'C71cf - Ответственный': c71cfToner ? c71cfToner.toner.man : '',
                'C71cf - Дата': c71cfToner ? new Date(c71cfToner.toner.date).toLocaleDateString('ru-RU') : '',
                '': '',
                'Label 190 - Аппарат': label190Toner ? label190Toner.toner.machine : '',
                'Label 190 - Цвет': label190Toner ? label190Toner.toner.color : '',
                'Label 190 - Счетчик': label190Toner ? label190Toner.toner.counter : '',
                'Label 190 - Ответственный': label190Toner ? label190Toner.toner.man : '',
                'Label 190 - Дата': label190Toner ? new Date(label190Toner.toner.date).toLocaleDateString('ru-RU') : ''
            });
        }
        
        const usedTonersSheet = XLSX.utils.json_to_sheet(usedTonersData);
        XLSX.utils.book_append_sheet(workbook, usedTonersSheet, "Потраченные тонеры");

        // 2. Лист "Потраченные детали" - машины в разных колонках
        const c71cfParts = parts.filter(p => p.part.machine === 'C71cf');
        const label190Parts = parts.filter(p => p.part.machine === 'Label 190');
        
        const maxPartRows = Math.max(c71cfParts.length, label190Parts.length);
        const usedPartsData: any[] = [];
        
        // Заголовки
        usedPartsData.push({
            'C71cf - Аппарат': 'C71cf',
            'C71cf - Наименование': 'Наименование',
            'C71cf - Артикул': 'Артикул',
            'C71cf - Количество': 'Количество',
            'C71cf - Ресурс': 'Ресурс',
            'C71cf - Процент': 'Процент',
            'C71cf - Ответственный': 'Ответственный',
            'C71cf - Дата': 'Дата',
            'C71cf - Секция': 'Секция',
            '': '',
            'Label 190 - Аппарат': 'Label 190',
            'Label 190 - Наименование': 'Наименование',
            'Label 190 - Артикул': 'Артикул',
            'Label 190 - Количество': 'Количество',
            'Label 190 - Ресурс': 'Ресурс',
            'Label 190 - Процент': 'Процент',
            'Label 190 - Ответственный': 'Ответственный',
            'Label 190 - Дата': 'Дата',
            'Label 190 - Секция': 'Секция'
        });
        
        // Данные
        for (let i = 0; i < maxPartRows; i++) {
            const c71cfPart = c71cfParts[i];
            const label190Part = label190Parts[i];
            
            usedPartsData.push({
                'C71cf - Аппарат': c71cfPart ? c71cfPart.part.machine : '',
                'C71cf - Наименование': c71cfPart ? c71cfPart.part.partName : '',
                'C71cf - Артикул': c71cfPart ? c71cfPart.part.partN : '',
                'C71cf - Количество': c71cfPart ? c71cfPart.part.quantity : '',
                'C71cf - Ресурс': c71cfPart ? (c71cfPart.part.serviceLife || 0) : '',
                'C71cf - Процент': c71cfPart ? c71cfPart.part.percent : '',
                'C71cf - Ответственный': c71cfPart ? c71cfPart.part.man : '',
                'C71cf - Дата': c71cfPart ? new Date(c71cfPart.part.date).toLocaleDateString('ru-RU') : '',
                'C71cf - Секция': c71cfPart ? c71cfPart.part.section : '',
                '': '',
                'Label 190 - Аппарат': label190Part ? label190Part.part.machine : '',
                'Label 190 - Наименование': label190Part ? label190Part.part.partName : '',
                'Label 190 - Артикул': label190Part ? label190Part.part.partN : '',
                'Label 190 - Количество': label190Part ? label190Part.part.quantity : '',
                'Label 190 - Ресурс': label190Part ? (label190Part.part.serviceLife || 0) : '',
                'Label 190 - Процент': label190Part ? label190Part.part.percent : '',
                'Label 190 - Ответственный': label190Part ? label190Part.part.man : '',
                'Label 190 - Дата': label190Part ? new Date(label190Part.part.date).toLocaleDateString('ru-RU') : '',
                'Label 190 - Секция': label190Part ? label190Part.part.section : ''
            });
        }
        
        const usedPartsSheet = XLSX.utils.json_to_sheet(usedPartsData);
        XLSX.utils.book_append_sheet(workbook, usedPartsSheet, "Потраченные детали");

        // 3. Лист "Склад тонеров"
        const tonersStockData = tonersArr.map((toner: any) => ({
            'Цвет': toner.toner.color,
            'Количество': toner.toner.qty
        }));
        const tonersStockSheet = XLSX.utils.json_to_sheet(tonersStockData);
        XLSX.utils.book_append_sheet(workbook, tonersStockSheet, "Склад тонеров");

        // 4. Лист "Склад материалов" - основной склад и брак в разных колонках
        const newMaterials = materials.filter(m => m.status === 'new');
        const defectiveMaterials = materials.filter(m => m.status === 'defective');
        
        const maxMaterialRows = Math.max(newMaterials.length, defectiveMaterials.length);
        const materialsStockData: any[] = [];
        
        // Заголовки
        materialsStockData.push({
            'Основной склад - Тип': 'ОСНОВНОЙ СКЛАД',
            'Основной склад - Количество': 'Количество',
            'Основной склад - Статус': 'Статус',
            '': '',
            'Брак - Тип': 'БРАК',
            'Брак - Количество': 'Количество',
            'Брак - Статус': 'Статус'
        });
        
        // Данные
        for (let i = 0; i < maxMaterialRows; i++) {
            const newMaterial = newMaterials[i];
            const defectiveMaterial = defectiveMaterials[i];
            
            materialsStockData.push({
                'Основной склад - Тип': newMaterial ? newMaterial.type : '',
                'Основной склад - Количество': newMaterial ? newMaterial.qty : '',
                'Основной склад - Статус': newMaterial ? 'Новый' : '',
                '': '',
                'Брак - Тип': defectiveMaterial ? defectiveMaterial.type : '',
                'Брак - Количество': defectiveMaterial ? defectiveMaterial.qty : '',
                'Брак - Статус': defectiveMaterial ? 'Брак' : ''
            });
        }
        
        const materialsStockSheet = XLSX.utils.json_to_sheet(materialsStockData);
        XLSX.utils.book_append_sheet(workbook, materialsStockSheet, "Склад материалов");

        // 5. Лист "Склад ламинации" - основной склад и брак в разных колонках
        const newLaminations = laminations.filter(l => l.status === 'new');
        const defectiveLaminations = laminations.filter(l => l.status === 'defective');
        
        const maxLaminationRows = Math.max(newLaminations.length, defectiveLaminations.length);
        const laminationsStockData: any[] = [];
        
        // Заголовки
        laminationsStockData.push({
            'Основной склад - Тип': 'ОСНОВНОЙ СКЛАД',
            'Основной склад - Количество': 'Количество',
            'Основной склад - Статус': 'Статус',
            '': '',
            'Брак - Тип': 'БРАК',
            'Брак - Количество': 'Количество',
            'Брак - Статус': 'Статус'
        });
        
        // Данные
        for (let i = 0; i < maxLaminationRows; i++) {
            const newLamination = newLaminations[i];
            const defectiveLamination = defectiveLaminations[i];
            
            laminationsStockData.push({
                'Основной склад - Тип': newLamination ? newLamination.type : '',
                'Основной склад - Количество': newLamination ? newLamination.qty : '',
                'Основной склад - Статус': newLamination ? 'Новый' : '',
                '': '',
                'Брак - Тип': defectiveLamination ? defectiveLamination.type : '',
                'Брак - Количество': defectiveLamination ? defectiveLamination.qty : '',
                'Брак - Статус': defectiveLamination ? 'Брак' : ''
            });
        }
        
        const laminationsStockSheet = XLSX.utils.json_to_sheet(laminationsStockData);
        XLSX.utils.book_append_sheet(workbook, laminationsStockSheet, "Склад ламинации");

        // 6. Лист "Склад деталей"
        const partsStockData = partsArray.map((part: any) => ({
            'Наименование': part.part.partName,
            'Артикул': part.part.partN,
            'Количество': part.part.quantity,
            'Секция': part.part.section,
            'Ресурс': part.part.serviceLife || 0
        }));
        const partsStockSheet = XLSX.utils.json_to_sheet(partsStockData);
        XLSX.utils.book_append_sheet(workbook, partsStockSheet, "Склад деталей");

        // 7. Лист "Держатели и ножи"
        const holdersData = holdersAndKnifes.map((item: any) => ({
            'Тип': item.type === 'holder' ? 'Держатель' : 'Нож',
            'Подтип': item.sub_type === 'new' ? 'Новый' : 'Старый',
            'Количество': item.qty
        }));
        const holdersSheet = XLSX.utils.json_to_sheet(holdersData);
        XLSX.utils.book_append_sheet(workbook, holdersSheet, "Держатели и ножи");

        // 8. Сводный лист
        const summaryData = [
            { 'Категория': '=== СКЛАДЫ ===', 'Общее количество': '' },
            { 'Категория': 'Тонеры на складе', 'Общее количество': tonersArr.reduce((sum: number, t: any) => sum + t.toner.qty, 0) },
            { 'Категория': 'Материалы на складе (новые)', 'Общее количество': materials.filter((m: any) => m.status === 'new').reduce((sum: number, m: any) => sum + m.qty, 0) },
            { 'Категория': 'Материалы брак', 'Общее количество': materials.filter((m: any) => m.status === 'defective').reduce((sum: number, m: any) => sum + m.qty, 0) },
            { 'Категория': 'Ламинация на складе (новая)', 'Общее количество': laminations.filter((l: any) => l.status === 'new').reduce((sum: number, l: any) => sum + l.qty, 0) },
            { 'Категория': 'Ламинация брак', 'Общее количество': laminations.filter((l: any) => l.status === 'defective').reduce((sum: number, l: any) => sum + l.qty, 0) },
            { 'Категория': 'Детали на складе', 'Общее количество': partsArray.reduce((sum: number, p: any) => sum + p.part.quantity, 0) },
            { 'Категория': 'Держатели и ножи', 'Общее количество': holdersAndKnifes.reduce((sum: number, h: any) => sum + h.qty, 0) },
            { 'Категория': '', 'Общее количество': '' },
            { 'Категория': '=== ПОТРАЧЕНО ===', 'Общее количество': '' },
            { 'Категория': 'Потрачено тонеров C71cf', 'Общее количество': toners.filter((t: any) => t.toner.machine === 'C71cf').length },
            { 'Категория': 'Потрачено тонеров Label 190', 'Общее количество': toners.filter((t: any) => t.toner.machine === 'Label 190').length },
            { 'Категория': 'Потрачено деталей C71cf', 'Общее количество': parts.filter((p: any) => p.part.machine === 'C71cf').length },
            { 'Категория': 'Потрачено деталей Label 190', 'Общее количество': parts.filter((p: any) => p.part.machine === 'Label 190').length }
        ];
        const summarySheet = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, "Сводка");

        // Сохраняем файл с указанием даты
        const fileName = `Полный_отчет_${currentDate.replace(/\./g, '_')}`;
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
                    <div className={cls.inputWrapper}>
                        <input
                            className={cls.date}
                            type="date"
                            {...register("from", {
                              required: "Обязательное поле"
                          })}
                        ></input>
                        {errors.from && <p className={cls.error}>{errors.from.message}</p>}
                    </div>
                </div>
                <div className={cls.wrapper}>
                    <span className={cls.span}>До</span>
                    <div className={cls.inputWrapper}>
                        <input
                            className={cls.date}
                            type="date"
                            {...register("to", {
                              required: "Обязательное поле"
                          })}
                        ></input>
                        {errors.to && <p className={cls.error}>{errors.to.message}</p>}
                    </div>
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
                <button className={cls.buttonExport} type="button" onClick={exportToFile}>
                    Экспорт в Excel
                </button>
                <button className={cls.buttonFullExport} type="button" onClick={exportFullReport}>
                    Полный отчет Excel
                </button>
            </form>
        </div>
    );
};

export default GenerateAReport;
