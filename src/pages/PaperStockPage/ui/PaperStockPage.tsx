import cls from "./PaperStockPage.module.scss";
import Roll from "../../../shared/assets/icons/roll.svg"
import EditPenIcon from "../../../shared/assets/icons/edit-pen.svg"

const PaperStockPage = () => {
    return (
        <div className={cls.PaperStockPage}>
            <h2 className={cls.title}>Бумага</h2>
            <div className={cls.container}>
                <div className={cls.paperBox}>
                    <Roll className={cls.paperBox__icon} />
                    <div className={cls.descriptionBox}>
                        <h3 className={cls.paperBox__title}>FA</h3>
                        <h4 className={cls.paperBox__subtitle}>Пленка акрил</h4>
                        <div className={cls.editBox}>
                            <data className={cls.editBox__data}>46</data>
                            <EditPenIcon className={cls.editIcon} />
                        </div>
                    </div>
                </div>
                <div className={cls.paperBox}>
                    <Roll className={cls.paperBox__icon} />
                    <div className={cls.descriptionBox}>
                        <h3 className={cls.paperBox__title}>FH</h3>
                        <h4 className={cls.paperBox__subtitle}>Пленка каучук</h4>
                        <div className={cls.editBox}>
                            <data className={cls.editBox__data}>46</data>
                            <EditPenIcon className={cls.editIcon} />
                        </div>
                    </div>
                </div>
                <div className={cls.paperBox}>
                    <Roll className={cls.paperBox__icon} />
                    <div className={cls.descriptionBox}>
                        <h3 className={cls.paperBox__title}>PA</h3>
                        <h4 className={cls.paperBox__subtitle}>Бумага акрил</h4>
                        <div className={cls.editBox}>
                            <data className={cls.editBox__data}>46</data>
                            <EditPenIcon className={cls.editIcon} />
                        </div>
                    </div>
                </div>
                <div className={cls.paperBox}>
                    <Roll className={cls.paperBox__icon} />
                    <div className={cls.descriptionBox}>
                        <h3 className={cls.paperBox__title}>PH</h3>
                        <h4 className={cls.paperBox__subtitle}>Бумага каучук</h4>
                        <div className={cls.editBox}>
                            <data className={cls.editBox__data}>46</data>
                            <EditPenIcon className={cls.editIcon} />
                        </div>
                    </div>
                </div>
                <div className={cls.paperBox}>
                    <Roll className={cls.paperBox__icon} />
                    <div className={cls.descriptionBox}>
                        <h3 className={cls.paperBox__title}>Clear</h3>
                        <h4 className={cls.paperBox__subtitle}>Пленка прозрачная</h4>
                        <div className={cls.editBox}>
                            <data className={cls.editBox__data}>46</data>
                            <EditPenIcon className={cls.editIcon} />
                        </div>
                    </div>
                </div>
                <div className={cls.paperBox}>
                    <Roll className={cls.paperBox__icon} />
                    <div className={cls.descriptionBox}>
                        <h3 className={cls.paperBox__title}>Metall</h3>
                        <h4 className={cls.paperBox__subtitle}>Пленка металлизированная</h4>
                        <div className={cls.editBox}>
                            <data className={cls.editBox__data}>46</data>
                            <EditPenIcon className={cls.editIcon} />
                        </div>
                    </div>
                </div>
                <div className={cls.paperBox}>
                    <Roll className={cls.paperBox__icon} />
                    <div className={cls.descriptionBox}>
                        <h3 className={cls.paperBox__title}>Verge</h3>
                        <h4 className={cls.paperBox__subtitle}>Бумага тиснёная</h4>
                        <div className={cls.editBox}>
                            <data className={cls.editBox__data}>46</data>
                            <EditPenIcon className={cls.editIcon} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaperStockPage;