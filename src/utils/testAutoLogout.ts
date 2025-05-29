// Утилита для тестирования автоматического выхода
export const testAutoLogoutLogic = () => {
  console.log('=== Тестирование логики автоматического выхода ===');
  
  // Получаем текущее московское время
  const now = new Date();
  const moscowTimeString = now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' });
  const moscowNow = new Date(moscowTimeString);
  const hours = moscowNow.getHours();
  const minutes = moscowNow.getMinutes();
  
  // Проверяем, был ли уже выполнен автоматический выход сегодня
  const today = moscowNow.toDateString();
  const lastAutoLogoutDate = localStorage.getItem('lastAutoLogoutDate');
  
  console.log(`Текущее время: ${hours}:${minutes.toString().padStart(2, '0')} МСК`);
  console.log(`Сегодняшняя дата: ${today}`);
  console.log(`Дата последнего автовыхода: ${lastAutoLogoutDate || 'не установлена'}`);
  
  // Проверяем условия для автоматического выхода
  const shouldLogout = hours === 22 && minutes >= 0 && lastAutoLogoutDate !== today;
  console.log(`Должен ли произойти автовыход: ${shouldLogout ? 'ДА' : 'НЕТ'}`);
  
  if (shouldLogout) {
    console.log('✅ Условия для автовыхода выполнены');
  } else {
    if (hours !== 22) {
      console.log(`❌ Неподходящее время: ${hours} часов (нужно 22)`);
    }
    if (lastAutoLogoutDate === today) {
      console.log('❌ Автовыход уже выполнялся сегодня');
    }
  }
  
  // Проверяем условия для очистки записи в полночь
  const shouldClearRecord = hours === 0 && minutes < 5 && lastAutoLogoutDate && lastAutoLogoutDate !== today;
  console.log(`Должна ли очиститься запись: ${shouldClearRecord ? 'ДА' : 'НЕТ'}`);
  
  console.log('=== Конец тестирования ===');
};

// Функция для симуляции автовыхода (для тестирования)
export const simulateAutoLogout = () => {
  const today = new Date().toDateString();
  localStorage.setItem('lastAutoLogoutDate', today);
  console.log(`Симуляция автовыхода: установлена дата ${today}`);
};

// Функция для очистки записи о последнем автовыходе (для тестирования)
export const clearAutoLogoutRecord = () => {
  localStorage.removeItem('lastAutoLogoutDate');
  console.log('Запись о последнем автовыходе очищена');
};

// Функция для получения статуса автовыхода
export const getAutoLogoutStatus = () => {
  const lastAutoLogoutDate = localStorage.getItem('lastAutoLogoutDate');
  const today = new Date().toDateString();
  
  return {
    lastLogoutDate: lastAutoLogoutDate,
    today: today,
    canLogoutToday: lastAutoLogoutDate !== today,
    hasLoggedOutToday: lastAutoLogoutDate === today
  };
}; 