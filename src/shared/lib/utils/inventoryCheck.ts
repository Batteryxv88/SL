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

export const getInventoryStatus = (lastCheckDate: string | null): 'checked' | 'warning' | 'overdue' => {
    if (!lastCheckDate) return 'warning';
    
    if (isToday(lastCheckDate)) return 'checked';
    
    if (isAfterTime('14:00')) return 'overdue';
    
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