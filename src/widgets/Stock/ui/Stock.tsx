import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import cls from "./Stock.module.scss";
import { fetchParts } from "../../../app/providers/StoreProvider/Store/PartSlice";
import Part from "../../../shared/ui/Part/Part";


type Part = {
    partN: string;
    section: string;
    partName: string;
    quantity: number;
    partLife: string | number;
  };
  
  type PartData = {
    id: string;
    part: Part;
  };


const Stock = () => {
    const dispatch = useDispatch<any>();
    const partsData: PartData[] = useSelector<any, PartData[]>((state) => state.parts.partsArray);
  
    useEffect(() => {
      dispatch(fetchParts());
    }, [dispatch]);
  
    const renderSection = (section: string) => {
      const filteredData = partsData.filter((item) => item.part.section === section);
  
      if (filteredData.length === 0) {
        return null; // или другая обработка, если данных нет
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
            />
          ))}
        </>
      );
    };
  
    return (
      <div className={cls.stock}>
        {renderSection("External section")}
        {renderSection("Photo conductor section")}
        {renderSection("Charging section")}
        {renderSection("Developing section")}
        {renderSection("Intermediate transfer section")}
        {renderSection("Fusing section")}
      </div>
    );
  };
  
  export default Stock;

