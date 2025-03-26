import cls from "./SidebarLamination.module.scss";


const SidebarLamination = () => {

    return (
        <div className={cls.SidebarLamination}>
            <h2 className={cls.title}>Как правильно измерить толщину слоя ламинации в рулоне</h2>
            <p className={cls.text}>
                1. Измеряйте расстояние от внешнего диаметра картонной втулки до края слоя ламинации.
                Используйте по возможности одну и ту же линейку для всех измерений, чтобы избежать погрешностей.
            </p>
            <p className={cls.text}>
                2. Чем точнее замер, тем точнее расчет калькулятора.
            </p>
            <p className={cls.text}>
                3. Рекомендуемый допуск – не более 0.3 мм. Для наглядности: делим 1 мм на 3 равные части и прикидываем, сколько получилось.
            </p>
            <p className={cls.text}>
                4. Примеры точных значений: 16.6 мм, 7.8 мм, 3.3 мм, 6.2 мм, 12.9 мм.
            </p>
            <p className={cls.text}>
                5. Если можете определить десятые доли миллиметра на глаз – используйте их.
            </p>
        </div>
    );
};

export default SidebarLamination;
