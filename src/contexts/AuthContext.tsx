import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getCurrentUser, logout } from '../services/auth';
import { auth } from '../services/firebase';
import { UserData, getUserData } from '../services/users';
import LoadingPlug from '../shared/ui/LoadingPlug/LoadingPlug';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Время автоматического выхода в миллисекундах (12 часов)
const AUTO_LOGOUT_TIME = 9 * 60 * 60 * 1000;
//const AUTO_LOGOUT_TIME = 20000;


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setUser(user);
      
      if (user) {
        // Загружаем дополнительные данные пользователя из Firestore
        const data = await getUserData(user.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Эффект для автоматического выхода через заданное время сессии (устойчив к перезагрузке)
  useEffect(() => {
    let autoLogoutTimer: NodeJS.Timeout | null = null;

    if (user) {
      // Получаем или устанавливаем время старта для авторазлогина в sessionStorage
      const stored = sessionStorage.getItem('autoLogoutStartTime');
      const startTime = stored ? parseInt(stored, 10) : Date.now();
      if (!stored) {
        sessionStorage.setItem('autoLogoutStartTime', startTime.toString());
      }
      const elapsed = Date.now() - startTime;
      const remaining = AUTO_LOGOUT_TIME - elapsed;

      if (remaining <= 0) {
        // Время сессии истекло — сразу выходим
        logout().catch((error) => console.error('Ошибка при автоматическом выходе:', error));
      } else {
        console.log(`Автоматический выход будет выполнен через ${remaining} мс`);
        autoLogoutTimer = setTimeout(async () => {
          console.log('Выполняем автоматический выход');
          try {
            await logout();
            console.log('Автоматический выход выполнен успешно');
          } catch (error) {
            console.error('Ошибка при автоматическом выходе:', error);
          }
        }, remaining);
      }
    } else {
      // Очищаем время старта при выходе
      sessionStorage.removeItem('autoLogoutStartTime');
    }

    return () => {
      if (autoLogoutTimer) {
        clearTimeout(autoLogoutTimer);
      }
    };
  }, [user]);

  // Эффект для выхода в 22:00 по московскому времени (проверка каждые 30 минут)
  useEffect(() => {
    if (!user) return;
    
    const checkLogoutByTime = async () => {
      try {
        // Получаем текущее московское время
        const now = new Date();
        const moscowTimeString = now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' });
        const moscowNow = new Date(moscowTimeString);
        const hours = moscowNow.getHours();
        const minutes = moscowNow.getMinutes();
        
        // Проверяем, был ли уже выполнен автоматический выход сегодня
        const today = moscowNow.toDateString();
        const lastAutoLogoutDate = localStorage.getItem('lastAutoLogoutDate');
        
        console.log(`Проверка времени: ${hours}:${minutes.toString().padStart(2, '0')} МСК, дата: ${today}, последний автовыход: ${lastAutoLogoutDate}`);
        
        // Выполняем автоматический выход только если:
        // 1. Время 22:00 или позже
        // 2. Автоматический выход еще не выполнялся сегодня
        // 3. Время не позднее 23:59 (чтобы не выходить на следующий день)
        if (hours === 22 && minutes >= 0 && lastAutoLogoutDate !== today) {
          console.log('Время 22:00 по МСК, выполняем автоматический выход');
          // Сохраняем дату последнего автоматического выхода
          localStorage.setItem('lastAutoLogoutDate', today);
          await logout();
        }
        
        // Очищаем запись о последнем автоматическом выходе в полночь
        // чтобы система была готова к следующему дню
        if (hours === 0 && minutes < 5 && lastAutoLogoutDate && lastAutoLogoutDate !== today) {
          console.log('Полночь - очищаем запись о последнем автоматическом выходе');
          localStorage.removeItem('lastAutoLogoutDate');
        }
      } catch (error) {
        console.error('Ошибка при проверке времени для автологаута:', error);
      }
    };
    
    // Сразу проверяем при инициализации
    checkLogoutByTime();
    // Запускаем проверку каждые 5 минут для более точного срабатывания
    const intervalId = setInterval(checkLogoutByTime, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [user]);

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence);
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, setUser }}>
      {loading ? <LoadingPlug /> : children}
    </AuthContext.Provider>
  );
}; 