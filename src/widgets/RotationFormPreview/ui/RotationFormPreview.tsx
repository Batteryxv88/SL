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
    
    // If no form is selected yet, default to the first one
    useEffect(() => {
        if (!selectedFormId && rotationForms.length > 0) {
            dispatch(setSelectedFormId(rotationForms[0].id));
        }
    }, [selectedFormId, rotationForms, dispatch]);

    const selectedItem = rotationForms.find(item => item.id === selectedFormId) || 
                        (rotationForms.length > 0 ? rotationForms[0] : null);

    if (!selectedItem) {
        return <div>Элемент не найден</div>;
    }
    
    const calculateWidthAndHeight = (content?: string | number, isSmallText = false) => {
        return (
            <div
                style={{
                    width: '100%',
                    aspectRatio: `${selectedItem.width} / ${selectedItem.height}`,
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
                }}
            >
                {content}
            </div>
        );
    };

    // Стили для сетки
    const gridStyle = {
        gridTemplateColumns: `repeat(${selectedItem.columns}, 1fr)`,
        gridTemplateRows: `repeat(${selectedItem.rows}, 1fr)`
    };
    
    return (
        <div className={cls.gridContainer}>
            <h2 className={cls.title}>Форма для ротации</h2>
            
            <div className={cls.content}>
                <div className={cls.leftColumn}>
                    <div className={cls.selectContainer}>
                        <select
                            value={selectedFormId || ''}
                            onChange={(e) => dispatch(setSelectedFormId(e.target.value))}
                            className={cls.select}
                        >
                            {rotationForms.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.width}×{item.height}, Ручьи: {item.columns}, Ряды: {item.rows}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className={cls.formDetails}>
                        <div className={cls.formDetailItem}>
                            <span className={cls.label}>Ширина:</span>
                            <span className={cls.value}>{selectedItem.width}</span>
                        </div>
                        <div className={cls.formDetailItem}>
                            <span className={cls.label}>Высота:</span>
                            <span className={cls.value}>{selectedItem.height}</span>
                        </div>
                        <div className={cls.formDetailItem}>
                            <span className={cls.label}>Ручьи:</span>
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
                                        <div key={`${rowIndex}-${colIndex}`} style={{ width: '100%', height: '100%' }}>
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