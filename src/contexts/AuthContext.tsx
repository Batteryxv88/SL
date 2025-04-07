import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
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
const AUTO_LOGOUT_TIME = 12 * 60 * 60 * 1000;

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

  // Эффект для автоматического выхода через 30 секунд
  useEffect(() => {
    let autoLogoutTimer: NodeJS.Timeout | null = null;
    
    if (user) {
      console.log('Автоматический выход будет выполнен через 30 секунд');
      autoLogoutTimer = setTimeout(async () => {
        console.log('Выполняем автоматический выход');
        try {
          await logout();
          console.log('Автоматический выход выполнен успешно');
        } catch (error) {
          console.error('Ошибка при автоматическом выходе:', error);
        }
      }, AUTO_LOGOUT_TIME);
    }
    
    // Очищаем таймер при размонтировании компонента или смене пользователя
    return () => {
      if (autoLogoutTimer) {
        clearTimeout(autoLogoutTimer);
      }
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, userData, loading, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 