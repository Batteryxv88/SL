import { useAppSelector } from "../../../app/providers/StoreProvider/Store/hooks";
import ReplacedPart from "../../../shared/ui/replacedPart/ReplacedPart";
import cls from "./Report.module.scss";

const Report = () => {
    const report = useAppSelector((state) => state.report.report);

    if (!report || report.length === 0) {
        return (
            <div className={cls.report}>
                <div className={cls.empty}>
                    Нет данных для отображения
                </div>
            </div>
        );
    }

    return (
        <div className={cls.report}>
            <div className={cls.header}>
                <h2 className={cls.title}>{report[0].machine}</h2>
                <span className={cls.period}>{report[0].period}</span>
            </div>

            <div className={cls.tonersWrapper}>
                <span className={cls.tonersTitle}>Тонеры:</span>
                <div className={cls.tonersGrid}>
                    <div className={cls.tonerItem}>
                        <div className={cls.colorWrapper}>
                            <span className={cls.colorTitle}>C</span>
                            <div className={cls.colorCircleC}></div>
                            <span className={cls.tonerValue}>{report[0].tonerC}</span>
                        </div>
                    </div>
                    <div className={cls.tonerItem}>
                        <div className={cls.colorWrapper}>
                            <span className={cls.colorTitle}>M</span>
                            <div className={cls.colorCircleM}></div>
                            <span className={cls.tonerValue}>{report[0].tonerM}</span>
                        </div>
                    </div>
                    <div className={cls.tonerItem}>
                        <div className={cls.colorWrapper}>
                            <span className={cls.colorTitle}>Y</span>
                            <div className={cls.colorCircleY}></div>
                            <span className={cls.tonerValue}>{report[0].tonerY}</span>
                        </div>
                    </div>
                    <div className={cls.tonerItem}>
                        <div className={cls.colorWrapper}>
                            <span className={cls.colorTitle}>K</span>
                            <div className={cls.colorCircleK}></div>
                            <span className={cls.tonerValue}>{report[0].tonerK}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cls.partsSection}>
                <span className={cls.partsTitle}>Детали:</span>
                {report.slice(1).map((item: any, index: number) => (
                    <ReplacedPart
                        key={index}
                        name={item.partName}
                        qty={item.quantity}
                        date={item.date}
                        man={item.man}
                        number={item.partN}
                        percent={item.percent}
                        life={item.life}
                    />
                ))}
            </div>
        </div>
    );
};

export default Report;
