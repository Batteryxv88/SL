import React, { useState, useEffect } from 'react';
import { UserData, createUserInFirestore } from '../services/users';
import { createNewUser } from '../services/adminUtils';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import styles from './AdminPage.module.scss';
import { activateUserCheck as activateCheck, isUserCheckActive } from '../services/auth';

export const AdminPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'администратор' | 'руководитель' | 'печатник' | 'резчик' | 'менеджер' | 'дизайнер'>('печатник');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [users, setUsers] = useState<{id: string, data: UserData}[]>([]);
  const [checkActive, setCheckActive] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Проверяем, активирована ли проверка
    setCheckActive(isUserCheckActive());
    
    // Загружаем список пользователей
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data() as UserData
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      await createNewUser(email, password, name, role);
      setStatus('Пользователь успешно создан!');
      setEmail('');
      setPassword('');
      setName('');
      setRole('печатник');
      
      // Обновляем список пользователей
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data() as UserData
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error creating user:', error);
      setStatus(`Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
    }
  };

  const addCurrentUserToFirestore = async () => {
    if (!user) return;
    
    setLoading(true);
    setStatus('');

    try {
      // Создаем запись для текущего пользователя
      const userData: UserData = {
        email: user.email || '',
        displayName: user.displayName || 'Неизвестный пользователь',
        role: 'администратор',  // Устанавливаем роль администратор для первого пользователя
        createdAt: Date.now()
      };

      await createUserInFirestore(user.uid, userData);
      setStatus('Ваш пользователь успешно добавлен в коллекцию!');
      
      // Обновляем список пользователей
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data() as UserData
      }));
      setUsers(usersList);
    } catch (error) {
      console.error('Error adding current user:', error);
      setStatus(`Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUserCheck = () => {
    setLoading(true);
    setStatus('');

    try {
      // Активируем проверку наличия пользователя
      activateCheck();
      setCheckActive(true);
      setStatus('Проверка наличия пользователей активирована! Теперь вход будет доступен только для пользователей из коллекции Users.');
    } catch (error) {
      console.error('Error activating user check:', error);
      setStatus(`Не удалось активировать проверку: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.adminPage}>
      <h1 className={styles.pageTitle}>Административная панель</h1>
      
      <div className={styles.currentUser}>
        <h2 className={styles.sectionTitle}>Текущий пользователь</h2>
        <p>Email: {user?.email}</p>
        <p>Имя: {user?.displayName || 'Не указано'}</p>
        <button onClick={addCurrentUserToFirestore} disabled={loading} className={styles.actionButton}>
          Добавить текущего пользователя в коллекцию как администратора
        </button>
      </div>

      <div className={styles.settings}>
        <h2 className={styles.sectionTitle}>Настройки безопасности</h2>
        <p>После того, как вы добавите всех необходимых пользователей, активируйте проверку:</p>
        {checkActive ? (
          <div className={styles.activeStatus}>
            <p>Проверка наличия пользователей активирована.</p>
            <p>Только пользователи из коллекции Users могут войти в систему.</p>
          </div>
        ) : (
          <button 
            onClick={handleActivateUserCheck} 
            disabled={loading || users.length === 0}
            className={styles.activateButton}
          >
            Активировать проверку наличия пользователя в коллекции
          </button>
        )}
        <p className={styles.note}>
          Примечание: После активации проверки необходимо добавить всех нужных пользователей в коллекцию Users.
        </p>
      </div>

      <div className={styles.newUserSection}>
        <h2 className={styles.sectionTitle}>Создать нового пользователя</h2>
        <form onSubmit={handleCreateUser} className={styles.userForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name">Имя:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="role">Роль:</label>
            <select 
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'администратор' | 'руководитель' | 'печатник' | 'резчик' | 'менеджер' | 'дизайнер')}
              className={styles.select}
            >
              <option value="администратор">Администратор</option>
              <option value="руководитель">Руководитель</option>
              <option value="печатник">Печатник</option>
              <option value="резчик">Резчик</option>
              <option value="менеджер">Менеджер</option>
              <option value="дизайнер">Дизайнер</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Создание...' : 'Создать пользователя'}
          </button>
        </form>
      </div>

      {status && <div className={styles.status}>{status}</div>}

      <div className={styles.usersSection}>
        <h2 className={styles.sectionTitle}>Существующие пользователи</h2>
        {users.length === 0 ? (
          <p className={styles.noUsers}>Пользователи не найдены</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Имя</th>
                  <th>Роль</th>
                  <th>Дата создания</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.data.email}</td>
                    <td>{user.data.displayName}</td>
                    <td>{user.data.role}</td>
                    <td>{new Date(user.data.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}; 