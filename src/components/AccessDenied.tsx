import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AccessDenied.module.scss';

export const AccessDenied: React.FC = () => {
  return (
    <div className={styles.accessDenied}>
      <div className={styles.content}>
        <h1 className={styles.title}>Доступ запрещен</h1>
        <p className={styles.message}>
          У вас недостаточно прав для просмотра этой страницы. 
          Эта страница доступна только пользователям с ролью "администратор".
        </p>
        <Link to="/" className={styles.button}>
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}; 