export const isToday = (date: string): boolean => {
    const today = new Date();
    const checkDate = new Date(date);
    return (
        today.getFullYear() === checkDate.getFullYear() &&
        today.getMonth() === checkDate.getMonth() &&
        today.getDate() === checkDate.getDate()
    );
};

export const isAfterTime = (time: string): boolean => {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(hours, minutes, 0, 0);
    return now >= targetTime;
};

// Дни недели для проверки инвентаризации (можно изменить здесь)
// 0 = воскресенье, 1 = понедельник, 2 = вторник, 3 = среда, 4 = четверг, 5 = пятница, 6 = суббота
export const INVENTORY_CHECK_DAYS = [2, 4]; // Вторник и четверг

export const isInventoryCheckDay = (): boolean => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return INVENTORY_CHECK_DAYS.includes(dayOfWeek);
};

export const wasLastCheckOnCurrentWeek = (lastCheckDate: string | null): boolean => {
    if (!lastCheckDate) return false;
    
    const today = new Date();
    const checkDate = new Date(lastCheckDate);
    
    // Получаем начало текущей недели (понедельник)
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Если воскресенье, то 6 дней назад, иначе dayOfWeek - 1
    startOfWeek.setDate(today.getDate() - daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    return checkDate >= startOfWeek;
};

export const getInventoryStatus = (lastCheckDate: string | null): 'checked' | 'warning' | 'overdue' => {
    // Если сегодня не день проверки, то всегда показываем "checked"
    if (!isInventoryCheckDay()) {
        return 'checked';
    }
    
    // Если проверка была сегодня, то "checked"
    if (lastCheckDate && isToday(lastCheckDate)) {
        return 'checked';
    }
    
    // Если проверка была на этой неделе (в предыдущий день проверки), то "checked"
    if (wasLastCheckOnCurrentWeek(lastCheckDate)) {
        return 'checked';
    }
    
    // Если время после 14:00 и проверки не было, то "overdue"
    if (isAfterTime('14:00')) {
        return 'overdue';
    }
    
    // Иначе "warning"
    return 'warning';
};

export const getStatusEmoji = (status: 'checked' | 'warning' | 'overdue'): string => {
    switch (status) {
        case 'checked':
            return '🟢';
        case 'warning':
            return '🟡';
        case 'overdue':
            return '🔴';
        default:
            return '⚪';
    }
};

export const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆';
    if (streak >= 15) return '🌟';
    if (streak >= 7) return '⭐';
    if (streak >= 3) return '✨';
    return '🎯';
}; 