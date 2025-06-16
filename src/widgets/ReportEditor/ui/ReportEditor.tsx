import cls from "./ReportEditor.module.scss";

const ReportEditor = () => {


    return (
        <div className={cls.reportEditor}>
            <h2 className={cls.h2}>Радактор отчета для заказа деталей</h2>
            <div className={cls.titleBox}>
                <p className={cls.name}>Наименование</p>
                <p className={cls.number}>Парт номер</p>
                <p className={cls.quantity}>Кол-во на складе</p>
                <p className={cls.edit}>Кол-во для заказа</p>
                <p className={cls.edit}>Включить в заказ</p>
                <p className={cls.edit}>Редактировать</p>
            </div>
        </div>
    );
};

export default ReportEditor;