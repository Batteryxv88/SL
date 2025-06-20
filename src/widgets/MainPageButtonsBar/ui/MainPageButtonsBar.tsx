import { useEffect, useState } from 'react';
import cls from './MainPageButtonsBar.module.scss';
import AddPart from '../../../features/ui/AddPart/AddPart';
import { useOrderList } from '../../../shared/lib/hooks/useOrderList';
import { exportOrderListToExcel, setNotificationCallback } from '../../../shared/lib/utils/exportOrderList';
import { useAppDispatch, useAppSelector } from '../../../app/providers/StoreProvider/Store/hooks';
import { fetchParts } from '../../../app/providers/StoreProvider/Store/PartSlice';
import { fetchQuantityToOrder } from '../../../app/providers/StoreProvider/Store/QuantityToOrderSlice';
import NotificationModal from '../../../shared/ui/NotificationModal/NotificationModal';

const MainPageButtonsBar = () => {
    const dispatch = useAppDispatch();
    const { orderList } = useOrderList();
    
    // Состояние для уведомлений
    const [notification, setNotification] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'info' | 'warning' | 'error' | 'success';
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });
    
    // Получаем состояние данных из store
    const partsArray = useAppSelector((state) => state.parts.partsArray);
    const quantityToOrderData = useAppSelector((state) => state.quantityToOrder.orders);
    
    useEffect(() => {
        // Устанавливаем callback для уведомлений
        setNotificationCallback((title: string, message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
            setNotification({
                isOpen: true,
                title,
                message,
                type
            });
        });
    }, []);
    
    useEffect(() => {
        // Загружаем данные только если их еще нет в store
        if (partsArray.length === 0) {
            dispatch(fetchParts());
        }
        
        if (quantityToOrderData.length === 0) {
            dispatch(fetchQuantityToOrder());
        }
    }, [dispatch, partsArray.length, quantityToOrderData.length]);
    
    const handleOrderExport = () => {
        exportOrderListToExcel(orderList);
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <>
            <div className={cls.MainPageButtonsBar}>
                <AddPart />
                <button className={cls.button}><span className={cls.buttonText}>Аудит</span></button>
                <button className={cls.button} onClick={handleOrderExport}>
                    <span className={cls.buttonText}>Заказ деталей</span>
                </button>
            </div>
            
            <NotificationModal
                isOpen={notification.isOpen}
                onClose={handleCloseNotification}
                title={notification.title}
                message={notification.message}
                type={notification.type}
            />
        </>
    );
};

export default MainPageButtonsBar;
