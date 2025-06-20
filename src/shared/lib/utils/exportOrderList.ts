import * as XLSX from 'xlsx';
import { OrderListItem } from '../hooks/useOrderList';

let showNotificationCallback: ((title: string, message: string, type?: 'info' | 'warning' | 'error' | 'success') => void) | null = null;

export const setNotificationCallback = (callback: (title: string, message: string, type?: 'info' | 'warning' | 'error' | 'success') => void) => {
    showNotificationCallback = callback;
};

const showNotification = (title: string, message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    if (showNotificationCallback) {
        showNotificationCallback(title, message, type);
    } else {
        // Fallback на обычный alert если callback не установлен
        alert(`${title}: ${message}`);
    }
};

export const exportOrderListToExcel = (orderList: OrderListItem[]) => {
    if (orderList.length === 0) {
        showNotification(
            'Нет деталей для заказа',
            'На данный момент нет деталей которые нужно заказать. Все детали находятся в достаточном количестве на складе.',
            'warning'
        );
        return;
    }

    // Создаем данные для Excel - простая таблица
    const excelData: any[] = [];
    
    // Добавляем все детали (заголовки создаются автоматически из ключей)
    orderList.forEach(item => {
        excelData.push({
            'Секция': item.section,
            'Артикул': item.partN,
            'Наименование': item.partName,
            'На складе': item.currentQty,
            'Должно быть': item.targetQty,
            'К заказу': item.needToOrder
        });
    });

    // Добавляем пустую строку перед итогами
    excelData.push({
        'Секция': '',
        'Артикул': '',
        'Наименование': '',
        'На складе': '',
        'Должно быть': '',
        'К заказу': ''
    });

    // Добавляем итоги
    const totalQuantity = orderList.reduce((sum, item) => sum + item.needToOrder, 0);
    excelData.push({
        'Секция': 'ИТОГО позиций:',
        'Артикул': orderList.length,
        'Наименование': '',
        'На складе': '',
        'Должно быть': '',
        'К заказу': ''
    });

    // Создаем Excel файл
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Заказ деталей");

    // Генерируем имя файла с текущей датой
    const currentDate = new Date().toLocaleDateString('ru-RU').replace(/\./g, '_');
    const fileName = `Заказ_деталей_${currentDate}`;
    
    // Скачиваем файл
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    // Показываем уведомление об успешном экспорте
    showNotification(
        'Экспорт завершен!',
        `Файл "${fileName}.xlsx" успешно экспортирован и сохранён в папке загрузок вашего браузера.`,
        'success'
    );
    
    console.log(`Экспортировано ${orderList.length} позиций на общую сумму ${totalQuantity} деталей`);
}; 