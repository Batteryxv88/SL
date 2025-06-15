import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/providers/StoreProvider/Store/hooks';
import { setShowModal, setReminderPostponed, incrementStreak, resetStreak } from '../../../app/providers/StoreProvider/Store/InventoryCheckSlice';
import { updateInventoryCheck, fetchLastInventoryCheck } from '../../../app/providers/StoreProvider/Store/InventoryCheckSlice';
import { updateToner, fetchTonersStorage } from '../../../app/providers/StoreProvider/Store/TonersStorageSlice';
import { fetchMaterials, updateMaterialQuantity } from '../../../app/providers/StoreProvider/Store/MaterialsSlice';
import { getStreakEmoji } from '../../../shared/lib/utils/inventoryCheck';
import { useMaterials } from '../../../app/providers/StoreProvider/Store/hooks';
import cls from './InventoryModal.module.scss';

type TonerColor = 'C' | 'M' | 'Y' | 'K';
type TonerQuantities = Record<TonerColor, string>;
type MaterialQuantities = Record<string, string>;

const InventoryModal = () => {
    const dispatch = useAppDispatch();
    const { showModal, reminderPostponed, streak, lastCheckDate } = useAppSelector((state) => state.inventoryCheck);
    const tonersArr = useAppSelector((state) => state.tonersStorage.tonersStorageArr);
    const { materials } = useMaterials();
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentStep, setCurrentStep] = useState<'toners' | 'materials'>('toners');
    const [tonersInitialized, setTonersInitialized] = useState(false);
    const [materialsInitialized, setMaterialsInitialized] = useState(false);
    const streakEmoji = getStreakEmoji(streak);
    
    // Состояния для количеств
    const [localTonerQuantities, setLocalTonerQuantities] = useState<TonerQuantities>({
        C: '',
        M: '',
        Y: '',
        K: ''
    });

    const [localMaterialQuantities, setLocalMaterialQuantities] = useState<MaterialQuantities>({
        'FA': '',
        'FH': '',
        'PA': '',
        'PH': '',
        'clear': '',
        'metall': '',
        'verge': ''
    });

    // Material names mapping for display
    const materialNames: Record<string, string> = {
        'FA': 'FA',
        'FH': 'FH', 
        'PA': 'PA',
        'PH': 'PH',
        'clear': 'Clear',
        'metall': 'Metall',
        'verge': 'Verge'
    };

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
            const loadData = async () => {
                try {
                    await Promise.all([
                        dispatch(fetchTonersStorage()).unwrap(),
                        dispatch(fetchMaterials()).unwrap()
                    ]);
                } catch (err) {
                    console.error('Failed to load data:', err);
                    setError('Не удалось загрузить текущие значения');
                }
            };
            loadData();
        }
    }, [showModal, dispatch]);

    useEffect(() => {
        // Инициализируем локальные значения тонеров из store только один раз
        if (tonersArr.length > 0 && !tonersInitialized) {
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
            setTonersInitialized(true);
        }
    }, [tonersArr, tonersInitialized]);

    useEffect(() => {
        // Инициализируем локальные значения материалов из store только один раз
        if (materials.length > 0 && !materialsInitialized) {
            const newQuantities: MaterialQuantities = {
                'FA': '',
                'FH': '',
                'PA': '',
                'PH': '',
                'clear': '',
                'metall': '',
                'verge': ''
            };
            
            materials.forEach((material) => {
                if (material.status === 'new') {
                    const materialType = material.type;
                    const materialTypeLower = material.type.toLowerCase();
                    
                    // Ищем по точному совпадению (для clear, metall, verge)
                    if (materialTypeLower in newQuantities) {
                        newQuantities[materialTypeLower] = material.qty.toString();
                    }
                    // Ищем по верхнему регистру (для FA, FH, PA, PH)  
                    else if (materialType in newQuantities) {
                        newQuantities[materialType] = material.qty.toString();
                    }
                }
            });
            
            setLocalMaterialQuantities(newQuantities);
            setMaterialsInitialized(true);
        }
    }, [materials, materialsInitialized]);

    const handleTonerChange = (color: TonerColor, value: string) => {
        setLocalTonerQuantities(prev => ({
            ...prev,
            [color]: value
        }));
    };

    const handleMaterialChange = (type: string, value: string) => {
        setLocalMaterialQuantities(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handleNext = () => {
        setCurrentStep('materials');
        setError(null);
    };

    const handleBack = () => {
        setCurrentStep('toners');
        setError(null);
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
            
            // Обновляем количества материалов
            for (const material of materials) {
                if (material.status === 'new') {
                    const materialType = material.type;
                    const materialTypeLower = material.type.toLowerCase();
                    
                    // Проверяем есть ли такой материал в наших локальных данных
                    let newQty = 0;
                    if (materialTypeLower in localMaterialQuantities) {
                        newQty = parseInt(localMaterialQuantities[materialTypeLower]) || 0;
                    } else if (materialType in localMaterialQuantities) {
                        newQty = parseInt(localMaterialQuantities[materialType]) || 0;
                    }
                    
                    if (newQty !== undefined) {
                        await dispatch(updateMaterialQuantity({
                            id: material.id,
                            qty: newQty
                        })).unwrap();
                    }
                }
            }
            
            // Обновляем дату последней проверки
            const today = new Date().toISOString();
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
    const shouldShowModal = showModal && !reminderPostponed;
    if (!shouldShowModal) return null;

    const renderStepIndicator = () => (
        <div className={cls.stepIndicator}>
            <div className={`${cls.step} ${currentStep === 'toners' ? cls.active : cls.completed}`}>
                1
            </div>
            <div className={`${cls.connector} ${currentStep === 'materials' ? cls.active : ''}`} />
            <div className={`${cls.step} ${currentStep === 'materials' ? cls.active : cls.inactive}`}>
                2
            </div>
        </div>
    );

    const renderTonersStep = () => (
        <>
            <h2>Пересчёт тонеров</h2>
            <h3>Введите текущее количество тонеров в наличии:</h3>
            
            {error && <div className={cls.error}>{error}</div>}
            
            <div className={cls.tonerInputs}>
                {Object.entries(localTonerQuantities).map(([color, quantity]) => (
                    <div key={color} className={cls.inputWrapper}>
                        <label className={cls.inputLabel} htmlFor={`toner-${color}`}>Тонер {color}:</label>
                        <input
                            className={cls.inputField}
                            type="number"
                            id={`toner-${color}`}
                            value={quantity}
                            onChange={(e) => handleTonerChange(color as TonerColor, e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                    </div>
                ))}
            </div>

            <div className={cls.actions}>
                <button 
                    className={cls.nextButton}
                    onClick={handleNext}
                    disabled={isChecking}
                >
                    Далее
                </button>
                <button 
                    className={cls.postponeButton}
                    onClick={handlePostpone}
                >
                    Напомнить позже
                </button>
            </div>
        </>
    );

    const renderMaterialsStep = () => (
        <>
            <h2>Пересчёт материалов</h2>
            <h3>Введите текущее количество материалов (бумаги) в наличии:</h3>
            
            {error && <div className={cls.error}>{error}</div>}
            
            <div className={cls.materialInputs}>
                {Object.entries(localMaterialQuantities).map(([type, quantity]) => (
                    <div key={type} className={cls.inputWrapper}>
                        <label className={cls.inputLabel} htmlFor={`material-${type}`}>{materialNames[type]}</label>
                        <input
                            className={cls.inputField}
                            type="number"
                            id={`material-${type}`}
                            value={quantity}
                            onChange={(e) => handleMaterialChange(type, e.target.value)}
                            placeholder="0"
                            min="0"
                        />
                    </div>
                ))}
            </div>

            <div className={cls.actions}>
                <button 
                    className={cls.backButton}
                    onClick={handleBack}
                    disabled={isChecking}
                >
                    Назад
                </button>
                <button 
                    className={cls.confirmButton}
                    onClick={handleConfirm}
                    disabled={isChecking}
                >
                    Подтвердить пересчёт
                </button>
            </div>
        </>
    );

    return (
        <div className={cls.modalOverlay}>
            <div className={cls.modal}>
                {renderStepIndicator()}
                
                {currentStep === 'toners' ? renderTonersStep() : renderMaterialsStep()}

                <div className={cls.streakInfo}>
                    {streak > 0 && (
                        <span>
                            {streakEmoji} Текущая серия: {streak} дней
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryModal; 