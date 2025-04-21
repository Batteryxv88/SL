import { useEffect } from 'react';
import cls from './RotationFormTable.module.scss';
import { useAppDispatch, useAppSelector } from '../../../app/providers/StoreProvider/Store/hooks';
import RotationSizePart from '../../../shared/ui/RotationSizePart/RotationSizePart';
import { RootState } from '../../../app/providers/StoreProvider/Store';
import { fetchForms } from '../../../app/providers/StoreProvider/Store/RotationFormsSlice';
import RotationFormTableSkeleton from './RotationFormTableSkeleton';

const RotationFormTable = () => {
    const dispatch = useAppDispatch();
    const { rotationForms, loading, error } = useAppSelector((state) => state.rotationForms);

    useEffect(() => {
        // Загружаем данные только если их еще нет в хранилище
        if (rotationForms.length === 0 && !loading) {
            dispatch(fetchForms());
        }
    }, [dispatch, rotationForms.length, loading]);

    if (loading) {
        return (
            <div className={cls.rotationFormTable}>
                <div className={cls.nameContainer}>
                    <div className={cls.namesSizes}>
                        <p className={cls.span}>W</p>
                        <p className={cls.span}>H</p>
                    </div>
                    <p className={cls.namesColumns}>Ручьи</p>
                    <p className={cls.namesRows}>Ряды</p>
                    <p className={cls.namesShape}>Форма</p>
                    <p className={cls.namesSizeToDie}>
                        <span className={cls.span}>W</span> к ручью</p>
                    <p className={cls.namesLabel}>Метка</p>
                    <p className={cls.namesHeightWithout1mm}>
                        <span className={cls.span}>H</span> без 1мм</p>
                    <p className={cls.namesMaterial}>Мастериал</p>
                    <p className={cls.namesComment}>Комментарий</p>
                    <p className={cls.namesOrder}>Заказ</p>
                    <p className={cls.namesEdit}>Ред.</p>
                </div>
                <RotationFormTableSkeleton />
            </div>
        );
    }

    if (error) {
        return <div>Ошибка: {error}</div>;
    }

    // Сортируем формы сначала по ширине, а при равной ширине - по высоте
    const sortedForms = [...rotationForms].sort((a, b) => {
        // Если ширина разная, сортируем по ширине
        if (a.width !== b.width) {
            return a.width - b.width;
        }
        // Если ширина одинаковая, сортируем по высоте
        return a.height - b.height;
    });

    return (
        <div className={cls.rotationFormTable}>
            <h2 className={cls.title}>Таблица форм</h2>
            <div className={cls.nameContainer}>
                <div className={cls.namesSizes}>
                    <p className={cls.span}>W</p>
                    <p className={cls.span}>H</p>
                </div>
                <p className={cls.namesColumns}>Ручьи</p>
                <p className={cls.namesRows}>Ряды</p>
                <p className={cls.namesShape}>Форма</p>
                <p className={cls.namesSizeToDie}>
                    <span className={cls.span}>W</span> к ручью</p>
                <p className={cls.namesLabel}>Метка</p>
                <p className={cls.namesHeightWithout1mm}>
                    <span className={cls.span}>H</span> без 1мм</p>
                <p className={cls.namesMaterial}>Мастериал</p>
                <p className={cls.namesComment}>Комментарий</p>
                <p className={cls.namesOrder}>Заказ</p>
                <p className={cls.namesEdit}>Ред.</p>
            </div>
            {sortedForms.map(item => (
                <RotationSizePart key={item.id} {...item} />
            ))}
        </div>
    )
}

export default RotationFormTable;