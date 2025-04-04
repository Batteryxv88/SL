import cls from './RotationFormTable.module.scss';

const RotationFormTable = () => {
    return (
        <div className={cls.rotationFormTable}>
            <div className={cls.nameContainer}>
                <div className={cls.namesSizes}>
                    <p className={cls.namesSizesItem}>Высота</p>
                    <p className={cls.namesSizesItem}>Ширина</p>
                </div>
                <p className={cls.namesColumns}>Ручьи</p>
                <p className={cls.namesRows}>Ряды</p>
                <p className={cls.namesShape}>Форма</p>
                <p className={cls.namesSizeToDie}>Размер к ручью</p>
                <p className={cls.namesLabel}>Метка</p>
                <p className={cls.namesHeightWithout1mm}>Высота без 1мм</p>
                <p className={cls.namesMaterial}>Мастериал</p>
                <p className={cls.namesComment}>Комментарий</p>
                <p className={cls.namesOrder}>Заказ</p>
            </div>
        </div>
    )
}

export default RotationFormTable;