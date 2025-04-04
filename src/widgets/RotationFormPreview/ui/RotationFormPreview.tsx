import { useState } from 'react';
import cls from './RotationFormPreview.module.scss';
import { RootState } from '../../../app/providers/StoreProvider/Store';
import { useSelector } from 'react-redux';

const RotationFormPreview = () => {

    const rotationForms = useSelector((state: RootState) => state.rotationForms.rotationForms);
    
    const [selectedId, setSelectedId] = useState<number>(3);

    const selectedItem = rotationForms.find(item => item.id === selectedId);

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
                    flexDirection: 'column', // Размещаем текст вертикально
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.87)',
                    fontSize: isSmallText ? '10px' : '14px', // Уменьшенный шрифт для размеров
                    lineHeight: isSmallText ? '10px' : '14px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    whiteSpace: 'pre-wrap', // Позволяет переносить текст
                    wordBreak: 'break-word', // Гарантирует перенос длинных слов
                    padding: isSmallText ? '2px' : '0', // Отступ для читаемости
                }}
            >
                {content}
            </div>
        );
    };

    return (
        <div className={cls.gridContainer}>
            <div className={cls.selectContainer}>
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(Number(e.target.value))}
                    className={cls.select}
                >
                    {rotationForms.map(item => (
                        <option key={item.id} value={item.id}>
                            ID: {item.id} - {item.number}
                        </option>
                    ))}
                </select>
            </div>
    
            <div className={cls.gridBox}>
                <div
                    className={cls.grid}
                    style={{
                        gridTemplateColumns: `repeat(${selectedItem.columns}, 1fr)`,
                        gridTemplateRows: `repeat(${selectedItem.rows}, 1fr)`
                    }}
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
    );
}

export default RotationFormPreview;