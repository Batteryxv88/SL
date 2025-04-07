import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { UserData, createUserInFirestore } from './users';

/**
 * Функция для создания нового пользователя администратором
 * Эта функция должна вызываться только в безопасной административной среде,
 * например, на защищенной странице администратора или через функцию Firebase Cloud Functions
 */
export const createNewUser = async (
  email: string, 
  password: string, 
  displayName: string, 
  role: 'администратор' | 'руководитель' | 'печатник' | 'резчик' | 'менеджер' | 'дизайнер' = 'печатник'
) => {
  try {
    // Создаем пользователя в Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Обновляем профиль с отображаемым именем
    await updateProfile(user, {
      displayName
    });

    // Создаем запись в Firestore с дополнительными данными
    const userData: UserData = {
      email,
      displayName,
      role,
      createdAt: Date.now()
    };

    await createUserInFirestore(user.uid, userData);
    
    // Выходим из созданного аккаунта, чтобы не логиниться автоматически в новый аккаунт
    await signOut(auth);
    
    return user;
  } catch (error) {
    console.error('Error creating new user:', error);
    throw error;
  }
};

/**
 * Пример использования:
 * 
 * // В компоненте админ-панели:
 * import { createNewUser } from '../services/adminUtils';
 * 
 * const AdminPanel = () => {
 *   const handleCreateUser = async () => {
 *     try {
 *       await createNewUser(
 *         'newuser@example.com',
 *         'securePassword123',
 *         'Иван Иванов',
 *         'manager'
 *       );
 *       alert('Пользователь успешно создан!');
 *     } catch (error) {
 *       console.error('Error:', error);
 *       alert('Ошибка при создании пользователя');
 *     }
 *   };
 *   
 *   return (
 *     <div>
 *       <h2>Панель администратора</h2>
 *       <button onClick={handleCreateUser}>Создать нового пользователя</button>
 *     </div>
 *   );
 * };
 */ 