import cls from './SidebarRotation.module.scss'
import { useState } from 'react';
import AddRotationForm from '../../../features/ui/AddRotationForm/AddRotationForm';

const SidebarRotation = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={cls.sidebarRotation}>
            <div className={cls.searchContainer}>
                <span className={cls.searchTitle}>Введите размер для поиска формы</span>
                <input type="text" placeholder="Поиск" />
                
            </div>
            <button className={cls.tableButton}>Таблица</button>
            <button 
                className={cls.addFormButton}
                onClick={() => setIsModalOpen(true)}
            >
                Добавить форму
            </button>
            <AddRotationForm 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    )
}   

export default SidebarRotation;