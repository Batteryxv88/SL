import { useState } from 'react';
import { useAppSelector } from '../../../app/providers/StoreProvider/Store/hooks';
import { getInventoryStatus, getStatusEmoji } from '../../../shared/lib/utils/inventoryCheck';
import cls from './StorageIcon.module.scss';

const StorageIcon = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const { lastCheckDate } = useAppSelector((state) => state.inventoryCheck);
    const status = getInventoryStatus(lastCheckDate);
    const statusEmoji = getStatusEmoji(status);

    const getTooltipText = () => {
        switch (status) {
            case 'checked':
                return 'Склад пересчитан сегодня';
            case 'warning':
                return 'Склад не пересчитан. Проверьте данные';
            case 'overdue':
                return 'СРОЧНО! Склад не пересчитан';
            default:
                return 'Статус склада неизвестен';
        }
    };

    return (
        <div 
            className={cls.iconContainer}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <span className={cls.icon}>{statusEmoji}</span>
            {showTooltip && (
                <div className={cls.tooltip}>
                    {getTooltipText()}
                </div>
            )}
        </div>
    );
};

export default StorageIcon; 