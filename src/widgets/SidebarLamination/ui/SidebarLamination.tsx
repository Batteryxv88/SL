import React, { useState, useRef, useEffect } from "react";
import cls from "./SidebarLamination.module.scss";

const SidebarLamination = () => {
    const [openSections, setOpenSections] = useState([false, false]);
    const timersRef = useRef<(ReturnType<typeof setTimeout> | null)[]>([null, null]);

    const toggleSection = (index: number) => {
        const isOpen = openSections[index];
        if (isOpen) {
            if (timersRef.current[index]) {
                clearTimeout(timersRef.current[index]!);
                timersRef.current[index] = null;
            }
            setOpenSections(prev => {
                const updated = [...prev];
                updated[index] = false;
                return updated;
            });
        } else {
            setOpenSections(prev => {
                const updated = [...prev];
                updated[index] = true;
                return updated;
            });
            timersRef.current[index] = setTimeout(() => {
                setOpenSections(prev => {
                    const updated = [...prev];
                    updated[index] = false;
                    return updated;
                });
                timersRef.current[index] = null;
            }, 180000);
        }
    };

    useEffect(() => {
        return () => {
            timersRef.current.forEach(timer => {
                if (timer) clearTimeout(timer);
            });
        };
    }, []);

    return (
        <div className={cls.SidebarLamination}>
            {/* Section 1 */}
            <div className={cls.wrapper}>
                <div style={{ cursor: "pointer" }} onClick={() => toggleSection(0)}>
                    <h2 className={cls.title}>
                        Инструкция по выбору типа расчёта: "Метраж по толщине" и "Толщина по метражу"
                    </h2>
                    <div style={{ display: "flex", justifyContent: "center", color: "rgba(255, 255, 255, 0.6)", transform: openSections[0] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                </div>
                <div style={{ display: openSections[0] ? "block" : "none", marginTop: 16 }}>
                    <p className={cls.text}>
                        При работе с ламинирующими материалами и бумагой применяются два типа расчётов:
                    </p>
                    <h3 className={cls.text}>1. Метраж по толщине</h3>
                    <p className={cls.text}>
                        Назначение:
                        Применяется, когда необходимо определить, сколько метров материала осталось в ролике, исходя из фактической толщины слоя материала.
                    </p>
                    <p className={cls.text}>
                        Порядок действий:
                        Укажите фактическую толщину слоя материала.
                    </p>
                    <p className={cls.text}>
                        В результате расчёта вы получите остаточную длину материала в ролике (в метрах), которой хватит исходя из фактической толщины слоя материала.
                    </p>
                    <h3 className={cls.text}>2. Толщина по метражу</h3>
                    <p className={cls.text}>
                        Назначение:
                        Используется, когда известна длина тиража, и необходимо рассчитать минимально допустимую толщину материала, при которой ролика хватит на весь объёма работ.
                    </p>
                    <p className={cls.text}>
                        Порядок действий:
                        Укажите длину тиража в метрах.
                    </p>
                    <p className={cls.text}>
                        В результате расчёта будет определена минимальная толщина слоя материала, необходимая для выполнения данного тиража.
                    </p>
                    <h3 className={cls.text}>Памятка</h3>
                    <p className={cls.text}>
                        Обязательно учитывайте в расчетах количество метров, необходимое для приладки:
                        Для бумаги — минимум 7 метров.
                        Для ламинации — минимум 3 метра.
                    </p>
                </div>
            </div>

            {/* Section 2 */}
            <div className={cls.wrapper}>
                <div style={{ cursor: "pointer" }} onClick={() => toggleSection(1)}>
                    <h2 className={cls.title}>
                        Как правильно измерить толщину слоя ламинации в рулоне
                    </h2>
                    <div style={{ display: "flex", justifyContent: "center", color: "rgba(255, 255, 255, 0.6)", transform: openSections[1] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                </div>
                <div style={{ display: openSections[1] ? "block" : "none", marginTop: 16 }}>
                    <p className={cls.text}>
                        1. Измеряйте расстояние от внешнего диаметра картонной втулки до края слоя ламинации. Используйте по возможности одну и ту же линейку для всех измерений, чтобы избежать погрешностей.
                    </p>
                    <p className={cls.text}>2. Чем точнее замер, тем точнее расчет калькулятора.</p>
                    <p className={cls.text}>
                        3. Рекомендуемый допуск – не более 0.3 мм. Для наглядности: делим 1 мм на 3 равные части и прикидываем, сколько получилось.
                    </p>
                    <p className={cls.text}>
                        4. Примеры точных значений: 16.6 мм, 7.8 мм, 3.3 мм, 6.2 мм, 12.9 мм.
                    </p>
                    <p className={cls.text}>5. Если можете определить десятые доли миллиметра на глаз – используйте их.</p>
                </div>
            </div>
        </div>
    );
};

export default SidebarLamination;
