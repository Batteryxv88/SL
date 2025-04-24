import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getCurrentUser, logout } from '../services/auth';
import { auth } from '../services/firebase';
import { UserData, getUserData } from '../services/users';

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

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence);
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 