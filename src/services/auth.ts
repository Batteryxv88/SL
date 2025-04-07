import { 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from './firebase';
import { checkUserExists, getUserRole } from './users';

// Функция для проверки, активирована ли проверка наличия пользователя
export const isUserCheckActive = (): boolean => {
  return localStorage.getItem('userCheckActive') === 'true';
};

// Функция для активации проверки наличия пользователя
export const activateUserCheck = (): void => {
  localStorage.setItem('userCheckActive', 'true');
};

// Массив разрешенных ролей пользователей
const allowedRoles = [
  'администратор',
  'руководитель',
  'печатник',
  'резчик',
  'менеджер',
  'дизайнер'
];

export const login = async (email: string, password: string) => {
  try {
    // Проверяем, активирована ли проверка наличия пользователя
    if (isUserCheckActive()) {
      // Проверяем, есть ли пользователь в нашей коллекции пользователей
      const userExists = await checkUserExists(email);
      if (!userExists) {
        throw new Error('Пользователь с таким email не найден. Пожалуйста, обратитесь к администратору.');
      }
      
      // Проверяем роль пользователя
      const userRole = await getUserRole(email);
      if (!userRole || !allowedRoles.includes(userRole)) {
        throw new Error('У вас нет доступа к системе. Пожалуйста, обратитесь к администратору.');
      }
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Login error details:', error);
    
    if (error instanceof FirebaseError) {
      const errorMessage = getErrorMessage(error.code);
      console.log('Firebase error code:', error.code);
      console.log('Translated error message:', errorMessage);
      throw new Error(errorMessage);
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Произошла ошибка при входе. Пожалуйста, попробуйте еще раз.');
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

// Преобразуем коды ошибок Firebase в удобочитаемые сообщения
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Пользователь с таким email не найден.';
    case 'auth/wrong-password':
      return 'Неверный пароль.';
    case 'auth/invalid-email':
      return 'Неверный формат email.';
    case 'auth/user-disabled':
      return 'Этот аккаунт заблокирован.';
    case 'auth/email-already-in-use':
      return 'Этот email уже используется.';
    case 'auth/weak-password':
      return 'Слишком простой пароль. Пароль должен содержать минимум 6 символов.';
    case 'auth/operation-not-allowed':
      return 'Операция не разрешена.';
    case 'auth/network-request-failed':
      return 'Ошибка сети. Проверьте подключение к интернету.';
    case 'auth/too-many-requests':
      return 'Слишком много попыток входа. Пожалуйста, попробуйте позже.';
    case 'auth/internal-error':
      return 'Внутренняя ошибка. Пожалуйста, попробуйте еще раз.';
    case 'auth/popup-closed-by-user':
      return 'Операция отменена пользователем.';
    case 'auth/requires-recent-login':
      return 'Для выполнения этой операции требуется повторный вход.';
    case 'auth/unauthorized-domain':
      return 'Неавторизованный домен. Обратитесь к администратору.';
    case 'auth/configuration-not-found':
      return 'Ошибка конфигурации Firebase. Пожалуйста, обратитесь к администратору.';
    case 'auth/invalid-credential':
      return 'Неверные учетные данные. Пожалуйста, проверьте email и пароль.';
    case 'auth/account-exists-with-different-credential':
      return 'Аккаунт с таким email уже существует, но с другими учетными данными.';
    case 'auth/requires-recent-login':
      return 'Для выполнения этой операции требуется повторный вход.';
    case 'auth/provider-already-linked':
      return 'Этот провайдер уже связан с аккаунтом.';
    case 'auth/credential-already-in-use':
      return 'Эти учетные данные уже используются другим аккаунтом.';
    case 'auth/email-change-needs-verification':
      return 'Для изменения email требуется подтверждение.';
    case 'auth/expired-action-code':
      return 'Срок действия кода истек. Пожалуйста, запросите новый код.';
    case 'auth/invalid-action-code':
      return 'Недействительный код. Пожалуйста, запросите новый код.';
    case 'auth/missing-email':
      return 'Email не указан.';
    case 'auth/missing-password':
      return 'Пароль не указан.';
    case 'auth/quota-exceeded':
      return 'Превышен лимит запросов. Пожалуйста, попробуйте позже.';
    case 'auth/rejected-credential':
      return 'Учетные данные были отклонены.';
    case 'auth/timeout':
      return 'Превышено время ожидания. Пожалуйста, попробуйте еще раз.';
    default:
      return 'Произошла ошибка при авторизации. Пожалуйста, попробуйте еще раз.';
  }
}; 