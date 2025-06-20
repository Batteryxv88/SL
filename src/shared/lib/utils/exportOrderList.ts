import * as XLSX from 'xlsx-js-style';
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
            'Необходимо': item.targetQty,
            'На складе': item.currentQty,
            'К заказу': item.needToOrder
        });
    });

    // Добавляем пустую строку перед итогами
    excelData.push({
        'Секция': '',
        'Артикул': '',
        'Наименование': '',
        'Необходимо': '',
        'На складе': '',
        'К заказу': ''
    });

    // Добавляем итоги
    excelData.push({
        'Секция': 'ИТОГО позиций:',
        'Артикул': orderList.length,
        'Наименование': '',
        'Необходимо': '',
        'На складе': '',
        'К заказу': ''
    });

    // Создаем Excel файл
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Настраиваем ширину колонок
    worksheet['!cols'] = [
        { wch: 28 }, // Секция
        { wch: 15 }, // Артикул  
        { wch: 35 }, // Наименование
        { wch: 15 }, // На складе
        { wch: 12 }, // Необходимо
        { wch: 12 }  // К заказу
    ];

    // Применяем стили с помощью xlsx-js-style
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (worksheet[cellAddress]) {
                // Базовый стиль для всех ячеек
                worksheet[cellAddress].s = {
                    alignment: { 
                        horizontal: "center", 
                        vertical: "center" 
                    },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } }
                    }
                };

                // Заголовки (первая строка) - жирный шрифт
                if (row === 0) {
                    worksheet[cellAddress].s = {
                        ...worksheet[cellAddress].s,
                        font: { bold: true, size: 12 },
                        fill: { 
                            fgColor: { rgb: "E0E0E0" } 
                        }
                    };
                }

                // Строка итогов - жирный шрифт
                if (row === range.e.r) {
                    worksheet[cellAddress].s = {
                        ...worksheet[cellAddress].s,
                        font: { bold: true, size: 11 }
                    };
                }
            }
        }
    }

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
    
    console.log(`Экспортировано ${orderList.length} позиций`);
}; 