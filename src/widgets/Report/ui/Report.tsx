import { useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import ReplacedPart from "../../../shared/ui/replacedPart/ReplacedPart";
import cls from "./Report.module.scss";

const Report = () => {
    const report = useAppSelector((state) => state.report.report);

   
    function order(words: any){
        const arr = words.split(" ")
        const ttt = arr.map((item: any) => {return item.split('').map((item: any) => {return Number(item) || item})})
        function extractNumber(arr: any) {
            const number = arr.find((item: any) => typeof item === 'number');
            return number || 0; // Если число не найдено, возвращаем 0
        }
       
        const sortedArray = ttt.sort((a: any, b: any) => extractNumber(a) - extractNumber(b));
        return sortedArray.map((item: any) => item.join('')).join(" ")
        
    }
    
        
        console.log(order("4of Fo1r pe6ople g3ood th5e the2"))

    return (
        <div className={cls.report}>
            {report.length > 0 ? (
                <div>
                    <h2 className={cls.title}>{report[0].machine}</h2>
                    <span>Период:</span>
                    <p className={cls.period}>{report[0].period}</p>
                    <div className={cls.tonersWrapper}>
                        <span className={cls.tonersTitle}>Тонеры:</span>
                        <div className={cls.colorWrapper}>
                            <p className={cls.colorTitle}>{"C"}</p>
                            <div className={cls.colorCircleC}></div>
                            <p>{" - " + report[0].tonerC}</p>
                        </div>
                        <div className={cls.colorWrapper}>
                            <p className={cls.colorTitle}>{"M"}</p>
                            <div className={cls.colorCircleM}></div>
                            <p>{" - " + report[0].tonerM}</p>
                        </div>
                        <div className={cls.colorWrapper}>
                            <p className={cls.colorTitle}>{"Y"}</p>
                            <div className={cls.colorCircleY}></div>
                            <p>{" - " + report[0].tonerY}</p>
                        </div>
                        <div className={cls.colorWrapper}>
                            <p className={cls.colorTitle}>{"K"}</p>
                            <div className={cls.colorCircleK}></div>
                            <p>{" - " + report[0].tonerK}</p>
                        </div>
                    </div>
                    <span className={cls.partsTitle}>Детали:</span>
                </div>
            ) : (
                ""
            )}
            {report.slice(1).map((item: any) => (
                <ReplacedPart
                    name={item.partName}
                    qty={item.quantity}
                    date={item.date}
                    man={item.man}
                    number={item.partN}
                    percent={item.percent}
                    life={item.life}
                />
            ))}

            {/* {report.map((item) => (
                <div className={cls.partWrapper}>
                    <p className={cls.partNumber}>{item.partN}</p>
                    <p className={cls.partName}>{item.partName}</p>
                    <p className={cls.man}>{item.man}</p>
                    <p className={cls.qty}>{item.quantity}</p>
                </div>
            ))} */}
        </div>
    );
};

export default Report;
