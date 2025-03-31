import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import styles from './AuthForm.module.scss';

interface AuthFormProps {
  mode: 'login' | 'register';
  onModeChange: (mode: 'login' | 'register') => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onModeChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        console.log('Attempting to login with:', { email });
        await login(email, password);
        console.log('Login successful');
      } else {
        console.log('Attempting to register with:', { email, name });
        await register(email, password, name);
        console.log('Registration successful');
      }
      navigate('/');
    } catch (err: any) {
      console.error('Auth error:', err);
      console.error('Error message:', err.message);
      console.error('Error object:', err);
      console.error('Error stack:', err.stack);
      setError(err.message || 'Произошла ошибка при авторизации');
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    onModeChange(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2>{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
        
        {mode === 'register' && (
          <div className={styles.formGroup}>
            <label htmlFor="name">Имя</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="Введите ваш email"
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
            disabled={loading}
            placeholder="Введите ваш пароль"
            minLength={6}
          />
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>

        <button
          type="button"
          className={styles.switchButton}
          onClick={handleModeSwitch}
          disabled={loading}
        >
          {mode === 'login' ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
        </button>
      </form>
    </div>
  );
}; 