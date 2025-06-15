import cls from './RotationSizePart.module.scss';
import { RectangleIcon, SquareIcon, CircleIcon, OvalIcon, CustomShapeIcon } from '../../assets/icons/shapes';
import EditPenIcon from '../../assets/icons/edit-pen.svg';
import CheckIcon from '../../assets/icons/check-icon.svg';
import { useState, CSSProperties, useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from '../../../app/providers/StoreProvider/Store/hooks';
import { updateForm } from '../../../app/providers/StoreProvider/Store/RotationFormsSlice';
import { setSelectedFormId } from '../../../app/providers/StoreProvider/Store/SelectedFormSlice';
import { changeRotationModule } from '../../../app/providers/StoreProvider/Store/ChangeRotationModule';

// Глобальная переменная для отслеживания состояния редактирования
// Она не сбрасывается при перерендере компонентов
let isAnyFormBeingEdited = false;

// Списки для выпадающих меню
const SHAPES = ['Прямоугольник', 'Квадрат', 'Круг', 'Овал', 'Фигурная'];
const MARKS = ['5х5 L R', '5х5 R', '4х4 L R', '4х4 R', '3х3 L R', '3х3 R'];
const MATERIALS = ['бумага', 'пленка'];

type RotationSizePartProps = {
    id: number;
    height: number;
    width: number;
    rows: number;
    shape: string;
    size_for_column: number;
    mark: string;
    height_without1: number;
    material: string;
    columns: number;
    comment: string;
    number: number;
}

const RotationSizePart = (props: RotationSizePartProps) => {
    const { id, height, width, rows, shape, size_for_column, mark, height_without1, material, columns, comment, number } = props;

    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Обновляем глобальное состояние редактирования при изменении локального
    useEffect(() => {
        if (isEditing) {
            isAnyFormBeingEdited = true;
        } else if (!isEditing) {
            // Проверяем, нет ли других редактируемых форм
            setTimeout(() => {
                isAnyFormBeingEdited = false;
            }, 0);
        }

        // Очищаем состояние при размонтировании
        return () => {
            if (isEditing) {
                isAnyFormBeingEdited = false;
            }
        };
    }, [isEditing]);

    // Состояния для редактируемых полей
    const [editedHeight, setEditedHeight] = useState(height);
    const [editedWidth, setEditedWidth] = useState(width);
    const [editedRows, setEditedRows] = useState(rows);
    const [editedShape, setEditedShape] = useState(shape);
    const [editedSizeForColumn, setEditedSizeForColumn] = useState(size_for_column);
    const [editedMark, setEditedMark] = useState(mark);
    const [editedHeightWithout1, setEditedHeightWithout1] = useState(height_without1);
    const [editedMaterial, setEditedMaterial] = useState(material);
    const [editedColumns, setEditedColumns] = useState(columns);
    const [editedComment, setEditedComment] = useState(comment);
    const [editedNumber, setEditedNumber] = useState(number);

    // Добавляем рефы для проверки обрезания текста
    const commentRef = useRef<HTMLParagraphElement>(null);
    const [isCommentTruncated, setIsCommentTruncated] = useState(false);

    // Обработчик клика вне блока - оптимизированный для множественных инпутов
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            
            // Проверяем, что клик НЕ по инпуту, селекту или области редактирования
            const isInput = target.tagName === 'INPUT';
            const isSelect = target.tagName === 'SELECT';
            const isEditContainer = target.closest(`.${cls.editContainer}`);
            const isEditableArea = target.closest(`.${cls.RotationSizePart}`) && (isInput || isSelect || isEditContainer);
            
            if (!isEditableArea && containerRef.current && !containerRef.current.contains(target)) {
                setIsEditing(false);
                resetEditedValues();
            }
        };

        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing]);

    // Таймер для автоматического закрытия
    useEffect(() => {
        if (isEditing) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            
            timerRef.current = setTimeout(() => {
                setIsEditing(false);
                resetEditedValues();
            }, 30000); // 30 секунд для множественных полей
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isEditing]);

    const resetEditedValues = useCallback(() => {
        setEditedHeight(height);
        setEditedWidth(width);
        setEditedRows(rows);
        setEditedShape(shape);
        setEditedSizeForColumn(size_for_column);
        setEditedMark(mark);
        setEditedHeightWithout1(height_without1);
        setEditedMaterial(material);
        setEditedColumns(columns);
        setEditedComment(comment);
        setEditedNumber(number);
    }, [height, width, rows, shape, size_for_column, mark, height_without1, material, columns, comment, number]);
    
    // Проверяем, обрезан ли текст при монтировании и изменении comment
    useEffect(() => {
        const checkIfCommentIsTruncated = () => {
            if (commentRef.current) {
                setIsCommentTruncated(
                    commentRef.current.scrollWidth > commentRef.current.clientWidth
                );
            }
        };
        
        checkIfCommentIsTruncated();
        
        // Добавляем проверку при изменении размера окна
        window.addEventListener('resize', checkIfCommentIsTruncated);
        return () => {
            window.removeEventListener('resize', checkIfCommentIsTruncated);
        };
    }, [comment]);

    const getShapeIcon = useCallback(() => {
        switch (shape.toLowerCase()) {
            case 'прямоугольник':
                return <RectangleIcon />;
            case 'квадрат':
                return <SquareIcon />;
            case 'круг':
                return <CircleIcon />;
            case 'овал':
                return <OvalIcon />;
            case 'фигурная':
                return <CustomShapeIcon />;
            default:
                return <RectangleIcon />;
        }
    }, [shape]);

    const handleSaveChanges = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        const updatedData = {
            height: editedHeight,
            width: editedWidth,
            rows: editedRows,
            shape: editedShape,
            size_for_column: editedSizeForColumn,
            mark: editedMark,
            height_without1: editedHeightWithout1,
            material: editedMaterial,
            columns: editedColumns,
            comment: editedComment,
            number: editedNumber
        };

        dispatch(updateForm({ id: id.toString(), updatedData }));
        setIsEditing(false);
        // При сохранении сбрасываем глобальное состояние
        isAnyFormBeingEdited = false;
    }, [dispatch, id, editedHeight, editedWidth, editedRows, editedShape, editedSizeForColumn, editedMark, editedHeightWithout1, editedMaterial, editedColumns, editedComment, editedNumber]);

    // Глобальный обработчик Enter для всего компонента
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleSaveChanges();
            }
        };

        if (isEditing) {
            document.addEventListener('keydown', handleGlobalKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [isEditing, handleSaveChanges]);

    // Обработчик клика для просмотра формы
    const handleRowClick = useCallback(() => {
        // Проверяем, что никакая форма не редактируется в данный момент
        if (!isEditing && !isAnyFormBeingEdited) {
            dispatch(setSelectedFormId(id.toString()));
            dispatch(changeRotationModule('preview'));
        }
    }, [isEditing, dispatch, id]);

    const handleEditClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        // Разрешаем редактирование только если никакая другая форма не редактируется
        if (!isAnyFormBeingEdited) {
            setIsEditing(true);
            resetEditedValues(); // Восстанавливаем текущие значения при начале редактирования
        }
    }, [resetEditedValues]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            handleSaveChanges();
        }
    }, [handleSaveChanges]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            handleSaveChanges();
        }
    }, [handleSaveChanges]);

    // Общий стиль для полей ввода
    const inputStyle: CSSProperties = {
        width: '100%',
        height: '24px',
        padding: '0 4px',
        background: '#2A2A2A',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '4px',
        color: 'rgba(255, 255, 255, 0.87)',
        fontSize: '12px',
        textAlign: 'center'
    };

    // Стили для отдельных полей ввода, соответствующие ширине оригинальных полей
    const getColumnInputStyle = useCallback((): CSSProperties => ({
        ...inputStyle,
        width: '37px'
    }), []);

    const getRowInputStyle = useCallback((): CSSProperties => ({
        ...inputStyle,
        width: '32px'
    }), []);

    const getSizeForColumnInputStyle = useCallback((): CSSProperties => ({
        ...inputStyle,
        width: '72px'
    }), []);

    const getHeightWithout1InputStyle = useCallback((): CSSProperties => ({
        ...inputStyle,
        width: '65px'
    }), []);

    const getCommentInputStyle = useCallback((): CSSProperties => ({
        ...inputStyle,
        width: '190px'
    }), []);

    const getOrderInputStyle = useCallback((): CSSProperties => ({
        ...inputStyle,
        width: '40px'
    }), []);

    const getSelectMaterialStyle = useCallback((): CSSProperties => ({
        ...inputStyle,
        width: '68px',
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23BB86FC%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 4px center',
        backgroundSize: '8px',
        paddingRight: '14px'
    }), []);

    const getSelectMarkStyle = useCallback((): CSSProperties => ({
        ...inputStyle,
        width: '48px',
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23BB86FC%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 4px center',
        backgroundSize: '8px',
        paddingRight: '14px'
    }), []);

    const getSelectShapeStyle = useCallback((): CSSProperties => ({
        ...inputStyle,
        width: '42px',
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23BB86FC%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 4px center',
        backgroundSize: '8px',
        paddingRight: '14px'
    }), []);

    // Добавляем стиль для полей ввода размеров
    const getSizeInputStyle = useCallback((): CSSProperties => ({
        ...inputStyle,
        width: '30px'
    }), []);

    return (
        <div
            ref={containerRef}
            className={cls.RotationSizePart}
            onClick={handleRowClick}
            style={{
                cursor: isEditing || isAnyFormBeingEdited ? 'default' : 'pointer',
                // Добавляем визуальную индикацию, если форма не может быть открыта для просмотра
                opacity: isAnyFormBeingEdited && !isEditing ? 0.7 : 1
            }}
        >
            <div className={cls.sizesContainer}>
                {isEditing ? (
                    <>
                        <input
                            type="number"
                            value={editedWidth}
                            onChange={(e) => setEditedWidth(Number(e.target.value))}
                            style={getSizeInputStyle()}
                            onKeyPress={handleKeyPress}
                        />
                        <span>×</span>
                        <input
                            type="number"
                            value={editedHeight}
                            onChange={(e) => setEditedHeight(Number(e.target.value))}
                            style={getSizeInputStyle()}
                            onKeyPress={handleKeyPress}
                        />
                    </>
                ) : (
                    <>
                        <p className={cls.name}>{width}</p>
                        <span>×</span>
                        <p className={cls.name}>{height}</p>
                        
                        
                    </>
                )}
            </div>
            {isEditing ? (
                <div className={cls.nameColumns}>
                    <input
                        type="number"
                        value={editedColumns}
                        onChange={(e) => setEditedColumns(Number(e.target.value))}
                        style={getColumnInputStyle()}
                        onKeyPress={handleKeyPress}
                    />
                </div>
            ) : (
                <p className={cls.nameColumns}>{columns}</p>
            )}

            {isEditing ? (
                <div className={cls.nameRows}>
                    <input
                        type="number"
                        value={editedRows}
                        onChange={(e) => setEditedRows(Number(e.target.value))}
                        style={getRowInputStyle()}
                        onKeyPress={handleKeyPress}
                    />
                </div>
            ) : (
                <p className={cls.nameRows}>{rows}</p>
            )}

            {isEditing ? (
                <div className={cls.nameShape}>
                    <select
                        value={editedShape}
                        onChange={(e) => setEditedShape(e.target.value)}
                        style={getSelectShapeStyle()}
                        onKeyDown={handleKeyDown}
                    >
                        {SHAPES.map(shapeOption => (
                            <option key={shapeOption} value={shapeOption}>{shapeOption}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <div className={cls.nameShape}>
                    {getShapeIcon()}
                </div>
            )}

            {isEditing ? (
                <div className={cls.namesSizeToDie}>
                    <input
                        type="number"
                        value={editedSizeForColumn}
                        onChange={(e) => setEditedSizeForColumn(Number(e.target.value))}
                        style={getSizeForColumnInputStyle()}
                        onKeyPress={handleKeyPress}
                    />
                </div>
            ) : (
                <p className={cls.namesSizeToDie}>{size_for_column}</p>
            )}

            {isEditing ? (
                <div className={cls.namesLabel}>
                    <select
                        value={editedMark}
                        onChange={(e) => setEditedMark(e.target.value)}
                        style={getSelectMarkStyle()}
                        onKeyDown={handleKeyDown}
                    >
                        {MARKS.map(markOption => (
                            <option key={markOption} value={markOption}>{markOption}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <p className={cls.namesLabel}>{mark}</p>
            )}

            {isEditing ? (
                <div className={cls.heightWithout1mm}>
                    <input
                        type="number"
                        value={editedHeightWithout1}
                        onChange={(e) => setEditedHeightWithout1(Number(e.target.value))}
                        style={getHeightWithout1InputStyle()}
                        onKeyPress={handleKeyPress}
                    />
                </div>
            ) : (
                <p className={cls.heightWithout1mm}>{height_without1}</p>
            )}

            {isEditing ? (
                <div className={cls.nameMaterial}>
                    <select
                        value={editedMaterial}
                        onChange={(e) => setEditedMaterial(e.target.value)}
                        style={getSelectMaterialStyle()}
                        onKeyDown={handleKeyDown}
                    >
                        {MATERIALS.map(materialOption => (
                            <option key={materialOption} value={materialOption}>{materialOption}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <p className={cls.nameMaterial}>{material}</p>
            )}

            {isEditing ? (
                <div className={cls.nameComment}>
                    <input
                        type="text"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                        style={getCommentInputStyle()}
                        onKeyPress={handleKeyPress}
                    />
                </div>
            ) : (
                <div className={cls.nameCommentWrapper}>
                    <p 
                        ref={commentRef} 
                        className={cls.nameComment} 
                        title=""  /* Убираем стандартный тултип */
                    >
                        {comment}
                    </p>
                    {isCommentTruncated && (
                        <div className={cls.commentTooltip}>
                            {comment}
                        </div>
                    )}
                </div>
            )}

            {isEditing ? (
                <div className={cls.namesOrder}>
                    <input
                        type="number"
                        value={editedNumber}
                        onChange={(e) => setEditedNumber(Number(e.target.value))}
                        style={getOrderInputStyle()}
                        onKeyPress={handleKeyPress}
                    />
                </div>
            ) : (
                <p className={cls.namesOrder}>{number}</p>
            )}

            <div className={cls.editContainer}>
                {isEditing ? (
                    <CheckIcon
                        className={cls.editPenIcon}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveChanges();
                        }}
                    />
                ) : (
                    <EditPenIcon
                        className={cls.editPenIcon}
                        onClick={handleEditClick}
                    />
                )}
            </div>
        </div>
    );
};

export default RotationSizePart;