import { useMemo } from 'react';
import { useAppSelector } from '../../../app/providers/StoreProvider/Store/hooks';
import { useQuantityToOrder } from './useQuantityToOrder';

export interface OrderListItem {
    id: string;
    partN: string;
    partName: string;
    currentQty: number;     // текущее количество на складе
    targetQty: number;      // целевое количество которое должно быть
    needToOrder: number;    // сколько нужно заказать
    section: string;
}

export const useOrderList = () => {
    const partsArray = useAppSelector((state) => state.parts.partsArray);
    const { orders } = useQuantityToOrder();

    const orderList = useMemo(() => {
        const results: OrderListItem[] = [];

        partsArray.forEach((partData: any) => {
            const part = partData.part;
            const partId = partData.id;

            // Ищем соответствующую запись в quantityToOrder по partN
            const orderData = orders.find(order => order.PartN === part.partN);

            // Обрабатываем только те детали, у которых use = true
            if (orderData && orderData.use) {
                const currentQty = part.quantity || 0;
                const targetQty = orderData.qty || 0;
                const needToOrder = Math.max(0, targetQty - currentQty);

                // Добавляем в список только если нужно заказать больше 0
                if (needToOrder > 0) {
                    results.push({
                        id: partId,
                        partN: part.partN,
                        partName: part.partName,
                        currentQty,
                        targetQty,
                        needToOrder,
                        section: part.section || "Other"
                    });
                }
            }
        });

        // Сортируем по секциям и названиям
        return results.sort((a, b) => {
            if (a.section !== b.section) {
                return a.section.localeCompare(b.section);
            }
            return a.partName.localeCompare(b.partName);
        });
    }, [partsArray, orders]);

    return {
        orderList,
        totalItems: orderList.length,
        totalQuantityToOrder: orderList.reduce((sum, item) => sum + item.needToOrder, 0)
    };
}; 