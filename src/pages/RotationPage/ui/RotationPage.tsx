import cls from './RotationPage.module.scss';
import { useState } from 'react';

interface RotationPageProps {
    className?: string;
}

const data = [
    {
        id: 1,
        height: 25,
        width: 25,
        columns: 8,
        shape: "прямоугольник",
        size_for_column: 12,
        mark: "метка 5х5 с обеих сторон",
        height_without1: 231,
        material: "бумага",
        rows: 8,
        comment: "УАИ СИ, кругление 1, 1/2 шт",
        number: 32661
    },
    {
        id: 2,
        height: 12,
        width: 25,
        columns: 10,
        shape: "прямоугольник",
        size_for_column: 12,
        mark: "метка 5х5 с обеих сторон",
        height_without1: 275,
        material: "плёнка",
        rows: 4,
        comment: "скругление 2 ЗАКАЗ РТБ",
        number: 98336
    },
    {
        id: 3,
        height: 16,
        width: 45,
        columns: 12,
        shape: "прямоугольник",
        size_for_column: 16,
        mark: "метка 5х5 с обеих сторон",
        height_without1: 342,
        material: "плёнка",
        rows: 7,
        comment: "",
        number: 82711
    },
    {
        id: 4,
        height: 148,
        width: 210,
        rows: 2,
        shape: "прямоугольник",
        size_for_column: 148,
        mark: "метка 5х5 с обеих сторон",
        height_without1: 427,
        material: "плёнка",
        columns: 2,
        comment: "",
        number: 84367
    }
];

const RotationPage = ({ className }: RotationPageProps) => {
    const [selectedId, setSelectedId] = useState<number>(3);

    const selectedItem = data.find(item => item.id === selectedId);

    if (!selectedItem) {
        return <div>Элемент не найден</div>;
    }

    const calculateWidthAndHeight = () => {
        return (
            <div 
                style={{ 
                    width: '100%',
                    height: '100%',
                    aspectRatio: `${selectedItem.width} / ${selectedItem.height}`,
                    border: '2px solid #BB86FC',
                    borderRadius: '3px',
                    background: '#2A2A2A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255, 255, 255, 0.87)',
                    fontSize: '14px',
                    minWidth: '20px',
                    minHeight: '20px'
                }}
            >
                {selectedItem.number}
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
                    {data.map(item => (
                        <option key={item.id} value={item.id}>
                            ID: {item.id} - {item.number}
                        </option>
                    ))}
                </select>
            </div>
            <div 
                className={cls.grid} 
                style={{
                    gridTemplateColumns: `repeat(${selectedItem.columns}, 1fr)`,
                    gridTemplateRows: `repeat(${selectedItem.rows}, 1fr)`
                }}
            >
                {[...Array(selectedItem.columns * selectedItem.rows)].map((_, index) => (
                    <div key={index} style={{ width: '100%', height: '100%' }}>
                        {calculateWidthAndHeight()}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RotationPage;