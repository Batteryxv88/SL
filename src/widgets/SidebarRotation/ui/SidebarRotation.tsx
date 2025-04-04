import cls from './SidebarRotation.module.scss'

const SidebarRotation = () => {
    return (
        <div className={cls.sidebarRotation}>
            <div className={cls.searchContainer}>
                <span className={cls.searchTitle}>Введите размер для поиска формы</span>
                <input type="text" placeholder="Поиск" />
                
            </div>
            <button className={cls.tableButton}>Таблица</button>
            <button className={cls.addFormButton}>
                Добавить форму
            </button>
        </div>
    )
}   

export default SidebarRotation;