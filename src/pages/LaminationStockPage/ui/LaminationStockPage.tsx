import cls from "./LaminationStockPage.module.scss";

const LaminationStockPage = () => {
    return (
        <div className={cls.LaminationStockPage}>
            <h2 className={cls.title}>Ламинация</h2>
            <div className={cls.container}>
                <div className={cls.laminationBox}>
                    <h3 className={cls.laminationBox__title}>Глянец</h3>
                    <h4 className={cls.laminationBox__subtitle}>Пленка стандарт</h4>
                    <div className={cls.image}></div>
                    <data className={cls.laminationBox__data}>23</data>
                </div>
                <div className={cls.laminationBox}>
                    <h3 className={cls.laminationBox__title}>Глянец тонкий</h3>
                    <h4 className={cls.laminationBox__subtitle}>Пленка тонкая</h4>
                    <data className={cls.laminationBox__data}>46</data>
                </div>
                <div className={cls.laminationBox}>
                    <h3 className={cls.laminationBox__title}>Матт</h3>
                    <h4 className={cls.laminationBox__subtitle}>Пленка матовая</h4>
                    <data className={cls.laminationBox__data}>32</data>
                </div>
                <div className={cls.laminationBox}>
                    <h3 className={cls.laminationBox__title}>Софт тач</h3>
                    <h4 className={cls.laminationBox__subtitle}>Пленка бархатистая</h4>
                    <data className={cls.laminationBox__data}>55</data>
                </div>
            </div>
        </div>
    );
};

export default LaminationStockPage;