import cls from './HoldersAndKnifesStockPage.module.scss';
import Holder from '../../../shared/assets/icons/holder.svg';
import Knife from '../../../shared/assets/icons/knife.svg';
import EditIcon from '../../../shared/assets/icons/edit-pen.svg';
import CheckIcon from '../../../shared/assets/icons/check-icon.svg';
import { useHoldersAndKnifes } from '../../../app/providers/StoreProvider/Store/hooks';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { updateHolderAndKnifeQty } from '../../../services/holdersAndKnifes';
import LoadingPlug from '../../../shared/ui/LoadingPlug/LoadingPlug';

const HoldersAndKnifesStockPage = () => {
    const { holdersAndKnifes, isLoading, error } = useHoldersAndKnifes();
    const [editingMaterial, setEditingMaterial] = useState<string | null>(null);
    const [newQty, setNewQty] = useState<string>("");
    const containerRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Фильтруем держатели и ножи
    const holders = useMemo(() => 
        holdersAndKnifes.filter(item => item.type === 'holder'), [holdersAndKnifes]
    );
    
    const knifes = useMemo(() => 
        holdersAndKnifes.filter(item => item.type === 'knife'), [holdersAndKnifes]
    );

    // Обработчик клика вне блока - оптимизированный
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            
            // Проверяем, что клик НЕ по инпуту и НЕ по области редактирования
            const isInput = target.tagName === 'INPUT';
            const isEditBox = target.closest(`.${cls.holder__qty_box}`) || target.closest(`.${cls.holder__edit_icon_box}`);
            
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
            }, 15000);
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [editingMaterial]);

    const handleEditClick = useCallback((id: string, currentQty: number) => {
        setEditingMaterial(id);
        setNewQty(currentQty.toString());
    }, []);

    const handleSave = useCallback(async (id: string) => {
        try {
            const material = holdersAndKnifes.find(h => h.id === id);
            if (material && newQty !== "") {
                const qty = parseInt(newQty);
                
                if (!isNaN(qty) && qty >= 0) {
                    await updateHolderAndKnifeQty(material.id, qty);
                    setEditingMaterial(null);
                    setNewQty("");
                }
            }
        } catch (error) {
            console.error('Error updating material quantity:', error);
        }
    }, [holdersAndKnifes, newQty]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent, id: string) => {
        if (e.key === 'Enter') {
            handleSave(id);
        }
    }, [handleSave]);

    const renderItem = useCallback((item: any) => (
        <div key={item.id} className={cls.holder__info}>
            <p className={cls.holder__sub_title}>{item.sub_type === 'new' ? 'Новый' : 'Старый'}</p>
            <div className={cls.holder__qty_box}>
                {editingMaterial === item.id ? (
                    <input
                        type="number"
                        value={newQty}
                        onChange={(e) => setNewQty(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, item.id)}
                        className={cls.holder__qty_input}
                        autoFocus
                    />
                ) : (
                    <p className={cls.holder__qty}>{item.qty}</p>
                )}
                <div className={cls.holder__edit_icon_box}>
                    {editingMaterial === item.id ? (
                        <CheckIcon 
                            className={cls.checkIcon} 
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSave(item.id);
                            }}
                        />
                    ) : (
                        <EditIcon 
                            className={cls.holder__edit_icon} 
                            onClick={() => handleEditClick(item.id, item.qty)}
                        />
                    )}
                </div>
            </div>
        </div>
    ), [editingMaterial, newQty, handleKeyPress, handleSave, handleEditClick]);

    if (isLoading) {
        return <LoadingPlug />
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={cls.HoldersAndKnifesStockPage} ref={containerRef}>
            <h2 className={cls.title}>Склад держателей и ножей</h2>
            <div className={cls.container}>
                <div className={cls.holder}>
                    <Holder className={cls.holder__icon} />
                    <div className={cls.info__container}>
                        <h3 className={cls.holder__title}>Держатели</h3>
                        <div className={cls.map__box}>
                            {holders.map(renderItem)}
                        </div>
                    </div>
                </div>
                <div className={cls.holder}>
                    <Knife className={cls.holder__icon} />
                    <div className={cls.info__container}>
                        <h3 className={cls.holder__title}>Ножи</h3>
                        <div className={cls.map__box}>
                            {knifes.map(renderItem)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HoldersAndKnifesStockPage;   