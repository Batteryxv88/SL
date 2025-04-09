import cls from "./PaperStockPage.module.scss";

const PaperStockPage = () => {
    return (
        <div className={cls.PaperStockPage}>
            <h2 className={cls.title}>Бумага</h2>
            <div className={cls.container}>
                <div className={cls.paperBox}>
                    <h3 className={cls.paperBox__title}>FA</h3>
                    <h4 className={cls.paperBox__subtitle}>Пленка акрил</h4>
                    <data className={cls.paperBox__data}>100</data>
                </div>
                <div className={cls.paperBox}>
                    <h3 className={cls.paperBox__title}>FH</h3>     
                    <h4 className={cls.paperBox__subtitle}>Пленка каучук</h4>
                    <data className={cls.paperBox__data}>50</data>
                </div>
                <div className={cls.paperBox}>
                    <h3 className={cls.paperBox__title}>PA</h3>
                    <h4 className={cls.paperBox__subtitle}>Бумага акрил</h4>
                    <data className={cls.paperBox__data}>45</data>
                </div>
                <div className={cls.paperBox}>
                    <h3 className={cls.paperBox__title}>PH</h3>
                    <h4 className={cls.paperBox__subtitle}>Бумага каучук</h4>
                    <data className={cls.paperBox__data}>14</data>
                </div>
                <div className={cls.paperBox}>
                    <h3 className={cls.paperBox__title}>Clear</h3>
                    <h4 className={cls.paperBox__subtitle}>Пленка прозрачная</h4>
                    <data className={cls.paperBox__data}>44</data>
                </div>
                <div className={cls.paperBox}>
                    <h3 className={cls.paperBox__title}>Metall</h3>
                    <h4 className={cls.paperBox__subtitle}>Пленка металлизированная</h4>
                    <data className={cls.paperBox__data}>13</data>
                </div>
                <div className={cls.paperBox}>
                    <h3 className={cls.paperBox__title}>Verge</h3>
                    <h4 className={cls.paperBox__subtitle}>Бумага тиснёная</h4>
                    <data className={cls.paperBox__data}>89</data>
                </div>
            </div>
        </div>
    );
};

export default PaperStockPage;