import cls from "./LaminationStockPage.module.scss";
import RollNarrow from "../../../shared/assets/icons/roll-narrow.svg"
import EditPenIcon from "../../../shared/assets/icons/edit-pen.svg"
import CheckIcon from "../../../shared/assets/icons/check-icon.svg"
import { useLaminations } from "../../../app/providers/StoreProvider/Store/hooks";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { updateLaminationQty } from "../../../services/materials";
import classNames from "classnames";
import { Lamination } from "../../../services/laminations";

const LaminationStockPage = () => {
    const { laminations, isLoading, error } = useLaminations();
    const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
    const [newQty, setNewQty] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const getMaterialQty = useCallback((type: string) => {
        const lamination = laminations.find(l => l.type.toLowerCase() === type.toLowerCase());
        return lamination ? lamination.qty : 0;
    }, [laminations]);

    const getIconClass = useCallback((qty: number) => {
        if (qty <= 3) {
            return cls.low;
        } else if (qty <= 6) {
            return cls.medium;
        } else {
            return cls.high;
        }
    }, []);

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

    const handleEditClick = useCallback((id: string) => {
        setEditingMaterial(id);
        setNewQty(getMaterialQty(id).toString());
    }, [getMaterialQty]);

    const handleSave = useCallback(async (id: string) => {
        try {
            const lamination = laminations.find(l => l.id === id);
            if (lamination && newQty) {
                await updateLaminationQty(lamination.id, parseInt(newQty));
                setEditingMaterial(null);
                setNewQty("");
            }
        } catch (error) {
            console.error('Error updating lamination quantity:', error);
        }
    }, [laminations, newQty]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter') {
            handleSave(id);
        }
    }, [handleSave]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!laminations.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className={cls.PaperStockPage} ref={containerRef}>
            <h2 className={cls.title}>Склад ламинации</h2>
            <div className={cls.container}>
            {laminations.map((lamination: Lamination) => (
                <div key={lamination.id} className={classNames(cls.paperBox, getIconClass(lamination.qty))}>
                <RollNarrow className={cls.paperBox__icon} />
                <div className={cls.descriptionBox}>
                    <h3 className={classNames(cls.paperBox__title, getIconClass(lamination.qty))}>{lamination.type}</h3>
                    <h4 className={cls.paperBox__subtitle}>{lamination.title}</h4>
                    <h5 className={cls.paperBox__subtitle}>{lamination.sub_type}</h5>
                    <div className={cls.editBox}>
                        {editingMaterial === lamination.id ? (
                            <input
                                type="number"
                                value={newQty}
                                onChange={(e) => setNewQty(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, lamination.id)}
                                className={cls.editBox__data}
                                autoFocus
                            />
                        ) : (
                            <data className={cls.editBox__data}>{lamination.qty}</data>
                        )}
                        {editingMaterial === lamination.id ? (
                            <CheckIcon 
                                className={cls.checkIcon} 
                                onClick={() => handleSave(lamination.id)}
                            />
                        ) : (
                            <EditPenIcon 
                                className={cls.editIcon} 
                                onClick={() => handleEditClick(lamination.id)}
                            />
                        )}
                    </div>
                </div>
            </div>
            ))}
            </div>
        </div>
    );
};

export default LaminationStockPage;