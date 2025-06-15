import cls from "./PaperStockPage.module.scss";
import Roll from "../../../shared/assets/icons/roll.svg"
import RollNarrow from "../../../shared/assets/icons/roll-narrow.svg"
import EditPenIcon from "../../../shared/assets/icons/edit-pen.svg"
import CheckIcon from "../../../shared/assets/icons/check-icon.svg"
import { useMaterials } from "../../../app/providers/StoreProvider/Store/hooks";
import { useState, useEffect, useRef, useCallback } from "react";
import { updateMaterialQty } from "../../../services/materials";
import classNames from "classnames";
import LoadingPlug from "../../../shared/ui/LoadingPlug/LoadingPlug";

const PaperStockPage = () => {
    const { materials, isLoading } = useMaterials();
    const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
    const [newQty, setNewQty] = useState<string>("");
    const [isDefectiveExpanded, setIsDefectiveExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const getMaterialQty = useCallback((type: string, status: string) => {
        const material = materials.find(m =>
            m.type.toLowerCase() === type.toLowerCase() &&
            m.status === status
        );
        return material ? material.qty : 0;
    }, [materials]);

    // Добавляем функцию для получения материала по комбинированному ID
    const getMaterialByComboId = useCallback((comboId: string) => {
        const [type, status] = comboId.split('-');
        const material = materials.find(m =>
            m.type.toLowerCase() === type.toLowerCase() &&
            m.status === status
        );
        return material;
    }, [materials]);

    const getIconClass = useCallback((qty: number, status: string) => {
        if (status === 'defective') {
            return cls.medium; // Для бракованных материалов всегда используем средний класс
        }

        if (qty <= 3) {
            return cls.low;
        } else if (qty <= 6) {
            return cls.medium;
        } else {
            return cls.high;
        }
    }, []);

    // Обработчик клика вне блока - упрощенный
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            
            // Проверяем, что клик НЕ по инпуту и НЕ по области редактирования
            const isInput = target.tagName === 'INPUT';
            const isEditBox = target.closest(`.${cls.editBox}`);
            
            if (!isInput && !isEditBox) {
                setEditingMaterial(null);
                setNewQty("");
            }
        };

        if (editingMaterial) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingMaterial]);

    // Таймер для автоматического закрытия
    useEffect(() => {
        if (editingMaterial) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                setEditingMaterial(null);
                setNewQty("");
            }, 15000); // 15 секунд
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [editingMaterial]);

    const handleEditClick = useCallback((type: string, status: string) => {
        const comboId = `${type}-${status}`;
        setEditingMaterial(comboId);
        setNewQty(getMaterialQty(type, status).toString());
    }, [getMaterialQty]);

    const handleSave = useCallback(async (type: string, status: string) => {
        try {
            const material = materials.find(m =>
                m.type.toLowerCase() === type.toLowerCase() &&
                m.status === status
            );
            
            if (material && newQty !== "") {
                const qty = parseInt(newQty);
                
                if (!isNaN(qty) && qty >= 0) {
                    await updateMaterialQty(material.id, qty);
                    setEditingMaterial(null);
                    setNewQty("");
                }
            }
        } catch (error) {
            console.error('Error updating material quantity:', error);
        }
    }, [materials, newQty]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent, type: string, status: string) => {
        if (e.key === 'Enter') {
            handleSave(type, status);
        }
    }, [handleSave]);

    if (isLoading) {
        return <LoadingPlug />;
    }

    const renderMaterialBox = (type: string, title: string, subtitle: string, status: string) => {
        const isEditing = editingMaterial === `${type}-${status}`;
        const qty = getMaterialQty(type, status);
        const iconClass = getIconClass(qty, status);

        return (
            <div className={classNames(cls.paperBox, iconClass)}>
                <Roll className={cls.paperBox__icon} />
                <div className={cls.descriptionBox}>
                    <h3 className={classNames(cls.paperBox__title, iconClass)}>{title}</h3>
                    <h4 className={cls.paperBox__subtitle}>{subtitle}</h4>
                    <div className={cls.editBox}>
                        {isEditing ? (
                            <input
                                type="number"
                                value={newQty}
                                onChange={(e) => setNewQty(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, type, status)}
                                className={cls.editBox__data}
                                autoFocus
                            />
                        ) : (
                            <data className={cls.editBox__data}>{qty}</data>
                        )}
                        {isEditing ? (
                            <CheckIcon
                                className={cls.checkIcon}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSave(type, status);
                                }}
                            />
                        ) : (
                            <EditPenIcon
                                className={cls.editIcon}
                                onClick={() => handleEditClick(type, status)}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={cls.PaperStockPage} ref={containerRef}>
            <h2 className={cls.title}>Склад бумаги</h2>
            <div className={cls.columnsContainer}>
                <div className={cls.column}>
                    <div className={cls.materialBox}>
                        <h3 className={cls.materialBox__title}>Основной склад</h3>
                        <div className={cls.container}>
                            {renderMaterialBox('FA', 'FA', 'Пленка акрил', 'new')}
                            {renderMaterialBox('FH', 'FH', 'Пленка каучук', 'new')}
                            {renderMaterialBox('PA', 'PA', 'Бумага акрил', 'new')}
                            {renderMaterialBox('PH', 'PH', 'Бумага каучук', 'new')}
                            {renderMaterialBox('clear', 'Clear', 'Пленка прозрачная', 'new')}
                            {renderMaterialBox('metall', 'Metall', 'Пленка металлизированная', 'new')}
                            {renderMaterialBox('verge', 'Verge', 'Бумага тиснёная', 'new')}
                        </div>
                    </div>
                </div>
                <div className={classNames(cls.column, { [cls.expanded]: isDefectiveExpanded })}>
                    <div className={cls.materialBox}>
                        <h3 
                            className={cls.materialBox__title}
                            onClick={() => setIsDefectiveExpanded(!isDefectiveExpanded)}
                        >
                            Брак
                            <span className={cls.expandArrow}></span>
                        </h3>
                        <div className={cls.container}>
                            {renderMaterialBox('FA', 'FA', 'Пленка акрил', 'defective')}
                            {renderMaterialBox('FH', 'FH', 'Пленка каучук', 'defective')}
                            {renderMaterialBox('PA', 'PA', 'Бумага акрил', 'defective')}
                            {renderMaterialBox('PH', 'PH', 'Бумага каучук', 'defective')}
                            {renderMaterialBox('clear', 'Clear', 'Пленка прозрачная', 'defective')}
                            {renderMaterialBox('metall', 'Metall', 'Пленка металлизированная', 'defective')}
                            {renderMaterialBox('verge', 'Verge', 'Бумага тиснёная', 'defective')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaperStockPage;