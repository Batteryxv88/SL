import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/providers/StoreProvider/Store/hooks';
import { setShowModal, setReminderPostponed, incrementStreak, resetStreak } from '../../../app/providers/StoreProvider/Store/InventoryCheckSlice';
import { updateInventoryCheck, fetchLastInventoryCheck } from '../../../app/providers/StoreProvider/Store/InventoryCheckSlice';
import { updateToner, fetchTonersStorage } from '../../../app/providers/StoreProvider/Store/TonersStorageSlice';
import { getStreakEmoji } from '../../../shared/lib/utils/inventoryCheck';
import cls from './InventoryModal.module.scss';

type TonerColor = 'C' | 'M' | 'Y' | 'K';
type TonerQuantities = Record<TonerColor, string>;

const InventoryModal = () => {
    const dispatch = useAppDispatch();
    const { showModal, reminderPostponed, streak, lastCheckDate } = useAppSelector((state) => state.inventoryCheck);
    const tonersArr = useAppSelector((state) => state.tonersStorage.tonersStorageArr);
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const streakEmoji = getStreakEmoji(streak);
    const [localTonerQuantities, setLocalTonerQuantities] = useState<TonerQuantities>({
        C: '',
        M: '',
        Y: '',
        K: ''
    });

    // Загружаем историю пересчетов при монтировании
    useEffect(() => {
        const loadHistory = async () => {
            try {
                await dispatch(fetchLastInventoryCheck()).unwrap();
            } catch (err) {
                console.error('Failed to load inventory check history:', err);
                setError('Не удалось загрузить историю пересчетов');
            }
        };
        loadHistory();
    }, [dispatch]);

    useEffect(() => {
        if (showModal) {
            const loadToners = async () => {
                try {
                    await dispatch(fetchTonersStorage()).unwrap();
                    console.log('Loaded toners:', tonersArr);
                } catch (err) {
                    console.error('Failed to load toners:', err);
                    setError('Не удалось загрузить текущие значения тонеров');
                }
            };
            loadToners();
        }
    }, [showModal, dispatch]);

    useEffect(() => {
        // Инициализируем локальные значения из store
        if (tonersArr.length > 0) {
            console.log('Updating local quantities from tonersArr:', tonersArr);
            const newQuantities: TonerQuantities = {
                C: '',
                M: '',
                Y: '',
                K: ''
            };
            tonersArr.forEach((toner) => {
                if (toner.toner && toner.toner.color && toner.toner.color in newQuantities) {
                    newQuantities[toner.toner.color as TonerColor] = toner.toner.qty?.toString() || '';
                }
            });
            setLocalTonerQuantities(newQuantities);
        }
    }, [tonersArr]);

    const handleTonerChange = (color: TonerColor, value: string) => {
        setLocalTonerQuantities(prev => ({
            ...prev,
            [color]: value
        }));
    };

    const handleConfirm = async () => {
        setIsChecking(true);
        setError(null);
        try {
            // Обновляем количества тонеров
            for (const toner of tonersArr) {
                if (toner.toner && toner.toner.color && toner.toner.color in localTonerQuantities) {
                    const newQty = parseInt(localTonerQuantities[toner.toner.color as TonerColor]) || 0;
                    await dispatch(updateToner({
                        id: toner.id,
                        toner: {
                            ...toner.toner,
                            qty: newQty
                        }
                    })).unwrap();
                }
            }
            
            // Обновляем дату последней проверки
            const today = new Date().toISOString();
            console.log('Updating inventory check date:', today);
            await dispatch(updateInventoryCheck(today)).unwrap();
            
            dispatch(incrementStreak());
            dispatch(setShowModal(false));
        } catch (err) {
            console.error('Failed to update inventory check:', err);
            setError('Не удалось сохранить изменения. Попробуйте еще раз.');
        } finally {
            setIsChecking(false);
        }
    };

    const handlePostpone = () => {
        dispatch(setReminderPostponed(true));
        dispatch(setShowModal(false));
        setTimeout(() => {
            dispatch(setShowModal(true));
        }, 2 * 60 * 60 * 1000);
    };

    // Проверяем, нужно ли показывать модальное окно
    const shouldShowModal = showModal && !reminderPostponed && !lastCheckDate;
    if (!shouldShowModal) return null;

    return (
        <div className={cls.modalOverlay}>
            <div className={cls.modal}>
                <h2>Пожалуйста, выполните пересчёт склада.</h2>
                <h3>Актуальные данные необходимы для точного планирования заказов тонеров. Несвоевременный пересчёт может привести к задержкам в работе оборудования или дополнительным затратам при срочной закупке.</h3>
                <p>Введите текущее количество тонеров:</p>
                
                {error && <div className={cls.error}>{error}</div>}
                
                <div className={cls.tonerInputs}>
                    {Object.entries(localTonerQuantities).map(([color, quantity]) => (
                        <div key={color} className={cls.tonerInput}>
                            <label htmlFor={`toner-${color}`}>Тонер {color}:</label>
                            <input
                                type="number"
                                id={`toner-${color}`}
                                value={quantity}
                                onChange={(e) => handleTonerChange(color as TonerColor, e.target.value)}
                                placeholder="Количество"
                                min="0"
                            />
                        </div>
                    ))}
                </div>

                <div className={cls.streakInfo}>
                    {streak > 0 && (
                        <span>
                            {streakEmoji} Текущая серия: {streak} дней
                        </span>
                    )}
                </div>

                <div className={cls.actions}>
                    <button 
                        className={cls.confirmButton}
                        onClick={handleConfirm}
                        disabled={isChecking}
                    >
                        ✅ Подтвердить пересчёт
                    </button>
                    <button 
                        className={cls.postponeButton}
                        onClick={handlePostpone}
                    >
                        ⏳ Напомнить позже
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryModal; 