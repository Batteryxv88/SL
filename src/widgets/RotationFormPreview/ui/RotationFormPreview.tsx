import { useState, useEffect } from 'react';
import cls from './RotationFormPreview.module.scss';
import { RootState } from '../../../app/providers/StoreProvider/Store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../app/providers/StoreProvider/Store/hooks';
import { setSelectedFormId } from '../../../app/providers/StoreProvider/Store/SelectedFormSlice';

const RotationFormPreview = () => {
    const dispatch = useAppDispatch();
    const rotationForms = useSelector((state: RootState) => state.rotationForms.rotationForms);
    const selectedFormId = useSelector((state: RootState) => state.selectedForm.selectedFormId);
    
    // Sort forms by width then height to match RotationFormTable
    const sortedForms = [...rotationForms].sort((a, b) => {
        if (a.width !== b.width) {
            return a.width - b.width;
        }
        return a.height - b.height;
    });

    // If no form is selected yet, default to the first one
    useEffect(() => {
        if (!selectedFormId && sortedForms.length > 0) {
            dispatch(setSelectedFormId(sortedForms[0].id));
        }
    }, [selectedFormId, rotationForms, dispatch]);

    const selectedItem = rotationForms.find(item => item.id === selectedFormId) ||
                        (sortedForms.length > 0 ? sortedForms[0] : null);

    // Add navigation logic for previous/next functionality
    const currentIndex = sortedForms.findIndex(item => item.id === selectedFormId);
    const prevForm = currentIndex > 0 ? sortedForms[currentIndex - 1] : null;
    const nextForm = currentIndex >= 0 && currentIndex < sortedForms.length - 1 ? sortedForms[currentIndex + 1] : null;
    const handlePrev = () => { if (prevForm) dispatch(setSelectedFormId(prevForm.id)); };
    const handleNext = () => { if (nextForm) dispatch(setSelectedFormId(nextForm.id)); };

    // SVG icons for navigation arrows
    const arrowLeftIcon = (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
    const arrowRightIcon = (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );

    if (!selectedItem) {
        return <div>Элемент не найден</div>;
    }
    
    // Реальные размеры формы в мм
    const FORM_WIDTH_MM = 284;
    const FORM_HEIGHT_MM = 478;
    
    // Междуэтикеточное расстояние в мм
    const GAP_SIZE_MM = 3;
    
    // Вычисляем полную ширину и высоту всей сетки в мм, с учетом междуэтикеточных расстояний
    const gridFullWidthMM = (selectedItem.columns * selectedItem.width) + (GAP_SIZE_MM * (selectedItem.columns - 1));
    const gridFullHeightMM = (selectedItem.rows * selectedItem.height) + (GAP_SIZE_MM * (selectedItem.rows - 1));
    
    // Проверяем, превышает ли сетка доступный размер формы
    const isOverflowWidth = gridFullWidthMM > FORM_WIDTH_MM;
    const isOverflowHeight = gridFullHeightMM > FORM_HEIGHT_MM;
    
    // Вычисляем масштаб, если сетка не помещается в форму
    const scaleX = isOverflowWidth ? FORM_WIDTH_MM / gridFullWidthMM : 1;
    const scaleY = isOverflowHeight ? FORM_HEIGHT_MM / gridFullHeightMM : 1;
    const scale = Math.min(scaleX, scaleY);
    
    // Для случаев, когда масштаб меньше 1, предупреждаем пользователя
    const showScaleWarning = scale < 1;
    
    // Используем фиксированное значение отступа в 3мм
    const gapSizeMM = GAP_SIZE_MM;
    // Преобразуем его в проценты от размера формы для CSS
    const gapSizePercent = (gapSizeMM / Math.max(FORM_WIDTH_MM, FORM_HEIGHT_MM)) * 100 * scale;
    
    // Общая ширина и высота сетки с учетом масштаба
    const totalGridWidthPercent = Math.min(95, (gridFullWidthMM / FORM_WIDTH_MM) * 100 * scale);
    const totalGridHeightPercent = Math.min(95, (gridFullHeightMM / FORM_HEIGHT_MM) * 100 * scale);

    
    // Стили для сетки с учетом реальных размеров и отступов
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${selectedItem.columns}, 1fr)`,
        gridTemplateRows: `repeat(${selectedItem.rows}, 1fr)`,
        gap: `${gapSizePercent}%`,
        width: `${totalGridWidthPercent - 5}%`,
        height: `${totalGridHeightPercent - 5}%`,
        alignItems: 'flex-start',
        justifyContent: 'center',
    };
    
    // Функция для отображения ячейки с информацией с точным отражением междуэтикеточных расстояний
    const calculateWidthAndHeight = (content?: string | number, isSmallText = false) => {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    border: '2px solid #BB86FC',
                    borderRadius: '3px',
                    background: '#2A2A2A',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.87)',
                    fontSize: isSmallText ? '10px' : '14px',
                    lineHeight: isSmallText ? '10px' : '14px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    padding: isSmallText ? '2px' : '0',
                    boxSizing: 'border-box',
                }}
            >
                {content}
            </div>
        );
    };
    
    return (
        <div className={cls.gridContainer}>
            <h2 className={cls.title}>Предварительный вид формы</h2>
            
            <div className={cls.content}>
                <div className={cls.leftColumn}>
                    <div className={`${cls.selectContainer} ${cls.navControls}`}>
                        <button onClick={handlePrev} disabled={!prevForm} className={cls.navButton}>
                            {arrowLeftIcon}
                        </button>
                        <select
                            value={selectedFormId || ''}
                            onChange={(e) => dispatch(setSelectedFormId(e.target.value))}
                            className={cls.select}
                        >
                            {sortedForms.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.width}×{item.height}, Ручьи: {item.columns}, Ряды: {item.rows}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleNext} disabled={!nextForm} className={cls.navButton}>
                            {arrowRightIcon}
                        </button>
                    </div>
                    
                    <div className={cls.formDetails}>
                        <div className={cls.formDetailItem}>
                            <span className={cls.label}>Размер этикетки:</span>
                            <span className={cls.value}>{selectedItem.width} × {selectedItem.height} мм</span>
                        </div>
                        <div className={cls.formDetailItem}>
                            <span className={cls.label}>Ручьи (колонки):</span>
                            <span className={cls.value}>{selectedItem.columns}</span>
                        </div>
                        <div className={cls.formDetailItem}>
                            <span className={cls.label}>Ряды:</span>
                            <span className={cls.value}>{selectedItem.rows}</span>
                        </div>
                        <div className={cls.formDetailItem}>
                            <span className={cls.label}>Всего мест:</span>
                            <span className={cls.value}>{selectedItem.columns * selectedItem.rows}</span>
                        </div>
                        <div className={cls.formDetailItem}>
                            <span className={cls.label}>Размер формы:</span>
                            <span className={cls.value}>{FORM_WIDTH_MM} × {FORM_HEIGHT_MM} мм</span>
                        </div>
                    </div>
                </div>
                
                <div className={cls.rightColumn}>
                    <div className={cls.gridBox}>
                        <div
                            className={cls.grid}
                            style={gridStyle}
                        >
                            {[...Array(selectedItem.rows)].map((_, rowIndex) => (
                                [...Array(selectedItem.columns)].map((_, colIndex) => {
                                    const isTopRow = rowIndex === 0;
                                    const isLeftColumn = colIndex === 0;
                                    const isBottomRight = rowIndex === selectedItem.rows - 1 && colIndex === selectedItem.columns - 1;

                                    return (
                                        <div 
                                            key={`${rowIndex}-${colIndex}`} 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%',
                                                aspectRatio: `${selectedItem.width} / ${selectedItem.height}`
                                            }}
                                        >
                                            {isTopRow
                                                ? calculateWidthAndHeight(colIndex + 1) // Номера столбцов
                                                : isLeftColumn
                                                    ? calculateWidthAndHeight(rowIndex + 1) // Номера строк
                                                    : isBottomRight
                                                        ? calculateWidthAndHeight(`${selectedItem.width} × ${selectedItem.height}`, true) // Размер в нижней правой ячейке (с меньшим шрифтом)
                                                        : calculateWidthAndHeight() // Обычная ячейка
                                            }
                                        </div>
                                    );
                                })
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RotationFormPreview;