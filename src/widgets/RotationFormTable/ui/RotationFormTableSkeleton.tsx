import cls from './RotationFormTableSkeleton.module.scss';

const RotationFormTableSkeleton = () => {
    // Генерируем 10 строк скелетона
    const rows = Array.from({ length: 10 }, (_, index) => (
        <div key={index} className={cls.skeletonRow}>
            <div className={`${cls.skeletonCell} ${cls.sizesContainer}`}></div>
            <div className={`${cls.skeletonCell} ${cls.nameColumns}`}></div>
            <div className={`${cls.skeletonCell} ${cls.nameRows}`}></div>
            <div className={`${cls.skeletonCell} ${cls.nameShape}`}></div>
            <div className={`${cls.skeletonCell} ${cls.namesSizeToDie}`}></div>
            <div className={`${cls.skeletonCell} ${cls.namesLabel}`}></div>
            <div className={`${cls.skeletonCell} ${cls.heightWithout1mm}`}></div>
            <div className={`${cls.skeletonCell} ${cls.nameMaterial}`}></div>
            <div className={`${cls.skeletonCell} ${cls.nameComment}`}></div>
            <div className={`${cls.skeletonCell} ${cls.namesOrder}`}></div>
            <div className={`${cls.skeletonCell} ${cls.editContainer}`}></div>
        </div>
    ));

    return (
        <div>
            {rows}
        </div>
    );
};

export default RotationFormTableSkeleton; 