import cls from './SidebarRotation.module.scss'
import { useState, useEffect, useRef } from 'react';
import AddRotationForm from '../../../features/ui/AddRotationForm/AddRotationForm';
import { useAppSelector, useAppDispatch } from '../../../app/providers/StoreProvider/Store/hooks';
import { RootState } from '../../../app/providers/StoreProvider/Store';
import { fetchForms } from '../../../app/providers/StoreProvider/Store/RotationFormsSlice';
import { changeRotationModule } from '../../../app/providers/StoreProvider/Store/ChangeRotationModule';
import { setSelectedFormId } from '../../../app/providers/StoreProvider/Store/SelectedFormSlice';

const SidebarRotation = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const dispatch = useAppDispatch();
    
    const { rotationForms, loading } = useAppSelector((state: RootState) => state.rotationForms);

    useEffect(() => {
        dispatch(fetchForms());
    }, [dispatch]);

    // Фильтруем формы на основе запроса поиска (по ширине или высоте)
    const filteredForms = rotationForms.filter(form => {
        const query = searchQuery.trim();
        if (!query) return false;
        
        const searchNumber = parseInt(query);
        if (isNaN(searchNumber)) return false;

        return form.width === searchNumber || form.height === searchNumber;
    });

    // Обработчик ввода в поле поиска
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value.trim()) {
            setIsDropdownOpen(true);
        } else {
            setIsDropdownOpen(false);
        }
    };

    // Обработчик выбора формы из списка
    const handleSelectForm = (formId: string) => {
        // Переключаемся на вид предпросмотра и устанавливаем выбранную форму
        dispatch(changeRotationModule('preview'));
        dispatch(setSelectedFormId(formId));
        setIsDropdownOpen(false);
        setSearchQuery(''); // Очищаем поле поиска
    };

    // Переключение на вид таблицы
    const handleTableView = () => {
        dispatch(changeRotationModule('table'));
    };

    // Обработчик клика вне выпадающего списка для его закрытия
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={cls.sidebarRotation}>
            <div className={cls.searchContainer}>
                <span className={cls.searchTitle}>Введите размер для поиска формы</span>
                <div className={cls.searchInputContainer}>
                    <input 
                        type="text" 
                        placeholder="Поиск по размеру" 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
                        ref={inputRef}
                        className={cls.searchInput}
                    />
                    
                    {isDropdownOpen && (
                        <div className={cls.searchDropdown} ref={dropdownRef}>
                            {loading ? (
                                <div className={cls.searchDropdownItem}>Загрузка...</div>
                            ) : filteredForms.length > 0 ? (
                                filteredForms.map(form => (
                                    <div 
                                        key={form.id} 
                                        className={cls.searchDropdownItem}
                                        onClick={() => handleSelectForm(form.id)}
                                    >
                                        {form.width}×{form.height}, ручьи: {form.columns}, ряды: {form.rows}
                                    </div>
                                ))
                            ) : searchQuery.trim() ? (
                                <div className={cls.searchDropdownItem}>Формы не найдены</div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
            <button 
                className={cls.tableButton}
                onClick={handleTableView}
            >
                Таблица
            </button>
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