import { changePage } from "../../../app/providers/StoreProvider/Store/ChangePageSlice";
import { useAppDispatch, useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import AddReplacedPart from "../../../features/ui/AddReplacedPart/AddReplacedPart";
import Calendar from "../../../widgets/Calendar/Calendar";
import * as XLSX from "xlsx";

const SchedulePage = () => {
    const dispatch = useAppDispatch();

    const data = useAppSelector((state) => state.parts.partsArray)

    const transformedArray = data.map(item => {
        return {
            id: item.id,
            quantity: 0,
            section: item.part.section,
            // Другие свойства, которые вы хотите сохранить из вложенного объекта
            partName: item.part.partName,
            partN: item.part.partN,
            partLife: item.part.partLife
        };
    });

    dispatch(changePage("schedule"));

    const exportToFile = () => {
        const worksheet = XLSX.utils.json_to_sheet(transformedArray);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

        // Имя файла для экспорта
        const fileName = "exportedData";

        // Сохраняем файл
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <div>
            <AddReplacedPart />
            <Calendar />
            <button onClick={exportToFile}>Export file</button>
        </div>
    );
};

export default SchedulePage;
