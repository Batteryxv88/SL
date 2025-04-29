import cls from "./Stock.module.scss";
import Part from "../../../shared/ui/Part/Part";
import { useParts } from "../../../app/providers/StoreProvider/Store/hooks";
import AddPart from "../../../features/ui/AddPart/AddPart";
import Button from "../../../shared/ui/Button/Button";
type Part = {
    partN: string;
    section: string;
    partName: string;
    quantity: number;
    partLife: string | number;
};

type PartData = {
    id?: string;
    part?: Part;
};

const Stock = () => {
    const { partsArray } = useParts();

    const renderSection = (section: string) => {
        const filteredData = partsArray.filter(
            (item) => item.part.section === section
        );

        if (filteredData.length === 0) {
            return null;
        }

        return (
            <>
                <h3 className={cls.title}>{section}</h3>
                {filteredData.map((item) => (
                    <Part
                        name={item.part.partName}
                        number={item.part.partN}
                        qty={item.part.quantity}
                        key={item.id}
                        id={item.id}
                    />
                ))}
            </>
        );
    };

    return (
        <div className={cls.stock}>
            <h2 className={cls.h2}>Склад деталей Konica Minolta</h2>
            <div className={cls.titleBox}>
                <p className={cls.name}>Наименование</p>
                <p className={cls.number}>Парт номер</p>
                <div className={cls.quantityBox}>
                    <p className={cls.quantity}>Кол-во</p>
                    <p className={cls.edit}>Редактировать</p>
                </div>
            </div>
            {renderSection("External section")}
            {renderSection("Photo conductor section")}
            {renderSection("Charging section")}
            {renderSection("Developing section")}
            {renderSection("Intermediate transfer section")}
            {renderSection("Fusing section")}
            {renderSection("Toner collection section")}
            {renderSection("Paper feed section")}
            {renderSection("Paper exit section")}
            {renderSection("RW-101")}
            {renderSection("Other")}
        </div>
    );
};

export default Stock;
