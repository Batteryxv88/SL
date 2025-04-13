import cls from "./PaperStockPage.module.scss";
import Roll from "../../../shared/assets/icons/roll.svg"
import EditPenIcon from "../../../shared/assets/icons/edit-pen.svg"
import CheckIcon from "../../../shared/assets/icons/check-icon.svg"
import { useMaterials } from "../../../app/providers/StoreProvider/Store/hooks";
import { useState, useEffect, useRef } from "react";
import { updateMaterialQty } from "../../../services/materials";

const PaperStockPage = () => {
    const { materials, isLoading } = useMaterials();
    const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
    const [newQty, setNewQty] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const getMaterialQty = (type: string) => {
        const material = materials.find(m => m.type.toLowerCase() === type.toLowerCase());
        return material ? material.qty : 0;
    };

    // Обработчик клика вне блока
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

    const handleEditClick = (type: string) => {
        setEditingMaterial(type);
        setNewQty(getMaterialQty(type).toString());
    };

    const handleSave = async (type: string) => {
        const material = materials.find(m => m.type.toLowerCase() === type.toLowerCase());
        if (material && newQty) {
            await updateMaterialQty(material.id, parseInt(newQty));
            setEditingMaterial(null);
            setNewQty("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent, type: string) => {
        if (e.key === 'Enter') {
            handleSave(type);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const renderMaterialBox = (type: string, title: string, subtitle: string) => {
        const isEditing = editingMaterial === type;

        return (
            <div className={cls.paperBox}>
                <Roll className={cls.paperBox__icon} />
                <div className={cls.descriptionBox}>
                    <h3 className={cls.paperBox__title}>{title}</h3>
                    <h4 className={cls.paperBox__subtitle}>{subtitle}</h4>
                    <div className={cls.editBox}>
                        {isEditing ? (
                            <input
                                type="number"
                                value={newQty}
                                onChange={(e) => setNewQty(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, type)}
                                className={cls.editBox__data}
                                autoFocus
                            />
                        ) : (
                            <data className={cls.editBox__data}>{getMaterialQty(type)}</data>
                        )}
                        {isEditing ? (
                            <CheckIcon 
                                className={cls.editIcon} 
                                onClick={() => handleSave(type)}
                            />
                        ) : (
                            <EditPenIcon 
                                className={cls.editIcon} 
                                onClick={() => handleEditClick(type)}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={cls.PaperStockPage} ref={containerRef}>
            <h2 className={cls.title}>Бумага</h2>
            <div className={cls.container}>
                {renderMaterialBox('FA', 'FA', 'Пленка акрил')}
                {renderMaterialBox('FH', 'FH', 'Пленка каучук')}
                {renderMaterialBox('PA', 'PA', 'Бумага акрил')}
                {renderMaterialBox('PH', 'PH', 'Бумага каучук')}
                {renderMaterialBox('clear', 'Clear', 'Пленка прозрачная')}
                {renderMaterialBox('metall', 'Metall', 'Пленка металлизированная')}
                {renderMaterialBox('verge', 'Verge', 'Бумага тиснёная')}
            </div>
        </div>
    );
};

export default PaperStockPage;