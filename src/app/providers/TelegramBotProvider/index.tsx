import { useEffect } from 'react';
import { initBot } from '../../../telegramBot';

const CHAT_ID = '439671248'; // Замените на ваш chat_id

export const TelegramBotProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Инициализируем бота при монтировании компонента
        initBot(CHAT_ID);
    }, []);

    return <>{children}</>;
}; 