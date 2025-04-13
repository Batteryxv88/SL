import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from './services/firebase';

const BOT_TOKEN = '7724634503:AAGLv8TjIx0IzhycGAUrwTSNcbUuodBPSPo';
let CHAT_ID = null;
let lastUpdateId = 0;

// Функция для отправки сообщения в Telegram
async function sendTelegramMessage(chatId, message) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });
        
        if (!response.ok) {
            throw new Error('Ошибка отправки сообщения');
        }
    } catch (error) {
        console.error('Ошибка при отправке сообщения в Telegram:', error);
    }
}

// Функция для получения обновлений от Telegram
async function getUpdates() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`);
        const data = await response.json();
        
        if (data.ok && data.result.length > 0) {
            for (const update of data.result) {
                lastUpdateId = update.update_id;
                
                if (update.message) {
                    const chatId = update.message.chat.id;
                    const text = update.message.text;
                    
                    // Если это первое сообщение, сохраняем chat_id
                    if (!CHAT_ID) {
                        CHAT_ID = chatId;
                        console.log('Получен chat_id:', CHAT_ID);
                    }
                    
                    // Обрабатываем команду
                    await handleMessage(chatId, text);
                }
            }
        }
    } catch (error) {
        console.error('Ошибка при получении обновлений:', error);
    }
}

// Функция для проверки количества материалов
async function checkMaterials(chatId) {
    try {
        const materialsRef = collection(db, 'Materials');
        const snapshot = await getDocs(materialsRef);
        let lowQuantityMaterials = [];
        
        snapshot.forEach((doc) => {
            const data = doc.data();
            const quantity = data.qty || 0;
            const type = data.type || doc.id;
            
            if (quantity <= 3) {
                lowQuantityMaterials.push({ type, quantity });
            }
        });

        if (lowQuantityMaterials.length > 0) {
            let message = "Склад бумаги. Следующие материалы заканчиваются:\n\n";
            lowQuantityMaterials.forEach(material => {
                message += `${material.type}: ${material.quantity} шт.\n`;
            });
            message += "\nНеобходим срочный заказ!";
            
            await sendTelegramMessage(chatId, message);
        }
    } catch (error) {
        console.error('Ошибка при проверке материалов:', error);
    }
}

// Функция для получения статуса всех материалов
async function getMaterialsStatus(chatId) {
    try {
        const materialsRef = collection(db, 'Materials');
        const snapshot = await getDocs(materialsRef);
        let statusMessage = "Текущее количество материалов:\n\n";
        
        if (snapshot.empty) {
            statusMessage += "Нет доступных материалов";
        } else {
            snapshot.forEach((doc) => {
                const data = doc.data();
                const quantity = data.qty || 0;
                const type = data.type || doc.id;
                statusMessage += `${type}: ${quantity} шт.\n`;
            });
        }
        
        console.log('Отправляем статус:', statusMessage); // Для отладки
        await sendTelegramMessage(chatId, statusMessage);
    } catch (error) {
        console.error('Ошибка при получении статуса материалов:', error);
        await sendTelegramMessage(chatId, 'Ошибка при получении статуса материалов');
    }
}

// Функция для обновления количества материала
async function updateMaterialQuantity(chatId, materialId, quantity) {
    try {
        const materialRef = doc(db, 'materials', materialId);
        await updateDoc(materialRef, {
            quantity: parseInt(quantity)
        });
        sendTelegramMessage(chatId, `Количество материала ${materialId} обновлено до ${quantity} шт.`);
    } catch (error) {
        console.error('Ошибка при обновлении количества материала:', error);
        sendTelegramMessage(chatId, 'Ошибка при обновлении количества материала');
    }
}

// Функция для обработки команд
async function handleCommand(chatId, command, args = []) {
    switch (command) {
        case '/start':
            sendTelegramMessage(chatId, 'Бот запущен и готов к работе!');
            break;
        case '/status':
            await getMaterialsStatus(chatId);
            break;
        case '/set':
            if (args.length === 2) {
                const [materialId, quantity] = args;
                await updateMaterialQuantity(chatId, materialId, quantity);
            } else {
                sendTelegramMessage(chatId, 'Использование: /set [материал] [количество]');
            }
            break;
        case '/test':
            await checkMaterials(chatId);
            sendTelegramMessage(chatId, 'Проверка материалов выполнена');
            break;
        default:
            sendTelegramMessage(chatId, 'Неизвестная команда');
    }
}

// Функция для планирования следующей проверки
function scheduleNextCheck(chatId) {
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(22, 0, 0, 0);

    // Если текущее время уже после 22:00, планируем на следующий день
    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    const timeUntilCheck = targetTime - now;
    console.log(`Следующая проверка запланирована на ${targetTime.toLocaleString()}`);

    setTimeout(() => {
        checkMaterials(chatId);
        // После выполнения проверки планируем следующую
        scheduleNextCheck(chatId);
    }, timeUntilCheck);
}

// Функция для инициализации бота
export function initBot(chatId) {
    CHAT_ID = chatId;
    console.log('Бот инициализирован с chat_id:', chatId);
    
    // Запускаем проверку обновлений каждые 5 секунд
    setInterval(getUpdates, 5000);
    
    // Планируем первую проверку материалов
    scheduleNextCheck(chatId);
}

// Функция для обработки входящих сообщений
export async function handleMessage(chatId, text) {
    const [command, ...args] = text.split(' ');
    await handleCommand(chatId, command, args);
}

// Экспортируем функцию для ручной проверки
export function manualCheck() {
    if (CHAT_ID) {
        checkMaterials(CHAT_ID);
    }
} 