import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthError,
  updateProfile
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from './firebase';

export const login = async (email: string, password: string) => {
  try {
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
    
    throw new Error('Произошла ошибка при входе. Пожалуйста, попробуйте еще раз.');
  }
};

export const register = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name
    });
    return userCredential.user;
  } catch (error) {
    console.error('Registration error details:', error);
    
    if (error instanceof FirebaseError) {
      const errorMessage = getErrorMessage(error.code);
      console.log('Firebase error code:', error.code);
      console.log('Translated error message:', errorMessage);
      throw new Error(errorMessage);
    }
    
    throw new Error('Произошла ошибка при регистрации. Пожалуйста, попробуйте еще раз.');
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    if (error instanceof FirebaseError) {
      throw new Error(getErrorMessage(error.code));
    }
    throw new Error('Произошла ошибка при выходе. Пожалуйста, попробуйте еще раз.');
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

// Функция для получения понятных сообщений об ошибках
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'Этот email уже зарегистрирован. Пожалуйста, используйте другой email или войдите в существующий аккаунт.';
    case 'auth/invalid-email':
      return 'Некорректный формат email. Пожалуйста, проверьте правильность введенного email.';
    case 'auth/operation-not-allowed':
      return 'Операция не разрешена. Пожалуйста, обратитесь к администратору.';
    case 'auth/weak-password':
      return 'Пароль слишком слабый. Пароль должен содержать минимум 6 символов.';
    case 'auth/user-disabled':
      return 'Этот аккаунт был отключен. Пожалуйста, обратитесь к администратору.';
    case 'auth/user-not-found':
      return 'Пользователь с таким email не найден. Пожалуйста, проверьте email или зарегистрируйтесь.';
    case 'auth/wrong-password':
      return 'Неверный пароль. Пожалуйста, проверьте правильность введенного пароля.';
    case 'auth/too-many-requests':
      return 'Слишком много попыток входа. Пожалуйста, подождите несколько минут и попробуйте снова.';
    case 'auth/network-request-failed':
      return 'Ошибка сети. Пожалуйста, проверьте подключение к интернету.';
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
    case 'auth/unauthorized-domain':
      return 'Этот домен не авторизован для OAuth-операций.';
    case 'auth/unsupported-persistence-type':
      return 'Неподдерживаемый тип сохранения состояния.';
    case 'auth/used-email-from-another-provider':
      return 'Этот email уже используется другим провайдером.';
    default:
      return 'Произошла ошибка при авторизации. Пожалуйста, попробуйте еще раз.';
  }
}; 