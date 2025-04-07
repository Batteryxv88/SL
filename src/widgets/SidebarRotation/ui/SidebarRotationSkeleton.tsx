import cls from './SidebarRotationSkeleton.module.scss';

const SidebarRotationSkeleton = () => {
    // Генерируем несколько строк скелетонов для выпадающего списка
    const items = Array.from({ length: 3 }, (_, index) => (
        <div key={index} className={cls.skeletonDropdownItem}></div>
    ));

    return <>{items}</>;
};

export default SidebarRotationSkeleton; 