import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/providers/StoreProvider/Store/hooks';
import { setShowReminder, setShowModal } from '../../../app/providers/StoreProvider/Store/InventoryCheckSlice';
import { getInventoryStatus, getStatusEmoji } from '../../../shared/lib/utils/inventoryCheck';
import cls from './InventoryReminder.module.scss';
import StorageIcon from '../../../shared/ui/StorageIcon/StorageIcon';
const InventoryReminder = () => {
    const dispatch = useAppDispatch();
    const { lastCheckDate, showReminder, streak } = useAppSelector((state) => state.inventoryCheck);
    const status = getInventoryStatus(lastCheckDate);
    const statusEmoji = getStatusEmoji(status);

    useEffect(() => {
        if (status === 'warning' || status === 'overdue') {
            dispatch(setShowReminder(true));
        }
    }, [status, dispatch]);

    const handleCheckNow = () => {
        dispatch(setShowModal(true));
    };

    if (!showReminder || status === 'checked') return null;

    return (
        <div className={cls.reminder}>
            {/* <span className={cls.status}>{statusEmoji}</span> */}
            <StorageIcon />
            <div className={cls.content}>
                {streak > 0 && <span className={cls.streak}>Серия: {streak} дней</span>}
                <button className={cls.checkButton} onClick={handleCheckNow}>
                    Пересчитать сейчас
                </button>
            </div>

        </div>
    );
};

export default InventoryReminder; 