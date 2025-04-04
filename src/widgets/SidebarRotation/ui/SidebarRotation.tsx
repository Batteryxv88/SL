import cls from './SidebarRotation.module.scss'

const SidebarRotation = () => {
    return (
        <div className={cls.sidebarRotation}>
            <div className={cls.searchContainer}>
                <span className={cls.searchTitle}>Введите размер для поиска формы</span>
                <input type="text" placeholder="Поиск" />
                
            </div>
            <button>Таблица</button>
        </div>
    )
}   

export default SidebarRotation;